const rollup = require("rollup");
const vue = require("rollup-plugin-vue");
const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const eslint = require("rollup-plugin-eslint");
const cleaner = require("rollup-plugin-cleaner");
const minify = require("uglify-es").minify;
const uglify = require("rollup-plugin-uglify").uglify;
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");
const { yParser } = require("@umijs/utils");

const componentInfo = require("../src/component-list");
const { pkgTypeList, addons } = require("./config");

const args = yParser(process.argv.slice(2));

const lib = path.join(process.cwd(), "lib");

function copyFile(src, dist) {
  fs.writeFileSync(dist, fs.readFileSync(src));
}

rimraf.sync(lib);
fs.mkdirSync(lib);

let pkg = [];

pkgTypeList.forEach(({ type, min, suffix }) => {
  Object.keys(componentInfo).forEach(name => {
    const { src, dist } = componentInfo[name];
    pkg.push({ min, type, suffix, globalName: name, src, dist });
  });
});

pkg = pkg.concat(addons);

pkg.forEach(item => {
  rollupFn(item);
  // copyFile("lib/index.min.js", "docs/index.min.js");
});

async function rollupFn(item) {
  const {
    min,
    dist,
    suffix,
    src: input,
    type: format,
    globalName: name
  } = item;
  const vueSettings = min
    ? { css: "lib/style.min.css", postcss: [autoprefixer, cssnano] }
    : { css: "lib/style.css", postcss: [autoprefixer] };
  const plugins = [
    eslint(),
    vue(vueSettings),
    resolve({ extensions: [".js", ".vue"] }),
    babel({ plugins: ["external-helpers"] }),
    cleaner({
      targets: ["../lib/"]
    })
  ];
  if (min) plugins.push(uglify({}, minify));

  const distPath = dist + suffix;
  const isCommonjs = format === "cjs";
  let reg = isCommonjs
    ? /(^(echarts|numerify|utils-lite)|(\/core|\/utils|\/constants)$)/
    : /^(echarts)/;
  const external = id => reg.test(id);
  const globals = { "echarts/lib/echarts": "echarts" };

  if (args.w) {
    const watcher = rollup.watch([
      {
        input,
        external,
        plugins,
        output: [
          {
            file: distPath,
            format,
            name,
            globals
          }
        ],
        watch: { external }
      }
    ]);
    watcher.on("event", async event => {
      if (event.code === "START") {
        console.log("roolup  start bundle");
      }

      if (event.code === "BUNDLE_END") {
        console.log("roolup  BUNDLE_END bundle");
        let { code } = await event.result.generate({
          format,
          name,
          globals
        });
        if (isCommonjs) {
          code = code.replace(
            /require\(['"](..?\/)+(utils|core|constants)['"]\)/g,
            "require('./$2')"
          );
        }
        fs.writeFileSync(path.join(process.cwd(), distPath), code);
      }

      if (event.code === "ERROR") {
        console.log("roolup  ERROR bundle");
      }
    });
    process.once("SIGINT", () => {
      watcher.close();
    });
  } else {
    const bundle = await rollup.rollup({ input, external, plugins });
    let { code } = await bundle.generate({
      format,
      name,
      globals
    });
    if (isCommonjs) {
      code = code.replace(
        /require\(['"](..?\/)+(utils|core|constants)['"]\)/g,
        "require('./$2')"
      );
    }
    fs.writeFileSync(path.join(process.cwd(), distPath), code);
  }
}
