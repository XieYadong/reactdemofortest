import { Button, Checkbox, Form, Input, message, Select, Space } from 'antd';
import { Rule } from 'antd/lib/form';
import {
  usePrincipalOptions,
  useRiskLevelOptions,
  useTermOptions,
  useRulesetOptions
} from './portfolio-meta.lookup';
import {
  PortfolioTypeOptions,
  PortfolioTypes
} from 'constants/portfolio.constant';
import { request } from 'utils/helpers/http';
import { formatDecimal } from 'utils/helpers/number-format';
import { getAuldAPIEndpoint } from 'lib/options/api.options';
import { GenericCallback } from 'lib/typings/common.interface';
import { Portfolio } from 'lib/typings/portfolio.interface';
import React, {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useRef,
  useState
} from 'react';
import { UserOption, WechatOption } from './portfolio-meta.lookup';
import { user } from 'utils/helpers';
interface InsertFormProps {
  onFinish(
    formValues: InsertFormFields
  ): Promise<void | boolean | GenericCallback>;
  recode: any;
  // userOptions: Partial<UserOption>[];
  wechatOptions: Partial<WechatOption>[];
}

interface InsertFormFields {
  meta: Portfolio['meta'];
}
const formValidationRules: Partial<
  Record<keyof InsertFormFields['meta'], Rule[]>
> = {
  name: [{ required: true, type: 'string', message: '请输入账户名称' }],
  term: [{ required: true, type: 'string', message: '请选择持仓时间' }],
  riskLevel: [{ required: true, type: 'string', message: '请选择风险等级' }],
  wid: [{ required: true, type: 'number', message: '请选择所属公众号' }],
  initialPrincipal: [
    { required: true, type: 'string', message: '请选择初始本金' }
  ]
};

