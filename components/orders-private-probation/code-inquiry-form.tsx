import { AutoComplete, Button, Card, Col, Form, Input, Row, Space } from 'antd';
import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import styles from './search.orders.module.scss';
import { Rule } from 'antd/lib/form';
import { RanksUpdate } from 'pages/orders-private-probation/code-inquiry';

export interface SearchFormProps {
  isLoading: boolean;
  onSubmit: (formValues: RanksUpdate) => void;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

const formValidationRules: Partial<Record<keyof RanksUpdate, Rule[]>> = {
  code: [
    {
      len: 6,
      pattern: /^[0-9]{6}$/,
      type: 'string',
      message: '请输入有效的股票代码',
      validateTrigger: 'onBlur'
    }
  ]
};

export const SearchCodeForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<RanksUpdate>();
    const [options, setOptions] = useState([]);
    const [initialValues, setInitialValues] = useState({
      code: undefined,
      portfolioType: 'Probation'
    });

    useImperativeHandle(ref, () => ({
      submit() {
        form.submit();
      }
    }));

    const handleReset = () => {
      setInitialValues({
        code: undefined,
        portfolioType: 'Probation'
      });
      form.resetFields();
      requestAnimationFrame(() => form.resetFields());
      submitBtnRef.current.focus();
    };

    const formNumItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
      }
    };
    return (
      <Card style={{ marginTop: '20px' }}>
        <Form
          className={styles['searchForm']}
          name="search-form"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={initialValues}
          onFinish={props.onSubmit}>
          <Form.Item name="portfolioType" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item
                {...formNumItemLayout}
                name="code"
                label="股票代码"
                rules={formValidationRules.code}>
                <AutoComplete
                  filterOption={false}
                  // onSearch={handleSearch}
                  // onSelect={handleSelect}
                  placeholder="请输入股票代码">
                  {options.map(option => (
                    <AutoComplete.Option
                      value={option.value}
                      key={'buy-' + option.value}>
                      {`${option.label} (${option.value})`}
                    </AutoComplete.Option>
                  ))}
                </AutoComplete>
              </Form.Item>
            </Col>
            <Col span={3} style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={props.isLoading}
                  ref={submitBtnRef}>
                  搜 索
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
