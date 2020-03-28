// eslint-disable-next-line import/no-duplicates
import VeLine from "./packages/line";
// eslint-disable-next-line import/no-duplicates
import TzLine from "./packages/line";
import TzBar from "./packages/bar";
import TzPie from "./packages/pie";
import TzRing from "./packages/ring";
import TzHistogram from "./packages/histogram";

const components = [VeLine, TzBar, TzLine];

function install(Vue, _) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

export { VeLine, TzLine, TzBar, TzPie, TzRing, TzHistogram, install };
