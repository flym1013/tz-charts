# MINI 图

#### settings 配置项

| 配置项     | 简介                                   | 类型            | 备注                                                                                                              |
| ---------- | -------------------------------------- | --------------- | ----------------------------------------------------------------------------------------------------------------- |
| dimension  | 维度                                   | array           | 默认 columns 第一项为维度                                                                                         |
| metrics    | 指标                                   | array           | 默认 columns 第二项起为指标                                                                                       |
| yAxisType  | 左右坐标轴数据类型                     | array           | 可选值: KMB, normal, percent                                                                                      |
| yAxisName  | 左右坐标轴标题                         | array           | -                                                                                                                 |
| axisSite   | 指标所在的轴                           | object          | 默认不在 right 轴的指标都在 left 轴                                                                               |
| stack      | 堆叠选项                               | object          | -                                                                                                                 |
| digit      | 设置数据类型为 percent 时保留的位数    | number          | 默认为 2                                                                                                          |
| dataOrder  | 设置数据排序方式                       | boolean, object | 默认为 false                                                                                                      |
| scale      | 是否是脱离 0 值比例                    | array           | 默认为[false, false]，表示左右<br>两个轴都不会脱离 0 值比例。<br>设置成 true 后坐标刻度不会<br>强制包含零刻度<br> |
| min        | 左右坐标轴最小值                       | array           | -                                                                                                                 |
| max        | 左右坐标轴最大值                       | array           | -                                                                                                                 |
| labelMap   | 设置指标的别名，同时作用于提示框和图例 | object          | -                                                                                                                 |
| legendName | 设置图表上方图例的别名                 | object          | -                                                                                                                 |
| label      | 设置图形上的文本标签                   | object          | 内容参考[文档](http://echarts.baidu.com/option.html#series-bar.label)                                             |
| itemStyle  | 图形样式                               | object          | 内容参考[文档](http://echarts.baidu.com/option.html#series-bar.itemStyle)                                         |
| showLine   | 展示为折线图的指标                     | array           | -                                                                                                                 |
| xAxisType  | 横轴的类型                             | string          | 可选值'category'，'value'，默认为'category'                                                                       |
| opacity    | 透明度                                 | number          | -                                                                                                                 |

> 备注 1. axisSite 可以设置 left 和 right，例如示例所示 `axisSite: { right: ['占比'] }` 即将占比的数据置于右轴上。

> 备注 2. stack 用于将两数据堆叠起来，例如实例中所示`stack: { '销售额': ['销售额-1季度', '销售额-2季度'] }` 即将'销售额-1 季度', '销售额-2 季度'相应的数据堆叠在一起。

> 备注 3. dataOrder 用于设置数据的排序方式，用于更加清晰的展示数据的升降。例如： `{ label: '余额', order: 'asc }` 表示数据按照余额指标升序展示，降序为`desc`。

> 备注 4. min 和 max 的值可以直接设置为数字，例如：`[100, 300]`；也可以设置为`['dataMin', 'dataMin']`, `['dataMax', 'dataMax']`，此时表示使用该坐标轴上的最小值或最大值为最小或最大刻度。

> 备注 5. 有时我们需要将折线图与柱状图展示在同一个图上，利用 showLine 属性可以设置需要展示为折线图的指标，其他的指标则使用柱状图展示。

> 备注 6. 为了优化连续的数值型横轴显示多指标的时候样式，在此情况下默认设置 opacity 为 0.5。

#### 示例

<vuep template="#simple-mini-chart"></vuep>

<script v-pre type="text/x-template" id="simple-mini-chart">
<template>
  <ve-mini :data="chartData" height='200px'></ve-mini>
</template>

<script>
  export default {
    data () {
      return {
        chartData: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 1232, 年龄: 10 },
          { 日期: "1-2", 余额: 1223, 年龄: 6 },
          { 日期: "1-3", 余额: 2123, 年龄: 9 },
          { 日期: "1-4", 余额: 4123, 年龄: 12 },
          { 日期: "1-5", 余额: 3123, 年龄: 15 },
          { 日期: "1-6", 余额: 123, 年龄: 3 },
          { 日期: "1-7", 余额: 1223, 年龄: 6 },
          { 日期: "1-8", 余额: 2123, 年龄: 9 },
          { 日期: "1-9", 余额: 4123, 年龄: 12 },
          { 日期: "1-10", 余额: 3123, 年龄: 15 },
          { 日期: "1-11", 余额: 123, 年龄: 3 },
          { 日期: "1-12", 余额: 1223, 年龄: 6 },
          { 日期: "1-13", 余额: 2123, 年龄: 9 },
          { 日期: "1-14", 余额: 4123, 年龄: 12 },
          { 日期: "1-15", 余额: 3123, 年龄: 15 },
          { 日期: "1-16", 余额: 123, 年龄: 3 },
          { 日期: "1-17", 余额: 1223, 年龄: 6 },
          { 日期: "1-18", 余额: 2123, 年龄: 9 },
          { 日期: "1-19", 余额: 4123, 年龄: 12 },
          { 日期: "1-20", 余额: 3123, 年龄: 15 },
          { 日期: "1-21", 余额: 7123, 年龄: 20 },
          { 日期: "1-22", 余额: 1223, 年龄: 6 },
          { 日期: "1-23", 余额: 2123, 年龄: 9 },
          { 日期: "1-24", 余额: 4123, 年龄: 12 },
          { 日期: "1-25", 余额: 3123, 年龄: 15 },
          { 日期: "1-26", 余额: 123, 年龄: 3 },
          { 日期: "1-27", 余额: 1223, 年龄: 6 },
          { 日期: "1-28", 余额: 2123, 年龄: 9 },
          { 日期: "1-29", 余额: 4123, 年龄: 12 },
          { 日期: "1-30", 余额: 3123, 年龄: 15 }
        ]
        }
      }
    }
  }
