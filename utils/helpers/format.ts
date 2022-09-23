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
  const percentage = (record.totalIncome / record.principal) * 100;

  return `${numeral(percentage).format('0.00')}%`;
};
export const formatColor = (totalIncomeRate: number) => {
  let color = '#000'; //red #008232 green
  totalIncomeRate > 0 ? (color = '#cf1322') : '';
  totalIncomeRate < 0 ? (color = '#1196EE') : '';
  return color;
};
