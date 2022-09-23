import Item from 'antd/lib/list/Item';
import numeral from 'numeral';

interface NumeralFormatterFunction {
  (value: number): string;
}

export const formatDecimal: NumeralFormatterFunction = value => {
  return numeral(value).format('0,0.00');
};

export const formatInteger: NumeralFormatterFunction = value => {
  return numeral(value).format('0,0');
};

export const formatPercentage: NumeralFormatterFunction = value => {
  const percentage = value * 100;
  return `${numeral(percentage).format('0.00')}%`;
};
export const calculationPercentage = record => {
  const principal = record.assets - (record.totalIncome || 0);
  const percentage = (record.totalIncome / principal) * 100;

  return `${numeral(percentage).format('0.00')}%`;
};

export const calculationPosition = record => {
  const percentage = record.stocks
    ? record.stocks.reduce((aggregate, stock) => {
        return aggregate + stock.market_value;
      }, 0) / record.assets
    : 0;

  // return percentage;

  return `${numeral(percentage * 100).format('0.00')}%`;
};

export const calculationRetracement = record => {
  const percentage =
    (record.maxTotalIncome - record.lastTotalIncome) / record.assets;

  // return percentage;

  return percentage > 0 ? `${numeral(percentage * 100).format('0.00')}%` : '';
};
export const calculationWithdrawalRate = record => {
  const rate = record.maxTotalIncomeRate - record.latestTotalIncomeRate;
  return rate > 0 ? `${numeral(rate * 100).format('0.00')}%` : '';
};
export const formatColor = (totalIncomeRate: number) => {
  let color = '#000'; //red #008232 green
  totalIncomeRate > 0 ? (color = '#cf1322') : '';
  totalIncomeRate < 0 ? (color = '#1196EE') : '';
  return color;
};
