import { message, Table, Tag } from 'antd';
import { request } from 'utils/helpers/http';
import { getAPIEndpoint } from 'lib/options/api.options';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';
import { ColumnsType } from 'antd/lib/table';
// import { useUserInfo } from 'lib/hooks/userinfo';
import { formatDecimal } from 'utils/helpers/number-format';
import { StocksAllots } from 'lib/typings/portfolio.interface';
import { SelectPortfolio } from './matchCustomers';
import user from 'utils/helpers/user';

const API_ROUTE_PATH = '/stocks-allot';

export interface ConfirmProps {
  recordId: string;
  selectData: SelectPortfolio[];
  buyStocks: (data: StocksAllots[]) => void;
}

export const Confirm: FunctionComponent<ConfirmProps> = (
  props: PropsWithChildren<ConfirmProps>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState([]);
  // const { token } = useUserInfo();

  const fomatClient = (record: string[]) => {
    return record.map(item => {
      return <Tag key={'tag' + item}>{item}</Tag>;
    });
  };

  const columns: ColumnsType<StocksAllots> = [
    {
      title: '证券代码',
      dataIndex: 'code',
      key: 'code'
    },
    {
      title: '证券名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      key: 'industry'
    },
    {
      title: '客户类型',
      dataIndex: 'clientType',
      key: 'clientType',
      render: value => fomatClient(value)
    },
    {
      title: '买入价格',
      dataIndex: 'cost',
      key: 'cost',
      align: 'center',
      render: value => (typeof value == 'string' ? value : formatDecimal(value))
    },
    {
      title: '买入仓位',
      dataIndex: 'position',
      key: 'position',
      align: 'center'
    },
    {
      title: '匹配客户',
      key: 'portfolioName',
      dataIndex: 'portfolioName',
      render: value => fomatClient(value)
    }
  ];

  useEffect(() => {
    // TODO: 可根据用户个性化配
    getData();
  }, []);

  const getData = async () => {
    const token = user.verifyToken();
    setIsLoading(true);
    try {
      const { data } = await request(
        `${getAPIEndpoint('/invest-admin/admin/stocks-allot/')}/${
          props.recordId
        }`,
        {
          token
        }
      );
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: editStocks.tsx ~ line 129 ~ getData ~ item`,
        data
      );

      setCollection(data.stocksAllot);
      props.buyStocks(data.stocksAllot);
    } catch (err) {
      console.log('获取数据报错：', err);
      message.error(err.message);
    }
    setIsLoading(false);
  };

  return (
    <div style={{ width: '100%' }}>
      <Table
        size="small"
        rowKey="code"
        columns={columns}
        dataSource={collection}
        loading={isLoading}
        pagination={false}
      />
    </div>
  );
};
