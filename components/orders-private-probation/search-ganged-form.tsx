import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { Rule } from 'antd/lib/form';
import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import styles from './search.orders.module.scss';

export interface SearchFormFields {
  // 跟投名称
  followPortfolioName_like?: string;
}

export interface SearchFormProps {
  isLoading: boolean;
  onSubmit: (formValues: SearchFormFields) => void;
  onReset: () => void;
  extraButtons?: JSX.Element;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

const formValidationRules: Partial<Record<keyof SearchFormFields, Rule[]>> = {
  followPortfolioName_like: []
};

export const SearchGangedForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();
    const [initialValues, setInitialValues] = useState({
      followPortfolioName_like: undefined
    });
    // useEffect(() => {
    //   // TODO: 请求后台tag数据
    //   // setChildren()
    // }, [children]);
    useImperativeHandle(ref, () => ({
      submit() {
        form.submit();
      }
    }));

    const handleReset = () => {
      form.resetFields();
      props.onReset();
      requestAnimationFrame(() => form.resetFields());
      setInitialValues({
        followPortfolioName_like: undefined
      });
      submitBtnRef.current.focus();
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
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item
                {...formItemLayout}
                name="followPortfolioName_like"
                label="跟投名称"
                rules={formValidationRules.followPortfolioName_like}>
                <Input autoComplete="off" placeholder="请输入跟投名称" />
              </Form.Item>
            </Col>
            <Col span={3}>
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
                {props.extraButtons}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
);
