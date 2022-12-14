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
        `π ${new Date().toLocaleString()} ~ file: use-ranks.ts ~ line 19 ~ addListener ~ updates`,
        updates
      );
      setRanks(updates);
      logger.debug('ζεζ΄ζ° %o', updates);
    });

    return () => {
      removeListener('ranks_update');
    };
  }, []);

  const watchRanks = (data: any[]) => {
    console.log(
      `π ${new Date().toLocaleString()} ~ file: use-ranks.ts ~ line 35 ~ watchRanks ~ data`,
      data
    );
    emit('subscribe_ranks_updates', {
      data
    });
    logger.info('θ·θΈͺζε-η­ιζ‘δ»Ά %o', data);
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
