import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  DatePicker,
  Select,
  Checkbox
} from 'antd';
import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

export interface SearchFormFields {
  // 代码
  code?: string;
  // 日期
  search_time?: number[];
  // 买入时间
  buy_time_range?: number[];
  // 卖出时间
  sell_time_range?: number[];
  // 持仓中、已卖出
  empty?: string;
  filtration?: boolean;
}

export interface SearchFormProps {
  isLoading: boolean;
  onSubmit: (formValues: SearchFormFields) => void;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

export const StockReturnsInquiryForm = forwardRef<
  SearchFormRefs,
  SearchFormProps
>((props: PropsWithChildren<SearchFormProps>, ref) => {
  const submitBtnRef: any = useRef();
  const [form] = Form.useForm<SearchFormFields>();
  const [filtrationCheckbox, setFiltrationCheckbox] = useState(false);
  const [initialValues, setInitialValues] = useState<SearchFormFields>({
    code: undefined,
    search_time: undefined,
    empty: undefined,
    filtration: false
  });

  useImperativeHandle(ref, () => ({
    submit() {
      form.submit();
    }
  }));

  const handleReset = () => {
    setInitialValues({
      code: undefined,
      search_time: undefined,
      empty: undefined,
      filtration: false
    });
    form.resetFields();
    setFiltrationCheckbox(false);
    requestAnimationFrame(() => form.resetFields());
    submitBtnRef.current.focus();
  };

  const filtrationOnChange = (e: { target: { checked: boolean } }) => {
    const checked = e.target.checked;
    form.setFieldsValue({
      filtration: checked
    });
    setFiltrationCheckbox(checked);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 8 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 }
    }
  };
  const formItemCheckboxLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 24 }
    },
    wrapperCol: {
      xs: { span: 0 },
      sm: { span: 0 }
    }
  };

  return (
    <Card>
      <Form
        name="search-form"
        form={form}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        initialValues={initialValues}
        onFinish={props.onSubmit}>
        <Row gutter={16}>
          <Col span={5}>
            <Form.Item {...formItemLayout} name="code" label="股票代码">
              <Input autoComplete="off" placeholder="请输入股票代码" />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item {...formItemLayout} name="empty" label="数据状态">
              <Select style={{ width: '100%' }} placeholder="请选择数据状态">
                <Select.Option value="0">持仓中</Select.Option>
                <Select.Option value="1">已卖出</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item name="search_time" label="买入日期">
              <DatePicker.RangePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item {...formItemCheckboxLayout} name="filtration">
              <Checkbox
                onChange={filtrationOnChange}
                checked={filtrationCheckbox}
                value="true">
                过滤小于2条客户的数据
              </Checkbox>
            </Form.Item>
          </Col>
          <Col span={3}>
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
});
