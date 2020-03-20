
// import { set, get, cloneDeep } from 'utils-lite'
// import echarts from 'echarts'

const title = {
  text: '报名分析-流量实效',
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
  data: [
    '报名-新量',
    '报名-老量',
    '补余款-新量',
    '补余款-老量',
    '未补余款-新量',
    '未补余款-老量'
  ],
  right: -5,
  textStyle: {
    fontSize: 10,
    color: 'rgba(153,153,153,1)'
  }
}

const xAxis = [
  {
    type: 'category',
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
    data: ['济南市', '青岛市', '淄博市', '枣庄', '东营', '烟台市', '潍坊市', '济宁市', '威海市', '泰安市']
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
  }
]

const series = [
  {
    name: '报名-新量',
    type: 'bar',
    color: '#04B352',
    stack: 'sum',
    data: [20, 30, 20, 30, 20, 30, 20, 30, 20, 30]
  },
  {
    name: '报名-老量',
    type: 'bar',
    barWidth: '20px',
    color: '#1961FF',
    stack: 'sum',
    data: [9, 30, 9, 60, 70, 20, 59, 20, 49, 20]
  },
  {
    name: '补余款-新量',
    type: 'bar',
    color: '#9BE1BA',
    stack: 'sum1',
    data: [20, 30, 20, 30, 20, 30, 20, 30, 20, 30]
  },
  {
    name: '补余款-老量',
    type: 'bar',
    color: '#68D197',
    stack: 'sum1',
    data: [9, 30, 9, 60, 70, 20, 59, 20, 49, 20]
  },
  {
    name: '未补余款-新量',
    type: 'bar',
    color: '#82A9FF',
    stack: 'sum1',
    data: [9, 30, 9, 60, 70, 20, 59, 20, 49, 20]
  },
  {
    name: '未补余款-老量',
    type: 'bar',
    color: '#4389FF',
    stack: 'sum1',
    data: [9, 30, 9, 60, 70, 20, 59, 20, 49, 20]
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
    //     return `
    //     <span style="font-size:12px;
    // font-family:PingFangSC-Regular,PingFang SC;
    //  font-weight:400;
    // color:rgba(153,153,153,1);">${name[0].name.replace('-', '/')}</span><br/>
    //     <i style='display:inline-block;width:4px;height:4px;background:#FFCD2F;border-radius:40px;margin-right:2px;margin-bottom:3px'></i><span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>
    //     ROI：${name[0].value.toFixed(2)}</span><br/>
    //     <i style='display:inline-block;width:4px;height:4px;background:#A69DFB;border-radius:40px;margin-right:2px;margin-bottom:3px'></i><span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>
    //     消费：${(name[1].value / 10000).toFixed(2)}万</span><br/>
    //     <i style='display:inline-block;width:4px;height:4px;background:#568AFD;border-radius:40px;margin-right:2px;margin-bottom:3px'></i><span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>
    //    业绩： ${(name[2].value / 10000).toFixed(2)}万</span><br/>`
  }
}

const grid = {
  left: '0px',
  right: '0px',
  bottom: '10px',
  top: '40px',
  containLabel: true
}

export const option = (columns, rows, settings, status, extra) => {
  console.log('5555555555555', columns, rows, settings, status, extra)
  // const innerRows = cloneDeep(rows)
  const options = { title, legend, yAxis, series, xAxis, tooltip, grid }
  return options
}
