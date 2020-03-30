import "echarts/lib/chart/pie";
import { pie } from "./main.js";
import Core from "../../core.js";
export default Object.assign({}, Core, {
  name: "VePie",
  data() {
    this.chartHandler = pie;
    return {};
  }
});
