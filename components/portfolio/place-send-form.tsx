import { Button, Col, Form, AutoComplete, Row, Space, message } from 'antd';
import { useRouter } from 'next/dist/client/router';
import React, { PropsWithChildren, useState } from 'react';
import styles from './index.module.scss';
export interface SearchFormFields {
  price: number;
  // 说明
}
export interface initValueFields {
  price: number;
  // 金额大于
  code: number | string;
  name: string;
  type: string;
}
export interface quotes {
  name: number | string;
}
export interface SearchFormProps {
  onFinish: (formValues: SearchFormFields) => Promise<void>;
  initValues: initValueFields;
  colse: () => void;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

export const PlaceSendForm = (props: PropsWithChildren<SearchFormProps>) => {
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);

  const [form] = Form.useForm<SearchFormFields>();

  const type = props.initValues.type == 'buy' ? '买入' : '卖出';
  const options = [
    { label: props.initValues.price, value: props.initValues.price + '' },
    { label: `集合竞价`, value: `集合竞价` }
    // { label: `现价${type}`, value: `现价${type}` }
  ];

  const handleSubmit = async (values: initValueFields) => {
    setLoading(true);
    try {
      await props.onFinish(values);
      message.success('交易成功！');
      props.colse();
    } catch (err) {
      setLoading(false);
      message.error('交易失败！');
    }
  };

  const value = { price: props.initValues.price + '' };
  return (
    <div>
      <Form
        name="search-form"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={value}
        onFinish={handleSubmit}>
        <p className={styles.confirm}>
          请仔细核对价格，一旦确认发送交易指令给客户，无法撤销
        </p>
        <Row>
          <Col span={12}>
            <Form.Item label="代码名称">
              <span className={styles.textLable}>
                {props.initValues.name}({props.initValues.code})
              </span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              label={`${type}价格`}
              className={styles.inputBox}>
              <AutoComplete filterOption={false} placeholder={`选择价格`}>
                {options.map(option => (
                  <AutoComplete.Option value={option.value} key={option.value}>
                    <span className={styles.textLable}>{option.label}</span>
                  </AutoComplete.Option>
                ))}
              </AutoComplete>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={30}>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Space>
              <Button
                htmlType="button"
                onClick={() => {
                  props.colse();
                }}>
                取消
              </Button>
              <Button type="primary" disabled={loading} htmlType="submit">
                发送
              </Button>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
