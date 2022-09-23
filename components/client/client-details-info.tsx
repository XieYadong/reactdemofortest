import { Button, Col, message, notification, Row, Skeleton, Tabs } from 'antd';
import classnames from 'classnames';
import { StateTable } from 'components/common/table/state-table';
import { IndividualTable } from 'components/client/individualTable-table';
import { StockTable } from 'components/client/stock-table';
import {
  formatDateTime,
  formatDateWithTooltip
} from 'utils/helpers/date-format';
import {
  formatDecimal,
  formatInteger,
  formatPercentage
} from 'utils/helpers/number-format';
import { getAuldAPIEndpoint } from 'lib/options/api.options';
import { ReloadableComponentRefs } from 'lib/typings/common.interface';
import {
  Order,
  OrderHistory,
  Portfolio,
  StockHolding,
  UserList
} from 'lib/typings/portfolio.interface';
import dynamic from 'next/dynamic';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import styles from './index.module.scss';
import { ColumnsType } from 'antd/lib/table';
import user from 'utils/helpers/user';
// import { transactionProfit } from 'pages/inquiry/username-inquiry';
// import { GetTokenFunction } from 'lib/hooks/auth';
import { UserNamePortfolioOverview } from 'components/portfolio/username-portfolio-overview';
import { request } from 'utils/helpers/http';
// import { Industrys } from 'pages/portfolio/[id]';
// import { useUserInfo } from 'lib/hooks/userinfo';
import { useQuotes } from 'lib/hooks/use-quotes';
import {
  EmittableEvents,
  ReceivableEvents
} from 'constants/notification.constant';
import { useSocketIO } from 'lib/hooks/use-socket-io';
import pino from 'pino';
import { Industrys } from 'pages/personaltailor/client/username-inquiry';

export const pageMeta = {
  title: '持仓周期详情',
  icon: 'channel-detail'
};

const logger = pino({
  name: 'portfolio',
  prettyPrint: process.env.NODE_ENV !== 'production'
});

const PortfolioPieChart = dynamic(
  () => import('components/portfolio/chart/portfolio-pie-chart'),
  { loading: () => <Skeleton />, ssr: false }
);

const IndustryPieChart = dynamic(
  () => import('components/portfolio/chart/industry-pie-chart'),
  { loading: () => <Skeleton />, ssr: false }
);
const PortfolioIncomeTrendChart = dynamic(
  () =>
    import('components/portfolio/chart/portfolio-income-trend-chart').then(
      mod => mod.PortfolioIncomeTrendChart
    ),
  { loading: () => <Skeleton />, ssr: false }
);

interface SearchFormProps {
  initialValues: { tabPane: Portfolio; selectOption: UserList };
  // getToken: GetTokenFunction;
}

const API_ROUTE_PATH_PORTFOLIO = '/portfolio';
const BATCH_GET_ORDERS_ROUTE_PATH = '/order/batch';

const sorter = [{ field: 'trade_time', order: 'descend' }];
const sorterIndividual = [{ field: 'trade_time', order: 'ascend' }];

const columns: ColumnsType<OrderHistory> = [
  {
    title: '成交时间',
    dataIndex: 'trade_time',
    key: 'trade_time',
    render: formatDateTime,
    sorter: {
      multiple: 1
    },
    defaultSortOrder: 'descend'
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
    title: '成交数量',
    dataIndex: 'trade_quantity',
    key: 'trade_quantity',
    render: formatInteger
  },
  {
    title: '成交均价',
    dataIndex: 'trade_price',
    key: 'trade_price',
    render: formatDecimal
  }
];

