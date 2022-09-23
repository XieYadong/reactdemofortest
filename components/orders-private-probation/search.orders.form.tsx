import { Button, Card, Col, Form, Input, Row, Space, Select } from 'antd';
import React, {
  forwardRef,
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState
} from 'react';
import { InputGroup } from 'components/personaltailor/distribute/input-group';
import styles from './search.orders.module.scss';

export interface clientTypeOption {
  _id: string;
  clientType: string;
  remark: string;
}

export interface productOption {
  _id: string;
  productName: string;
  productType: string;
  transactionDate: string;
  description: string;
}

export interface SearchFormFields {
  // 客户姓名
  name_in?: string[];
  // 跟投产品
  productId?: string[];
  // 客户类型
  clientType?: number[];
  // 仓位
  position?: number[];
  // 关联账户仓位
  correlationPosition?: number[];
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
  productOptions: Partial<productOption>[];
  clientType: Partial<clientTypeOption>[];
  tabType: string;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

export const SearchOrdersForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();
    const [initialValues, setInitialValues] = useState({
      name_in: [],
      // productId: undefined,
      position: undefined,
      clientType: undefined,
      totalIncomeRate: undefined,
      // 是否显示隐藏数据
      display_position: 'Probation',
      portfolioType_In: ['Probation']
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
      requestAnimationFrame(() => form.resetFields());
      setInitialValues({
        name_in: [],
        // productId: undefined,
        position: undefined,
        clientType: undefined,
        totalIncomeRate: undefined,
        // 是否显示隐藏数据
        display_position: 'Probation',
        portfolioType_In: ['Probation']
      });
      submitBtnRef.current.focus();
    };

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
          <Form.Item name="display_position" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="portfolioType_In" hidden>
            <Input />
          </Form.Item>
          <Row gutter={8}>
            <Col span={4}>
              <Form.Item {...formItemLayout} name="name_in" label="客户名称">
                <Select mode="tags" placeholder="请输入客户名称"></Select>
              </Form.Item>
            </Col>
            {/* <Col span={4}>
              <Form.Item {...formItemLayout} name="productId" label="购买产品">
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="请选择购买产品">
                  {props.productOptions.map(option => (
                    <Select.Option
                      value={option._id}
                      key={`follow-product-${option._id}`}>
                      {option.productName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col> */}
            <Col span={4}>
              <Form.Item {...formItemLayout} name="clientType" label="客户类型">
                <Select
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="请选择客户类型">
                  {props.clientType.map(option => (
                    <Select.Option
                      value={option.clientType}
                      key={`clientType-${option._id}`}>
                      {option.clientType}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item {...formNumItemLayout} name="position" label="仓位">
                <InputGroup
                  inputGroupOnChange={positionInputGroup}
                  restrictSize={[0, 100]}
                />
              </Form.Item>
            </Col>
            <Col span={4}>
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
