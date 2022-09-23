import { Col, Row, Statistic } from 'antd';
import { renderStatisticValue } from 'components/common/animated/updatable-number';
import { Portfolio } from 'lib/typings/portfolio.interface';
import React, { FunctionComponent, PropsWithChildren, useMemo } from 'react';

interface PortfolioOverviewProps {
  portfolio: Portfolio;
}

export const PortfolioOverview: FunctionComponent<PortfolioOverviewProps> = (
  props: PropsWithChildren<PortfolioOverviewProps>
) => {
  const [stockMarketValueSum, totalAsset, totalIncome] = useMemo(() => {
    const sum = props.portfolio.stocks.reduce((aggregate, stock) => {
      return aggregate + stock.market_value;
    }, 0);

    const asset = sum + props.portfolio.available + props.portfolio.frozen;
    const income = asset - props.portfolio.principal;

    return [sum, asset, income];
  }, [props.portfolio.stocks]);

  return (
    <Row gutter={[16, 10]}>
      <Col span={4}>
        <Statistic
          precision={2}
          title="资产总值"
          valueRender={renderStatisticValue}
          value={totalAsset}
        />
      </Col>
      <Col span={4}>
        <Statistic
          precision={2}
          title="证券市值"
          valueRender={renderStatisticValue}
          value={stockMarketValueSum}
        />
      </Col>
      <Col span={4}>
        <Statistic
          precision={2}
          title="当前仓位"
          suffix="%"
          value={(stockMarketValueSum / totalAsset) * 100}
        />
      </Col>
      <Col span={4}>
        <Statistic
          precision={2}
          title="账户盈亏"
          valueRender={renderStatisticValue}
          value={totalIncome}
        />
      </Col>
      <Col span={4}>
        <Statistic
          precision={2}
          title="可用资金"
          value={props.portfolio.available}
        />
      </Col>
      <Col span={4}>
        <Statistic
          precision={2}
          title="冻结资金"
          value={props.portfolio.frozen}
        />
      </Col>
    </Row>
  );
};
