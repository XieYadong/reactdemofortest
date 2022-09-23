import {
  Button,
  Col,
  message,
  Modal,
  Row,
  Space,
  Table,
  Tabs,
  Tag
} from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { formatDecimal, formatPercentage } from 'utils/helpers/number-format';
import { request } from 'utils/helpers/http';
import { getAPIEndpoint } from 'lib/options/api.options';
import { Portfolio, UserList } from 'lib/typings/portfolio.interface';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';
import user from 'utils/helpers/user';

// import { useUserInfo } from 'lib/hooks/userinfo';
import _ from 'lodash';
// import { ClientDetailsInfo } from 'components/inquiry/client-details-info';
// import { useAuth } from 'lib/hooks/auth';
// import { customManeger } from 'constants/permission.constant';
// import { formatDateWithTooltip } from 'utils/helpers/date-format';

const API_ROUTE_PATH = '/stocks-allot/match-customers';
const API_ROUTE_PATH_STOCKS_ALLOT = '/stocks-allot';
const API_ROUTE_PATH_STOCKS_ALLOT_DATA = '/stocks-allot/data';
const API_ROUTE_PATH_PORTFOLIO = '/portfolio';
const API_ROUTE_PATH_CLIENT = '/userInfo/client';

export interface SelectPortfolio {
  code: string;
  selectData: Portfolio[];
}

export interface SelectPortfolioProps {
  recordId: string;
  selectData: (data: SelectPortfolio[]) => void;
}

