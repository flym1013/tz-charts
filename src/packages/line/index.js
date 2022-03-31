import "echarts/lib/chart/line";
import { line } from "./main.js";
import Core from "../../core.js";

export default Object.assign({}, Core, {
  name: "VeLine",
  data() {
    this.chartHandler = line;
    return {};
  }
});
