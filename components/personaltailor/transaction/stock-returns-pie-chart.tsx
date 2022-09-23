import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
import { EChartOption } from 'echarts';
import { fontStyles } from 'constants/chart-options.constant';
import { ChartValueProps } from 'pages/portfolio/rankinglist';

interface AssetComponent {
  name: string;
  value: number;
}

interface StockReturnsChartProps {
  dataSource: ChartValueProps[];
}

export const StockReturnsPieChart: FunctionComponent<StockReturnsChartProps> = (
  props: PropsWithChildren<StockReturnsChartProps>
) => {
  const data = useMemo(() => {
    const ret: AssetComponent[] = [];

    if (props.dataSource.length) {
      const profitNum = props.dataSource.filter(item => item.avgValue > 0);
      const lossNum = props.dataSource.filter(item => item.avgValue < 0);
      const flatNum = props.dataSource.filter(item => item.avgValue == 0);

      ret.push(
        {
          name: '涨',
          value: profitNum.length
        },
        {
          name: '跌',
          value: lossNum.length
        },
        {
          name: '平',
          value: flatNum.length
        }
      );
    }

    return ret;
  }, [props.dataSource]);
  const legendData = useMemo(() => {
    return data.map(item => item.name);
  }, [props.dataSource]);

  const options: EChartOption = {
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
          params.value +
          ' (' +
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
    color: ['#F60015', '#1E7701', '#757575'],
    series: [
      {
        name: '盈亏情况',
        type: 'pie',
        top: 24,
        label: {
          show: true,
          position: 'inside',
          formatter: function (params: any) {
            return params.value + '\n(' + params.percent + '%)';
          }
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

export default StockReturnsPieChart;