export const MatchCustomers: FunctionComponent<SelectPortfolioProps> = (
  props: PropsWithChildren<SelectPortfolioProps>
) => {
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [selectedRowsPlus, setSelectedRowsPlus] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState([]);
  const [portfolioDatas, setPortfolioDatas] = useState<SelectPortfolio[]>([]);
  const [activeKey, setActiveKey] = useState('');
  const [detailsModal, setDetailsModal] = useState(false);
  const [tabPane, setTabPane] = useState<Portfolio>();
  const [collectionTable, setCollectionTable] = useState<Portfolio[]>();
  const [selectOption, setSelectOption] = useState<UserList>();
  // const { token } = useUserInfo();
  // const { getToken } = useAuth({ role: [customManeger.privateManager] });

  useEffect(() => {
    // TODO: 可根据用户个性化配
    getData();
  }, []);

  const getData = async () => {
    setIsLoading(true);
    const token = user.verifyToken();
    try {
      const { item } = await request(
        `${getAPIEndpoint(
          '/invest-admin/admin/stocks-allot/match-customers/'
        )}${props.recordId}`,
        {
          token
        }
      );
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: matchCustomers.tsx ~ line 51 ~ getData ~ item`,
        item
      );
      setCollection(item.stocksAllot);
      setActiveKey(item.stocksAllot[0].code);
      setCollectionTable(item.stocksAllot[0].portfolioData);
      setSelectedRowKey(() => {
        let newPortfolioId = [];
        item.stocksAllot[0].portfolioId.map(value => {
          item.stocksAllot[0].portfolioData.filter(result => {
            if (value == result.correlationId) {
              newPortfolioId.push(result._id);
            }
          });
        });
        return newPortfolioId;
      });
      setSelectedRow(() => {
        let newPortfolio = [];
        item.stocksAllot[0].portfolioId.map(value => {
          item.stocksAllot[0].portfolioData.filter(result => {
            if (value == result.correlationId) {
              newPortfolio.push(result);
            }
          });
        });
        return newPortfolio;
      });
      setSelectedRowsPlus(() => {
        let newPortfolio = [];
        item.stocksAllot[0].portfolioId.map(value => {
          item.stocksAllot[0].portfolioData.filter(result => {
            if (value == result.correlationId) {
              newPortfolio.push(result);
            }
          });
        });
        return newPortfolio;
      });
      const selectDatas = [];
      item.stocksAllot.map(stock => {
        let newPortfolio = [];
        stock.portfolioId.map(value => {
          stock.portfolioData.filter(result => {
            if (value == result.correlationId) {
              newPortfolio.push(result);
            }
          });
        });
        selectDatas.push({ code: stock.code, selectData: newPortfolio });
      });
      setPortfolioDatas(selectDatas);
      props.selectData(selectDatas);
    } catch (err) {
      console.log('获取数据报错：', err);
      message.error(err.message);
    }
    setIsLoading(false);
  };

  const getDatas = async (value: string) => {
    const token = user.verifyToken();
    const { item } = await request(
      `${getAPIEndpoint(API_ROUTE_PATH_PORTFOLIO)}/${value}`,
      {
        token
      }
    );
    const options = await request(
      `${getAPIEndpoint(API_ROUTE_PATH_CLIENT)}/${
        item.meta.product.customerId
      }`,
      {
        token
      }
    );
    setTabPane(item);
    setSelectOption(options.item);
  };

  const initData = async () => {
    const token = user.verifyToken();

    setIsLoading(true);
    const { item } = await request(
      `${getAPIEndpoint(API_ROUTE_PATH_STOCKS_ALLOT)}/${props.recordId}`,
      {
        token
      }
    );
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: matchCustomers.tsx ~ line 115 ~ initData ~ item`,
      item
    );
    setIsLoading(false);
    return item.stocksAllot;
  };

  const fomatProduct = (_: any, record: Portfolio) => {
    const hash = {};
    const weight = record.stocks.reduce((item, next) => {
      hash[next.industry]
        ? ''
        : (hash[next.industry] = true && item.push(next));
      return item;
    }, []);
    return weight.map(item => {
      return <Tag key={'tag' + item.code}>{item.industry}</Tag>;
    });
  };

  const columns: ColumnsType<Portfolio> = [
    {
      title: '客户名称',
      dataIndex: ['meta', 'description'],
      key: 'meta.description',
      fixed: 'left'
    },
    {
      title: '总资金',
      dataIndex: 'assets',
      key: 'assets',
      align: 'center',
      render: formatDecimal
    },
    {
      title: '总市值',
      dataIndex: 'totalMarketValue',
      key: 'totalMarketValue',
      align: 'center',
      render: (_, record) => formatDecimal(record.assets - record.available)
    },
    {
      title: '盈亏金额',
      key: 'totalIncome',
      align: 'center',
      render: (_, record) => formatDecimal(record.assets - record.principal)
    },
    {
      title: '实盘仓位',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
      render: value => formatPercentage(value)
    },
    {
      title: '示范仓位',
      dataIndex: 'correlationPosition',
      key: 'correlationPosition',
      align: 'center',
      render: value => formatPercentage(value)
    },
    {
      title: '持仓行业',
      dataIndex: 'stocks',
      key: 'stocks',
      align: 'center',
      width: 200,
      render: fomatProduct
    },
    {
      title: '最后交易',
      dataIndex: 'correlationLastBuyAt',
      key: 'correlationLastBuyAt'
      // render: formatDateWithTooltip
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'operation',
      key: 'operation',
      render: (_: any, record: Portfolio) => {
        return (
          <Space>
            <Button
              size={'small'}
              type="link"
              onClick={async () => {
                await getDatas(record._id);
                setDetailsModal(true);
              }}>
              查看实盘
            </Button>
            <Button
              size={'small'}
              type="link"
              onClick={async () => {
                await getDatas(record.correlationId);
                setDetailsModal(true);
              }}>
              查看示范
            </Button>
          </Space>
        );
      }
    }
  ];

  const callback = async (key: string) => {
    const newCollection = await initData();
    const stocksData = collection.filter(item => item.code === key)[0];
    const stocksNewData = newCollection.filter(item => item.code === key)[0];
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: matchCustomers.tsx ~ line 263 ~ callback ~ stocksNewData`,
      newCollection,
      portfolioDatas,
      stocksNewData,
      stocksData
    );
    setActiveKey(stocksData.code);
    setCollectionTable(stocksData.portfolioData);
    setSelectedRowKey(() => {
      let newPortfolioId = [];
      stocksNewData.portfolioId.map(value => {
        stocksData.portfolioData.filter(result => {
          if (value == result.correlationId) {
            newPortfolioId.push(result._id);
          }
        });
      });
      return newPortfolioId;
    });
    setSelectedRow(() => {
      let newPortfolio = [];
      stocksNewData.portfolioId.map(value => {
        stocksData.portfolioData.filter(result => {
          if (value == result.correlationId) {
            newPortfolio.push(result);
          }
        });
      });
      return newPortfolio;
    });
    setSelectedRowsPlus(() => {
      let newPortfolio = [];
      stocksNewData.portfolioId.map(value => {
        stocksData.portfolioData.filter(result => {
          if (value == result.correlationId) {
            newPortfolio.push(result);
          }
        });
      });
      return newPortfolio;
    });
    const selectDatas = portfolioDatas.map(value => {
      if (value.code == stocksNewData.code) {
        const newPortfolio = [];
        stocksNewData.portfolioId.map(result => {
          const newSelectData = value.selectData.filter(
            item => result == item.correlationId
          )[0];
          newPortfolio.push(newSelectData);
        });
        value.selectData = newPortfolio;
      }
      return value;
    });
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: matchCustomers.tsx ~ line 290 ~ callback ~ selectDatas`,
      selectDatas
    );
    setPortfolioDatas(selectDatas);
    props.selectData(selectDatas);
  };

  const onSelect = (record: Portfolio, selected: boolean) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: matchCustomers.tsx ~ line 318 ~ onSelect ~ record`,
      record
    );
    const bodyValue = {
      portfolioId: record.correlationId,
      portfolioName: record.meta.description
    };
    if (selected) {
      try {
        request(
          `${getAPIEndpoint(API_ROUTE_PATH_STOCKS_ALLOT_DATA)}/${
            props.recordId
          }/stockPortfolio/${activeKey}`,
          {
            method: 'PUT',
            // token,
            body: bodyValue
          }
        );
      } catch (err) {
        console.error('添加股票账户id报错：', err);
        message.error(err.message);
      }
      setSelectedRowsPlus([...selectedRowsPlus, record]);
      setPortfolioDatas(
        portfolioDatas.map(item => {
          if (item.code == activeKey) {
            item.selectData.push(record);
          }
          console.log('项目是：', item);
          return item;
        })
      );
    }
    if (!selected) {
      let delIndex = null;
      for (let i = 0; i < selectedRowsPlus.length; i++) {
        if (selectedRowsPlus[i]._id == record._id) {
          delIndex = i;
          break;
        }
      }
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: matchCustomers.tsx ~ line 359 ~ onSelect ~ delIndex`,
        delIndex,
        selectedRowsPlus
      );
      selectedRowsPlus.splice(delIndex, 1);
      setSelectedRowsPlus([...selectedRowsPlus]);
      setPortfolioDatas(
        portfolioDatas.map(item => {
          if (item.code == activeKey) {
            item.selectData.splice(delIndex, 1);
          }
          return item;
        })
      );
      try {
        request(
          `${getAPIEndpoint(API_ROUTE_PATH_STOCKS_ALLOT_DATA)}/${
            props.recordId
          }/stockPortfolio/${activeKey}`,
          {
            method: 'DELETE',
            // token,
            body: bodyValue
          }
        );
      } catch (err) {
        console.error('删除股票账户id报错：', err);
        message.error(err.message);
      }
    }
  };

  const onSelectAll = (
    selected: boolean,
    selectedRows: Partial<Portfolio>[],
    changeRows: Partial<Portfolio>[]
  ) => {
    if (selected) {
      setSelectedRowsPlus([...selectedRowsPlus.concat(changeRows)]);
    }
    if (!selected) {
      const newSelectedRowsPlus = _.cloneDeep(selectedRowsPlus);
      let delIndex = [];
      for (let i = 0; i < newSelectedRowsPlus.length; i++) {
        for (let j = 0; j < changeRows.length; j++) {
          if (changeRows[j]._id == newSelectedRowsPlus[i]._id) {
            delIndex.push(i);
            break;
          }
        }
      }
      for (let k = 0; k < delIndex.length; k++) {
        delete newSelectedRowsPlus[delIndex[k]];
      }
      const pureProductListSelectedRowsPlus = newSelectedRowsPlus.filter(
        (item: any) => {
          return item != undefined;
        }
      );
      setSelectedRowsPlus(pureProductListSelectedRowsPlus);
    }
  };

  const onSelectChange = (
    selectedRowKeys: React.Key[],
    selectedRows: Partial<Portfolio>[]
  ) => {
    setSelectedRowKey(selectedRowKeys);
    setSelectedRow(selectedRows);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKey,
    selectedRows: selectedRow,
    onSelect,
    onSelectAll,
    onChange: onSelectChange
  };

  return (
    <div style={{ width: '100%' }}>
      <Tabs hideAdd type="card" onChange={callback} activeKey={activeKey}>
        {collection.map((item, index) => {
          return (
            <Tabs.TabPane tab={`${item.code} ${item.name}`} key={item.code}>
              <Row>
                <Col span={24}>
                  <Table
                    size="small"
                    rowKey="_id"
                    columns={columns}
                    dataSource={collectionTable}
                    rowSelection={rowSelection}
                    loading={isLoading}
                    // onChange={handleTableChangeNoform(getData)}
                    pagination={false}
                  />
                </Col>
              </Row>
            </Tabs.TabPane>
          );
        })}
      </Tabs>
      {/* <Modal
        title="账户信息详情"
        width={1100}
        centered={true}
        visible={detailsModal}
        keyboard={false}
        destroyOnClose
        onCancel={() => setDetailsModal(false)}
        footer={null}>
        <ClientDetailsInfo
          initialValues={{ tabPane, selectOption }}
          getToken={getToken}
        />
      </Modal> */}
    </div>
  );
};
