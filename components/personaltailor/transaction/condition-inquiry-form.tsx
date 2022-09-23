import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd';
import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { InputGroup } from './input-group';
import styles from './condition-inquiry-form.module.scss';
import {
  getPortfolioTypeLabelByValue,
  PortfolioTypes
} from 'constants/portfolio.constant';

export interface SearchFormFields {
  // 仓位
  position?: number[];
  // 盈亏比例
  totalIncomeRate?: number[];
  // 是否显示仓位、总市值和盈亏比例
  display_position: string;
  // 交易账户类型
  portfolioType_In: string[];
}

export interface SearchFormProps {
  isLoading: boolean;
  onSubmit: (formValues: SearchFormFields) => void;
  onReset: () => void;
  queryType: string[];
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

export const SearchConditionForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();
    const [initialValues, setInitialValues] = useState({
      position: undefined,
      totalIncomeRate: undefined,
      // 是否显示隐藏数据
      displayPosition: 'Premium',
      metaPortfolioTypeIn: props.queryType
    });

    useImperativeHandle(ref, () => ({
      getForm: () => form,
      submit() {
        form.submit();
      }
    }));

    const positionInputGroup = (value: number[]) => {
      form.setFieldsValue({
        position: value
      });
    };

    const totalIncomeRateInputGroup = (value: number[]) => {
      form.setFieldsValue({
        totalIncomeRate: value
      });
    };

    const handleReset = () => {
      setInitialValues({
        position: undefined,
        totalIncomeRate: undefined,
        // 是否显示隐藏数据
        displayPosition: 'Premium',
        metaPortfolioTypeIn: props.queryType
      });
      props.onReset();
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
          <Form.Item name="displayPosition" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="portfolioType_In" hidden>
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={5}>
              <Form.Item
                {...formNumItemLayout}
                name="metaPortfolioTypeIn"
                label="账户类型">
                <Select style={{ width: '100%' }} placeholder="请选择账户类型">
                  {props.queryType.map(option => {
                    if (option) {
                      return (
                        <Select.Option
                          value={option}
                          key={`portfolioType-${option}`}>
                          {getPortfolioTypeLabelByValue(PortfolioTypes[option])}
                        </Select.Option>
                      );
                    }
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...formNumItemLayout}
                name="position"
                label="股票仓位">
                <InputGroup
                  inputGroupOnChange={positionInputGroup}
                  restrictSize={[0, 100]}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item
                {...formNumItemLayout}
                name="totalIncomeRate"
                label="盈亏比例">
                <InputGroup inputGroupOnChange={totalIncomeRateInputGroup} />
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
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
);
