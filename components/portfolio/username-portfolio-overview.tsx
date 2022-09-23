import { Col, Row, Statistic } from 'antd';
import { renderStatisticValue } from 'components/common/animated/updatable-number';
import { Portfolio } from 'lib/typings/portfolio.interface';
// import { transactionProfit } from 'pages/inquiry/username-inquiry';
import React, { FunctionComponent, PropsWithChildren, useMemo } from 'react';

interface PortfolioOverviewProps {
  portfolio: Portfolio;
  transactionProfitStock: any;
}

export const UserNamePortfolioOverview: FunctionComponent<PortfolioOverviewProps> = (
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
    <>
      <Row gutter={[16, 10]}>
        <Col span={6}>
          <Statistic
            precision={2}
            title="总资产"
            valueRender={renderStatisticValue}
            value={totalAsset}
          />
        </Col>
        <Col span={6}>
          <Statistic
            precision={2}
            title="总盈亏"
            valueRender={renderStatisticValue}
            value={totalIncome}
          />
        </Col>
        <Col span={6}>
          <Statistic
            precision={2}
            title="盈亏比例"
            suffix="%"
            value={(totalIncome / props.portfolio.principal) * 100}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="交易股票数"
            value={props.transactionProfitStock?.transactionStock}
          />
        </Col>
      </Row>
      <Row gutter={[16, 10]}>
        <Col span={6}>
          <Statistic
            precision={2}
            title="总市值"
            value={stockMarketValueSum}
            valueRender={renderStatisticValue}
          />
        </Col>
        <Col span={6}>
          <Statistic
            precision={2}
            title="可用金额"
            valueRender={renderStatisticValue}
            value={props.portfolio.available}
          />
        </Col>
        <Col span={6}>
          <Statistic
            precision={2}
            title="当前仓位"
            suffix="%"
            value={(stockMarketValueSum / totalAsset) * 100}
          />
        </Col>
        <Col span={6}>
          <Statistic
            title="盈利股票数"
            value={props.transactionProfitStock?.profitStock}
          />
        </Col>
      </Row>
    </>
  );
};
