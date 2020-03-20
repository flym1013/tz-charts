// import { set, get, cloneDeep } from 'utils-lite'
// import echarts from 'echarts'
const title = {
  text: '成交周期',
  textStyle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'rgba(48,48,48,1)'
  },
  left: 0
}
const legend = {
  icon: 'circle',
  orient: 'horizontal',
  x: 'center',
  bottom: '0%',
  itemWidth: 6,
  itemHeight: 6,
  // 超过4个字显示省略号
  formatter: function (name) {
    return name.length > 4 ? name.substr(0, 3) + '...' : name
  }
}

const series = [
  {
    itemStyle: {
      // 图形样式
    },
    color: [
      'rgba(33, 198, 195, 1)',
      'rgba(75, 217, 186, 1)',
      'rgba(39, 213, 116, 1)',
      'rgba(254, 215, 38, 1)',
      'rgba(243, 161, 106, 1)',
      'rgba(138, 127, 252, 1)',
      'rgba(112, 157, 255, 1)'
    ],
    type: 'pie',
    radius: ['29%', '59%'],
    center: ['50%', '50%'],
    stillShowZeroSum: true,
    label: {
      normal: {
        position: 'inner',
        show: false,
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      }
    },
    labelLine: {
      normal: {
        show: false
      }
    },
    data: [
      {
        value: 17,
        name: '体育技能'
      },
      { value: 23, name: '体育行为' },
      { value: 27, name: '体质健康' },
      { value: 33, name: '体育意识' },
      { value: 9, name: '体育知识' }
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
