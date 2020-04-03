import VeBar from "../bar";
import VeLine from "../line";

const components = [VeBar, VeLine];

function install(Vue, _) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export default {
  VeBar,
  VeLine,
  install
};
