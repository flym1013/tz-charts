import "echarts/lib/chart/bar";
import { histogram } from "./main";
import Core from "../../core.js";
export default Object.assign({}, Core, {
  name: "VeHistogram",
  data() {
    this.chartHandler = histogram;
    return {};
  }
});
