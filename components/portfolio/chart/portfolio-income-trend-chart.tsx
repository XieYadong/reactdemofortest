import { message } from 'antd';
import {
  axisLabelColor,
  colorLightBlue,
  fontStyles
} from 'constants/chart-options.constant';
import user from 'utils/helpers/user';
import ReactEcharts from 'echarts-for-react';
import { padStart } from 'utils/helpers/utils';
import { request } from 'utils/helpers/http';
import { getAuldAPIEndpoint } from 'lib/options/api.options';
import {
  FunctionComponent,
  PropsWithChildren,
  useEffect,
  useState
} from 'react';

interface CollectionItem {
  // 日期
  date: string;
  // 累计总收益
  totalIncome: number;
  // 累计总收益率
  totalIncomeRate: number;
  // 当日总资产
  assets: number;
}

interface PortfolioIncomeTrendChartProps {
  portfolioId: string;
}
const formatNum = function (value: number) {
  // 格式化成月/日，只在第一个刻度显示年份
  if (typeof value == 'number') {
    return (value * 100).toFixed(2) + '%';
  }
};
export const PortfolioIncomeTrendChart: FunctionComponent<PortfolioIncomeTrendChartProps> = (
  props: PropsWithChildren<PortfolioIncomeTrendChartProps>
) => {
  const [data, setData] = useState([]);
  const [xAxisdata, setXAxisData] = useState([]);

  useEffect(() => {
    fetch(props.portfolioId);
  }, []);

  // const data = [-1.23, -2.46, 0.78, 3.87, 7.91, 11.86, 8.73];

  const fetch = async (portfolioId: string) => {
    try {
      const token = user.verifyToken();
      const response: { items: CollectionItem[] } = await request(
        getAuldAPIEndpoint(`/portfolio/${portfolioId}/chart/income`),
        {
          token
        }
      );
      console.log(
        `🚀 ${new Date().toLocaleString()} ~ file: portfolio-income-trend-chart.tsx ~ line 55 ~ fetch ~ response`,
        response
      );
      // return response.items;

      const { incomeCol, dateCol } = response.items.reduce(
        ({ incomeCol, dateCol }, item) => {
          incomeCol.push(item.totalIncomeRate);
          dateCol.push(item.date);
          return {
            incomeCol,
            dateCol
          };
        },
        { incomeCol: [], dateCol: [] }
      );

      setData(padStart(incomeCol, 7, null));
      setXAxisData(padStart(dateCol, 7, ''));
    } catch (err) {
      console.error(err);
      message.error(err.message);
    }
  };

  const options: any = {
    animation: true,
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        params = params[0];
        const res =
          typeof params.data === 'number'
            ? params.name +
              '<br/>' +
              params.marker +
              params.seriesName +
              '：' +
              formatNum(params.data)
            : params.marker + params.seriesName + '：-';

        return res;
      },
      axisPointer: {
        type: 'shadow',
        label: {
          ...fontStyles
        }
      },
      textStyle: {
        ...fontStyles
      }
    },
    xAxis: {
      // type: 'time',
      type: 'category',
      data: xAxisdata,
      axisLabel: {
        inside: false,
        color: axisLabelColor,
        ...fontStyles
      },
      axisTick: {
        inside: false
      }
    },
    yAxis: {
      position: 'left',
      type: 'value',
      offset: 0,
      boundaryGap: [0, 0],
      axisTick: {
        inside: true
      },
      axisLabel: {
        inside: true,
        color: axisLabelColor,
        ...fontStyles,
        formatter: function (value: number, index: number) {
          // 格式化成月/日，只在第一个刻度显示年份
          if (typeof value == 'number') {
            return (value * 100).toFixed(2) + '%';
          }
        }
      }
    },
    grid: {
      left: 3,
      right: 3,
      top: 5,
      bottom: 16
    },
    series: [
      {
        name: '累计收益',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: colorLightBlue
        },
        itemStyle: {
          color: colorLightBlue
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            global: false,
            colorStops: [
              {
                offset: 0,
                color: colorLightBlue // 0% 处的颜色
              },
              {
                offset: 1,
                color: '#f5f5f5' // 100% 处的颜色
              }
            ]
          },
          opacity: 0.85,
          origin: 'auto'
        },
        data
      }
    ]
  };

  return (
    <ReactEcharts style={{ minHeight: 160, height: '100%' }} option={options} />
  );
};
