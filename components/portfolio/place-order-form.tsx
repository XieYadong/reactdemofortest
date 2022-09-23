import {
  AutoComplete,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
  Tooltip
} from 'antd';
import { Rule } from 'antd/lib/form';
import { request } from 'utils/helpers/http';
import { formatDecimal, formatInteger } from 'utils/helpers/number-format';
import { getAuldAPIEndpoint } from 'lib/options/api.options';
import { GenericCallback } from 'lib/typings/common.interface';
import { StockHolding } from 'lib/typings/portfolio.interface';
import { debounce } from 'lodash';

import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState
} from 'react';
import styles from './place-order-form.module.scss';
interface Price {
  ask1: number;
  ask5: number;
  ask3: number;
  bid1: number;
  bid5: number;
}
export interface PlaceOrderFormRefs {
  setPrice(price: number): void;
  setPricePro(price: Price): void;
  setStockToSell(stock: StockHolding): void;
  resetFields(): void;
}

interface PlaceOrderFormProps {
  portfolioId: string;
  available: number;
  asset: number;
  stocks: StockHolding[];
  onPlaceOrder(values: OrderFormFields): Promise<void | GenericCallback>;
  onMarketOrder(values: OrderFormFields): Promise<void | GenericCallback>;
  onStockChange(code: string): void;
  setFormOrderType(type: string, orderType: string): void;
}

export interface OrderFormFields {
  order_id?: string;
  portfolio_id: string;
  code: string;
  price: number;
  positions?: number | string;
  type: 'buy' | 'sell';
  order_type: 'limit' | 'market';
  quantity: number;
  quantitySell?: number;
}

const formValidationRules: Partial<Record<keyof OrderFormFields, Rule[]>> = {
  code: [
    {
      required: true,
      len: 6,
      pattern: /^[0-9]{6}$/,
      type: 'string',
      message: '请输入有效的股票代码'
    }
  ],
  price: [
    {
      required: true,
      min: 0.01,
      type: 'number',
      pattern: /^[0-9]+\.[0-9]{2}$/,
      message: '请输入正确的股票价格'
    }
  ],
  quantity: [
    { required: true, min: 100, type: 'number', message: '请输入有效的股数' },
    {
      validateTrigger: 'onChange',
      validator: (_, value) =>
        Math.floor(value / 100) === value / 100
          ? Promise.resolve()
          : Promise.reject('请输入 100 的整数倍')
    }
  ],
  quantitySell: [
    { required: true, min: 1, type: 'number', message: '请输入有效的股数' },
    {
      validateTrigger: 'onChange',
      validator: (_, value) =>
        Math.floor(value / 1) === value / 1
          ? Promise.resolve()
          : Promise.reject('请输入正整数')
    }
  ]
};

export const PlaceOrderForm = forwardRef<
  PlaceOrderFormRefs,
  PlaceOrderFormProps
