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
  DatePicker,
  Radio
} from 'antd';
import moment from 'moment';
// import { productOption } from 'components/lookup/portfolio-meta.lookup';
import { GenericCallback } from 'lib/typings/common.interface';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';
import { UserFollowProducts, UserList } from 'lib/typings/portfolio.interface';
import { AddUserProduct } from './add-userProduct';
import { ColumnsType } from 'antd/lib/table/interface';
import { formatDate } from 'utils/helpers/date-format';
import { getPortfolioTypeLabelByValue } from 'constants/portfolio.constant';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export interface productOption {
  label: string;
  value: string;
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
  createdAt: number;
  expiredAt: number;
}

export const RelationshipForm: FunctionComponent<UpdateFormRefs> = (
  props: PropsWithChildren<UpdateFormRefs>
) => {
  const recordData = props.initialValues;
  const [form] = Form.useForm<UpdateFormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collection, setCollection] = useState([]);
  const [radioValue, setRadioValue] = useState(false);

  const initial: UpdateFormFields = {
    id: undefined,
    name: undefined,
    clientType: undefined,
    nickName: undefined,
    openId: undefined,
    initialFunding: undefined,
    remark: undefined,
    productDetailsList: [],
    createdAt: undefined,
    expiredAt: undefined
  };
  const initialValues =
    typeof props.initialValues == 'object'
      ? {
          ...props.initialValues,
          // createdAt: dayjs(dayjs(props.initialValues.createdAt)),
          // expiredAt: dayjs(dayjs(props.initialValues.createdAt))
          createdAt: moment(moment(props.initialValues.createdAt)),
          expiredAt: moment(moment(props.initialValues.expiredAt))
        }
      : initial;
  const handleReset = () => {
    form.resetFields();
  };

  const radioChage = e => {
    setRadioValue(e.target.value);
  };
  const handleFinish = async (formValues: any) => {
    console.log(formValues, 'formValues111111111');
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
        <Col span={12}>
          <Form.Item name={'productType'} label="产品类型">
            <Select
              placeholder="请选择产品名称"
              style={{ width: '100%' }}
              disabled
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
        <Col span={12}>
          <Form.Item name={'productId'} label="产品名称">
            <Select
              placeholder="请选择产品名称"
              style={{ width: '100%' }}
              disabled
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
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item name={'createdAt'} label="购买时间">
            <DatePicker
              placeholder="请选择购买时间"
              style={{ width: '100%' }}
              // onChange={dateChange}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="expiredAt" label="到期时间">
            <DatePicker
              placeholder="请选择到期日期"
              style={{ width: '100%' }}
              // onChange={dateChange}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24} style={{ verticalAlign: 'middle' }}>
        <Col span={10}>
          <Form.Item name={'initialFunding'} label="起始资金">
            <Input autoComplete="off" />
          </Form.Item>
        </Col>

        {/* <Col span={10} style={{ marginTop: '30px' }}>
          <Button>修改初始本金</Button>
        </Col> */}
      </Row>
      <Row>
        <Form.Item label="是否购买">
          <Radio.Group onChange={radioChage} value={radioValue}>
            <Radio value={false}>否</Radio>
            <Radio value={true}>是</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      {/* {radioValue && (
        <>
          <Form.Item name={'adjustRemarkFunding'} label="起始资金">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name={'adjustRemark'} label="修改备注">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="adjustAt" label="到期时间">
            <DatePicker
              placeholder="请选择到期日期"
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              // onChange={dateChange}
            />
          </Form.Item>
        </>
      )} */}

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
