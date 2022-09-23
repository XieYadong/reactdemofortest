import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
// import { EChartOption } from 'echarts';
import { Portfolio } from 'lib/typings/portfolio.interface';
import { fontStyles } from 'constants/chart-options.constant';
import { StockHolding } from 'lib/typings/portfolio.interface';
interface AssetComponent {
  name: string;
  value: number;
}
interface Industrys {
  name: string;
  industry: string;
  symbol: string;
}
interface IndustryPieChartProps {
  portfolio?: Portfolio;
  stocks: StockHolding[];
  industrys: Industrys[];
}
const formatNum = function (value: number) {
  // 格式化成月/日，只在第一个刻度显示年份
  return value.toFixed(2);
};
export const IndustryPieChart: FunctionComponent<IndustryPieChartProps> = (
  props: PropsWithChildren<IndustryPieChartProps>
) => {
  const data = useMemo(() => {
    let ret: AssetComponent[] = [];

    let obj = {};

    if (props.stocks.length > 0) {
      props.stocks.forEach(item => {
        const industry = props.industrys.find(
          industry => industry.symbol == item.code
        );
        if (industry === undefined) {
          return;
        }
        if (obj[industry.industry]) {
          obj[industry.industry] += item.market_value;
        } else {
          obj[industry.industry] = item.market_value;
        }
      });
    }
    const result = Object.entries(obj).map(ele => {
      return { name: ele[0], value: ele[1] };
    });
    return result;
  }, [props.stocks, props.industrys]);
  const legendData = useMemo(() => {
    return data.map(item => item.name);
  }, [props.stocks, props.industrys]);

  const options: any = {
    tooltip: {
      trigger: 'item',
      // formatter: '{a} <br/>{b}: {c} ({d}%)',
      formatter: function (params: any) {
        const res =
          params.seriesName +
          '<br/>' +
          params.marker +
          params.name +
          '：' +
          formatNum(params.value) +
          '(' +
          params.percent +
          '%)';

        return res;
      },
      textStyle: fontStyles
    },
    legend: {
      orient: 'horizontal',
      left: 'center',
      top: 10,
      textStyle: fontStyles,
      data: legendData
    },
    series: [
      {
        name: '行业组成',
        type: 'pie',
        top: 24,
        label: {
          show: true,
          position: 'inside',
          formatter: '{d}%'
        },
        emphasis: {
          label: {
            show: true,
            ...fontStyles,
            fontSize: 18
          }
        },
        labelLine: {
          show: true
        },
        data
      }
    ]
  };
  return (
    <>
      {data && data.length > 0 ? (
        <ReactEcharts
          style={{ height: '100%', minHeight: 220 }}
          option={options}
        />
      ) : (
        <Empty description="暂无数据" />
      )}
    </>
  );
};

export default IndustryPieChart;
