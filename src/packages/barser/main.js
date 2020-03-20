// import { set, get, cloneDeep } from 'utils-lite'
// import echarts from 'echarts'

const xAxis = {
  show: false,
  boundaryGap: false,
  splitLine: {
    show: false
  },
  axisLine: {
    show: false
  },
  axisTick: {
    show: false
  }
}

const yAxis = {
  type: 'category',
  nameGap: 16,
  axisLine: {
    show: false,
    lineStyle: {
      color: '#ddd'
    }
  },
  axisTick: {
    show: false,
    lineStyle: {
      color: '#ddd'
    }
  },
  axisLabel: {
    interval: 0,
    textStyle: {
      color: '#999'
    }
  },
  data: ['北京', '天津', '上海', '重庆', '河北', '河南']
}

const series = [
  {
    name: 'barSer',
    type: 'bar',
    roam: false,
    visualMap: false,
    zlevel: 2,
    barMaxWidth: 20,
    itemStyle: {
      normal: {
        color: '#8A7FFC'
      }
      // emphasis: {
      //   color: '#3596c0'
      // }
    },
    label: {
      normal: {
        show: true,
        position: 'inside'
      }
    },
    data: [
      {
        name: '北京',
        value: 5.3
      },
      {
        name: '天津',
        value: 3.8
      },
      {
        name: '上海',
        value: 4.6
      },
      {
        name: '重庆',
        value: 3.6
      },
      {
        name: '河北',
        value: 3.4
      },
      {
        name: '河南',
        value: 3.2
      }
    ]
  }
]

const tooltip = {
  // trigger: 'axis',
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
  formatter: function (params) {
    return 555
  }
}

const grid = {
  left: '0px',
  right: '0px',
  bottom: '10px',
  top: '20px',
  containLabel: true
}

export const option = (columns, rows, settings, status, extra) => {
  console.log('5555555555555', columns, rows, settings, status, extra)
  // const innerRows = cloneDeep(rows)
  const options = { yAxis, series, xAxis, tooltip, grid }
  return options
}
