import { Button, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  formatDecimal,
  formatInteger,
  formatPercentage
} from 'utils/helpers/number-format';
import classnames from 'classnames';
import { GenericCallback } from 'lib/typings/common.interface';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import styles from './index.module.scss';
import { StockHolding } from 'lib/typings/portfolio.interface';

interface StockTableProps {
  stocks: StockHolding[];
  onSellStock?(stock: StockHolding): GenericCallback;
  isLoading?: boolean;
}

export const StockTable: FunctionComponent<StockTableProps> = (
  props: PropsWithChildren<StockTableProps>
) => {
  const handleSellStock = (stock: StockHolding) => {
    const callback = props.onSellStock(stock);
    if (typeof callback === 'function') {
      callback();
    }
  };

  const columns: ColumnsType<StockHolding> = [
    {
      title: '股票代码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '股票名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '持仓数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: formatInteger
    },
    {
      title: '可用数量',
      render: (_, record) => formatInteger(record.quantity - record.frozen)
    },
    {
      title: '成本价格',
      render: (_, record) => formatDecimal(record.cost / record.quantity)
    },
    {
      title: '最新价格',
      render: (_, record) =>
        record.realtime_price
          ? formatDecimal(record.realtime_price)
          : formatDecimal(record.market_value / record.quantity)
    },
    {
      title: '最新市值',
      render: (_, record) => formatDecimal(record.market_value)
    },
    {
      title: '浮动盈亏',
      render: (_, record) => {
        const income = record.market_value - record.cost;
        return (
          <span
            className={classnames({
              [styles.rise]: income > 0,
              [styles.fall]: income < 0
            })}>
            {formatDecimal(income)}
          </span>
        );
      }
    },
    {
      title: '盈亏比例 (%)',
      render: (_, record) => {
        const income = record.market_value - record.cost;
        return (
          <span
            className={classnames({
              [styles.rise]: income > 0,
              [styles.fall]: income < 0
            })}>
            {formatPercentage(income / record.cost)}
          </span>
        );
      }
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      render: (_, record) => {
        return (
          <Button onClick={() => handleSellStock(record)} type="link">
            卖出
          </Button>
        );
      }
    }
  ];

  return (
    <Table
      rowKey="code"
      // scroll={{ x: 1200 }}
      columns={columns}
      dataSource={props.stocks}
      pagination={false}
      loading={props.isLoading}
    />
  );
};
