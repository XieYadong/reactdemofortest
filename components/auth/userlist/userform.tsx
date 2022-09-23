import { Button, Form, Input, Select, Space, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Rule } from 'antd/lib/form';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';

import { omit } from 'lodash';
interface InsertFormProps {
  onFinish(formValues: FormFields);
  initialValues: any;
}
interface attributes {
  address: string;
  openid: string;
}
export interface FormFields {
  id: string;
  nickName: string;
  password: string;
  username: string;
  gender?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: string[];
  attributes?: attributes;
  status: number;
}
const editRule = [
  ({ getFieldValue }) => ({
    validator(_, value) {
      if (!value || getFieldValue('password') === value) {
        return Promise.resolve();
      }
      return Promise.reject('两次密码不一致!');
    }
  })
];
const formValidationRules: Partial<Record<keyof FormFields, Rule[]>> = {
  nickName: [{ required: true, type: 'string', message: '用户名不能为空' }],
  password: [{ required: true, type: 'string', message: '密码不能为空' }],

  email: [{ type: 'email', message: '请输入正确的邮箱' }],
  phone: [
    {
      pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
      message: '手机号必须以13,14,15,16,17,18,19开头，并且是11位数字'
    }
  ],
  role: [{ required: true, type: 'array', message: '角色权限不能为空' }]
};

export const AccountManagementForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<FormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNeedWechat, setIsNeedWechat] = useState(
    props.initialValues?.role?.includes('fansManeger')
  );
  useEffect(() => {
    // 自动加载选项数据
    // loadLookupTables();
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
  }, []);

  const initial: FormFields = {
    id: undefined,
    nickName: '',
    password: '',
    username: '',
    gender: undefined,
    email: undefined,
    avatar: undefined,
    phone: undefined,
    role: undefined,
    status: 1
  };
  const initialValues =
    props.initialValues !== 'add' && props.initialValues !== false
      ? {
          ...props.initialValues
        }
      : initial;
  const handleReset = () => {
    form.resetFields();
  };

  // const formChange = (values: Partial<FormFields>) => {
  //   if ('role' in values) {
  //     if (values.role.includes('fansManeger')) {
  //       setIsNeedWechat(true);
  //     } else if (values.role.includes('fansManeger') === false) {
  //       setIsNeedWechat(false);
  //     }
  //   }
  // };
  const handleFinish = async (formValues: FormFields) => {
    const values = {
      ...formValues
    };
    setIsSubmitting(true);
    const callback = await props.onFinish(omit(values, ['prefix']));
    setIsSubmitting(false);
  };

  return (
    <Form
      name="update-form"
      layout="vertical"
      form={form}
      style={{ maxWidth: 640 }}
      initialValues={initialValues}
      onFinish={handleFinish}
      // onValuesChange={formChange}
      scrollToFirstError>
      <Form.Item name="id" style={{ display: 'none' }}>
        <Input />
      </Form.Item>
      <Form.Item
        name="username"
        label="用户名"
        rules={formValidationRules.nickName}
        hasFeedback>
        <Input autoComplete="off" placeholder="请输入用户名" />
      </Form.Item>
      <Form.Item
        name="nickName"
        label="昵称"
        rules={formValidationRules.nickName}
        hasFeedback>
        <Input autoComplete="off" placeholder="请输入昵称" />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={
          props.initialValues == 'add' ? formValidationRules.password : null
        }
        hasFeedback>
        <Input.Password autoComplete="off" placeholder="请输入密码" />
      </Form.Item>

      <Form.Item name="gender" label="性别" rules={formValidationRules.gender}>
        <Select placeholder="请选择性别">
          <Select.Option value="保密">保密</Select.Option>
          <Select.Option value="男">男</Select.Option>
          <Select.Option value="女">女</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label="邮箱"
        rules={formValidationRules.email}
        hasFeedback>
        <Input autoComplete="off" placeholder="请输入邮箱" />
      </Form.Item>
      <Form.Item
        name="phone"
        label="电话"
        rules={formValidationRules.phone}
        hasFeedback>
        <Input autoComplete="off" placeholder="请输入电话" />
      </Form.Item>
      <Form.Item name="note" label="备注" hasFeedback>
        <Input.TextArea placeholder="请输入备注" />
      </Form.Item>

      <Form.Item label="是否启用" name="status">
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
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
