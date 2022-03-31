import { itemPoints } from "../../constants.js";
import { getFormated, getStackMap } from "../../utils.js";
import { set, get, cloneDeep } from "utils-lite";
// default opacity of bar while dim-axis type is 'value'
const VALUE_AXIS_OPACITY = 0.5;

function getBarDimAxis(args) {
  const {
    innerRows,
    dimAxisName,
    dimension,
    axisVisible,
    dimAxisType,
    dims
  } = args;
  return dimension.map(item => ({
    type: "category",
    name: dimAxisName,
    nameLocation: "middle",
    nameGap: 22,
    data:
      dimAxisType === "value"
        ? getValueAxisData(dims)
        : innerRows.map(row => row[item]),
    axisLabel: {
      margin: 4,
      textStyle: {
        fontSize: 10,
        color: "rgba(153, 153, 153, 1)"
      },
      formatter(v) {
        return String(v);
      }
    },
    axisLine: {
      lineStyle: {
        color: "#E4E7ED"
      }
    },
    axisTick: {
      show: true,
      alignWithLabel: true
    },
    show: axisVisible
  }));
}
function getValueAxisData(dims) {
  const max = Math.max.apply(null, dims);
  const min = Math.min.apply(null, dims);
  const result = [];
  for (let i = min; i <= max; i++) {
    result.push(i);
  }
  return result;
}

function getBarMeaAxis(args) {
  const {
    meaAxisName,
    meaAxisType,
    axisVisible,
    digit,
    scale,
    min,
    max
  } = args;
  const meaAxisBase = {
    type: "value",
    axisTick: {
      show: false
    },
    show: axisVisible,
    axisLine: {
      lineStyle: {
        color: "#fff"
      }
    }
  };
  let meaAxis = [];

  for (let i = 0; i < 2; i++) {
    if (meaAxisType[i]) {
      meaAxis[i] = Object.assign({}, meaAxisBase, {
        axisLabel: {
          margin: -25,
          formatter(val) {
            return getFormated(val, meaAxisType[i], digit);
          },
          textStyle: {
            fontSize: 10,
            color: "rgba(153, 153, 153, 1)"
          }
        }
      });
    } else {
      meaAxis[i] = Object.assign({}, meaAxisBase);
    }
    meaAxis[i].name = meaAxisName[i] || "";
    meaAxis[i].scale = scale[i] || false;
    meaAxis[i].min = min[i] || null;
    meaAxis[i].max = max[i] || null;
    meaAxis[i].splitLine = {
      lineStyle: {
        type: "dashed",
        color: "#E4E7ED"
      }
    };
  }

  return meaAxis;
}

function getBarTooltip(args) {
  const { axisSite, isHistogram, meaAxisType, digit, labelMap } = args;
  let secondAxis = isHistogram ? axisSite.right || [] : axisSite.top || [];
  if (labelMap) {
    secondAxis = secondAxis.map(item => {
      return labelMap[item] === undefined ? item : labelMap[item];
    });
  }
  return {
    show: false,
    trigger: "axis",
    extraCssText: "box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);",
    backgroundColor: "#fff",
    padding: 10,
    textStyle: {
      fontSize: 12,
      color: "#57617B"
    },
    axisPointer: {
      type: "shadow",
      z: 0,
      shadowStyle: {
        color: "#E4E7ED",
        opacity: 0.3
      }
    },
    formatter(items) {
      let tpl = [];
      tpl.push(
        `<span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>${items[0].name}</span><br>`
      );
      items.forEach(item => {
        const seriesName = item.seriesName;
        const type = ~secondAxis.indexOf(seriesName)
          ? meaAxisType[1]
          : meaAxisType[0];
        tpl.push(itemPoints(item.color));
        tpl.push(
          `<span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI; line-height: 23px'>${seriesName}: </span>`
        );
        tpl.push(
          `<span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI; line-height: 23px'>${getFormated(
            item.value,
            type,
            digit
          )}</span>`
        );
        tpl.push("<br>");
      });

      return tpl.join("");
    }
  };
}

function getValueData(seriesTemp, dims) {
  const max = Math.max.apply(null, dims);
  const min = Math.min.apply(null, dims);
  const result = [];
  for (let i = min; i <= max; i++) {
    const index = dims.indexOf(i);
    if (~index) {
      result.push(seriesTemp[index]);
    } else {
      result.push(null);
    }
  }
  return result;
}

