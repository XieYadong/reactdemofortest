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
import user from 'utils/helpers/user';
import { request, shallowCopySkipEmptyString } from 'utils/helpers/http';

import { UserFollowProducts, UserList } from 'lib/typings/portfolio.interface';
import { AddUserProduct } from './add-userProduct';
import { ColumnsType } from 'antd/lib/table/interface';
import { formatDate } from 'utils/helpers/date-format';
import { getPortfolioTypeLabelByValue } from 'constants/portfolio.constant';
import dayjs from 'dayjs';
import { getAPIEndpoint } from 'lib/options/api.options';
import { setFlagsFromString } from 'v8';

const { RangePicker } = DatePicker;

export interface productOption {
  label: string;
  value: string;
}
export interface UpdateFormRefs {
  onFinish(formValues: UpdateFormFields): Promise<void | GenericCallback>;
  initialValues: UpdateFormFields;
  productOptions: Partial<productOption>[];
  accountLimit: Partial<productOption>[];
  companys: Partial<productOption>[];
}
export interface UpdateFormFields {
  id: string;
  clientName: string;
  nickName: string;
  openId: string;
  productDetailsList?: UserFollowProducts[];
  clientType?: string;
  clientTags?: string[];
  initialFunding?: number;
  remark?: string;
  companyId?: string;
  accountLimit?: string;
}

export const ClienteditForm: FunctionComponent<UpdateFormRefs> = (
  props: PropsWithChildren<UpdateFormRefs>
) => {
  const recordData = props.initialValues;
  const [form] = Form.useForm<UpdateFormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [collection, setCollection] = useState([]);
  const [radioValue, setRadioValue] = useState(false);
  const [logs, setLogs] = useState([]);
  const columns: ColumnsType<any> = [
    {
      title: '????????????',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '????????????',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '????????????',
      dataIndex: 'name',
      key: 'name'
    }
  ];
  const initial: UpdateFormFields = {
    id: undefined,
    clientName: undefined,
    clientType: undefined,
    nickName: undefined,
    openId: undefined,
    initialFunding: undefined,
    remark: undefined,
    productDetailsList: [],
    companyId: undefined,
    accountLimit: undefined
  };
  const initialValues =
    typeof props.initialValues == 'object'
      ? {
          ...props.initialValues,
          companyId: props.initialValues.companyId + '',
          accountLimit: props.initialValues.accountLimit + ''
        }
      : initial;
  const handleReset = () => {
    form.resetFields();
  };
  useEffect(() => {
    // getEditLog()
  }, []);
  const radioChage = e => {
    setRadioValue(e.target.value);
  };
  const handleFinish = async (formValues: any) => {
    console.log(formValues, 'formValues111111111');

    setIsSubmitting(true);
    const callback = await props.onFinish(formValues);
    setIsSubmitting(false);

    requestAnimationFrame(() => {
      if (typeof callback === 'function') {
        callback();
      }

      form.resetFields();
    });
  };
  const getEditLog = async () => {
    const token = user.verifyToken();
    const { data } = await request(
      `${getAPIEndpoint('/invest-admin/admin/member/')}`,
      {
        token
      }
    );
    setLogs(data);
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
        <Col span={8}>
          <Form.Item name={'investmentStyle'} label="????????????">
            <Select
              showSearch
              placeholder="???????????????????????????"
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
        <Col span={8}>
          <Form.Item name={'accountLimit'} label="????????????">
            <Select
              placeholder="?????????????????????"
              style={{ width: '100%' }}
              // onChange={selectChange}
            >
              {props.accountLimit.map(option => (
                <Select.Option
                  value={`${option.value}`}
                  key={`follow-product-${option.value}`}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'companyId'} label="????????????">
            <Select
              placeholder="?????????????????????"
              style={{ width: '100%' }}
              // onChange={selectChange}
            >
              {props.companys.map(option => (
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

      <Row gutter={24} style={{ verticalAlign: 'middle' }}>
        <Col span={10}>
          <Form.Item name={'initialFunding'} label="????????????">
            <Input disabled autoComplete="off" />
          </Form.Item>
        </Col>

        {/* <Col span={10} style={{ marginTop: '30px' }}>
          <Button>??????????????????</Button>
        </Col> */}
      </Row>
      <Form.Item name={'remark'} label="??????">
        <Input autoComplete="off" placeholder="???????????????" />
      </Form.Item>
      {/* <Row>
        <Form.Item label="????????????">
          <Radio.Group onChange={radioChage} value={radioValue}>
            <Radio value={false}>???</Radio>
            <Radio value={true}>???</Radio>
          </Radio.Group>
        </Form.Item>
      </Row>
      {radioValue && (
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
      {/* <Table
        style={{ margin: '20px 0' }}
        size={'small'}
        bordered
        columns={columns}
        dataSource={logs}
      /> */}
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