export const CreatePortfolioForm: FunctionComponent<InsertFormProps> = (
  props: PropsWithChildren<InsertFormProps>
) => {
  const [form] = Form.useForm<InsertFormFields>();
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wids, setWids] = useState([
    { value: 19, label: '牛策略' },
    { value: 20, label: '中方信富' }
  ]);
  const [termOptions, setTermOptions] = useTermOptions();
  const [riskLevelOptions, setRiskLevelOptions] = useRiskLevelOptions();
  const [principalOptions, setPrincipalOptions] = usePrincipalOptions();
  const [rulesetOptions, setRulesetOptions] = useRulesetOptions();
  const [token, setToken] = useState('');

  const inputRef: any = useRef();

  useEffect(() => {
    // 自动加载选项数据
    loadLookupTables();
    const token = user.verifyToken();
    setToken(token);
    // form.submit();
    // 自动获得焦点，进入页面加载完毕可以直接按回车搜索
    inputRef.current.focus();
  }, []);

  const ruleSetValues = {
    [principalOptions[0]?._id]: [
      'j7UYuDSRvt9WbVwpAMDDbT',
      'MMfWGKu9x3Xgt8YiLLZDGU'
    ],
    [principalOptions[1]?._id]: [
      'ivmdV8pNqud3BsWXmSmJzn',
      'xWXf4mMrJVphCc3FXV5sgR'
    ],
    [principalOptions[2]?._id]: [
      'PvbwGMe7sugePC5GofXrB8',
      'dj2EcArevyn8ZaF4uNbbjZ'
    ]
  };

  const initialValues: InsertFormFields = {
    meta: {
      name: '',
      description: '',
      term: '',
      riskLevel: '',
      initialPrincipal: '',
      tags: [],
      ruleSet: [],
      owner: [],
      address: '',
      wid: undefined,
      portfolioType: PortfolioTypes.Following,
      shouldNotifyAfterBuy: false,
      shouldNotifyAfterSell: false,
      shouldNotifyStatistics: false
    }
  };
  const initialValue =
    Object.keys(props.recode).length > 0 ? props.recode : initialValues;
  const handleReset = () => {
    form.resetFields();
  };

  const loadLookupTables = async () => {
    setIsFetching(true);
    try {
      const { principal, term, riskLevel, ruleset } = await request(
        getAuldAPIEndpoint('/lookup/portfolio-meta'),
        {
          token
        }
      );

      setPrincipalOptions(principal);
      setTermOptions(term);
      setRiskLevelOptions(riskLevel);
      setRulesetOptions(ruleset);
      Object.keys(props.recode).length > 0 == false &&
        form.setFieldsValue({
          meta: {
            term: term[0]?._id,
            riskLevel: riskLevel[0]?._id,
            initialPrincipal: principal[0]?._id
            // ruleSet: ['j7UYuDSRvt9WbVwpAMDDbT', 'MMfWGKu9x3Xgt8YiLLZDGU']
          }
        });
    } catch (err) {
      message.error(err.message);
    }
    setIsFetching(false);
  };

  const ruleSetOnChange = async value => {
    console.log(`selected ${value}`, ruleSetValues[value]);
    form.setFieldsValue({
      meta: {
        ruleSet: ruleSetValues[value]
      }
    });
  };

  const handleFinish = async (formValues: InsertFormFields) => {
    setIsSubmitting(true);

    const ret = await props.onFinish({ ...props.recode, ...formValues });
    setIsSubmitting(false);

    requestAnimationFrame(() => {
      switch (typeof ret) {
        case 'boolean':
          // 请求异常，继续保持表单状态
          if (!ret) {
            return;
          }
          break;
        case 'function':
          ret();
        default:
          form.resetFields();
      }
    });
  };

  return (
    <Form
      name="update-form"
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      style={{ maxWidth: 640 }}
      initialValues={initialValue}
      onFinish={handleFinish}>
      <Form.Item name={['meta', 'ruleSet']} hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name={['meta', 'name']}
        label="名称"
        rules={formValidationRules.name}>
        <Input autoComplete="off" placeholder="账户名称" ref={inputRef} />
      </Form.Item>
      <Form.Item
        name={['meta', 'description']}
        label="说明"
        rules={formValidationRules.description}>
        <Input autoComplete="off" placeholder="账户说明" />
      </Form.Item>

      <Form.Item
        name={['meta', 'address']}
        label="所属分公司"
        rules={formValidationRules.description}>
        <Input autoComplete="off" placeholder="账户所属地址" />
      </Form.Item>
      <Form.Item
        name={['meta', 'portfolioType']}
        label="账户类型"
        rules={formValidationRules.portfolioType}>
        <Select options={PortfolioTypeOptions}></Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'wid']}
        label="所属公众号"
        rules={formValidationRules.wid}>
        {/* <Select options={wids}></Select> */}

        <Select disabled={isFetching}>
          {props.wechatOptions.map(option => (
            <Select.Option value={option.id} key={`principal-${option.id}`}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'term']}
        label="周期"
        rules={formValidationRules.term}>
        <Select disabled={isFetching}>
          {termOptions.map(option => (
            <Select.Option value={option._id} key={`term-${option._id}`}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'riskLevel']}
        label="风险等级"
        rules={formValidationRules.riskLevel}>
        <Select disabled={isFetching}>
          {riskLevelOptions.map(option => (
            <Select.Option value={option._id} key={`risk-level-${option._id}`}>
              {option.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'initialPrincipal']}
        label="起始资金"
        rules={formValidationRules.initialPrincipal}>
        <Select disabled={isFetching}>
          {principalOptions.map(option => (
            <Select.Option value={option._id} key={`principal-${option._id}`}>
              {formatDecimal(option.amount)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'tags']}
        label="标签"
        rules={formValidationRules.tags}>
        <Select
          mode="tags"
          placeholder="请输入产品标签"
          disabled={isFetching}></Select>
      </Form.Item>
      <Form.Item name={['meta', 'owner']} label="所属分析师">
        <Select mode="multiple" placeholder="所属分析师" disabled={isFetching}>
          {/* {props.userOptions
            .filter(item => item.role.includes('admin') === false)
            .map((item, index) => (
              <Select.Option value={item.id} key={index}>
                {item.nickname}
              </Select.Option>
            ))} */}
        </Select>
      </Form.Item>
      <Form.Item name={['meta', 'ruleSet']} label="风控规则">
        <Select mode="multiple" placeholder="风控规则" disabled={isFetching}>
          {rulesetOptions.map((item, index) => (
            <Select.Option value={item._id} key={index}>
              {item.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'riskeys']}
        id="riskeys"
        label="备用风控"
        className="riskeys"
        style={{ display: 'none' }}>
        <Select mode="multiple" placeholder="备用风控" disabled={isFetching}>
          {/* {props.userOptions
            .filter((item, index) => item.attributes.openid)
            .map((item, index) => (
              <Select.Option value={item.attributes.openid} key={index}>
                {item.nickname}
              </Select.Option>
            ))} */}
        </Select>
      </Form.Item>
      <Form.Item
        name={['meta', 'shouldNotifyAfterBuy']}
        wrapperCol={{ span: 20, offset: 4 }}
        valuePropName="checked"
        rules={formValidationRules.shouldNotifyAfterBuy}>
        <Checkbox>买入股票时发送模板消息提示客户</Checkbox>
      </Form.Item>
      <Form.Item
        name={['meta', 'shouldNotifyAfterSell']}
        wrapperCol={{ span: 20, offset: 4 }}
        valuePropName="checked"
        rules={formValidationRules.tags}>
        <Checkbox>卖出股票时发送模板消息提示客户</Checkbox>
      </Form.Item>
      <Form.Item
        name={['meta', 'shouldNotifyStatistics']}
        wrapperCol={{ span: 20, offset: 4 }}
        valuePropName="checked"
        rules={formValidationRules.tags}>
        <Checkbox>发送每日统计</Checkbox>
      </Form.Item>
      <Form.Item>
        <Space size="middle">
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isSubmitting}
            disabled={isSubmitting || isFetching}>
            保存
          </Button>
          <Button htmlType="button" size="large" onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};
