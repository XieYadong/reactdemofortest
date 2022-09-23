import { uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { useSocketIO } from './use-socket-io';

const logger = pino({
  name: 'useQuotes',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

export interface Quote {
  "machine_id":String,
  "id":String,
  "timestamp": String,
  "status": String
}

export function useQuotes(initialCodes: string[] = []) {
  const [codes, setCodes] = useState(initialCodes);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const { addListener, removeListener, emit } = useSocketIO('/ws');

  useEffect(() => {
    addListener('quote_update', (updates: Record<string, Quote>) => {
      setQuotes(updates);
    });

    return () => {
      removeListener('quote_update');
    };
  }, []);

  const watch = (newCodes: string[]) => {
    const uniqueCodes = uniq(newCodes);
    setCodes(uniqueCodes);
    emit('subscribe_quote_updates', {
      stocks: uniqueCodes
    });
  };

  const unwatch = () => {
    setCodes([]);
    emit('unsubscribe_quote_updates');
  };

  return {
    watch,
    unwatch,
    quotes
  };
}