>((props: PropsWithChildren<PlaceOrderFormProps>, ref) => {
  const [buyPrice, setBuyPrice] = useState(0);
  const [stockToSell, setStockToSell] = useState('');
  const [active, setActive] = useState('buy');
  const [options, setOptions] = useState([]);
  const [buyQuantity, setBuyQuantity] = useState(0);
  const [orderType, setOrderType] = useState('limit');
  const [buyForm] = Form.useForm<OrderFormFields>();
  const [sellForm] = Form.useForm<OrderFormFields>();
  const payMoney = useMemo(() => {
    return +(buyPrice * buyQuantity);
  }, [buyPrice, buyQuantity]);
  const initialValuesBuy: OrderFormFields = {
    portfolio_id: props.portfolioId,
    code: '',
    price: undefined,
    order_type: 'limit',
    type: 'buy',
    quantity: undefined
  };

  const initialValuesSell: OrderFormFields = {
    portfolio_id: props.portfolioId,
    code: '',
    price: undefined,
    order_type: 'limit',
    type: 'sell',
    quantity: undefined
  };

  useImperativeHandle(
    ref,
    () => ({
      setPrice(price: number) {
        buyForm.setFieldsValue({
          price
        });
        sellForm.setFieldsValue({
          price
        });
        setBuyPrice(price);
        // setSellPrice(price);
      },
      setPricePro(price: Price) {
        buyForm.setFieldsValue({
          price: price.ask5
        });
        sellForm.setFieldsValue({
          price: price.bid5
        });
        setBuyPrice(price.ask1);
        // setSellPrice(price);
      },
      setStockToSell(stock: StockHolding) {
        if (stock.frozen >= stock.quantity) {
          return message.warn('当前可卖出股数为 0');
        }

        sellForm.setFieldsValue({
          code: stock.code,
          price: stock.realtime_price || 0,
          quantity: stock.quantity - stock.frozen
        });
        setStockToSell(stock.code);

        setActive('sell');

        props.onStockChange(stock.code);
      },
      resetFields() {
        handleResetForms();
      }
    }),
    []
  );

  const handleFinishBuy = (formValues: OrderFormFields) => {
    console.log('buy', formValues);
    // if (position >= 1 / 3) {
    //   message.error('单笔下单金额不能大于1/3可用金额！');
    //   return;
    // }
    if (formValues.order_type === 'market') {
      props.onMarketOrder(formValues);
    } else {
      props.onPlaceOrder(formValues);
    }
    // props.onPlaceOrder(formValues);
  };

  const handleFinishSell = (formValues: OrderFormFields) => {
    console.log('sell', formValues);
    if (formValues.order_type === 'market') {
      props.onMarketOrder(formValues);
    } else {
      props.onPlaceOrder(formValues);
    }
  };

  const handleBuyFormChange = (values: Partial<OrderFormFields>) => {
    if ('price' in values) {
      setBuyPrice(values.price);
    }
    if ('quantity' in values) {
      setBuyQuantity(values.quantity);
    }
    if ('code' in values && values.code.match(/^[0-9]{6}$/)) {
      props.onStockChange(values.code);
    }
    //order_type
    if ('order_type' in values) {
      setOrderType(values.order_type);
      props.setFormOrderType('buy', values.order_type);
    }
  };

  const handleSellFormChange = (values: Partial<OrderFormFields>) => {
    // if ('price' in values) {
    //   setSellPrice(values.price);
    // }

    if ('code' in values && values.code.match(/^[0-9]{6}$/)) {
      props.onStockChange(values.code);
      setStockToSell(values.code);
    }

    if ('order_type' in values) {
      // props.setOrderType();
      setOrderType(values.order_type);
      props.setFormOrderType('sell', values.order_type);
    }
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
            setOptions(options);
          } else {
          }
        } catch (err) {
          message.error(err.message);
        }
      },
      800,
      { leading: true }
    ),
    []
  );

  // 返回最接近手数 * 100
  const getNearestHands = (value: number) => {
    return value ? Math.floor(value / 100) * 100 : 0;
  };
  // 返回最接近手数 * 100
  const getNearest = (value: number) => {
    return value ? Math.floor(value / 1) * 1 : 0;
  };
  const maxVolumeAbleToBuy = useMemo(() => {
    if (!isFinite(buyPrice) || buyPrice <= 0) {
      return 0;
    }

    return getNearestHands(props.available / buyPrice);
  }, [buyPrice, props.available]);
  const position = useMemo(() => {
    console.log(payMoney / props.available);
    return payMoney / props.available;
  }, [props.available, payMoney]);
  useEffect(() => {
    buyForm.setFieldsValue({
      positions: position
    });
  }, [position]);
  const stocksEligibleForSell = useMemo(() => {
    return props.stocks
      .filter(stock => stock.frozen < stock.quantity)
      .map(stock => ({
        value: stock.code,
        volume: stock.quantity - stock.frozen,
        label: stock.name || stock.code
      }));
  }, [props.stocks]);

  const stockHoldingToSell = useMemo(() => {
    if (stockToSell === '') {
      return {
        quantity: 0,
        frozen: 0
      };
    }

    return props.stocks.find(stock => stock.code === stockToSell);
  }, [props.stocks, stockToSell]);

  const maxVolumeAbleToSell = useMemo(() => {
    if (!stockHoldingToSell || !stockHoldingToSell.quantity) {
      return 0;
    }

    return stockHoldingToSell.quantity - stockHoldingToSell.frozen;
  }, [stockHoldingToSell]);

  const orderTypesOptions = [
    {
      label: '市价委托',
      value: 'market'
    },
    {
      label: '限价委托',
      value: 'limit'
    }
  ];
  const tailLayout = {
    wrapperCol: { span: 24 }
  };
  // console.log(buyForm.getFieldValue('price'));
  const handleResetForms = () => {
    buyForm.resetFields();
    sellForm.resetFields();
    setBuyPrice(0);
    // setSellPrice(0);
    setStockToSell('');
  };
  const handleChange = (key: string) => {
    setActive(key);
    props.onStockChange('');
    buyForm.resetFields();
    sellForm.resetFields();
    setBuyQuantity(0);
    setOrderType('limit');
  };
  return (
    <Tabs
      className={styles.placeOrderTabs}
      defaultActiveKey="buy"
      activeKey={active}
      type="card"
      size="large"
      onChange={handleChange}
      centered>
      <Tabs.TabPane
        tab={<div className={styles.buyTab}>买入</div>}
        key="buy"
        forceRender={true}>
        <Form
          form={buyForm}
          name="buy-order-form"
          layout="horizontal"
          onValuesChange={handleBuyFormChange}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={initialValuesBuy}
          onFinish={handleFinishBuy}>
          <Form.Item hidden name="portfolio_id">
            <Input hidden autoComplete="off" />
          </Form.Item>
          <Form.Item hidden name="type">
            <Input hidden autoComplete="off" />
          </Form.Item>
          <Form.Item hidden name="positions">
            <Input autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="code"
            label="股票代码"
            rules={formValidationRules.code}>
            <AutoComplete
              filterOption={false}
              onSearch={handleSearch}
              placeholder="输入股票代码">
              {options.map(option => (
                <AutoComplete.Option value={option.value} key={option.value}>
                  {`${option.label} (${option.value})`}
                </AutoComplete.Option>
              ))}
            </AutoComplete>
          </Form.Item>
          <Form.Item name="order_type" label="委托方式">
            <Select
              // disabled={userinfo.name !== '廖晓媛分析师'}
              options={orderTypesOptions}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="买入价格"
            className={styles.fontBold}
            rules={formValidationRules.price}>
            <InputNumber
              style={{
                width: '100%',
                color: orderType == 'market' ? 'transparent' : '#000'
              }}
              // formatter={formatDecimal}
              disabled={orderType === 'market'}
              step={0.01}
              precision={2}
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item label="买入数量">
            <Form.Item
              name="quantity"
              className={styles.fontBold}
              rules={formValidationRules.quantity}
              noStyle>
              <InputNumber
                style={{ minWidth: '50%' }}
                disabled={maxVolumeAbleToBuy <= 0}
                placeholder={
                  maxVolumeAbleToBuy ? `可买 ${maxVolumeAbleToBuy} 股` : ''
                }
                step={100}
                min={0}
                max={maxVolumeAbleToBuy}
                autoComplete="off"
              />
            </Form.Item>
            <span style={{ paddingLeft: '10px' }}>
              金额：
              <span
                style={{ fontWeight: 'bold', color: 'red', fontSize: '18px' }}>
                {(payMoney / 10000).toFixed(2)}万
              </span>
            </span>
          </Form.Item>
          <Form.Item {...tailLayout} className={styles.btnBox}>
            <Row
              gutter={8}
              justify="space-between"
              style={{ flexWrap: 'nowrap' }}>
              <Col span={4}>
                <Tooltip
                  title={
                    buyPrice
                      ? `买入 ${getNearestHands(props.available / buyPrice)} 股`
                      : ''
                  }>
                  <Button
                    disabled={buyPrice <= 0 || maxVolumeAbleToBuy <= 0}
                    onClick={() => {
                      buyForm.setFieldsValue({
                        quantity: getNearestHands(props.available / buyPrice)
                      });
                      setBuyQuantity(
                        getNearestHands(props.available / buyPrice)
                      );
                    }}
                    block>
                    全仓
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={
                    buyPrice
                      ? `买入 ${getNearestHands(
                          props.available / buyPrice / 2
                        )} 股`
                      : ''
                  }>
                  <Button
                    disabled={
                      buyPrice <= 0 ||
                      getNearestHands(props.available / buyPrice / 2) <= 0
                    }
                    onClick={() => {
                      buyForm.setFieldsValue({
                        quantity: getNearestHands(
                          props.available / buyPrice / 2
                        )
                      });
                      setBuyQuantity(
                        getNearestHands(props.available / buyPrice / 2)
                      );
                    }}
                    block>
                    1/2
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={
                    buyPrice > 0
                      ? `买入 ${getNearestHands(
                          props.available / buyPrice / 3
                        )} 股`
                      : ''
                  }>
                  <Button
                    disabled={
                      buyPrice <= 0 ||
                      getNearestHands(props.available / buyPrice / 3) <= 0
                    }
                    onClick={() => {
                      buyForm.setFieldsValue({
                        quantity: getNearestHands(
                          props.available / buyPrice / 3
                        )
                      });
                      setBuyQuantity(
                        getNearestHands(props.available / buyPrice / 3)
                      );
                    }}
                    block>
                    1/3
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={
                    buyPrice > 0
                      ? `买入 ${getNearestHands(
                          props.available / buyPrice / 4
                        )} 股`
                      : ''
                  }>
                  <Button
                    disabled={
                      buyPrice <= 0 ||
                      getNearestHands(props.available / buyPrice / 4) <= 0
                    }
                    onClick={() => {
                      buyForm.setFieldsValue({
                        quantity: getNearestHands(
                          props.available / buyPrice / 4
                        )
                      });
                      setBuyQuantity(
                        getNearestHands(props.available / buyPrice / 4)
                      );
                    }}
                    block>
                    1/4
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={
                    buyPrice > 0
                      ? `买入 ${getNearestHands(
                          props.available / buyPrice / 5
                        )} 股`
                      : ''
                  }>
                  <Button
                    disabled={
                      buyPrice <= 0 ||
                      getNearestHands(props.available / buyPrice / 5) <= 0
                    }
                    onClick={() => {
                      buyForm.setFieldsValue({
                        quantity: getNearestHands(
                          props.available / buyPrice / 5
                        )
                      });
                      setBuyQuantity(
                        getNearestHands(props.available / buyPrice / 5)
                      );
                    }}
                    block>
                    1/5
                  </Button>
                </Tooltip>
              </Col>

              <Col span={4}>
                <Tooltip
                  title={
                    buyPrice > 0
                      ? `买入 ${getNearestHands(
                          props.available / buyPrice / 10
                        )} 股`
                      : ''
                  }>
                  <Button
                    disabled={
                      buyPrice <= 0 ||
                      getNearestHands(props.available / buyPrice / 10) <= 0
                    }
                    onClick={() => {
                      buyForm.setFieldsValue({
                        quantity: getNearestHands(
                          props.available / buyPrice / 10
                        )
                      });
                      setBuyQuantity(
                        getNearestHands(props.available / buyPrice / 10)
                      );
                    }}
                    block>
                    1/10
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="comment"
            label="买入理由"
            rules={[{ required: true, message: '请输入买入理由!' }]}>
            <Input.TextArea style={{ width: '100%' }} autoComplete="off" />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Row gutter={8} justify="space-around">
              <Col span={12}>
                <Button block onClick={handleResetForms}>
                  清空
                </Button>
              </Col>
              <Col span={12}>
                <Button
                  disabled={maxVolumeAbleToBuy <= 0}
                  className={styles.btnBuy}
                  block
                  htmlType="submit">
                  买入
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Tabs.TabPane>
      <Tabs.TabPane
        tab={<div className={styles.sellTab}>卖出</div>}
        key="sell"
        disabled={stocksEligibleForSell.length === 0}
        forceRender={true}>
        <Form
          form={sellForm}
          name="sell-order-form"
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={initialValuesSell}
          onValuesChange={handleSellFormChange}
          onFinish={handleFinishSell}>
          <Form.Item hidden name="portfolio_id">
            <Input hidden autoComplete="off" />
          </Form.Item>
          <Form.Item hidden name="type">
            <Input hidden autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="code"
            label="股票代码"
            rules={formValidationRules.code}>
            <AutoComplete
              placeholder="请输入股票代码"
              options={stocksEligibleForSell}
            />
          </Form.Item>
          <Form.Item name="order_type" label="委托方式">
            <Select
              // disabled={userinfo.name !== '廖晓媛分析师'}
              options={orderTypesOptions}
            />
          </Form.Item>
          <Form.Item
            name="price"
            label="卖出价格"
            className={styles.fontBold}
            rules={formValidationRules.price}>
            <InputNumber
              style={{
                width: '100%',
                color: orderType == 'market' ? 'transparent' : '#000'
              }}
              // formatter={formatDecimal}
              disabled={orderType === 'market'}
              precision={2}
              step={0.01}
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="卖出数量"
            className={styles.fontBold}
            rules={formValidationRules.quantitySell}>
            <InputNumber
              style={{ width: '100%', fontWeight: 'bold' }}
              formatter={formatInteger}
              step={100}
              min={0}
              max={maxVolumeAbleToSell}
              placeholder={
                maxVolumeAbleToSell ? `可卖 ${maxVolumeAbleToSell} 股` : ''
              }
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item {...tailLayout} className={styles.btnBox}>
            <Row
              gutter={8}
              justify="space-between"
              style={{ flexWrap: 'nowrap' }}>
              <Col span={4}>
                <Tooltip
                  title={
                    stockHoldingToSell
                      ? `卖出 ${getNearestHands(maxVolumeAbleToSell)} 股`
                      : ''
                  }>
                  <Button
                    disabled={getNearestHands(maxVolumeAbleToSell) <= 0}
                    onClick={() =>
                      sellForm.setFieldsValue({
                        quantity: getNearest(maxVolumeAbleToSell)
                      })
                    }
                    block>
                    全仓
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={`卖出 ${getNearestHands(maxVolumeAbleToSell / 2)} 股`}>
                  <Button
                    disabled={getNearestHands(maxVolumeAbleToSell / 2) <= 0}
                    onClick={() =>
                      sellForm.setFieldsValue({
                        quantity: getNearestHands(maxVolumeAbleToSell / 2)
                      })
                    }
                    block>
                    1/2
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={`卖出 ${getNearestHands(maxVolumeAbleToSell / 3)} 股`}>
                  <Button
                    disabled={getNearestHands(maxVolumeAbleToSell / 3) <= 0}
                    onClick={() =>
                      sellForm.setFieldsValue({
                        quantity: getNearestHands(maxVolumeAbleToSell / 3)
                      })
                    }
                    block>
                    1/3
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={`卖出 ${getNearestHands(maxVolumeAbleToSell / 4)} 股`}>
                  <Button
                    disabled={getNearestHands(maxVolumeAbleToSell / 4) <= 0}
                    onClick={() =>
                      sellForm.setFieldsValue({
                        quantity: getNearestHands(maxVolumeAbleToSell / 4)
                      })
                    }
                    block>
                    1/4
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={`卖出 ${getNearestHands(maxVolumeAbleToSell / 5)} 股`}>
                  <Button
                    disabled={getNearestHands(maxVolumeAbleToSell / 5) <= 0}
                    onClick={() =>
                      sellForm.setFieldsValue({
                        quantity: getNearestHands(maxVolumeAbleToSell / 5)
                      })
                    }
                    block>
                    1/5
                  </Button>
                </Tooltip>
              </Col>
              <Col span={4}>
                <Tooltip
                  title={`卖出 ${getNearestHands(
                    maxVolumeAbleToSell / 10
                  )} 股`}>
                  <Button
                    disabled={getNearestHands(maxVolumeAbleToSell / 10) <= 0}
                    onClick={() =>
                      sellForm.setFieldsValue({
                        quantity: getNearestHands(maxVolumeAbleToSell / 10)
                      })
                    }
                    block>
                    1/10
                  </Button>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            name="comment"
            label="卖出理由"
            rules={[{ required: true, message: '请输入买入理由!' }]}>
            <Input.TextArea style={{ width: '100%' }} autoComplete="off" />
          </Form.Item>
          <Form.Item wrapperCol={{ span: 24 }}>
            <Row gutter={8} justify="space-around">
              <Col span={12}>
                <Button block onClick={handleResetForms}>
                  清空
                </Button>
              </Col>
              <Col span={12}>
                <Button className={styles.btnSell} block htmlType="submit">
                  卖出
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Tabs.TabPane>
    </Tabs>
  );
});