</script>
</script>

#### 折线 MINI 图

<vuep template="#simple-mini-line-chart"></vuep>

<script v-pre type="text/x-template" id="simple-mini-line-chart">
<template>
  <ve-mini :data="chartData" :settings="chartSettings" height='200px'></ve-mini>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        title: { text: "折线MINI图" },
        showLine: ["余额"]
      }
      return {
        chartData: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 1232, 年龄: 10 },
          { 日期: "1-2", 余额: 1223, 年龄: 6 },
          { 日期: "1-3", 余额: 2123, 年龄: 9 },
          { 日期: "1-4", 余额: 4123, 年龄: 12 },
          { 日期: "1-5", 余额: 3123, 年龄: 15 },
          { 日期: "1-6", 余额: 123, 年龄: 3 },
          { 日期: "1-7", 余额: 1223, 年龄: 6 },
          { 日期: "1-8", 余额: 2123, 年龄: 9 },
          { 日期: "1-9", 余额: 4123, 年龄: 12 },
          { 日期: "1-10", 余额: 3123, 年龄: 15 },
          { 日期: "1-11", 余额: 123, 年龄: 3 },
          { 日期: "1-12", 余额: 1223, 年龄: 6 },
          { 日期: "1-13", 余额: 2123, 年龄: 9 },
          { 日期: "1-14", 余额: 4123, 年龄: 12 },
          { 日期: "1-15", 余额: 3123, 年龄: 15 },
          { 日期: "1-16", 余额: 123, 年龄: 3 },
          { 日期: "1-17", 余额: 1223, 年龄: 6 },
          { 日期: "1-18", 余额: 2123, 年龄: 9 },
          { 日期: "1-19", 余额: 4123, 年龄: 12 },
          { 日期: "1-20", 余额: 3123, 年龄: 15 },
          { 日期: "1-21", 余额: 7123, 年龄: 20 },
          { 日期: "1-22", 余额: 1223, 年龄: 6 },
          { 日期: "1-23", 余额: 2123, 年龄: 9 },
          { 日期: "1-24", 余额: 4123, 年龄: 12 },
          { 日期: "1-25", 余额: 3123, 年龄: 15 },
          { 日期: "1-26", 余额: 123, 年龄: 3 },
          { 日期: "1-27", 余额: 1223, 年龄: 6 },
          { 日期: "1-28", 余额: 2123, 年龄: 9 },
          { 日期: "1-29", 余额: 4123, 年龄: 12 },
          { 日期: "1-30", 余额: 3123, 年龄: 15 }
        ]
        }
      }
    }
  }
</script>
</script>

#### 折线 MINI 面积图

<vuep template="#simple-mini-area-chart"></vuep>

<script v-pre type="text/x-template" id="simple-mini-area-chart">
<template>
  <ve-mini :data="chartData" :settings="chartSettings" height='200px'></ve-mini>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        title: { text: "折线MINI面积图" },
        showLine: ["余额"],
        area: true
      }
      return {
        chartData: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 1232, 年龄: 10 },
          { 日期: "1-2", 余额: 1223, 年龄: 6 },
          { 日期: "1-3", 余额: 2123, 年龄: 9 },
          { 日期: "1-4", 余额: 4123, 年龄: 12 },
          { 日期: "1-5", 余额: 3123, 年龄: 15 },
          { 日期: "1-6", 余额: 123, 年龄: 3 },
          { 日期: "1-7", 余额: 1223, 年龄: 6 },
          { 日期: "1-8", 余额: 2123, 年龄: 9 },
          { 日期: "1-9", 余额: 4123, 年龄: 12 },
          { 日期: "1-10", 余额: 3123, 年龄: 15 },
          { 日期: "1-11", 余额: 123, 年龄: 3 },
          { 日期: "1-12", 余额: 1223, 年龄: 6 },
          { 日期: "1-13", 余额: 2123, 年龄: 9 },
          { 日期: "1-14", 余额: 4123, 年龄: 12 },
          { 日期: "1-15", 余额: 3123, 年龄: 15 },
          { 日期: "1-16", 余额: 123, 年龄: 3 },
          { 日期: "1-17", 余额: 1223, 年龄: 6 },
          { 日期: "1-18", 余额: 2123, 年龄: 9 },
          { 日期: "1-19", 余额: 4123, 年龄: 12 },
          { 日期: "1-20", 余额: 3123, 年龄: 15 },
          { 日期: "1-21", 余额: 7123, 年龄: 20 },
          { 日期: "1-22", 余额: 1223, 年龄: 6 },
          { 日期: "1-23", 余额: 2123, 年龄: 9 },
          { 日期: "1-24", 余额: 4123, 年龄: 12 },
          { 日期: "1-25", 余额: 3123, 年龄: 15 },
          { 日期: "1-26", 余额: 123, 年龄: 3 },
          { 日期: "1-27", 余额: 1223, 年龄: 6 },
          { 日期: "1-28", 余额: 2123, 年龄: 9 },
          { 日期: "1-29", 余额: 4123, 年龄: 12 },
          { 日期: "1-30", 余额: 3123, 年龄: 15 }
        ]
        }
      }
    }
  }
</script>
</script>
