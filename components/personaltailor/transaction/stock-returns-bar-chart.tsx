import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
import { EChartOption } from 'echarts';
import { fontStyles } from 'constants/chart-options.constant';
import { ChartValueProps } from 'pages/portfolio/rankinglist';

interface AssetComponent {
  value: number;
  itemStyle: { color: string };
}

interface StockReturnsChartProps {
  dataSource: ChartValueProps[];
}

export const StockReturnsBarChart: FunctionComponent<StockReturnsChartProps> = (
  props: PropsWithChildren<StockReturnsChartProps>
) => {
  const data = useMemo(() => {
    const ret: AssetComponent[] = [
      {
        value: 0,
        itemStyle: {
          color: '#1E7701'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#1E7701'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#1E7701'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#1E7701'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#757575'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#F60015'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#F60015'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#F60015'
        }
      },
      {
        value: 0,
        itemStyle: {
          color: '#F60015'
        }
      }
    ];

    if (props.dataSource.length) {
      const obj = [
        [-8],
        [-6, -7],
        [-3, -4, -5],
        [-1, -2],
        [0],
        [1, 2],
        [3, 4, 5],
        [6, 7],
        [8]
      ];
      props.dataSource.map(item => {
        return obj.filter((value, index) => {
          if (index == 0 && item.floorValue < -7) {
            return ret[index].value++;
          } else if (index == 8 && item.floorValue > 7) {
            return ret[index].value++;
          } else if (value.includes(item.floorValue)) {
            return ret[index].value++;
          }
        });
      });
    }

    return ret;
  }, [props.dataSource]);

  const options: EChartOption = {
    tooltip: {
      trigger: 'axis',
      // formatter: '{a} <br/>{b}: {c} ({d}%)',
      formatter: function (params: any) {
        const tar = params[0];
        return (
          tar.seriesName + '<br/>' + tar.marker + tar.name + '：' + tar.value
        );
      },
      textStyle: fontStyles,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      top: '3%',
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      splitLine: { show: false },
      data: [
        '<-7%',
        '-5~-7%',
        '-2~-5%',
        '0~-2%',
        '平',
        '0~2%',
        '2~5%',
        '5~7%',
        '>7%'
      ]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '盈亏比例',
        type: 'bar',
        label: {
          show: true,
          position: 'inside'
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

export default StockReturnsBarChart;
