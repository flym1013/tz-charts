import VeBar from "./packages/bar";
import VeLine from "./packages/line";
const components = [VeBar, VeLine];

function install(Vue, _) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

export { VeBar, VeLine, install };
