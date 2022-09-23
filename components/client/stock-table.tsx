import { Table, Space, Button, Modal } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  formatDecimal,
  formatInteger,
  formatPercentage
} from 'utils/helpers/number-format';
import classnames from 'classnames';
import user from 'utils/helpers/user';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect
} from 'react';
import { request } from 'utils/helpers/http';
import { getAPIEndpoint } from 'lib/options/api.options';
import styles from './stock-table.module.scss';
import { StockHolding, Portfolio, High } from 'lib/typings/portfolio.interface';
import { CommentForm } from 'components/portfolio/code-comment-form';
interface StockTableProps {
  stocks: StockHolding[];
  isLoading?: boolean;
  portfolioType: string;
  portfolio?: Portfolio | High;
  openId?: string;
  selectSellStocks?: (data: StockHolding[]) => void;
}
interface CommentFields {
  // 名称
  commentDate?: any;
  // 说明
  comment: string;
}
export const StockTable: FunctionComponent<StockTableProps> = (
  props: PropsWithChildren<StockTableProps>
) => {
  const [codeComment, setCodeComment] = useState<any>(false);
  const [Initcomment, setInitcomment] = useState<string | boolean>(false);
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const handleCommentFinish = useCallback(
    async (formValues: CommentFields) => {
      const token = user.verifyToken();

      const formValue = {
        comment: formValues.comment,
        wid: 19,
        openId: props.openId,
        codeName: codeComment.name
      };
      const date = formValues.commentDate
        ? formValues.commentDate.format('YYYY-MM-DD')
        : 'today';

      await request(
        getAPIEndpoint(
          `/portfolio/${props.portfolio._id}/code/${codeComment.code}`
        ),
        {
          method: 'PUT',
          token: token,
          body: formValue
        }
      );
    },
    [codeComment]
  );

  const opreate =
    props.portfolio?.meta?.portfolioType !== 'Following'
      ? [
          // {
          //   title: '操作',
          //   render: record => {
          //     return (
          //       <Space size="middle">
          //         {
          //           <Button
          //             size="small"
          //             type="link"
          //             onClick={async () => {
          //               setCodeComment(record);
          //               console.log(record);
          //             }}>
          //             异动点评
          //           </Button>
          //         }
          //       </Space>
          //     );
          //   }
          // }
        ]
      : [];
  const columns: ColumnsType<any> =
    props.portfolioType !== 'Advanced'
      ? [
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
            render: (_, record) =>
              formatInteger(record.quantity - record.frozen)
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
            align: 'center',
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
          ...opreate
        ]
      : [
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
          // {
          //   title: '最新市值',
          //   render: (_, record) => formatDecimal(record.market_value)
          // },
          {
            title: '盈亏比例 (%)',
            align: 'center',
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
            title: '止损位',
            dataIndex: 'targetId',
            align: 'center',
            render: (_, record) => {
              const target = record.target.filter(
                item => item.desc == '止损位'
              )[0];
              // const status = target['reachedAt']
              //   ? target['reachedAt']
              //   : record.low_price < target['target'];
              return target['reachedAt'] ? '是' : '否';
            }
          },
          {
            title: '目标1',
            dataIndex: 'targetId',
            align: 'center',
            render: (_, record) => {
              const target = record.target.filter(
                item => item.desc == '第一目标位'
              )[0];
              // const status = target['reachedAt']
              //   ? target['reachedAt']
              //   : record.high_price > target['target'];
              return target['reachedAt'] ? '是' : '否';
            }
          },
          {
            title: '目标2',
            dataIndex: 'targetId',
            align: 'center',
            render: (_, record) => {
              const target = record.target.filter(
                item => item.desc == '第二目标位'
              )[0];
              // const status = target['reachedAt']
              //   ? target['reachedAt']
              //   : record.high_price > target['target'];
              return target['reachedAt'] ? '是' : '否';
            }
          }
        ];

  useEffect(() => {
    props.portfolio.meta.portfolioType == 'Premium'
      ? props.selectSellStocks(selectedRow)
      : null;
  }, [selectedRow]);

  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: Partial<StockHolding>[]
  ) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: stock-table.tsx ~ line 258 ~ selectedRowKeys`,
      selectedRowKeys
    );
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: stock-table.tsx ~ line 258 ~ selectedRows`,
      selectedRows
    );
    setSelectedRowKey(selectedRowKeys);
    setSelectedRow(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    selectedRows: selectedRow,
    onChange: onSelectChange
  };

  return (
    <>
      <Modal
        title={
          <span style={{ fontWeight: 'bold', fontSize: '20px' }}>
            {/* {`【${
              RowData === false ? '每日' : RowData.meta.name
            }】账户持仓点评`} */}
            用户股票点评
          </span>
        }
        wrapClassName={styles.commentmodal}
        width="600px"
        centered={true}
        visible={codeComment !== false}
        keyboard={false}
        maskClosable={false}
        destroyOnClose
        onCancel={() => setCodeComment(false)}
        footer={null}>
        <CommentForm
          onFinish={handleCommentFinish}
          initialcomment={Initcomment}
          portfolioId={props.portfolio._id}
          code={codeComment}
          onReset={() => {
            setCodeComment(false);
          }}></CommentForm>
      </Modal>
      <Table
        rowKey="code"
        rowSelection={
          props.portfolio.meta.portfolioType == 'Premium' ? rowSelection : null
        }
        columns={columns}
        dataSource={props.stocks}
        pagination={false}
        loading={props.isLoading}
      />
    </>
  );
};
