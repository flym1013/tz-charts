# 饼图

#### settings 配置项

| 配置项         | 简介                                  | 类型    | 备注                                                                                                |
| -------------- | ------------------------------------- | ------- | --------------------------------------------------------------------------------------------------- |
| dimension      | 维度                                  | string  | 默认 columns 第一项为维度                                                                           |
| metrics        | 指标                                  | string  | 默认 columns 第二项为指标                                                                           |
| dataType       | 数据类型                              | string  | 可选值: KMB, normal, percent                                                                        |
| legendLimit    | legend 显示数量限制                   | number  | legend 数量过多会导致饼图样式错误，限制 legend 最大值并且当超过此值时，隐藏 legend 可以解决这个问题 |
| selectedMode   | 选中模式                              | string  | 可选值：single, multiple，默认为 false                                                              |
| hoverAnimation | 是否开启 hover 在扇区上的放大动画效果 | boolean | 默认值为 true                                                                                       |
| radius         | 饼图半径                              | number  | -                                                                                                   |
| offsetY        | 纵向偏移量                            | number  | -                                                                                                   |
| digit          | 设置数据类型为 percent 时保留的位数   | number  | 默认为 2                                                                                            |
| roseType       | 显示为南丁格尔玫瑰图                  | string  | 默认不展示为南丁格尔玫瑰图，可设置为`'radius', 'area'`                                              |
| label          | 饼图图形上的文本标签                  | object  | 内容参考[文档](http://echarts.baidu.com/option.html#series-pie.label)                               |
| labelLine      | 标签的视觉引导线样式                  | object  | 内容参考[文档](http://echarts.baidu.com/option.html#series-pie.labelLine)                           |
| itemStyle      | 图形样式                              | object  | 内容参考[文档](http://echarts.baidu.com/option.html#series-pie.itemStyle)                           |
| level          | 多圆饼图时设置                        | array   | -                                                                                                   |
| limitShowNum   | 设置超过此数字时使用‘其他’代替        | number  | 此时数据会按照由大到小顺序显示                                                                      |
| tooltipMap     | 自定义悬浮提示的字段                  | object  | -                                                                                                   |

> 备注 1. level 的值接受二维数组，例如：`[['a', 'b'], ['c', 'd']]`, 表示的含义是内层展示的是维度中的`'a', 'b'`的指标加在一起组成的饼图，外层为`'c', 'd'`的指标加在一起组成的环图。

#### 示例

<vuep template="#simple-pie"></vuep>

<script v-pre type="text/x-template" id="simple-pie">
<template>
  <ve-pie :data="chartData"></ve-pie>
</template>

<script>
  export default {
    data () {
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 隐藏 label

<vuep template="#simple-label-pie"></vuep>

<script v-pre type="text/x-template" id="simple-label-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 自定义 label

<vuep template="#simple-set-pie"></vuep>

<script v-pre type="text/x-template" id="simple-set-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        label: {
          formatter: "{b} : {c} ({d}%)"
        }
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 自定义主题

<vuep template="#simple-theme-pie"></vuep>

<script v-pre type="text/x-template" id="simple-theme-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings" :theme="chartTheme"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        label: {
          show: false
        },
        labelLine: {
          show: false
        }
      }
      this.chartTheme = {
        color: ['#FEC9C8', '#FEE0C5', '#B4EFD5', '#CADCFE', '#FF9C5A', '#BAF6E9']
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 自定义悬浮显示字段

<vuep template="#simple-tooltip-pie"></vuep>

<script v-pre type="text/x-template" id="simple-tooltip-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
   tooltipMap: { user: "我的用户", user1: "我的用户1" }
      }
      return {
        chartData: {
          columns: ['日期', 'user', 'user1'],
          rows: [
            { '日期': '1/1', 'user': 1393, 'user1': 3792 },
            { '日期': '1/2', 'user': 3530, 'user1': 3530 },
            { '日期': '1/3', 'user': 2923, 'user1': 1723 },
            { '日期': '1/4', 'user': 1723, 'user1': 1393 },
            { '日期': '1/5', 'user': 3792, 'user1': 4593 },
            { '日期': '1/6', 'user': 4593, 'user1': 1393 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 基础环形

<vuep template="#simple-circular-pie"></vuep>

<script v-pre type="text/x-template" id="simple-circular-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        level: [[], ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6"]]
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 基础下钻环形

<vuep template="#simple-down-pie"></vuep>

<script v-pre type="text/x-template" id="simple-down-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        level: [[], ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6"]],
        downPie: true
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 设置指标维度

<vuep template="#index-demision"></vuep>

<script v-pre type="text/x-template" id="index-demision">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        dimension: '日期',
        metrics: '访问用户'
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 玫瑰图

<vuep template="#rose-pie"></vuep>

<script v-pre type="text/x-template" id="rose-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        roseType: 'radius'
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 限制显示条数饼图

<vuep template="#limited-number"></vuep>

<script v-pre type="text/x-template" id="limited-number">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        limitShowNum: 5
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 多圆饼图

<vuep template="#mutiple-pie"></vuep>

<script v-pre type="text/x-template" id="mutiple-pie">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        level: [
          ['1/1', '1/2', '1/3'],
          ['1/4', '1/5']
        ]
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 设置数据类型

<vuep template="#data-type"></vuep>

<script v-pre type="text/x-template" id="data-type">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        dataType: 'percent'
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>

#### 设置饼图半径边距

<vuep template="#pie-style"></vuep>

<script v-pre type="text/x-template" id="pie-style">
<template>
  <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
</template>

<script>
  export default {
    data () {
      this.chartSettings = {
        radius: 10,
        offsetY: 300
      }
      return {
        chartData: {
          columns: ['日期', '访问用户'],
          rows: [
            { '日期': '1/1', '访问用户': 1393 },
            { '日期': '1/2', '访问用户': 3530 },
            { '日期': '1/3', '访问用户': 2923 },
            { '日期': '1/4', '访问用户': 1723 },
            { '日期': '1/5', '访问用户': 3792 },
            { '日期': '1/6', '访问用户': 4593 }
          ]
        }
      }
    }
  }
</script>
</script>
