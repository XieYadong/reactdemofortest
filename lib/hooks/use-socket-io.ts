import { ReceivableEvents } from 'constants/notification.constant';
import {
  getNotificationServerEndpoint,
  getSocketIOOptions
} from 'lib/options/api.options';
import {
  MessageEmittable,
  MessageReceivable
} from 'lib/typings/notifications.interface';
import pino from 'pino';
import { stringify } from 'querystring';
import { useCallback, useEffect, useRef } from 'react';
import { fromEvent, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import io from 'socket.io-client';

const logger = pino({
  name: 'useSocketIO',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

const connectionStore = new Map<string, SocketIOClient.Socket>();
const referenceCount = new Map<string, number>();

interface WebSocketMessage {
  event: string;
  payload: any;
}

function getSocketIOInstance(path: string, opts?: SocketIOClient.ConnectOpts) {
  const uri = opts ? `${path}?${stringify(opts as any)}` : path;
  if (connectionStore.has(uri)) {
    referenceCount.set(uri, (referenceCount.get(uri) ?? 0) + 1);
    logger.info('续用 socket: %o', {
      uri,
      store: connectionStore,
      count: referenceCount
    });
    return connectionStore.get(uri);
  }

  const instance = io(getNotificationServerEndpoint(path), {
    // Otherwise original options object will be mutated
    ...opts
  });
  connectionStore.set(uri, instance);
  referenceCount.set(uri, (referenceCount.get(uri) ?? 0) + 1);

  logger.info('创建 socket: %o', {
    uri,
    store: connectionStore,
    count: referenceCount
  });

  return instance;
}

function dereference(path: string, opts?: SocketIOClient.ConnectOpts) {
  const uri = opts ? `${path}?${stringify(opts as any)}` : path;
  const count = (referenceCount.get(uri) ?? 0) - 1;
  if (count <= 0) {
    connectionStore.get(uri).removeAllListeners();
    connectionStore.get(uri).disconnect();
    connectionStore.delete(uri);
    referenceCount.delete(uri);
    logger.info('注销 socket.io 实例: %o', {
      uri,
      store: connectionStore,
      count: referenceCount
    });
  } else {
    referenceCount.set(uri, count);
  }
}

export function useSocketIO(
  path: string,
  opts: SocketIOClient.ConnectOpts = getSocketIOOptions()
) {
  const socket = useRef<SocketIOClient.Socket>();

  useEffect(() => {
    socket.current = getSocketIOInstance(path, opts);

    logger.info('注册 socket.io 实例', { socket: socket.current });

    socket.current.on('connection', () => {
      logger.info('socket.io 连接成功');
    });

    socket.current.on('reconnection', () => {
      logger.info('socket.io 重连成功');
    });

    socket.current.on('error', err => {
      console.error(err);
      logger.info('socket.io 连接失败');
    });

    socket.current.on('connect_error', err => {
      console.error(err);
      logger.info('socket.io 连接失败');
    });

    return () => dereference(path, opts);
  }, []);

  const addListener = useCallback((event: string, callback: Function) => {
    socket.current.on(event, callback);
  }, []);

  const removeListener = useCallback((event: string, callback?: Function) => {
    socket.current.off(event, callback);
  }, []);

  const emit = useCallback(<T>(event: string, ...payloads: T[]) => {
    socket.current.emit(event, ...payloads);
  }, []);

  const watch = useCallback((eventListening: ReceivableEvents) => {
    const ret$: Observable<MessageReceivable> = fromEvent<any>(
      socket.current,
      eventListening
    ).pipe(map(payload => ({ type: eventListening, payload })));

    return ret$;
  }, []);

  const subscribe = useCallback((action: MessageEmittable) => {
    socket.current.emit(action.type, action.payload);
  }, []);

  const subscribeAndWatch = useCallback(
    (eventListening: ReceivableEvents, action: MessageEmittable) => {
      const ret$ = watch(eventListening);
      subscribe(action);
      return ret$;
    },
    []
  );

  return {
    addListener,
    removeListener,
    emit,
    watch,
    subscribe,
    subscribeAndWatch
  };
}
