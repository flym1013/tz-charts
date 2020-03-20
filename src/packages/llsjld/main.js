// import { set, get, cloneDeep } from 'utils-lite'
// import echarts from 'echarts'
const title = {
  text: '链路数据',
  textStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(48,48,48,1)'
  },
  left: -2
}
const legend = {
  show: false
}

const series = [
  {
    name: '漏斗图',
    type: 'funnel',
    // minSize: data.value[3],
    left: '20%',
    width: '60%',
    top: 0,
    gap: 2,
    label: {
      normal: {
        show: true,
        position: 'inside',
        textStyle: {
          fontSize: 15
        },
        formatter: '{c}'
      }
    },
    labelLine: {
      show: false
    },
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 0
      }
    },
    data: [
      {
        value: 90,
        name: '首页'
      },
      {
        value: 70,
        name: '产品页'
      },
      {
        value: 50,
        name: '产品详情页'
      },
      {
        value: 10,
        name: '下单页'
      },
      {
        value: 5,
        name: '订单页'
      }
    ]
  },
  {
    name: '漏斗图',
    type: 'funnel',
    // minSize: data.value[3],
    left: '20%',
    width: '60%',
    top: 0,
    gap: 2,
    label: {
      normal: {
        show: true,
        position: 'left',
        textStyle: {
          fontSize: 15,
          color: '#D7D7D7'
        },
        formatter: '{c}'
      }
    },
    labelLine: {
      normal: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid',
          color: '#D7D7D7'
        }
      }
    },
    itemStyle: {
      normal: {
        borderColor: '#fff',
        borderWidth: 0
      }
    },
    data: [
      {
        value: 90,
        name: '首页'
      },
      {
        value: 70,
        name: '产品页'
      },
      {
        value: 50,
        name: '产品详情页'
      },
      {
        value: 10,
        name: '下单页'
      },
      {
        value: 5,
        name: '订单页'
      }
    ]
  }
]

const tooltip = {
  extraCssText: 'box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);',
  backgroundColor: '#fff',
  show: true,
  trigger: 'item',
  formatter: function (name) {
    return 5555
  }
}

const grid = {
  left: '0px',
  right: '0px',
  bottom: '10px',
  top: '20px',
  containLabel: true
}

// const option = { legend, yAxis, series, xAxis, tooltip }
export const option = (columns, rows, settings, status, extra) => {
  console.log('5555555555555', columns, rows, settings, status, extra)
  // const innerRows = cloneDeep(rows)
  const options = { title, legend, series, tooltip, grid }
  return options
}