function getBarSeries(args) {
  const {
    innerRows,
    metrics,
    stack,
    axisSite,
    isHistogram,
    labelMap,
    itemStyle,
    label,
    area,
    showLine = [],
    dimAxisType,
    barGap,
    opacity,
    dims
  } = args;
  let series = [];
  const defaultBarSet = {
    barMaxWidth: "24",
    barMinWidth: "4"
    // showBackground: true
    // backgroundStyle: {
    //   color: "#003EC4"
    // },
    // itemStyle: {
    //   color: "rgba(112, 157, 255, 1)"
    // }
  };
  const defaultLineSet = {
    symbol: "circle",
    symbolSize: 5,
    showSymbol: true,
    animation: true,
    yAxisIndex: 1,
    barGap: "15",
    lineStyle: {
      normal: {
        width: 2
      }
    },
    itemStyle: {
      // color: "#45D08B",
      normal: {
        // color: "#45D08B",
        // borderColor: "#45D08B",
        borderWidth: 5
      }
    },
    emphasis: {
      itemStyle: {
        borderWidth: 5
      }
    }
  };
  const seriesTemp = {};
  const secondAxis = isHistogram ? axisSite.right || [] : axisSite.top || [];
  const secondDimAxisIndex = isHistogram ? "yAxisIndex" : "xAxisIndex";
  const stackMap = stack && getStackMap(stack);
  metrics.forEach(item => {
    seriesTemp[item] = [];
  });
  innerRows.forEach(row => {
    metrics.forEach(item => {
      seriesTemp[item].push(row[item]);
    });
  });
  series = Object.keys(seriesTemp).map((item, index) => {
    const data =
      dimAxisType === "value"
        ? getValueData(seriesTemp[item], dims)
        : seriesTemp[item];
    const seriesItem = {
      name: labelMap[item] != null ? labelMap[item] : item,
      type: ~showLine.indexOf(item) ? "line" : "bar",
      data,
      [secondDimAxisIndex]: ~secondAxis.indexOf(item) ? "1" : "0"
    };

    if (seriesItem.type === "bar") {
      Object.assign(seriesItem, defaultBarSet);
    }

    if (seriesItem.type === "line") {
      if (area) {
        defaultLineSet.areaStyle = { normal: {} };
      }
      Object.assign(seriesItem, defaultLineSet);
    }

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item];

    if (label) seriesItem.label = label;
    if (itemStyle) seriesItem.itemStyle = itemStyle;

    let itemOpacity = opacity || get(seriesItem, "itemStyle.normal.opacity");
    if (dimAxisType === "value") {
      seriesItem.barGap = barGap;
      seriesItem.barCategoryGap = "1%";
      if (itemOpacity == null) itemOpacity = VALUE_AXIS_OPACITY;
    }

    if (itemOpacity != null) {
      set(seriesItem, "itemStyle.normal.opacity", itemOpacity);
    }

    return seriesItem;
  });

  return series.length ? series : false;
}

function getLegend(args) {
  const { metrics, labelMap, legendName } = args;
  const defaultSet = {
    icon: "",
    itemWidth: 14,
    itemHeight: 5,
    itemGap: 13,
    right: 20,
    top: 20,
    textStyle: {
      fontSize: 10,
      color: "rgba(153,153,153,1)"
    }
  };
  if (!legendName && !labelMap) return { data: metrics };
  const data = labelMap
    ? metrics.map(item => (labelMap[item] == null ? item : labelMap[item]))
    : metrics;
  return {
    ...defaultSet,
    data,
    show: false,
    formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
  };
}

function getDims(rows, dimension) {
  return rows.map(row => row[dimension[0]]);
}

function getBarTitle() {
  return {
    show: false,
    textStyle: {
      fontWeight: "bold",
      fontSize: 16,
      color: "rgba(48,48,48,1)"
    },
    top: 20,
    left: 20
  };
}

function getGrid(args) {
  const grid = {
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    containLabel: true
  };

  return {
    ...grid,
    ...args
  };
}

export const mini = (columns, rows, settings, status) => {
  const innerRows = cloneDeep(rows);
  const {
    axisSite = {},
    dimension = [columns[0]],
    stack = {},
    axisVisible = false,
    digit = 2,
    dataOrder = false,
    scale = [false, false],
    min = [null, null],
    max = [null, null],
    labelMap = {},
    legendName = {},
    label,
    area,
    itemStyle,
    showLine,
    barGap = "-100%",
    opacity,
    grid
  } = settings;

  if (dataOrder) {
    const { label, order } = dataOrder;
    if (!label || !order) {
      console.warn("Need to provide name and order parameters");
    } else {
      innerRows.sort((a, b) => {
        if (order === "desc") {
          return a[label] - b[label];
        } else {
          return b[label] - a[label];
        }
      });
    }
  }

  const { tooltipVisible, legendVisible } = status;
  let metrics = columns.slice();
  if (axisSite.left && axisSite.right) {
    metrics = axisSite.left.concat(axisSite.right);
  } else if (axisSite.left && !axisSite.right) {
    metrics = axisSite.left;
  } else if (settings.metrics) {
    metrics = settings.metrics;
  } else {
    metrics.splice(columns.indexOf(dimension[0]), 1);
  }
  const meaAxisType = settings.yAxisType || ["normal", "normal"];
  const dimAxisType = settings.xAxisType || "category";
  const meaAxisName = settings.yAxisName || [];
  const dimAxisName = settings.xAxisName || "";
  const isHistogram = true;
  const dims = getDims(innerRows, dimension);

  const legend = legendVisible && getLegend({ metrics, labelMap, legendName });
  const xAxis = getBarDimAxis({
    innerRows,
    dimAxisName,
    dimension,
    axisVisible,
    dimAxisType,
    dims
  });
  const yAxis = getBarMeaAxis({
    meaAxisName,
    meaAxisType,
    axisVisible,
    digit,
    scale,
    min,
    max
  });
  const series = getBarSeries({
    innerRows,
    metrics,
    stack,
    axisSite,
    isHistogram,
    labelMap,
    itemStyle,
    label,
    area,
    showLine,
    dimAxisType,
    dimension,
    barGap,
    opacity,
    dims
  });
  const tooltipParams = { axisSite, isHistogram, meaAxisType, digit, labelMap };
  const tooltip = tooltipVisible && getBarTooltip(tooltipParams);
  const title = getBarTitle();
  const _grid = getGrid(grid);
  const options = { legend, yAxis, series, xAxis, tooltip, title, grid: _grid };
  return options;
};
