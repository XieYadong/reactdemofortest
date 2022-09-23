import { Button, Card, Col, Form, Input, Row, Space, Select } from 'antd';
import { Rule } from 'antd/lib/form';
import { useRouter } from 'next/dist/client/router';
import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

export interface SearchFormFields {
  // 名称
  keyword?: string;
}

export interface SearchFormProps {
  isLoading?: boolean;
  onSubmit: (formValues: SearchFormFields) => Promise<void>;
  resource: Array<any>;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

export const SearchForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const { query } = useRouter();

    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();

    const handleReset = () => {
      form.resetFields();
    };

    return (
      <Card>
        <Form
          name="search-form"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          onFinish={props.onSubmit}>
          <Row gutter={8}>
            <Col span={6}>
              <Form.Item name="nameKeyword" label="商品名称">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="urlKeyword" label="资源路径">
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="categoryId" label="资源分类">
                <Select style={{ width: '100%' }} placeholder="请选择资源分类">
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
            </Col>
            <Col span={24} style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={props.isLoading}
                  ref={submitBtnRef}>
                  查询
                </Button>
                <Button htmlType="button" onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
);
