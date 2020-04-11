import { itemPoints } from "../../constants.js";
import { getFormated } from "../../utils";

function getFunnelTooltip(dataType, digit, tooltipMap) {
  return {
    extraCssText: "box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);",
    backgroundColor: "#fff",
    show: true,
    trigger: "item",
    padding: 10,
    formatter(item) {
      let tpl = [];
      // tpl.push(itemPoint(item.color))
      if (Object.keys(tooltipMap).length) {
        tpl.push(itemPoints(item.color));
        tpl.push(
          `<span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>${item.name}</span>`
        );
        Object.keys(tooltipMap).forEach(val => {
          tpl.push("<br>");
          tpl.push(`<span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI;padding-left: 10px;
          '>${tooltipMap[val] || val}:${item.data.data[val]}</span>`);
        });
      } else {
        tpl.push(
          `<span style="display:inline-block;margin-right:5px;border-radius:4px;width:6px;height:6px;background-color:${item.color}"></span>`
        );
        tpl.push(
          `<span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>${item.name}</span>`
        );
        tpl.push(`<span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI;padding-left: 5px;
        '>${getFormated(item.value, dataType, digit)}</span>`);
        // tpl.push(
        //   `${item.name}: ${getFormated(item.data.realValue, dataType, digit)}`
        // );
      }
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
    },
    labelLine: {
      normal: {
        // length: 20,
        lineStyle: {
          width: 1,
          type: "solid",
          color: "#E4E7ED",
          fontSize: 12
        }
      }
    },
    label: {
      normal: {
        show: true,
        position: "left",
        textStyle: {
          fontSize: 12,
          color: "#999999"
        }
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
        realValue: row[metrics],
        data: row
      }));
  } else {
    series.data = innerRows.map(row => ({
      name: row[dimension],
      value: row[metrics],
      realValue: row[metrics],
      data: row
    }));
  }

  if (ascending) series.sort = "ascending";
  if (label) series.label = label;
  if (labelLine) series.labelLine = labelLine;
  if (itemStyle) series.itemStyle = itemStyle;
  let copySeries = Object.assign({}, series, {
    labelLine: {
      show: false
    },
    label: {
      normal: {
        show: true,
        position: "inside",
        textStyle: {
          fontSize: 12
        },
        formatter: function(param) {
          return param.value;
        }
      }
    }
  });
  // console.log("1234", series, copySeries);
  return [series, copySeries];
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
    tooltipMap = [],
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

  const tooltip =
    tooltipVisible && getFunnelTooltip(dataType, digit, tooltipMap);
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