const columnIndividual: ColumnsType<OrderHistory> = [
  {
    title: '买入日期',
    dataIndex: 'buy_time',
    key: 'buy_time',
    render: formatDateTime,
    sorter: {
      multiple: 1
    }
    // defaultSortOrder: 'ascend'
  },
  {
    title: '卖出日期',
    dataIndex: 'sell_time',
    key: 'sell_time',
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
    title: '盈亏金额',
    dataIndex: 'profit_amount',
    key: 'profit_amount',
    render: value => {
      return (
        <span
          key={'profit_amount-' + value}
          className={classnames({
            [styles.rise]: value > 0,
            [styles.fall]: value < 0
          })}>
          {formatDecimal(value)}
        </span>
      );
    }
  },
  {
    title: '盈亏比例',
    dataIndex: 'profit_percent',
    key: 'profit_percent',
    align: 'center',
    render: value => {
      return (
        <span
          key={'profit_percent-' + value}
          className={classnames({
            [styles.rise]: value > 0,
            [styles.fall]: value < 0
          })}>
          {formatPercentage(value)}
        </span>
      );
    }
  },
  {
    title: '持有天数',
    dataIndex: 'days',
    key: 'days',
    align: 'center',
    render: (_, record) =>
      Math.floor((record.sell_time - record.buy_time) / 86400000)
  }
];

