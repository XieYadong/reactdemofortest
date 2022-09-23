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
  name: string;
  desciption: string;

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
  desciption: [{ required: true, type: 'string', message: '用户名不能为空' }],
  name: [{ required: true, type: 'string', message: '用户名不能为空' }]
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
    name: '',
    desciption: '',

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
      scrollToFirstError>
      <Form.Item name="id" style={{ display: 'none' }}>
        <Input />
      </Form.Item>
      <Form.Item name="name" label="名称" rules={formValidationRules.name}>
        <Input autoComplete="off" placeholder="名称" />
      </Form.Item>

      <Form.Item name="sort" label="排序">
        <Input placeholder="请输入排序" />
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
