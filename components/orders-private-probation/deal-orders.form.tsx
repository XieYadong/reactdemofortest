import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Space,
  Tabs,
  AutoComplete,
  InputNumber,
  Tooltip,
  Select,
  Checkbox
} from 'antd';
import { Rule } from 'antd/lib/form';
import { request } from 'utils/helpers/http';
import { Quote } from 'lib/hooks/use-quotes';
import { getAuldAPIEndpoint } from 'lib/options/api.options';
import { GenericCallback } from 'lib/typings/common.interface';
import { Portfolio, StockHolding } from 'lib/typings/portfolio.interface';
import { debounce } from 'lodash';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import styles from './search.orders.module.scss';

export interface DealFormFields {
  dataId?: string[];
  dataName?: string[];
  clientId?: string[];
  clientType?: string[];
  // 证券代码
  code?: string;
  // 名称
  stockName?: string;
  // 行业
  belong?: string;
  // 价格
  price?: number | string;
  // 数量
  quantity?: number;
  // 仓位
  percentage?: string;
  // 理由
  comment?: string;
  // 交易类型
  type: 'buy' | 'sell';
}

export interface stockInfo {
  value: string;
  label: string;
  industry: string;
}

export interface DealFormProps {
  isLoading: boolean;
  onSubmit(values: DealFormFields): Promise<void | GenericCallback>;
  stockCodeCallback: (code: string, industry?: string) => void;
  selectedData: Partial<Portfolio>[];
  quote: Quote;
  tabType: (type: string) => void;
}

export interface DealFormRefs {
  submit: () => void | Promise<void>;
}

