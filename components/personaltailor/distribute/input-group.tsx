import React, {
  useState,
  FunctionComponent,
  PropsWithChildren,
  useEffect
} from 'react';
import { Input, InputNumber } from 'antd';
import styles from './index.module.scss';

export interface SearchInputGroupRefs {
  inputGroupOnChange(value: number[]): void;
  restrictSize?: number[];
  initialValues?: number[] | string[];
}

export const InputGroup: FunctionComponent<SearchInputGroupRefs> = (
  props: PropsWithChildren<SearchInputGroupRefs>
) => {
  const [inputNumberOne, setInputNumberOne] = useState(undefined);
  const [inputNumberTwo, setInputNumberTwo] = useState(undefined);

  useEffect(() => {
    if (props.initialValues && props.initialValues.length) {
      setInputNumberOne(Number(props.initialValues[0]) * 100);
      setInputNumberTwo(Number(props.initialValues[1]) * 100);
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
      props.inputGroupOnChange([
        Number(inputNumberOne) / 100,
        Number(inputNumberTwo) / 100
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
        formatter={value => `${value}%`}
        parser={value => value.replace('%', '')}
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
        formatter={value => `${value}%`}
        parser={value => value.replace('%', '')}
        onChange={inputNumberTwoChange}
      />
    </Input.Group>
  );
};
