import { Button, Card, Col, Form, Input, Row, Select, Space } from 'antd';
import { Rule } from 'antd/lib/form';
import {
  PrincipalOption,
  RiskLevelOption,
  TermOption,
  usePrincipalOptions,
  useRiskLevelOptions,
  useTermOptions
} from './portfolio-meta.lookup';
import { formatDecimal } from 'utils/helpers/number-format';
import { useRouter } from 'next/dist/client/router';
import React, {
  forwardRef,
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from 'react';

export interface SearchFormFields {
  // ID
  _id?: number;
  // 名称
  name_like?: string;
  // 说明
  description_like?: string;
  term: string;
  risk: string;
  principal: string;
  // 是否显示被删除的数据
  show_deleted: string;
  // 交易账户类型
  portfolioType_In: string[];
}

export interface SearchFormProps {
  isLoading: boolean;
  // isAdmin: boolean;
  onSubmit: (formValues: SearchFormFields) => Promise<void>;
  onReset: () => void;
  termOptions: Partial<TermOption>[];
  riskLevelOptions: Partial<RiskLevelOption>[];
  principalOptions: Partial<PrincipalOption>[];
  extraButtons?: JSX.Element;
}

export interface SearchFormRefs {
  submit: () => void | Promise<void>;
}

const formValidationRules: Partial<Record<keyof SearchFormFields, Rule[]>> = {
  _id: [],
  name_like: []
};

export const SearchPortfolioForm = forwardRef<SearchFormRefs, SearchFormProps>(
  (props: PropsWithChildren<SearchFormProps>, ref) => {
    const { query } = useRouter();
    const submitBtnRef: any = useRef();
    const [form] = Form.useForm<SearchFormFields>();
    const [initialValues, setInitialValues] = useState({
      // _id: query._id,
      name_like: query.name_like,
      description_like: query.description_like,
      term: query.term ?? '',
      risk: query.risk ?? '',
      address: query.address_like ?? '',
      principal: query.principal ?? '',
      // 显示隐藏数据
      show_deleted: query.show_deleted ?? '',
      portfolioType_In: ['Following', 'Intelligent']
    });

    useImperativeHandle(ref, () => ({
      submit() {
        form.submit();
      }
    }));

    useEffect(() => {
      console.log(props.termOptions);
    }, [props.termOptions]);

    const handleReset = () => {
      setInitialValues({
        // _id: undefined,
        name_like: undefined,
        description_like: undefined,
        term: '',
        risk: '',
        address: '',
        principal: '',
        // 是否显示隐藏数据
        show_deleted: '',
        portfolioType_In: ['Following', 'Intelligent']
      });
      props.onReset();
      requestAnimationFrame(() => form.resetFields());
      submitBtnRef.current.focus();
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
          <Form.Item name="portfolioType_In" hidden>
            <Input />
          </Form.Item>
          <Row gutter={8}>
            {/* <Col span={6}>
              <Form.Item name="_id" label="Id" rules={formValidationRules._id}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col> */}
            <Col span={6}>
              <Form.Item name="name_like" label="名称">
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="description_like" label="说明">
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="address_like" label="所属分公司">
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="term" label="周期">
                <Select disabled={props.termOptions.length <= 1}>
                  <Select.Option value={''}>全部</Select.Option>
                  {props.termOptions.map(option => (
                    <Select.Option
                      value={option._id}
                      key={`term-${option._id}`}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="risk" label="风险等级">
                <Select disabled={props.termOptions.length <= 1}>
                  <Select.Option value={''}>全部</Select.Option>
                  {props.riskLevelOptions.map(option => (
                    <Select.Option
                      value={option._id}
                      key={`risk-level-${option._id}`}>
                      {option.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="principal" label="起始资金">
                <Select disabled={props.termOptions.length <= 1}>
                  <Select.Option value={''}>全部</Select.Option>
                  {props.principalOptions.map(option => (
                    <Select.Option
                      value={option._id}
                      key={`principal-${option._id}`}>
                      {formatDecimal(option.amount)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* {props.isAdmin && ( */}
            <Col span={6}>
              <Form.Item name="show_deleted" label="显示">
                <Select>
                  <Select.Option value="1">包含被删除的数据</Select.Option>
                  <Select.Option value="">默认</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {/* )} */}
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
                {props.extraButtons}
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
);
