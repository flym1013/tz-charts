import "echarts/lib/chart/funnel";
import { funnel } from "./main";
import Core from "../../core.js";
export default Object.assign({}, Core, {
  name: "VeFunnel",
  data() {
    this.chartHandler = funnel;
    return {};
  }
});
