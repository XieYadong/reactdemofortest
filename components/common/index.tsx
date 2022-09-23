import React, {
  useEffect,
  FunctionComponent,
  useState,
  useCallback,
  useMemo
} from 'react';

import { Button } from 'antd';

export const sum = (a: number, b: number) => a + b;
const ac = () => {
  console.log('dssdds');
};
const Index: FunctionComponent<any> = props => {
  return (
    <div>
      <div className="button" onClick={props.onClick}>
        sendStatusCode
      </div>
    </div>
  );
};

export default Index;
