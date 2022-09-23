import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space
} from 'antd';
import { Rule } from 'antd/lib/form';
import { productOption } from 'constants/client.constant';
import { StocksAllot } from 'pages/personaltailor/transaction/distribute';
import moment from 'moment';
import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import { InputGroup } from './input-group';
import { InputNumberGroup } from './input-group-number';
import styles from './index.module.scss';

export interface CreateDataFormFields {
  // 标题
  title: string;
  ratio: string;
  // 账户创建时间
  accountCreated?: any[];
  // 产品名称
  productId: string | string[];
  // 仓位
  portfolioPosition: number[];
  // 总资产
  portfolioAssets: number[];
  // 理由
  comment: string;
  // 是否分配当天已买入股票的账户
  haveBuyStock: boolean;
  // 数据的状态
  status: string;
}

export interface CreateDataFormProps {
  onSubmit: (formValues: CreateDataFormFields) => void;
  productOptions: productOption[];
  initialValues: StocksAllot;
}

export interface CreateDataFormRefs {
  submit: () => void | Promise<void>;
}
const formValidationRules: Partial<
  Record<keyof CreateDataFormFields, Rule[]>
> = {
  title: [{ required: true, message: '标题不能为空' }],
  ratio: [{ required: true, message: '比例不能为空' }],
  productId: [{ required: true, message: '产品不能为空' }],
  portfolioPosition: [{ required: true, message: '仓位不能为空' }],
  comment: [{ required: true, message: '理由不能为空' }]
};

export const CreateDataForm = forwardRef<
  CreateDataFormRefs,
  CreateDataFormProps
>((props: PropsWithChildren<CreateDataFormProps>, ref) => {
  console.log('传过来的数据：', props.initialValues);
  const submitBtnRef: any = useRef();
  const [form] = Form.useForm<CreateDataFormFields>();
  const [priceDisabled, setPriceDisabled] = useState(false);
  const [groupInput, setGroupInput] = useState([]);
  const [groupInputNumber, setGroupInputNumber] = useState([]);

  const initial: CreateDataFormFields = {
    title: undefined,
    ratio: '1:10',
    accountCreated: [
      moment(new Date('2021/3/1').toLocaleDateString(), 'YYYY-MM-DD'),
      moment(new Date().toLocaleDateString(), 'YYYY-MM-DD')
    ],
    productId: props.productOptions
      .map(item => item.id)
      .filter(value => value !== '6051d5c5338354001cc32ce7'),
    portfolioPosition: [0, 0.5],
    portfolioAssets: [0, 3000],
    comment: undefined,
    haveBuyStock: false,
    status: '0'
  };

  useEffect(() => {
    if (typeof props.initialValues == 'object') {
      setPriceDisabled(props.initialValues.haveBuyStock);
    }
    setGroupInput(
      typeof props.initialValues == 'object'
        ? props.initialValues.portfolioPosition
        : [0, 0.5]
    );
    setGroupInputNumber(
      typeof props.initialValues == 'object'
        ? props.initialValues.portfolioAssets
        : [0, 3000]
    );
  }, [props.initialValues]);

  const initialValues =
    typeof props.initialValues == 'object'
      ? {
          ...props.initialValues,
          accountCreated: props.initialValues.accountCreated?.length
            ? [
                moment(
                  new Date(
                    props.initialValues.accountCreated[0]
                  ).toLocaleDateString(),
                  'YYYY-MM-DD'
                ),
                moment(
                  new Date(
                    props.initialValues.accountCreated[1]
                  ).toLocaleDateString(),
                  'YYYY-MM-DD'
                )
              ]
            : []
        }
      : initial;

  const handleReset = () => {
    form.resetFields();
    submitBtnRef.current.focus();
  };

  const positionInputGroup = (value: number[]) => {
    form.setFieldsValue({
      portfolioPosition: value
    });
  };

  const assetsInputGroup = (value: number[]) => {
    form.setFieldsValue({
      portfolioAssets: value
    });
  };

  const checkboxChange = (e: { target: { checked: any } }) => {
    const checked = e.target.checked;
    form.setFieldsValue({
      haveBuyStock: checked
    });
    setPriceDisabled(checked);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 9 },
      sm: { span: 9 }
    },
    wrapperCol: {
      xs: { span: 14 },
      sm: { span: 14 }
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
      <Form.Item name="status" hidden>
        <Input disabled />
      </Form.Item>
      <Row>
        <Col span={24}>
          <Form.Item
            name="title"
            label="股票池名称"
            rules={formValidationRules.title}>
            <Input autoComplete="off" placeholder="请输入股票池名称" />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={16}>
          <Form.Item
            {...formItemLayout}
            name="ratio"
            label="客户比例"
            rules={formValidationRules.ratio}>
            <Input autoComplete="off" placeholder="请输入比例" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item {...formItemCheckboxLayout} name="haveBuyStock">
            <Checkbox
              onChange={checkboxChange}
              checked={priceDisabled}
              value="true">
              当天已买入的账户
            </Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Form.Item name="accountCreated" label="创建账户时间">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Form.Item name="portfolioAssets" label="账户总资产">
            <InputNumberGroup
              inputNumberGroupOnChange={assetsInputGroup}
              initialValues={groupInputNumber}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Form.Item
            name="productId"
            label="分发对象"
            rules={formValidationRules.productId}>
            <Select
              allowClear
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择分发对象">
              {props.productOptions.map(option => (
                <Select.Option
                  value={option.id}
                  key={`follow-product-${option.id}`}>
                  {option.productName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Form.Item
            name="portfolioPosition"
            label="账户仓位"
            rules={formValidationRules.portfolioPosition}>
            <InputGroup
              inputGroupOnChange={positionInputGroup}
              restrictSize={[0, 100]}
              initialValues={groupInput}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ marginTop: 20 }}>
        <Col span={24}>
          <Form.Item
            name="comment"
            label="买入理由"
            rules={formValidationRules.comment}>
            <Input.TextArea placeholder="请输入理由" />
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
