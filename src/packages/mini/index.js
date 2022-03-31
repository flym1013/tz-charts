import "echarts/lib/chart/bar";
import { mini } from "./main";
import Core from "../../core.js";
export default Object.assign({}, Core, {
  name: "VeMini",
  data() {
    this.chartHandler = mini;
    return {};
  }
});
