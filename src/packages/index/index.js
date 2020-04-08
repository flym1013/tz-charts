import VeBar from "../bar";
import VeLine from "../line";
import VeHistogram from "../histogram";
import VeFunnel from "../funnel";
import VePie from "../pie";
import VeMini from "../mini";

const components = [VeBar, VeLine, VeHistogram, VeFunnel, VePie, VeMini];

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
  VeHistogram,
  VeFunnel,
  VePie,
  VeMini,
  install
};
