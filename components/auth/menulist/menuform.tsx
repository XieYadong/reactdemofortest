import { Button, Form, Input, Select, Space, Radio, Col, Row } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Icon from 'components/common/Iconfont/';

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
  parentOptions: Array<any>;
}
interface attributes {
  address: string;
  openid: string;
}
export interface FormFields {
  id: string;
  name: string;
  title: string;
  parentId: any;
  sort: number | string;

  hidden: number;
  icon: string;
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
  name: [{ required: true, type: 'string', message: '前端名不能为空' }],
  title: [{ required: true, type: 'string', message: '菜单名不能为空' }]
};

export const AccountManagementForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<FormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formIcon, setFormIcon] = useState('');
  useEffect(() => {
    // 自动加载选项数据
    // loadLookupTables();
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
  }, []);

  const initial: FormFields = {
    id: undefined,
    name: '',
    title: '',
    parentId: undefined,
    sort: null,

    hidden: 1,
    icon: ''
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
  const formChange = (values: Partial<FormFields>) => {
    if ('icon' in values) {
      setFormIcon(values.icon);
    }
  };

  return (
    <Form
      name="update-form"
      layout="vertical"
      form={form}
      style={{ maxWidth: 640 }}
      initialValues={initialValues}
      onValuesChange={formChange}
      onFinish={handleFinish}
      scrollToFirstError>
      <Form.Item name="id" style={{ display: 'none' }}>
        <Input />
      </Form.Item>
      <Form.Item
        name="title"
        label="菜单名称"
        rules={formValidationRules.name}
        hasFeedback>
        <Input autoComplete="off" placeholder="菜单名" />
      </Form.Item>

      <Form.Item name="parentId" label="上级菜单">
        <Select>
          <Select.Option value={0}>无上级菜单</Select.Option>
          {props.parentOptions.map(option => (
            <Select.Option value={option.id} key={`term-${option.id}`}>
              {option.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="name" label="前端名称" hasFeedback>
        <Input autoComplete="off" placeholder="菜单名" />
      </Form.Item>
      <Row gutter={8} align="middle">
        <Col span={16}>
          <Form.Item name="icon" label="图标">
            <Input placeholder="请输入图标名" />
          </Form.Item>
        </Col>
        <Col span={8} style={{ lineHeight: '100%' }}>
          <Icon type={formIcon || initialValues.icon} />
        </Col>
      </Row>
      <Form.Item label="是否显示" name="hidden">
        <Radio.Group>
          <Radio value={1}>是</Radio>
          <Radio value={0}>否</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="sort" label="排序" hasFeedback>
        <Input placeholder="请输入" />
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
