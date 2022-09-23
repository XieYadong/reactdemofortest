import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag
} from 'antd';
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
import { formatDateWithTooltip } from 'utils/helpers/date-format';
import { useQuotes } from 'lib/hooks/use-quotes';
import { StocksAllots } from 'lib/typings/portfolio.interface';
import moment from 'moment';
import user from 'utils/helpers/user';

const API_ROUTE_PATH = '/stocks-allot';
const API_ROUTE_PATH_DATA = '/stocks-allot/data';

export interface AddStocksProps {
  recordId: string;
  buyStocks: (data: StocksAllots[]) => void;
  editStocksStatus: (value: boolean) => void;
}

export interface EditableCellProps {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: 'autoComplete' | 'check' | 'text' | 'select' | 'numberSymbol';
  record: StocksAllots;
  index: number;
  children: React.ReactNode;
}

export const EditStocks: FunctionComponent<AddStocksProps> = (
  props: PropsWithChildren<AddStocksProps>
) => {
  const [showAddRecordModal, setShowAddRecrodModal] = useState<any>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [collection, setCollection] = useState([]);
  const [currentStock, setCurrentStock] = useState('');
  const [clientType, setClientType] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();
  const [num, setNum] = useState(0);
  const [priceDisabled, setPriceDisabled] = useState(false);
  const [checkStatus, setCheckStatus] = useState(true);
  const [options, setOptions] = useState([]);
  // const { token } = useUserInfo();
  const { watch, quotes } = useQuotes();
  console.log('获取股票行情中。。。', quotes);

  const fomatProduct = (_: any, record: StocksAllots) => {
    return record.clientType.map(item => {
      return <Tag key={'tag' + item}>{item}</Tag>;
    });
  };

  const columns = [
    {
      title: '证券代码',
      dataIndex: 'code',
      width: '15%',
      editable: true
    },
    {
      title: '证券名称',
      dataIndex: 'name',
      editable: true
    },
    {
      title: '所属行业',
      dataIndex: 'industry',
      editable: true
    },
    {
      title: '客户类型',
      dataIndex: 'clientType',
      editable: true,
      render: fomatProduct
    },
    {
      title: '现价买入',
      dataIndex: 'currentPrice',
      width: 100,
      editable: true,
      render: (_: any, record: StocksAllots) => (
        <Checkbox disabled={true} checked={record.cost === '现价买入'} />
      )
    },
    {
      title: '买入价格',
      dataIndex: 'cost',
      editable: true,
      render: value => (typeof value == 'string' ? value : formatDecimal(value))
    },
    {
      title: '买入仓位',
      dataIndex: 'position',
      editable: true
    },
    {
      title: '加入日期',
      dataIndex: 'createdAt',
      editable: false,
      render: formatDateWithTooltip
    },
    {
      title: '操作',
      width: 150,
      dataIndex: 'operation',
      render: (_: any, record: StocksAllots) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Button type="link" onClick={() => save(record.key)}>
              保存
            </Button>
            <Popconfirm title="确定取消吗？" onConfirm={cancel}>
              <Button danger type="link">
                取消
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={() => edit(record)}>
              编辑
            </Button>
            <Popconfirm
              title={
                record.name
                  ? `确认删除 "${record.name ?? record.code}" 股票吗?`
                  : '确认删除该数据吗?'
              }
              onConfirm={() => handleDelete(record)}>
              <Button danger type="link">
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];

  useEffect(() => {
    const watchList: string[] = [];
    if (currentStock) {
      watchList.push(currentStock);
    }
    console.log('watchlist %o', watchList);
    watch(watchList);
  }, [currentStock]);

  useEffect(() => {
    // TODO: 可根据用户个性化配
    getData();
    loadClientType();
  }, []);

  const loadClientType = async () => {
    const token = user.verifyToken();

    try {
      const { data } = await request(
        getAPIEndpoint('/invest-admin/admin/customer-type-list'),
        {
          token,
          query: {
            pageSize: 1000,
            pageNo: 1
          }
        }
      );
      setClientType(
        data?.resultList?.filter(
          item =>
            item.clientType !== '问题客户' && item.clientType !== '到期客户'
        )
      );
    } catch (err) {
      console.error(
        `🚀 ${new Date().toLocaleString()} ~ file: index.tsx ~ line 86 ~ err`,
        err
      );
    }
  };

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
      if (data.stocksAllot.length) {
        const keyNum = data.stocksAllot.map(item => item.key.split('-')[1]);
        console.log(
          `🚀 ${new Date().toLocaleString()} ~ file: editStocks.tsx ~ line 199 ~ getData ~ keyNum`,
          keyNum,
          Math.max(...keyNum)
        );
        setNum(Math.max(...keyNum) + 1);
      }
      setCollection(data.stocksAllot);
      props.buyStocks(data.stocksAllot);
    } catch (err) {
      console.log('获取数据报错：', err);
      message.error(err.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (record: StocksAllots) => {
    console.log('所有数据：', collection);
    console.log(collection.filter(item => item.key !== record.key));
    const token = user.verifyToken();
    try {
      if (record.code) {
        await request(
          `${getAPIEndpoint('/invest-admin/admin/stocks-allot/data/')}/${
            props.recordId
          }/stock/${record.code}`,
          {
            method: 'DELETE',
            token
          }
        );
      }
      message.info('删除成功');
      setCollection(collection.filter(item => item.key !== record.key));
      props.buyStocks(collection.filter(item => item.key !== record.key));
    } catch (err) {
      message.error(err.message);
    }
  };

  const handleAdd = () => {
    const clientTypes = clientType.map(item => item.customerType);
    const newData: Partial<StocksAllots> = {
      key: `addStock-${num}`,
      code: undefined,
      name: undefined,
      industry: undefined,
      clientType: clientTypes,
      cost: '现价买入',
      close: '0',
      position: '10%',
      createdAt: moment(moment())
    };
    setCollection([...collection, newData]);
    props.buyStocks([...collection, newData]);
    setNum(num + 1);
  };

  const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      inputType === 'check' ? (
        <Checkbox
          disabled={checkStatus}
          style={{ marginLeft: 20 }}
          checked={priceDisabled}
          onChange={checkboxSelect}
          value="现价买入"
        />
      ) : inputType === 'numberSymbol' ? (
        <InputNumber
          min={0}
          max={100}
          formatter={value => `${value}%`}
          // parser={value => value.replace('%', '')}
        />
      ) : inputType === 'select' ? (
        <Select mode="multiple" placeholder="请选择客户类型">
          {clientType.map(option => (
            <Select.Option
              value={option.customerType}
              key={`clientType-${option.id}`}>
              {option.customerType}
            </Select.Option>
          ))}
        </Select>
      ) : inputType === 'autoComplete' ? (
        <Input
          autoComplete="off"
          placeholder={`请输入${title}`}
          onChange={handleSearch}
        />
      ) : (
        <Input autoComplete="off" placeholder={`请输入${title}`} />
      );

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={
              dataIndex == 'currentPrice'
                ? []
                : [
                    {
                      required: true,
                      message: `${title}不能为空!`
                    }
                  ]
            }>
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const isEditing = (record: StocksAllots) => record.key === editingKey;

  const edit = (record: Partial<StocksAllots>) => {
    props.editStocksStatus(true);
    setCurrentStock(record.code);
    setCheckStatus(false);
    if (record.cost === '现价买入') {
      setPriceDisabled(true);
    }
    console.log('代码：', record.code, record.cost);
    record.code ? setShowAddRecrodModal(record) : setShowAddRecrodModal('add');
    form.setFieldsValue({
      code: record.code || undefined,
      name: record.name || undefined,
      industry: record.industry || undefined,
      cost: record.cost === '现价买入' ? '现价买入' : record.cost,
      close: record.close || undefined,
      clientType: record.clientType || ['稳健型'],
      position: record.position || 10,
      ...record
    });
    setEditingKey(record.key);
  };

  useEffect(() => {
    console.log('股票改变了！！！', options);
    stockNameChange(options);
  }, [options]);

  useEffect(() => {
    form.setFieldsValue({
      cost: priceDisabled ? '现价买入' : quotes[currentStock]?.now
    });
  }, [quotes[currentStock]?.name]);

  const stockNameChange = (options: string | any[]) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: editStocks.tsx ~ line 364 ~ options`,
      options
    );
    if (!options.length) return;
    form.setFieldsValue({
      name: options[0]['name'],
      industry: options[0]['industry']
    });
  };

  const checkboxSelect = (e: { target: { checked: any } }) => {
    const checked = e.target.checked;
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: editable-cell.form.tsx ~ line 83 ~ checked`,
      checked
    );
    form.setFieldsValue({
      cost: checked ? '现价买入' : quotes[currentStock]?.now || undefined
    });
    setPriceDisabled(checked);
  };

  const handleSearch = async (e: { target: { value: string | any[] } }) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: editStocks.tsx ~ line 421 ~ handleSearch ~ e`,
      e.target.value
    );
    const token = user.verifyToken();
    try {
      if (e.target.value.length === 6) {
        const { data } = await request(
          `${getAPIEndpoint('/invest-admin/admin/lookup/stock')}/${
            e.target.value
          }`,
          {
            method: 'GET',
            token
          }
        );

        console.log(
          `🚀 ${new Date().toLocaleString()} ~ file: editable-cell.form.tsx ~ line 66 ~ options`,
          data
        );
        if (!data.length) {
          throw new Error('现有数据库中没有该股票，请联系技术人员！');
        }
        setCurrentStock(data[0]['symbol']);
        setOptions(data);
      }
    } catch (err) {
      console.error(
        `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 194 ~ err`,
        err
      );
      message.error(err.message);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    const token = user.verifyToken();
    props.editStocksStatus(false);
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: editable-cell.form.tsx ~ line 237 ~ save ~ key`,
      key
    );
    try {
      const row = (await form.validateFields()) as StocksAllots;
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: editable-cell.form.tsx ~ line 240 ~ save ~ row`,
        row
      );
      row.clientType = row.clientType.filter(item => {
        if (row.code.slice(0, 3) == '300' || row.code.slice(0, 3) == '688') {
          return !item.includes('非创') && !item.includes('非科');
        }
        return item;
      });
      if (typeof row.position === 'number') {
        row.position = row.position + '%';
      }
      const formDatas = {
        stocksAllot: {
          ...row,
          key,
          cost: row.cost.toString(),
          price: row.cost !== '现价买入' ? row.cost : null,
          close: quotes[currentStock]?.close,
          createdAt: collection.filter(item => item.key === key)[0][
            'createdAt'
          ],
          portfolioId: []
        }
      };
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: editStocks.tsx ~ line 152 ~ handleAddRecord ~ formDatas`,
        formDatas
      );

      const requestUrl =
        showAddRecordModal == 'add'
          ? `${getAPIEndpoint('/invest-admin/admin/stocks-allot/save')}/${
              props.recordId
            }`
          : `${getAPIEndpoint('/invest-admin/admin/stocks-allot')}/${
              props.recordId
            }`;
      await request(requestUrl, {
        method: 'PUT',
        token,
        body: formDatas
      });

      const newData = [...collection];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row
        });
        setCollection(newData);
        props.buyStocks(newData);
        setEditingKey('');
        setOptions([]);
      } else {
        newData.push(row);
        setCollection(newData);
        props.buyStocks(newData);
        setEditingKey('');
        setOptions([]);
      }

      message.success(
        showAddRecordModal == 'add' ? '新增记录成功' : '保存成功'
      );
      setShowAddRecrodModal(false);
      setCurrentStock('');
      form.resetFields();
      setPriceDisabled(false);
    } catch (errInfo) {
      console.log('验证失败：', errInfo);
      message.error(errInfo.message);
    }
  };

  const mergedColumns: ColumnsType<StocksAllots> = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: StocksAllots) => ({
        record,
        inputType:
          col.dataIndex === 'currentPrice'
            ? 'check'
            : col.dataIndex === 'position'
            ? 'numberSymbol'
            : col.dataIndex === 'clientType'
            ? 'select'
            : col.dataIndex === 'code'
            ? 'autoComplete'
            : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    };
  });

  return (
    <div style={{ width: '100%' }}>
      <Button onClick={handleAdd}>新增股票</Button>

      <Form name="update-form" layout="vertical" form={form} component={false}>
        <Table
          style={{ marginTop: 20 }}
          size="small"
          components={{
            body: {
              cell: EditableCell
            }
          }}
          bordered
          loading={isLoading}
          dataSource={collection}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={false}
        />
      </Form>
    </div>
  );
};
