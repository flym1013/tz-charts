# 开始使用

### 完整引入

---

```js
// main.js
import Vue from "vue";
import VCharts from "v-charts";
import App from "./App.vue";

Vue.use(VCharts);

new Vue({
  el: "#app",
  render: h => h(App)
});
```

### 按需引入

---

v-charts 的每种图表组件，都已经单独打包到 lib 文件夹下了

```
|- lib/
    |- line.common.js  -------------- 折线图
    |- bar.common.js  --------------- 条形图
    |- histogram.common.js  --------- 柱状图
    |- pie.common.js  --------------- 饼图
    |- ring.common.js  -------------- 环图
    |- funnel.common.js  ------------ 漏斗图
```

使用时，可以直接将单个图表引入到项目中

```js
import Vue from "vue";
import VeLine from "v-charts/lib/line.common";
import App from "./App.vue";

Vue.component(VeLine.name, VeLine);

new Vue({
  el: "#app",
  render: h => h(App)
});
```
