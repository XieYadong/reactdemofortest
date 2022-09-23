import { FunctionComponent, PropsWithChildren, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Empty } from 'antd';
import * as echarts from 'echarts';

interface AssetComponent {
  name: string;
  value: number;
}

interface StockReturnsChartProps {
  gradeData: any;
}

export const GradeRadar: FunctionComponent<StockReturnsChartProps> = (
  props: PropsWithChildren<StockReturnsChartProps>
) => {
  const legendData = useMemo(() => {
    return props.gradeData?.grade
      ? [
          props.gradeData.grade[0].shouyi || 0,
          props.gradeData.grade[0].zhengque || 0,
          props.gradeData.grade[0].huiche || 0,
          props.gradeData.grade[0].zhisun || 0,
          props.gradeData.grade[0].jiaoyi || 0
        ]
      : [];
  }, [props.gradeData]);

  const options: any = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      // data: ['预算分配'],
      orient: 'vertical',
      right: 'left'
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '收益率', max: 10 },
        { name: '成功率', max: 10 },
        { name: '回撤率', max: 10 },
        { name: '止损率', max: 10 },
        { name: '交易频率', max: 10 }
      ]
    },
    series: [
      {
        type: 'radar',
        areaStyle: {},

        data: [
          {
            value: legendData,
            name: props.gradeData?.name ? props.gradeData?.name : '各项分数',
            label: {
              show: true,
              formatter: function (params) {
                return params.value;
              }
            }
          }
        ]
      }
    ]
  };
  return (
    <>
      {props.gradeData?.grade && props.gradeData?.grade.length > 0 ? (
        <ReactEcharts
          style={{ height: '100%', minHeight: 220 }}
          option={options}
        />
      ) : (
        <Empty description="数据还未生成请稍后查看" />
      )}
    </>
  );
};
