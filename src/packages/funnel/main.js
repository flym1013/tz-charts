// import { itemPoint } from "../../constants";
import { getFormated } from "../../utils";

function getFunnelTooltip(dataType, digit) {
  return {
    extraCssText: "box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);",
    backgroundColor: "#fff",
    show: true,
    trigger: "item",
    padding: 10,
    formatter(item) {
      let tpl = [];
      // tpl.push(itemPoint(item.color))
      tpl.push(
        `<span style="display:inline-block;margin-right:5px;border-radius:4px;width:6px;height:6px;background-color:${item.color}"></span>`
      );
      tpl.push(
        `<span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>${item.name}</span>`
      );
      tpl.push(`<br/><span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI;padding-left: 10px;
      '>${getFormated(item.value, dataType, digit)}</span>`);
      // tpl.push(
      //   `${item.name}: ${getFormated(item.data.realValue, dataType, digit)}`
      // );
      return tpl.join("");
    }
  };
}

function getFunnelLegend(args) {
  const { data, legendName } = args;
  const defaultSet = {
    icon: "circle",
    orient: "horizontal",
    x: "center",
    bottom: 20,
    itemWidth: 6,
    itemHeight: 6
  };
  return {
    ...defaultSet,
    data,
    formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

function getFunnelSeries(args) {
  const {
    dimension,
    metrics,
    rows,
    sequence,
    ascending,
    label,
    labelLine,
    itemStyle,
    filterZero,
    useDefaultOrder
  } = args;
  let series = {
    type: "funnel",
    width: "70%",
    gap: 0,
    minSize: "8%",
    itemStyle: {
      normal: {
        borderColor: "#fff",
        borderWidth: 0
      }
    }
  };
  let innerRows = rows.sort((a, b) => {
    return sequence.indexOf(a[dimension]) - sequence.indexOf(b[dimension]);
  });

  if (filterZero) {
    innerRows = innerRows.filter(row => {
      return row[metrics];
    });
  }

  let falseFunnel = false;
  innerRows.some((row, index) => {
    if (index && row[metrics] > innerRows[index - 1][metrics]) {
      falseFunnel = true;
      return true;
    }
  });

  const step = 100 / innerRows.length;

  if (falseFunnel && !useDefaultOrder) {
    series.data = innerRows
      .slice()
      .reverse()
      .map((row, index) => ({
        name: row[dimension],
        value: (index + 1) * step,
        realValue: row[metrics]
      }));
  } else {
    series.data = innerRows.map(row => ({
      name: row[dimension],
      value: row[metrics],
      realValue: row[metrics]
    }));
  }

  if (ascending) series.sort = "ascending";
  if (label) series.label = label;
  if (labelLine) series.labelLine = labelLine;
  if (itemStyle) series.itemStyle = itemStyle;
  return series;
}

function getGrid(args) {
  const grid = {
    left: 20,
    right: 20,
    bottom: 20,
    top: 60,
    containLabel: true
  };

  return {
    ...grid,
    ...args
  };
}

function getFunnelTitle() {
  return {
    textStyle: {
      fontWeight: "bold",
      fontSize: 16,
      color: "rgba(48,48,48,1)"
    },
    top: 20,
    left: 20
  };
}

export const funnel = (outerColumns, outerRows, settings, extra) => {
  const columns = outerColumns.slice();
  const rows = outerRows.slice();
  const {
    dataType = "normal",
    dimension = columns[0],
    sequence = rows.map(row => row[dimension]),
    digit = 2,
    ascending,
    label,
    labelLine,
    legendName = {},
    itemStyle,
    filterZero,
    useDefaultOrder,
    grid
  } = settings;
  const { tooltipVisible, legendVisible } = extra;
  let metrics;
  if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    let metricsTemp = columns.slice();
    metricsTemp.splice(columns.indexOf(dimension), 1);
    metrics = metricsTemp[0];
  }

  const tooltip = tooltipVisible && getFunnelTooltip(dataType, digit);
  const legend =
    legendVisible && getFunnelLegend({ data: sequence, legendName });
  const series = getFunnelSeries({
    dimension,
    metrics,
    rows,
    sequence,
    ascending,
    label,
    labelLine,
    itemStyle,
    filterZero,
    useDefaultOrder
  });
  const _grid = getGrid(grid);
  const title = getFunnelTitle();
  const options = { title, tooltip, legend, series, grid: _grid };
  return options;
};
