import React, {
  useState,
  FunctionComponent,
  PropsWithChildren,
  useEffect
} from 'react';
import { Input, InputNumber } from 'antd';
import styles from './index.module.scss';

export interface SearchInputNumberGroupRefs {
  inputNumberGroupOnChange(value: number[]): void;
  restrictSize?: number[];
  initialValues?: number[] | string[];
}

export const InputNumberGroup: FunctionComponent<SearchInputNumberGroupRefs> = (
  props: PropsWithChildren<SearchInputNumberGroupRefs>
) => {
  const [inputNumberOne, setInputNumberOne] = useState(undefined);
  const [inputNumberTwo, setInputNumberTwo] = useState(undefined);

  useEffect(() => {
    if (props.initialValues && props.initialValues.length) {
      setInputNumberOne(Number(props.initialValues[0]));
      setInputNumberTwo(Number(props.initialValues[1]));
    }
  }, [props.initialValues]);

  const inputNumberOneChange = (value: string) => {
    setInputNumberOne(value);
  };

  const inputNumberTwoChange = (value: string) => {
    setInputNumberTwo(value);
  };

  useEffect(() => {
    if (inputNumberOne || inputNumberTwo)
      props.inputNumberGroupOnChange([
        Number(inputNumberOne),
        Number(inputNumberTwo)
      ]);
  }, [inputNumberOne, inputNumberTwo]);

  return (
    <Input.Group className={styles['searchPosition']}>
      <InputNumber
        className="site-input-number-left"
        value={inputNumberOne !== 'undefined' ? inputNumberOne : undefined}
        step={1}
        style={{ width: '40%' }}
        min={props.restrictSize && props.restrictSize[0]}
        max={props.restrictSize && props.restrictSize[1]}
        formatter={value => `${value}万`}
        parser={value => value.replace('万', '')}
        onChange={inputNumberOneChange}
      />
      <InputNumber
        className="site-input-number-split"
        style={{
          width: 14,
          backgroundColor: '#fff',
          borderLeft: 0,
          borderRight: 0,
          pointerEvents: 'none'
        }}
        placeholder="~"
        disabled
      />
      <InputNumber
        className="site-input-number-right"
        value={inputNumberTwo !== 'undefined' ? inputNumberTwo : undefined}
        step={1}
        style={{ width: '40%' }}
        min={props.restrictSize && props.restrictSize[0]}
        max={props.restrictSize && props.restrictSize[1]}
        formatter={value => `${value}万`}
        parser={value => value.replace('万', '')}
        onChange={inputNumberTwoChange}
      />
    </Input.Group>
  );
};