export const DealOrdersForm = forwardRef<DealFormRefs, DealFormProps>(
  (props: PropsWithChildren<DealFormProps>, ref) => {
    const [priceDisabled, setPriceDisabled] = useState(false);
    const [active, setActive] = useState('buy');
    const [options, setOptions] = useState([]);
    const [buyForm] = Form.useForm<DealFormFields>();
    const [sellForm] = Form.useForm<DealFormFields>();
    console.log('选中的人：', props.selectedData);

    const initialValuesBuy: DealFormFields = {
      dataId: undefined,
      dataName: undefined,
      clientId: undefined,
      clientType: undefined,
      code: undefined,
      stockName: undefined,
      belong: undefined,
      price: undefined,
      type: 'buy',
      quantity: undefined,
      percentage: undefined,
      comment: undefined
    };

    const initialValuesSell: DealFormFields = {
      dataId: undefined,
      dataName: undefined,
      clientId: undefined,
      clientType: undefined,
      code: undefined,
      stockName: undefined,
      price: undefined,
      type: 'sell',
      quantity: undefined,
      percentage: '100%',
      comment: undefined
    };

    const formValidationRules: Partial<Record<keyof DealFormFields, Rule[]>> = {
      code: [
        { required: true, message: '股票代码不能为空' },
        {
          len: 6,
          pattern: /^[0-9]{6}$/,
          type: 'string',
          message: '请输入有效的股票代码',
          validateTrigger: 'onBlur'
        }
      ],
      price: [
        { required: true, message: '股票价格不能为空' },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (typeof value == 'string') {
              return Promise.resolve();
            }
            const code = getFieldValue('code');
            console.log(
              `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 90 ~ validator ~ code`,
              code
            );
            console.log(props.quote);
            const limitUp =
              code.slice(0, 3) == '300' || code.slice(0, 3) == '688'
                ? (props.quote?.close * 1.2 + 0.001).toFixed(2)
                : (props.quote?.close * 1.1 + 0.001).toFixed(2);
            console.log(
              `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 134 ~ validator ~ limitUp`,
              limitUp
            );
            const limitDown =
              code.slice(0, 3) == '300' || code.slice(0, 3) == '688'
                ? (props.quote?.close * 0.8).toFixed(2)
                : (props.quote?.close * 0.9).toFixed(2);
            console.log(
              `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 139 ~ validator ~ limitDown`,
              limitDown
            );
            console.log(!value, value >= limitDown && value <= limitUp);
            if (!value || (value >= limitDown && value <= limitUp)) {
              return Promise.resolve();
            }
            return Promise.reject(
              new Error(`当前价格应在${limitDown}-${limitUp}之间！`)
            );
          }
        })
      ],
      quantity: [{ required: true, message: '股票数量不能为空' }],
      percentage: [{ required: true, message: '仓位不能为空' }],
      comment: [{ required: true, message: '理由不能为空' }]
    };

    useEffect(() => {
      changSelectData();
    }, [props.selectedData]);

    useEffect(() => {
      stockNameChange(options);
    }, [options]);

    useEffect(() => {
      if (active === 'buy') {
        buyForm.setFieldsValue({
          price: priceDisabled ? '现价买入' : props.quote?.now
        });
      } else {
        sellForm.setFieldsValue({
          price: priceDisabled ? '现价卖出' : props.quote?.now
        });
      }
    }, [props.quote?.name]);

    const changSelectData = () => {
      const idArray = props.selectedData.map(item => item._id);
      const nameArray = props.selectedData.map(item => item.meta.name);
      const customerIdArray = props.selectedData.map(
        item => item.meta.product.customerId
      );
      const clientType = props.selectedData.map(item => item.meta.clientType);
      buyForm.setFieldsValue({
        dataId: idArray,
        dataName: nameArray,
        clientId: customerIdArray,
        clientType: clientType
      });
      sellForm.setFieldsValue({
        dataId: idArray,
        dataName: nameArray,
        clientId: customerIdArray,
        clientType: clientType
      });
    };

    const handleSearch = useCallback(
      debounce(
        async (keyword: string) => {
          try {
            if (keyword) {
              const options = await request(
                `${getAuldAPIEndpoint('/lookup/stock')}/${keyword}`,
                {
                  method: 'GET'
                }
              );
              if (keyword.length == 6) {
                props.stockCodeCallback(keyword);
              }
              setOptions(options);
            }
          } catch (err) {
            console.error(
              `🚀 ${new Date().toLocaleString()} ~ file: deal-orders.form.tsx ~ line 194 ~ err`,
              err
            );
          }
        },
        800,
        { leading: true }
      ),
      []
    );

    const stockNameChange = (options: stockInfo[]) => {
      if (!options.length) return;
      props.stockCodeCallback(options[0]['value'], options[0]['industry']);
      if (active === 'buy') {
        buyForm.setFieldsValue({
          stockName: options[0]['label'],
          belong: options[0]['industry'],
          price: priceDisabled ? '现价买入' : props.quote?.now
        });
      } else {
        sellForm.setFieldsValue({
          stockName: options[0]['label'],
          price: priceDisabled ? '现价卖出' : props.quote?.now
        });
      }
    };

    const handleSelect = (value: string, option: stockInfo) => {
      props.stockCodeCallback(value, options[0]['industry']);
      const selectOption = options.filter(item => {
        return item.value === value;
      });
      setOptions(selectOption);
      if (active === 'buy') {
        buyForm.setFieldsValue({
          stockName: option['children'].split(' ')[0],
          belong: options[0]['industry']
        });
      } else {
        sellForm.setFieldsValue({
          stockName: option['children'].split(' ')[0]
        });
      }
    };

    const getNearestPositions = (value: number) => {
      return value ? value.toFixed(2) + '%' : 0 + '%';
    };

    const handleFinishBuy = (formValues: DealFormFields) => {
      console.log('buy', formValues);
      props.onSubmit(formValues);
      props.stockCodeCallback('', '');
      setPriceDisabled(false);
      setOptions([]);
      buyForm.resetFields();
    };

    const handleFinishSell = (formValues: DealFormFields) => {
      console.log('sell', formValues);
      props.onSubmit(formValues);
      props.stockCodeCallback('', '');
      setOptions([]);
      setPriceDisabled(false);
      sellForm.resetFields();
    };

    const handleFormChange = (values: Partial<DealFormFields>) => {
      if ('code' in values && values.code.match(/^[0-9]{6}$/)) {
        props.stockCodeCallback(values.code);
      }
    };

    const switchoverTab = (key: string) => {
      setActive(key);
      props.tabType(key);
      props.stockCodeCallback('', '');
      buyForm.resetFields();
      sellForm.resetFields();
      setOptions([]);
      setPriceDisabled(false);
    };

    const checkboxSelect = e => {
      const checked = e.target.checked;
      if (active === 'buy') {
        buyForm.setFieldsValue({
          price: checked ? '现价买入' : props.quote?.now || undefined
        });
      } else {
        sellForm.setFieldsValue({
          price: checked ? '现价卖出' : props.quote?.now || undefined
        });
      }
      setPriceDisabled(checked);
    };

    const handleResetForms = () => {
      props.stockCodeCallback('', '');
      buyForm.resetFields();
      sellForm.resetFields();
      setOptions([]);
      setPriceDisabled(false);
    };

    const formItemTextAreaGroupLayout = {
      labelCol: {
        xs: { span: 2 },
        sm: { span: 2 }
      },
      wrapperCol: {
        xs: { span: 22 },
        sm: { span: 22 }
      }
    };

    return (
      <Card>
        <Tabs type="card" onTabClick={switchoverTab}>
          <Tabs.TabPane tab="买入指令" key="buy" forceRender={true}>
            <Form
              className={styles['searchForm']}
              onValuesChange={handleFormChange}
              name="buy-order-form"
              form={buyForm}
              layout="horizontal"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={initialValuesBuy}
              onFinish={handleFinishBuy}>
              <Form.Item hidden name="type">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="dataId">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="dataName">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="clientId">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="clientType">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="quantity">
                <InputNumber />
              </Form.Item>
              <Row
                justify="space-around"
                align="middle"
                gutter={16}
                style={{ marginBottom: '24px' }}>
                <Col span={5}>
                  <Form.Item
                    name="code"
                    label="股票代码"
                    rules={formValidationRules.code}>
                    <AutoComplete
                      filterOption={false}
                      onSearch={handleSearch}
                      onSelect={handleSelect}
                      placeholder="输入股票代码">
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
                <Col span={4}>
                  <Form.Item
                    name="stockName"
                    label="股票名称"
                    rules={formValidationRules.stockName}>
                    <Input disabled autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="belong" label="所属行业">
                    <Input disabled autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item name="risk" label="风险等级">
                    <Select placeholder="请选择">
                      <Select.Option value="高">高</Select.Option>
                      <Select.Option value="中">中</Select.Option>
                      <Select.Option value="低">低</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    name="price"
                    label="买入价格"
                    rules={formValidationRules.price}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入价格"
                      disabled={priceDisabled}
                      step={0.01}
                    />
                  </Form.Item>
                </Col>
                <Col span={2}>
                  <Checkbox
                    checked={priceDisabled}
                    onChange={checkboxSelect}
                    value="现价买入">
                    现价买入
                  </Checkbox>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={5}>
                  <Form.Item
                    name="percentage"
                    label="买入仓位"
                    rules={formValidationRules.percentage}>
                    <Input
                      style={{ width: '100%' }}
                      autoComplete="off"
                      placeholder="请输入仓位"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Space size={8}>
                    <Tooltip title={`${getNearestPositions(100)}仓位`}>
                      <Button
                        onClick={() => {
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100)
                          });
                        }}
                        block>
                        全仓
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 2)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 2)
                          })
                        }
                        block>
                        1/2
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 3)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 3)
                          })
                        }
                        block>
                        1/3
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 4)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 4)
                          })
                        }
                        block>
                        1/4
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 5)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 5)
                          })
                        }
                        block>
                        1/5
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 6)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 6)
                          })
                        }
                        block>
                        1/6
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 7)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 7)
                          })
                        }
                        block>
                        1/7
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 8)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 8)
                          })
                        }
                        block>
                        1/8
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 9)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 9)
                          })
                        }
                        block>
                        1/9
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 10)}仓位`}>
                      <Button
                        onClick={() =>
                          buyForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 10)
                          })
                        }
                        block>
                        1/10
                      </Button>
                    </Tooltip>
                  </Space>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={19}>
                  <Form.Item
                    {...formItemTextAreaGroupLayout}
                    name="comment"
                    label="买入理由"
                    rules={formValidationRules.comment}>
                    <Input.TextArea autoSize={true} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Space>
                    <Button block onClick={handleResetForms}>
                      清空
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={
                        props.isLoading || !(props.selectedData.length > 0)
                      }
                      loading={props.isLoading}>
                      发 送
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="卖出指令" key="sell" forceRender={true}>
            <Form
              className={styles['searchForm']}
              name="sell-order-form"
              form={sellForm}
              layout="horizontal"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              initialValues={initialValuesSell}
              onValuesChange={handleFormChange}
              onFinish={handleFinishSell}>
              <Form.Item hidden name="type">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="dataId">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="dataName">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="clientId">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="clientType">
                <Input hidden autoComplete="off" />
              </Form.Item>
              <Form.Item hidden name="quantity">
                <InputNumber />
              </Form.Item>
              <Row align="middle" gutter={16} style={{ marginBottom: '24px' }}>
                <Col span={5}>
                  <Form.Item
                    name="code"
                    label="股票代码"
                    rules={formValidationRules.code}>
                    <AutoComplete
                      filterOption={false}
                      onSearch={handleSearch}
                      onSelect={handleSelect}
                      placeholder="输入股票代码">
                      {options.map(option => (
                        <AutoComplete.Option
                          value={option.value}
                          key={'sell-' + option.value}>
                          {`${option.label} (${option.value})`}
                        </AutoComplete.Option>
                      ))}
                    </AutoComplete>
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Form.Item
                    name="stockName"
                    label="股票名称"
                    rules={formValidationRules.stockName}>
                    <Input disabled autoComplete="off" />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item
                    name="price"
                    label="卖出价格"
                    rules={formValidationRules.price}>
                    <InputNumber
                      style={{ width: '100%' }}
                      placeholder="请输入价格"
                      disabled={priceDisabled}
                      step={0.01}
                      min={0}
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Checkbox
                    checked={priceDisabled}
                    onChange={checkboxSelect}
                    value="现价卖出">
                    现价卖出
                  </Checkbox>
                </Col>
                <Col span={5}>
                  <Form.Item
                    name="percentage"
                    label="卖出仓位"
                    rules={formValidationRules.percentage}>
                    <Input
                      style={{ width: '100%' }}
                      autoComplete="off"
                      placeholder="请输入仓位"
                    />
                  </Form.Item>
                </Col>
                {/* <Col span={5}>
                  <Space size={8}>
                    <Tooltip title={`${getNearestPositions(100)}仓位`}>
                      <Button
                        onClick={() =>
                          sellForm.setFieldsValue({
                            percentage: getNearestPositions(100)
                          })
                        }
                        block>
                        全仓
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 2)}仓位`}>
                      <Button
                        onClick={() =>
                          sellForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 2)
                          })
                        }
                        block>
                        1/2
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 5)}仓位`}>
                      <Button
                        onClick={() =>
                          sellForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 5)
                          })
                        }
                        block>
                        1/5
                      </Button>
                    </Tooltip>
                    <Tooltip title={`${getNearestPositions(100 / 10)}仓位`}>
                      <Button
                        onClick={() =>
                          sellForm.setFieldsValue({
                            percentage: getNearestPositions(100 / 10)
                          })
                        }
                        block>
                        1/10
                      </Button>
                    </Tooltip>
                  </Space>
                </Col> */}
              </Row>
              <Row gutter={16}>
                <Col span={19}>
                  <Form.Item
                    {...formItemTextAreaGroupLayout}
                    name="comment"
                    label="卖出理由"
                    rules={formValidationRules.comment}>
                    <Input.TextArea autoSize={true} />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Space>
                    <Button block onClick={handleResetForms}>
                      清空
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      disabled={
                        props.isLoading || !(props.selectedData.length > 0)
                      }
                      loading={props.isLoading}>
                      发 送
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Form>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
);
