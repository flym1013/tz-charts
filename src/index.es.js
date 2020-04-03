import VeBar from "./packages/bar";
import VeLine from "./packages/line";
import VeHistogram from "./packages/histogram";
import VeFunnel from "./packages/funnel";
import VePie from "./packages/pie";
import VeMini from "./packages/mini";
const components = [VeBar, VeLine, VeHistogram, VeFunnel, VePie, VeMini];

function install(Vue, _) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

export { VeBar, VeLine, VeHistogram, VeFunnel, VePie, VeMini, install };
