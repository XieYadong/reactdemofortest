import {
  Button,
  Form,
  Input,
  Space,
  Row,
  Col,
  Table,
  message,
  Select,
  Popconfirm,
  DatePicker
} from 'antd';
// import { productOption } from 'components/lookup/portfolio-meta.lookup';
import { GenericCallback } from 'lib/typings/common.interface';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';
import moment from 'moment';

import { UserFollowProducts, UserList } from 'lib/typings/portfolio.interface';
import { AddUserProduct } from './add-userProduct';
import { ColumnsType } from 'antd/lib/table/interface';
import { formatDate } from 'utils/helpers/date-format';
import { getPortfolioTypeLabelByValue } from 'constants/portfolio.constant';
import dayjs from 'dayjs';
// export interface productOption {
//   _id: string;
//   productName: string;
//   productType: string;
//   transactionDate: string;
//   description: string;
// }
const { RangePicker } = DatePicker;

export interface productOption {
  label: string;
  value: string;
  // productType: string;
  // transactionDate: string;
  // description: string;
}
export interface UpdateFormRefs {
  onFinish(formValues: UpdateFormFields): Promise<void | GenericCallback>;
  initialValues: UpdateFormFields;
  productOptions: Partial<productOption>[];
  productTypeOptions: Partial<productOption>[];
}
export interface UpdateFormFields {
  id: string;
  name?: string;
  nickName?: string;
  openId?: string;
  productDetailsList?: UserFollowProducts[];
  clientType?: string;
  clientTags?: string[];
  initialFunding?: number;
  remark?: string;
  createdAt?: number;
  expiredAt?: number;
}

export const RelationshipForm: FunctionComponent<UpdateFormRefs> = (
  props: PropsWithChildren<UpdateFormRefs>
) => {
  const recordData = props.initialValues;
  const [form] = Form.useForm<UpdateFormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collection, setCollection] = useState([]);

  const initial: UpdateFormFields = {
    id: undefined,
    name: undefined,
    clientType: undefined,
    nickName: undefined,
    openId: undefined,
    initialFunding: undefined,
    remark: undefined,
    productDetailsList: []
  };
  const initialValues =
    typeof props.initialValues == 'object'
      ? {
          ...props.initialValues,
          expiredAt: moment(props.initialValues.expiredAt),
          createdAt: moment(props.initialValues.createdAt)
        }
      : initial;
  const handleReset = () => {
    form.resetFields();
  };

  const handleTableData = (followProducts: UserFollowProducts[]) => {
    const hash = {};
    const weight = followProducts.reduce((item, next) => {
      hash[next.productName]
        ? ''
        : (hash[next.productName] = true && item.push(next));
      return item;
    }, []);
    weight.map(item => {
      item['key'] = `${item.productId}-${item.productName}${item.expiredAt}`;
    });
    setCollection(weight);
  };

  useEffect(() => {
    console.log('props.initialValues:', props.initialValues);
    // typeof props.initialValues == 'object' &&
    handleTableData(recordData.productDetailsList);
  }, []);

  const handleFinish = async (formValues: any) => {
    const bodyValue = {
      productId: formValues.productId,
      initialFunding: formValues.initialFunding,
      expiredAt: dayjs(formValues.expiredAt).valueOf(),
      createdAt: dayjs(formValues.createdAt).valueOf(),
      id: formValues.id
    };
    setIsSubmitting(true);
    const callback = await props.onFinish(bodyValue);
    setIsSubmitting(false);

    requestAnimationFrame(() => {
      if (typeof callback === 'function') {
        callback();
      }

      form.resetFields();
    });
  };

  const addProduct = (value: UserFollowProducts) => {
    console.log(
      `🚀 ${new Date().toLocaleString()} ~ file: update-userList-Relationship-form.tsx ~ line 103 ~ addProduct ~ value`,
      value
    );
    if (JSON.stringify(collection).indexOf(JSON.stringify(value)) !== -1) {
      return message.error('相同产品和到期日期已经存在，请勿重复添加！');
    }
    setCollection([...collection, value]);
  };

  const handleDelete = (key: string) => {
    const tableDatas = collection.filter(item => item.key !== key);
    setCollection(tableDatas);
  };

  const columns: ColumnsType<UserFollowProducts> = [
    {
      title: '产品类型',
      key: 'productType',
      dataIndex: 'productType',
      render: type => {
        if (type === 'Premium') {
          return '私人';
        } else if (type === 'Advanced') {
          return '项目';
        }
      }
    },
    {
      title: '购买产品',
      key: 'productName',
      dataIndex: 'productName'
    },
    {
      title: '到期日期',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      render: formatDate
    },
    {
      title: '操作',
      key: 'operation',
      render: record => {
        return (
          <Popconfirm
            title={`确认删除 "${record.productName ?? record.key}" 产品吗?`}
            onConfirm={() => handleDelete(record.key)}>
            <Button danger type="link">
              删除
            </Button>
          </Popconfirm>
        );
      }
    }
  ];

  return (
    <Form
      name="update-form"
      layout="vertical"
      form={form}
      style={{ maxWidth: 640 }}
      initialValues={initialValues}
      onFinish={handleFinish}>
      <Form.Item name="id" hidden>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'clientType'} hidden>
        <Input disabled />
      </Form.Item>
      <Form.Item name={'initialFunding'} hidden>
        <Input disabled />
      </Form.Item>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name={'name'} label="客户名称">
            <Input disabled autoComplete="off" placeholder="请输入客户姓名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={'nickName'} label="昵称">
            <Input disabled autoComplete="off" placeholder="请输入昵称" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name={'productType'} label="产品类型">
            <Select
              showSearch
              placeholder="请选择产品类型"
              style={{ width: '100%' }}
              // onChange={selectChange}
            >
              {props.productTypeOptions.map(option => (
                <Select.Option
                  value={`${option.value}`}
                  key={`follow-product-${option.value}`}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'productId'} label="产品名称">
            <Select
              showSearch
              placeholder="请选择产品名称"
              style={{ width: '100%' }}
              // onChange={selectChange}
            >
              {props.productOptions.map(option => (
                <Select.Option
                  value={`${option.value}`}
                  key={`follow-product-${option.value}`}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'createdAt'} label="购买时间">
            <DatePicker
              placeholder="请选择购买时间"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              // onChange={dateChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'expiredAt'} label="到期时间">
            <DatePicker
              placeholder="请选择到期日期"
              style={{ width: '100%' }}
              // onChange={dateChange}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name={'remark'} label="备注">
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item name={'initialFunding'} label="初始资金">
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item>
        <Space size="middle">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isFetching}>
            保存
          </Button>
          <Button htmlType="button" size="large" onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
