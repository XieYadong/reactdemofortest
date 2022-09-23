import { Button, Card, Col, Form, Input, Row, Space } from 'antd';
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
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

export const SearchForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const { query } = useRouter();

    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();
    const [initialValues, setInitialValues] = useState({
      _id: query._id,
      name_like: query.name_like,
      description_like: query.description_like
    });

    useImperativeHandle(ref, () => ({
      submit() {
        form.submit();
      }
    }));

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
              <Form.Item name="keyword" label="输入搜索">
                <Input />
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
