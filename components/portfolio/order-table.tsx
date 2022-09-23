import { Button, Popconfirm, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { formatDateTime } from 'utils/helpers/date-format';
import { formatDecimal, formatInteger } from 'utils/helpers/number-format';
import { GenericCallback } from 'lib/typings/common.interface';
import { Order, OrderEnhace } from 'lib/typings/portfolio.interface';
import React, { FunctionComponent, PropsWithChildren } from 'react';

interface OrderTableProps {
  orders: Order[];
  onRevokeOrder(order: any): Promise<void | GenericCallback>;
  isLoading?: boolean;
  portfolioName: string;
}
interface OrderProps {
  order_id: string;
  name: string;
  code: string | number;
}
export const OrderTable: FunctionComponent<OrderTableProps> = (
  props: PropsWithChildren<OrderTableProps>
) => {
  const handleRevoke = async (order: OrderProps) => {
    // const orderId = order.id;
    const callback = await props.onRevokeOrder(order);
    if (typeof callback === 'function') {
      callback();
    }
  };

  const columns: ColumnsType<Order> = [
    {
      title: '委托时间',
      dataIndex: 'order_time',
      key: 'order_time',
      render: formatDateTime
    },
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
      title: '委托方向',
      dataIndex: 'type',
      key: 'type',
      render(type: string) {
        switch (type) {
          case 'buy':
            return '买入';
          case 'sell':
            return '卖出';
          default:
            return '无效';
        }
      }
    },
    {
      title: '委托价',
      dataIndex: 'price',
      key: 'price',
      render: formatDecimal
    },
    {
      title: '委托数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: formatInteger
    },
    {
      title: '操作',
      align: 'center',
      render: (record: OrderEnhace) => {
        console.log(
          `🚀 ${new Date().toLocaleString()} ~ file: order-table.tsx ~ line 79 ~ record`,
          record
        );
        return record ? (
          <Popconfirm
            title={`确认撤销委托 【${props.portfolioName}】下的【 ${record.name}(${record.code}) 】吗?`}
            onConfirm={() => handleRevoke(record)}>
            <Button danger type="link">
              撤销委托
            </Button>
          </Popconfirm>
        ) : null;
      }
    }
  ];

  return (
    <Table
      rowKey="order_id"
      columns={columns}
      dataSource={props.orders}
      loading={props.isLoading}
    />
  );
};
