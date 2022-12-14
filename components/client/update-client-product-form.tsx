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
        <Col span={12}>
          <Form.Item name={'productType'} label="????????????">
            <Select
              placeholder="?????????????????????"
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
          <Form.Item name={'productId'} label="????????????">
            <Select
              placeholder="?????????????????????"
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
          <Form.Item name={'createdAt'} label="????????????">
            <DatePicker
              placeholder="?????????????????????"
              style={{ width: '100%' }}
              // onChange={dateChange}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="expiredAt" label="????????????">
            <DatePicker
              placeholder="?????????????????????"
              style={{ width: '100%' }}
              // onChange={dateChange}
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24} style={{ verticalAlign: 'middle' }}>
        <Col span={10}>
          <Form.Item name={'initialFunding'} label="????????????">
            <Input autoComplete="off" />
          </Form.Item>
        </Col>

        {/* <Col span={10} style={{ marginTop: '30px' }}>
          <Button>??????????????????</Button>
        </Col> */}
      </Row>
      <Row>
        <Form.Item label="????????????">
          <Radio.Group onChange={radioChage} value={radioValue}>
            <Radio value={false}>???</Radio>
            <Radio value={true}>???</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      {/* {radioValue && (
        <>
          <Form.Item name={'adjustRemarkFunding'} label="????????????">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name={'adjustRemark'} label="????????????">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item name="adjustAt" label="????????????">
            <DatePicker
              placeholder="?????????????????????"
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
