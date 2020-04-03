<template>
  <div class="page-item-test">
    <!-- <ve-line
      :settings="chartSettings"
      :data="performanceTrendscharts"
      :log="true"
    ></ve-line> -->
    <div class="chart-item" v-for="(d, i) in chartData" :key="i">
      <div class="chart-part">
        <component
          :is="`ve-${innerType}`"
          :data="d.data"
          :title="{ text: d.name }"
          :log="true"
        >
        </component>
      </div>
      <div class="code-view">
        <p>数据格式</p>
        <div class="data-code">
          <code-section :content="d.data" json></code-section>
        </div>
        <p>配置项</p>
        <div class="setting-code">
          <code-section :content="d.settings" json></code-section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import VeBar from "../../src/packages/bar";
// import { VeLine } from "../../src/index.es";
import { VeLine } from "../../src/index.es.js";
// import VeLine from "../../src/packages/line";
// import VeHistogram from "../../src/packages/histogram";
// import VePie from "../../src/packages/pie";
// import VeRing from "../../src/packages/ring";

// import VeWaterfall from '../../src/packages/waterfall'
// import VeFunnel from '../../src/packages/funnel'
// import VeRadar from '../../src/packages/radar'
// import VeChart from '../../src/packages/chart'
// import VeMap from '../../src/packages/map'
// import VeSankey from '../../src/packages/sankey'
// import VeHeatmap from '../../src/packages/heatmap'
// import VeScatter from '../../src/packages/scatter'
// import VeCandle from '../../src/packages/candle'
// import VeGauge from '../../src/packages/gauge'
// import VeTree from '../../src/packages/tree'
// import VeLiquidfill from '../../src/packages/liquidfill'
// import VeWordcloud from '../../src/packages/wordcloud'

import CHART_DATA from "../data";

export default {
  name: "Item",

  data() {
    return {
      title: { text: "表格测试" },
      series: [{ itemStyle: { normal: { color: "#00ffff" } } }],
      performanceTrendscharts: [],
      chartData: [],
      type: null,
      innerType: null,
      chartSettings: {
        axisSite: {
          right: ["数据2"]
        },
        yAxisType: ["KMB", "percent"]
      }
    };
  },

  methods: {
    init() {
      this.type = this.$route.params.type;
      this.chartData = CHART_DATA[this.type].data;
      this.innerType = CHART_DATA[this.type].type;
    }
  },

  created() {
    this.init();

    this.performanceTrendscharts = {
      columns: ["日期", "访问", "下单", "数据1", "数据2"],
      rows: [
        { 日期: "1/1", 访问: 1393, 下单: 1093, 数据1: 3233, 数据2: 0.32 },
        { 日期: "1/2", 访问: 3530, 下单: 3230, 数据1: 1233, 数据2: 0.32 },
        { 日期: "1/3", 访问: 2923, 下单: 2623, 数据1: 3233, 数据2: 0.32 },
        { 日期: "1/4", 访问: 1723, 下单: 1423, 数据1: 2233, 数据2: 0.32 },
        { 日期: "1/5", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/6", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/7", 访问: 4593, 下单: 4293, 数据1: 233, 数据2: 0.32 },
        { 日期: "1/8", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.92 },
        { 日期: "1/9", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/10", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/11", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/12", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.62 },
        { 日期: "1/13", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/14", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/15", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.32 },
        { 日期: "1/16", 访问: 3792, 下单: 3492, 数据1: 4233, 数据2: 0.12 }
      ]
    };
  },

  watch: {
    $route() {
      this.init();
    }
  },

  components: {
    // VeBar,
    VeLine
    // VeHistogram,
    // VePie,
    // VeRing
    // VeWaterfall,
    // VeFunnel,
    // VeRadar,
    // VeChart,
    // VeMap,
    // VeSankey,
    // VeHeatmap,
    // VeScatter,
    // VeCandle,
    // VeGauge,
    // VeTree,
    // VeLiquidfill,
    // VeWordcloud
  }
};
</script>

<style lang="less">
.page-item-test {
  h3,
  p {
    margin: 0;
  }

  pre {
    height: 150px;
  }

  .chart-item {
    display: flex;
    padding: 15px;

    .chart-part {
      flex: 1;
    }

    .code-view {
      width: 400px;
      margin-left: 20px;
    }
  }
}
</style>
