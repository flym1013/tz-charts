// import { cloneDeep } from 'utils-lite'
import echarts from 'echarts'
const title = {
  text: '业绩-ROI趋势',
  textStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(48,48,48,1)'
  },
  left: -2
}
const legend = {
  icon: '',
  itemWidth: 14,
  itemHeight: 5,
  itemGap: 13,
  data: ['ROI', '业绩'],
  right: -5,
  textStyle: {
    fontSize: 10,
    color: 'rgba(153,153,153,1)'
  }
}

const xAxis = [
  {
    type: 'category',
    // boundaryGap: false,

    axisLabel: {
      margin: 10,
      textStyle: {
        fontSize: 10,
        color: 'rgba(153, 153, 153, 1)'
      }
    },
    axisLine: {
      lineStyle: {
        color: '#E4E7ED'
      }
    },
    data: ['2019Q1', '2019Q2', '2019Q3', '2019Q4', '2019Q4', '2019Q4']
  }
]

const yAxis = [
  {
    type: 'value',
    name: '',
    // max: 1000,
    // min: 0,
    // interval: 50000 / 4,
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    },
    axisLabel: {
      formatter: function (value = 0) {
        return `${
          value > 10000
            ? `${Math.ceil(value / 10000)}w`
            : value < 1
              ? value
              : Math.ceil(value)
        }`
      },
      margin: 20,
      textStyle: {
        fontSize: 10,
        color: 'rgba(153, 153, 153, 1)'
      }
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#E4E7ED'
      }
    }
  },
  {
    type: 'value',
    name: '',
    // max: 100,
    // min: 0,
    // interval: 1000000 / 4,
    axisTick: {
      show: false
    },
    axisLine: {
      lineStyle: {
        color: '#fff'
      }
    },
    axisLabel: {
      margin: 20,
      textStyle: {
        fontSize: 10,
        color: 'rgba(153, 153, 153, 1)'
      }
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
        color: '#E4E7ED'
      }
    }
  }
]

const series = [
  {
    name: 'ROI',
    type: 'line',
    smooth: true,
    symbol: 'circle',
    symbolSize: 1,
    showSymbol: true,
    yAxisIndex: 1,
    barGap: '15',
    lineStyle: {
      normal: {
        width: 1
      }
    },
    areaStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(
          0,
          0,
          0,
          1,
          [
            {
              offset: 0,
              color: 'rgba(255, 205, 47, 0.2)'
            },
            {
              offset: 1,
              color: 'rgba(255, 205, 47, 0)'
            }
          ],
          false
        ),
        shadowColor: 'rgba(255, 205, 47, 0.1)',
        shadowBlur: 10
      }
    },
    itemStyle: {
      normal: {
        color: 'rgba(255, 205, 47, 1)',
        borderColor: 'rgba(255, 205, 47, 1)',
        borderWidth: 3
      }
    },
    data: [555, 888, 666, 655, 522, 455]
  },
  {
    name: '业绩',
    type: 'bar',
    // barWidth: '10',
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          // {
          //   offset: 0,
          //   color: 'rgba(125, 166, 255, 1)',
          // },
          {
            offset: 1,
            color: 'rgba(112, 157, 255, 1)'
          }
        ])
      }
    },
    data: [5051, 6551, 6661, 8881, 5221, 5551]
  }
]

const tooltip = {
  trigger: 'axis',
  extraCssText: 'box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);',
  backgroundColor: '#fff',
  textStyle: {
    fontSize: 12,
    color: '#57617B'
  },
  axisPointer: {
    type: 'line',
    lineStyle: {
      color: '#E4E7ED',
      width: 1,
      type: 'dashed'
    }
  },
  formatter: function (name) {
    // console.log(name)
    return 11111
  }
}

const grid = {
  left: '0px',
  right: '0px',
  bottom: '10px',
  top: '40px',
  containLabel: true
}

// function getDims (rows, dimension) {
//   return rows.map(row => row[dimension[0]])
// }
// const option = { legend, yAxis, series, xAxis, tooltip }
export const option = (columns, rows, settings, status, extra) => {
  console.log('666666666', columns, rows, settings, status, extra)
  const options = { title, legend, yAxis, series, xAxis, tooltip, grid }
  return options
}
