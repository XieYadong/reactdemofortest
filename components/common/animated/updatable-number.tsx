import { StatisticProps } from 'antd/lib/statistic/Statistic';
import classnames from 'classnames';
import { formatDecimal } from 'utils/helpers/number-format';
import { isUndefined } from 'lodash';
import { Component, FunctionComponent, useRef } from 'react';
import { usePrevious, useUpdateEffect } from 'react-use';
import styles from './updatable-number.module.scss';

interface UpdatableNumberProps {
  value: number;
  useSpan?: boolean;
}

export const UpdatableNumber: FunctionComponent<UpdatableNumberProps> = props => {
  const prevValue = usePrevious(props.value);
  const elemRef = useRef<HTMLDivElement>();

  useUpdateEffect(() => {
    // 数值未发生改变或刚刚初始化
    if (prevValue === undefined || props.value === prevValue) {
      return;
    }

    // 根据数值大小变更应用变更动画 class
    const increasing = props.value > prevValue;
    const decreasing = props.value < prevValue;
    const className = classnames({
      [styles['number-updatable']]: true,
      [styles['increasing']]: increasing,
      [styles['decreasing']]: decreasing
    });
    elemRef.current.className = className;

    // 在动画结束后恢复元素原来的 class
    const handleAnimationEnd = (evt: AnimationEvent) => {
      elemRef.current.className = styles['number-updatable'];
    };
    elemRef.current.addEventListener('animationend', handleAnimationEnd, {
      once: true
    });

    return () => {
      elemRef.current.removeEventListener('animationend', handleAnimationEnd);
    };
  }, [props.value]);

  if (props.useSpan) {
    return (
      <span ref={elemRef} className={styles['number-updatable']}>
        {props.children ? props.children : props.value}
      </span>
    );
  }

  return (
    <div ref={elemRef} className={styles['number-updatable']}>
      {props.children ? props.children : props.value}
    </div>
  );
};

interface GenericFormatter {
  (value: number | string): React.ReactNode | string;
}

type FormattedValue = string | React.ReactNode;

export function renderStatisticValue(node: Component<StatisticProps>) {
  let formatter: GenericFormatter = formatDecimal;
  let formatted: FormattedValue = '';
  if (typeof node.props.formatter === 'function') {
    formatter = node.props.formatter;
  }
  // const formatter: any = node.props.formatter || formatDecimal;
  formatted = formatter(node.props.value);
  const splitted = formatted.toString().split('.');

  return (
    <UpdatableNumber
      value={node.props.value as number}
      useSpan={
        !isUndefined(node.props.prefix) || !isUndefined(node.props.suffix)
      }>
      <span className="ant-statistic-content-value-int">{splitted[0]}</span>
      <span className="ant-statistic-content-value-decimal">
        .{splitted[1]}
      </span>
    </UpdatableNumber>
  );
}
