import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
// import { EChartOption } from 'echarts';
import { Portfolio } from 'lib/typings/portfolio.interface';
import { fontStyles } from 'constants/chart-options.constant';

interface AssetComponent {
  name: string;
  value: number;
}

interface PortfolioPieChartProps {
  portfolio: Portfolio;
}
const formatNum = function (value: number) {
  // 格式化成月/日，只在第一个刻度显示年份
  return value.toFixed(2);
};
export const PortfolioPieChart: FunctionComponent<PortfolioPieChartProps> = (
  props: PropsWithChildren<PortfolioPieChartProps>
) => {
  const data = useMemo(() => {
    const ret: AssetComponent[] = [
      {
        name: '资金',
        value: props.portfolio.available + props.portfolio.frozen
      }
    ];

    if (props.portfolio.stocks.length > 0) {
      ret.push({
        name: '市值',
        value:
          props.portfolio.assets -
          props.portfolio.frozen -
          props.portfolio.available
      });
    }

    return ret;
  }, [props.portfolio]);
  const legendData = useMemo(() => {
    return data.map(item => item.name);
  }, [props.portfolio]);

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
        name: '账户组成',
        type: 'pie',
        top: 24,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b} {d}%'
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
    <ReactEcharts style={{ height: '100%', minHeight: 220 }} option={options} />
  );
};

export default PortfolioPieChart;
