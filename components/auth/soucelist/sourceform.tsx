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
  resource: Array<any>;
}
interface attributes {
  address: string;
  openid: string;
}
export interface FormFields {
  id: string;
  name: string;
  url: string;
  description: string;
  categoryId: number;
}

const formValidationRules: Partial<Record<keyof FormFields, Rule[]>> = {
  name: [{ required: true, type: 'string', message: '用户名不能为空' }],
  url: [{ required: true, type: 'string', message: '密码不能为空' }],
  description: [{ required: true, type: 'string', message: '密码不能为空' }]
};

export const AccountManagementForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<FormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 自动加载选项数据
    // loadLookupTables();
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
  }, []);

  const initial: FormFields = {
    id: undefined,
    name: '',
    url: '',
    description: '',
    categoryId: 1
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

  const queryType = [];

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
      <Form.Item
        name="name"
        label="资源名"
        rules={formValidationRules.name}
        hasFeedback>
        <Input autoComplete="off" placeholder="请输入资源名" />
      </Form.Item>

      <Form.Item
        name="url"
        label="资源路径"
        rules={formValidationRules.url}
        hasFeedback>
        <Input autoComplete="off" placeholder="请输入资源路径" />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="资源分类"
        rules={formValidationRules.categoryId}
        hasFeedback>
        <Select style={{ width: '100%' }} placeholder="请选择账户类型">
          {props.resource.map(option => {
            if (option) {
              return (
                <Select.Option
                  value={option.id}
                  key={`portfolioType-${option.id}`}>
                  {option.name}
                </Select.Option>
              );
            }
          })}
        </Select>
      </Form.Item>
      <Form.Item name="description" label="描述" hasFeedback>
        <Input.TextArea placeholder="请输入描述" />
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
