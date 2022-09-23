import pino from 'pino';
import { useEffect, useState } from 'react';
import { useSocketIO } from './use-socket-io';

const logger = pino({
  name: 'useRanks',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

export function useRanks() {
  const [ranks, setRanks] = useState({
    items: [],
    meta: {}
  });
  const { addListener, removeListener, emit } = useSocketIO('/notification');

  useEffect(() => {
    addListener('ranks_update', updates => {
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: use-ranks.ts ~ line 19 ~ addListener ~ updates`,
        updates
      );
      setRanks(updates);
      logger.debug('排名更新 %o', updates);
    });

    return () => {
      removeListener('ranks_update');
    };
  }, []);

  const watchRanks = (data: any[]) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: use-ranks.ts ~ line 35 ~ watchRanks ~ data`,
      data
    );
    emit('subscribe_ranks_updates', {
      data
    });
    logger.info('跟踪排名-筛选条件 %o', data);
  };

  const unWatchRanks = () => {
    emit('unsubscribe_ranks_updates');
  };

  return {
    watchRanks,
    unWatchRanks,
    ranks
  };
}