export const ClientDetailsInfo: FunctionComponent<SearchFormProps> = (
  props: PropsWithChildren<SearchFormProps>
) => {
  const { watch, quotes } = useQuotes();
  const { watch: watchObservable, subscribe } = useSocketIO('/notification');
  console.log('监听股票中...');
  const [tabPane, setTabPane] = useState<Portfolio>(
    props.initialValues.tabPane
  );
  const [selectOption, setSelectOption] = useState<UserList>(
    props.initialValues.selectOption
  );
  const [transactionProfitStock, setTransactionProfitStock] = useState<any>({
    transactionStock: 0,
    profitStock: 0
  });
  const orderHistoryTable = useRef<ReloadableComponentRefs>();
  const IndividualTableTable = useRef<ReloadableComponentRefs>();
  const [industrys, setIndustrys] = useState<Industrys[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  // const { token } = useUserInfo();
  const [sellOrder, setSellOrder] = useState([]);

  useEffect(() => {
    // 指定需要跟踪更新的账户 ID
    subscribe({
      type: EmittableEvents.SubscribeOrderUpdate,
      payload: {
        portfolio: tabPane._id
      }
    });

    const orderUpdates$ = watchObservable(ReceivableEvents.OrderUpdate);

    // TODO: 解决委托更新重复触发
    const orderUpdatesSubscription = orderUpdates$.subscribe(evt => {
      logger.info('委托更新 %o', { orderId: evt.payload.orderId });
      message.info(`委托 [${evt.payload.orderId}] 状态已更新`);
      handleReload();
    });

    return () => {
      logger.info('取消 rxjs 订阅');
      orderUpdatesSubscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const watchList = [
      ...orders.map(order => order.code),
      ...tabPane.stocks.map(stock => stock.code)
    ];
    // TODO: 解决同样的股票列表重复触发 subscribe 事件
    console.log('watchlist %o', watchList);
    watch(watchList);
  }, [orders, tabPane.stocks]);

  useEffect(() => {
    let updatedCount = 0;
    // 行情更新
    if (tabPane.stocks.length > 0) {
      const updatedStocks = tabPane.stocks.map(stock => {
        const match = quotes[stock.code];
        if (match && match.now !== stock.realtime_price) {
          updatedCount++;
          return {
            ...stock,
            realtime_price: match.now,
            market_value: match.now * stock.quantity
          };
        } else {
          return stock;
        }
      });

      if (updatedCount) {
        setTabPane({
          ...tabPane,
          stocks: updatedStocks
        });
      }
    }
  }, [quotes, tabPane]);

  useEffect(() => {
    getIIndustrys(tabPane.stocks);
  }, []);

  const getIIndustrys = async (stocks: StockHolding[]) => {
    try {
      const token = user.verifyToken();
      const res = await request(
        `${getAuldAPIEndpoint('/lookup/batch')}/${stocks
          .map(item => item.code)
          .join(',')}`,
        {
          token
        }
      );
      setIndustrys(res.items);
    } catch (err) {
      console.log(err);
    }
  };

  const handleReload = async () => {
    try {
      const token = user.verifyToken();
      const response = await request(
        getAuldAPIEndpoint(`${API_ROUTE_PATH_PORTFOLIO}/${tabPane._id}`),
        {
          token
        }
      );
      setTabPane({
        ...tabPane,
        ...response.item
      });

      if (response.item.orders.length > 0) {
        await handleUpdateOrders(response.item.orders);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }

    // 同时更新交易历史
    orderHistoryTable.current.reload();
    IndividualTableTable.current.reload();
  };
  const handleUpdateOrders = async (orderIds: string[]) => {
    try {
      const token = user.verifyToken();
      const orderResponse = await request(
        `${getAuldAPIEndpoint(BATCH_GET_ORDERS_ROUTE_PATH)}/${orderIds.join(
          ','
        )}`,
        {
          token
        }
      );

      setOrders(orderResponse.items);
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  const selectSellStocks = (data: StockHolding[]) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: client-details-info.tsx ~ line 352 ~ selectSellStocks ~ data`,
      data
    );
    const newData = [];
    data.map(item => {
      const obj = {
        portfolio_id: tabPane._id,
        type: 'sell',
        name: item.name,
        code: item.code,
        price: item.cost / item.quantity,
        quantity: item.quantity
      };
      newData.push(obj);
    });
    setSellOrder(newData);
  };

  const sellOrders = async () => {
    const hide = message.loading('正在下单中，请稍后...', 0);
    try {
      logger.info(
        `🚀 ${new Date().toLocaleString()} ~ 发送数据一共%s条，数据格式：%o`,
        sellOrder.length,
        sellOrder
      );

      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: index.tsx ~ line 611 ~ orderHandleSubmit ~ client`,
        selectOption
      );

      const correlationId = selectOption.meta.followProducts.filter(
        product => product.productType === 'Premium'
      );
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: index.tsx ~ line 612 ~ orderHandleSubmit ~ correlationId`,
        correlationId
      );
      const token = user.verifyToken();
      const correlationPortfolio = await request(
        getAuldAPIEndpoint(
          `${API_ROUTE_PATH_PORTFOLIO}/${correlationId[0].portfolioId[1]}`
        ),
        {
          token
        }
      );
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: index.tsx ~ line 614 ~ orderHandleSubmit ~ correlationPortfolio`,
        correlationPortfolio
      );
      sellOrder.map(item => {
        const correlationStock = correlationPortfolio.item.stocks.some(
          stock => stock.code === item.code
        );
        console.log(
          `🚀 ${new Date().toLocaleString()} ~ file: index.tsx ~ line 616 ~ orderHandleSubmit ~ correlationStock`,
          correlationStock
        );

        if (!correlationStock) {
          console.log(`卖出股票时，实盘账户中没有"${item.code}"股票`);
          return;
        }
        item.price = quotes[item.code]?.now;
        item.comment = '仓位调整';

        const bodyValue = {
          message: {
            type: 'SELL_ORDER',
            payload: {
              code: item.code,
              price: `${(item.price * 0.995).toFixed(2)}-${(
                item.price * 1.005
              ).toFixed(2)}`,
              name: item.name,
              orderTime: Date.now(),
              portfolioId: item.portfolio_id,
              portfolioName: selectOption.meta.clientName,
              openId: [selectOption.meta.openId],
              comment: item.comment
            }
          }
        };

        logger.info(
          `🚀 ${new Date().toLocaleString()} ~ 发送微信模板的格式：%o`,
          bodyValue
        );
        request(getAuldAPIEndpoint(`/notification/openid`), {
          method: 'POST',
          token,
          body: bodyValue
        });
      });

      const orderError = [];
      for (let i = 0; i < sellOrder.length; i++) {
        const formDatas = {
          orders: sellOrder.slice(i, i + 5)
        };
        console.log(
          `🚀 ${new Date().toLocaleString()} 处理好的数据：`,
          formDatas
        );

        const { items, errors } = await request(
          getAuldAPIEndpoint('/direct-order/batch'),
          {
            method: 'POST',
            token,
            body: formDatas
          }
        );
        console.log(
          `🚀 ${new Date().toLocaleString()} ~ file: index.tsx ~ line 586 ~ orderHandleSubmit ~ errors`,
          errors
        );
        if (errors.length) {
          orderError.push(...errors);
        }
        i += 4;
      }

      sellOrder.map(async item => {
        var result_one = orderError.some(value => {
          if (value.context == item.portfolio_id) {
            return true;
          }
        });
        if (result_one) {
          return;
        }
      });

      setTimeout(hide);
      if (orderError.length) {
        notification.error({
          message: `卖出交易失败`,
          description: orderError.map(value => value.message).join('\n'),
          duration: 0
        });
      } else {
        setSellOrder([]);
        message.success(`卖出记录成功`, 2);
      }
    } catch (err) {
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: client-details-info.tsx ~ line 521 ~ sellOrders ~ err`,
        err
      );
      setTimeout(hide);
      message.error(err.message, 2);
    }
  };

  // const arrayIncludes = (data: string[]) => {
  //   return data.find(item => userinfo.role.includes(item));
  // };

  return (
    <>
      {selectOption && (
        <div className={styles.rowbox}>
          <h3 className={styles.title}>客户信息</h3>

          <Row gutter={8} justify={'space-around'}>
            <Col>客户名称：{selectOption?.meta?.clientName}</Col>
            <Col>
              跟投产品：
              {tabPane.meta.portfolioType === 'Premium'
                ? tabPane.meta.name.split('】')[1]
                : tabPane.meta.portfolioType === 'Probation'
                ? '财富管理'
                : tabPane.meta.name
                    .split('】')[1]
                    .slice(0, tabPane?.meta?.name.split('】')[1].length - 2)}
            </Col>
            <Col>
              客户类型：
              {tabPane?.meta?.clientType}
            </Col>
            <Col>
              创建日期：{formatDateWithTooltip(selectOption?.createdAt)}
            </Col>
            <Col>
              到期日期：
              {formatDateWithTooltip(
                selectOption?.meta.followProducts.find(
                  item => item.productType == 'Premium'
                ).expiredAt
              )}
            </Col>
          </Row>
          {selectOption?.meta?.business ? (
            <Row style={{ marginTop: 20 }} justify={'space-around'}>
              <Col>
                所属总监：
                {selectOption?.meta?.business?.directorName}
              </Col>
              <Col>
                所属销售：
                {selectOption?.meta?.business?.sellName}
              </Col>
            </Row>
          ) : null}
        </div>
      )}
      <div className={styles.rowbox}>
        <h3 className={styles.title}>账户信息（{tabPane.meta.name}）</h3>
        <UserNamePortfolioOverview
          portfolio={tabPane}
          transactionProfitStock={transactionProfitStock}
        />
      </div>

      <Row gutter={16} className={styles['portfolio-panel']}>
        <Col span={12}>
          <div
            className={classnames([
              styles['portfolio-block-card'],
              'card-container'
            ])}>
            <Tabs type="card">
              <Tabs.TabPane tab="近一周">
                <PortfolioIncomeTrendChart portfolioId={tabPane._id} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Col>
        <Col span={6} className={styles['portfolio-block-container']}>
          <PortfolioPieChart portfolio={tabPane} />
        </Col>
        <Col span={6} className={styles['portfolio-block-container']}>
          <IndustryPieChart stocks={tabPane.stocks} industrys={industrys} />
        </Col>
      </Row>

      <Row style={{ marginTop: '25px' }}>
        <Col span={21}>
          <h3 style={{ marginTop: 0 }} className={styles.title}>
            持仓信息
          </h3>
        </Col>
        {tabPane.meta.portfolioType == 'Premium' ? (
          <Col span={3}>
            <Button
              disabled={sellOrder.length == 0}
              type="default"
              onClick={sellOrders}>
              批量卖出
            </Button>
          </Col>
        ) : null}
      </Row>
      <StockTable
        stocks={tabPane.stocks}
        portfolioType="portfolio"
        portfolio={tabPane}
        openId={selectOption?.meta?.openId}
        selectSellStocks={selectSellStocks}
      />

      <h3 className={styles.title}>成交历史</h3>
      <StateTable
        columns={columns}
        id={tabPane._id}
        ref={orderHistoryTable}
        feachUrl={getAuldAPIEndpoint('/order-history')}
        idKey="portfolio_id"
        sorter={sorter}
      />

      <h3 className={styles.title}>个股盈亏分析</h3>
      <IndividualTable
        id={tabPane._id}
        ref={IndividualTableTable}
        columns={columnIndividual}
        feachUrl={getAuldAPIEndpoint('/profit-history')}
        idKey="portfolio_id"
        sorter={sorterIndividual}
        stockNumber={({ transactionStock, profitStock }) => {
          setTransactionProfitStock({
            transactionStock,
            profitStock
          });
        }}
      />
    </>
  );
};
