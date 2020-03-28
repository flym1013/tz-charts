import VeBar from "./packages/bar";
import VeLine from "./packages/line";
import YjroiChart from "./packages/yjroi";

const components = [VeBar, VeLine, YjroiChart];

function install(Vue, _) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

export { VeBar, VeLine, YjroiChart, install };
