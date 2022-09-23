import { Col, Empty, Row, Statistic } from 'antd';
import { formatPercentage } from 'utils/helpers/number-format';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { Quote } from 'lib/hooks/use-quotes';
import styles from './quote-panel.module.scss';

interface OrderTableProps {
  quote: Quote;
  stock: number | string;
  setPrice(value: number): void;
}
interface color {
  now: number | string;
  close: number | string;
}
export const QuotePanel: FunctionComponent<OrderTableProps> = (
  props: PropsWithChildren<OrderTableProps>
) => {
  if (!props.quote) {
    return (
      <Empty
        description="请输入有效的股票代码"
        image={Empty.PRESENTED_IMAGE_SIMPLE}></Empty>
    );
  }
  const colorFunc = (arg: color) => {
    let flag = '#000';
    if (arg.now == arg.close) {
      flag = '#000';
    } else {
      flag = arg.now > arg.close ? '#cf1322' : '#008232';
    }
    return flag;
  };
  return (
    <>
      <div>
        <Row>
          <Col span={12}>
            <span className={styles.fonttitle}>{props.stock}</span>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <span className={styles.fonttitle}> {props.quote?.name}</span>
          </Col>
        </Row>
        <Row gutter={14} style={{ marginBottom: '16px' }}>
          <Col span={8}>
            <Statistic
              // valueRender={renderStatisticValue}
              value={props.quote?.now}
              valueStyle={{
                color: colorFunc(props.quote),
                fontSize: '24px'
              }}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={7}>
            <Statistic
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
              valueStyle={{
                color: colorFunc(props.quote),
                fontSize: '24px'
              }}
              value={props.quote?.now - props.quote?.close}
            />
          </Col>
          <Col span={9} style={{ textAlign: 'right' }}>
            <Statistic
              formatter={(value: number) => formatPercentage(value)}
              precision={2}
              valueStyle={{
                color: colorFunc(props.quote),
                fontSize: '24px'
              }}
              value={
                props.quote?.close
                  ? (props.quote?.now - props.quote?.close) / props.quote?.close
                  : 0
              }
            />
          </Col>
        </Row>
      </div>
      <div
        className={styles.clickable}
        onClick={() => props.setPrice(props.quote?.now)}></div>
      <div className={styles.buy}>
        <Row
          gutter={20}
          align="middle"
          onClick={() => props.setPrice(props.quote?.ask5)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>卖五</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.ask5}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.ask5_volume} />
          </Col>
        </Row>

        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.ask4)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>卖四</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.ask4}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.ask4_volume} />
          </Col>
        </Row>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.ask3)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>卖三</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.ask3}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.ask3_volume} />
          </Col>
        </Row>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.ask2)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>卖二</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.ask2}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.ask2_volume} />
          </Col>
        </Row>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.ask1)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>卖一</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.ask1}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.ask1_volume} />
          </Col>
        </Row>
      </div>

      <div>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.bid1)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>买一</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.bid1}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.bid1_volume} />
          </Col>
        </Row>

        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.bid2)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>买二</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.bid2}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.bid2_volume} />
          </Col>
        </Row>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.bid3)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>买三</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.bid3}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.bid3_volume} />
          </Col>
        </Row>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.bid4)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>买四</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.bid4}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.bid4_volume} />
          </Col>
        </Row>
        <Row
          gutter={20}
          onClick={() => props.setPrice(props.quote?.bid5)}
          className={styles.clickable}>
          <Col span={7}>
            <div className={styles.centerText}>买五</div>
          </Col>
          <Col span={7}>
            <Statistic
              value={props.quote?.bid5}
              precision={props.stock.toString().startsWith('5') ? 3 : 2}
            />
          </Col>
          <Col span={10}>
            <Statistic value={props.quote?.bid5_volume} />
          </Col>
        </Row>
      </div>
    </>
  );
};
