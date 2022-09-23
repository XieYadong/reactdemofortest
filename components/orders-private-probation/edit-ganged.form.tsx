import { Button, Col, Form, Input, InputNumber, Row, Space } from 'antd';
import { Rule } from 'antd/lib/form';
import React, { forwardRef, PropsWithChildren, useRef } from 'react';
import styles from './search.orders.module.scss';

export interface EditGangedFormFields {
  _id: string;
  ratio: number;
  position: number;
}

export interface EditGangedFormProps {
  onSubmit: (formValues: EditGangedFormFields) => void;
  initialValues: EditGangedFormFields;
}

export interface EditGangedFormRefs {
  submit: () => void | Promise<void>;
}
const formValidationRules: Partial<
  Record<keyof EditGangedFormFields, Rule[]>
> = {
  _id: [],
  ratio: [{ required: true, message: '比例不能为空' }],
  position: [{ required: true, message: '仓位不能为空' }]
};

export const EditGangedForm = forwardRef<
  EditGangedFormRefs,
  EditGangedFormProps
>((props: PropsWithChildren<EditGangedFormProps>, ref) => {
  console.log('传过来的数据：', props.initialValues);
  const submitBtnRef: any = useRef();
  const [form] = Form.useForm<EditGangedFormFields>();

  const initial: EditGangedFormFields = {
    _id: undefined,
    ratio: 2,
    position: 10
  };

  const initialValues =
    typeof props.initialValues == 'object'
      ? {
          ...props.initialValues,
          ratio: props.initialValues.ratio || 2,
          position: props.initialValues.position || 10
        }
      : initial;

  const handleReset = () => {
    form.resetFields();
    submitBtnRef.current.focus();
  };

  return (
    <Form
      className={styles['searchForm']}
      name="CreateData-form"
      form={form}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={initialValues}
      onFinish={props.onSubmit}>
      <Form.Item name="_id" hidden>
        <Input disabled />
      </Form.Item>
      <Row>
        <Col span={24}>
          <Form.Item
            name="ratio"
            label="比例"
            rules={formValidationRules.ratio}>
            <InputNumber
              style={{ width: '80%' }}
              min={0}
              placeholder="请输入比例"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Form.Item
            name="position"
            label="仓位"
            rules={formValidationRules.position}>
            <InputNumber
              style={{ width: '80%' }}
              min={1}
              max={100}
              step={1}
              placeholder="请输入仓位"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }} justify="center">
        <Col span={7}>
          <Space>
            <Button type="primary" htmlType="submit" ref={submitBtnRef}>
              确定
            </Button>
            <Button htmlType="button" onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
});
