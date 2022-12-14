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
      `???? ${new Date().toLocaleString()} ~ file: update-userList-Relationship-form.tsx ~ line 103 ~ addProduct ~ value`,
      value
    );
    if (JSON.stringify(collection).indexOf(JSON.stringify(value)) !== -1) {
      return message.error('???????????????????????????????????????????????????????????????');
    }
    setCollection([...collection, value]);
  };

  const handleDelete = (key: string) => {
    const tableDatas = collection.filter(item => item.key !== key);
    setCollection(tableDatas);
  };

  const columns: ColumnsType<UserFollowProducts> = [
    {
      title: '????????????',
      key: 'productType',
      dataIndex: 'productType',
      render: type => {
        if (type === 'Premium') {
          return '??????';
        } else if (type === 'Advanced') {
          return '??????';
        }
      }
    },
    {
      title: '????????????',
      key: 'productName',
      dataIndex: 'productName'
    },
    {
      title: '????????????',
      dataIndex: 'expiredAt',
      key: 'expiredAt',
      render: formatDate
    },
    {
      title: '??????',
      key: 'operation',
      render: record => {
        return (
          <Popconfirm
            title={`???????????? "${record.productName ?? record.key}" ??????????`}
            onConfirm={() => handleDelete(record.key)}>
            <Button danger type="link">
              ??????
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
          <Form.Item name={'name'} label="????????????">
            <Input disabled autoComplete="off" placeholder="?????????????????????" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={'nickName'} label="??????">
            <Input disabled autoComplete="off" placeholder="???????????????" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name={'productType'} label="????????????">
            <Select
              showSearch
              placeholder="?????????????????????"
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
          <Form.Item name={'productId'} label="????????????">
            <Select
              showSearch
              placeholder="?????????????????????"
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
          <Form.Item name={'createdAt'} label="????????????">
            <DatePicker
              placeholder="?????????????????????"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              // onChange={dateChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'expiredAt'} label="????????????">
            <DatePicker
              placeholder="?????????????????????"
              style={{ width: '100%' }}
              // onChange={dateChange}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name={'remark'} label="??????">
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item name={'initialFunding'} label="????????????">
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
            ??????
          </Button>
          <Button htmlType="button" size="large" onClick={handleReset}>
            ??????
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
