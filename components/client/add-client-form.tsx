import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Row,
  Col,
  InputNumber,
  AutoComplete,
  message,
  Radio,
  List
} from 'antd';
import { Rule } from 'antd/lib/form';
// import {
//   productOption,
//   clientTypeOption,
//   clientTagOption
// } from 'components/lookup/portfolio-meta.lookup';
import { GenericCallback } from 'lib/typings/common.interface';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState
} from 'react';
import user from 'utils/helpers/user';

import { UserFollowProducts, UserList } from 'lib/typings/portfolio.interface';
import { debounce } from 'lodash';
import { request } from 'utils/helpers/http';
import { getAPIEndpoint } from 'lib/options/api.options';
// import { useUserInfo } from 'lib/hooks/userinfo';
interface InsertFormProps {
  onFinish(formValues: FormFields): Promise<void | GenericCallback>;
  initialValues: UserList;
  typeOptions: Partial<any>[];
  // tagOptions: Partial<clientTagOption>[];
}

export interface FormFields {
  id: string;
  clientName: string;
  nickName: string;
  openId: string;
  followProducts?: UserFollowProducts[];
  clientType?: string;
  clientTags?: string[];
  initialFunding?: number;
  remark?: string;
}

const formValidationRules: Partial<Record<keyof FormFields, Rule[]>> = {
  openId: [
    { required: true, type: 'string', message: 'openId不能为空' },
    {
      pattern: /^([\w-]){28}$/,
      message: '请输入正确的openId，openId为28位字符'
    }
  ],
  initialFunding: [
    { type: 'number', min: 5000, message: '起始资金不能少于5000' },
    { required: true, message: '起始资金不能为空' }
  ]
};

export const UserForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  console.log('传过来的数据：', props.initialValues);
  const [form] = Form.useForm<FormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [options, setOptions] = useState([]);
  // const { token } = useUserInfo();

  const initial: FormFields = {
    id: '',
    clientName: undefined,
    nickName: undefined,
    openId: undefined,
    remark: undefined,
    followProducts: [],
    initialFunding: undefined,
    clientType: undefined
  };
  const initialValues =
    typeof props.initialValues == 'object'
      ? {
          ...props.initialValues
        }
      : initial;
  const handleReset = () => {
    form.resetFields();
  };

  const handleSearch = useCallback(
    debounce(
      async (keyword: string) => {
        try {
          const token = user.verifyToken();

          if (keyword) {
            const { results } = await request(
              getAPIEndpoint('/userInfo/client-openId/query-openId'),
              {
                method: 'POST',
                token,
                body: { clientName: keyword }
              }
            );

            setOptions(results);
          }
        } catch (err) {
          console.error(
            `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 194 ~ err`,
            err
          );
        }
      },
      800,
      { leading: true }
    ),
    []
  );

  const handleSelect = async (value: string, option: any) => {
    const selectOption = options.filter(item => {
      return item.clientName === value.split('|')[0];
    });
    setOptions(selectOption);
    form.setFieldsValue({
      clientName: value.split('|')[0],
      openId: option.key.split('|')[0],
      nickName: option.nickname
    });
  };

  const handleFinish = async (formValues: FormFields) => {
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

  // const radioChange = e => {
  //   props.initialValues.meta.followProducts.map(item => {
  //     if (item.productName === e.target.name) {
  //       item.status = e.target.value;
  //     }
  //   });
  // };

  // const highChange = e => {
  //   props.initialValues.meta.followProducts.map(item => {
  //     if (
  //       item.productType === 'Advanced' &&
  //       item.productName === e.target.name
  //     ) {
  //       item.num = e.target.value;
  //     }
  //   });
  // };

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
      <Form.Item name={'followProducts'} hidden>
        <Input disabled />
      </Form.Item>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name={'clientName'}
            label="客户名称"
            rules={formValidationRules.clientName}>
            <AutoComplete
              filterOption={false}
              onSearch={handleSearch}
              onSelect={handleSelect}
              placeholder="请输入客户姓名">
              {options.map(option => (
                <AutoComplete.Option
                  value={`${option.clientName}|${option.nickname}`}
                  nickname={option.nickname}
                  key={`${option.openId}|${option.nickname}`}>
                  {`${option.clientName} (${option.nickname})`}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'clientType'}
            label="客户类型"
            rules={formValidationRules.clientType}>
            <Select showSearch placeholder="请选择客户类型">
              {props.typeOptions.map(option => (
                <Select.Option
                  value={option.clientType}
                  key={`risk-level-${option._id}`}>
                  {option.clientType}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name={'initialFunding'}
            label="起始资金"
            rules={formValidationRules.initialFunding}>
            <InputNumber
              style={{ width: '100%' }}
              placeholder="请输入起始资金"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name={'nickName'}
            label="昵称"
            rules={formValidationRules.nickName}>
            <Input autoComplete="off" placeholder="请输入昵称" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name={'openId'}
            label="openId"
            rules={formValidationRules.openId}>
            <Input autoComplete="off" placeholder="请输入微信粉丝的openId" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        name={'remark'}
        label="备注"
        rules={formValidationRules.remark}>
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
