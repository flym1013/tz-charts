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
      margin: 8,
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

function getLeftData(min, max, splitNumber) {
  // 最高位向上取整
  if (max > 1) {
    let strMax = (max + "").split(".")[0];
    let firstC = parseInt(strMax.substring(0, 1)) + 1;
    for (let i = 0; i < strMax.substring(1, strMax.length).length; i++) {
      firstC = firstC + "0";
    }
    max = parseInt(firstC);
  } else {
    // 小于1的情况暂时不处理直接为1
    max = 1;
  }
  // 控制分割条数，
  const distance = parseFloat(((max - min) / splitNumber).toString(), 10);
  return {
    max,
    min,
    interval: distance
  };
}

function getBarMeaAxis(args) {
  const {
    meaAxisName,
    meaAxisType,
    axisVisible,
    digit,
    scale,
    min,
    max,
    emin,
    emax,
    splitNumber,
    axisSite
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
          margin: 4,
          textStyle: {
            fontSize: 10,
            color: "rgba(153, 153, 153, 1)"
          },
          formatter(val) {
            return getFormated(val, meaAxisType[i], digit);
          }
        }
      });
    } else {
      meaAxis[i] = Object.assign({}, meaAxisBase, {
        axisLabel: {
          margin: 4,
          textStyle: {
            fontSize: 10,
            color: "rgba(153, 153, 153, 1)"
          }
        }
      });
    }
    meaAxis[i].name = meaAxisName[i] || "";
    meaAxis[i].scale = scale[i] || false;
    if (axisSite.right) {
      meaAxis[i].min = emin[i] || null;
      meaAxis[i].max = getLeftData(emin[i], emax[i], splitNumber).max;
      meaAxis[i].interval = getLeftData(emin[i], emax[i], splitNumber).interval;
    } else {
      meaAxis[i].min = min[i] || null;
      meaAxis[i].max = max[i] || null;
    }
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
    showLine = [],
    dimAxisType,
    barGap,
    opacity,
    dims
  } = args;
  let series = [];
  const defaultBarSet = {
    barMaxWidth: "24",
    barMinWidth: "8"
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
    symbolSize: 3,
    showSymbol: true,
    animation: true,
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
        borderWidth: 3
      }
    },
    emphasis: {
      itemStyle: {
        borderWidth: 3
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

export const histogram = (columns, rows, settings, status) => {
  const innerRows = cloneDeep(rows);
  const {
    axisSite = {},
    dimension = [columns[0]],
    stack = {},
    axisVisible = true,
    digit = 2,
    dataOrder = false,
    scale = [false, false],
    min = [null, null],
    max = [null, null],
    labelMap = {},
    legendName = {},
    label,
    itemStyle,
    showLine,
    barGap = "-100%",
    opacity,
    splitNumber = 5,
    grid
  } = settings;

  function getMaxByKey(list, key) {
    let max = 0;
    list.forEach(item => {
      if (max < item[key]) {
        max = item[key];
      }
    });
    return max;
  }
  // 计算Y轴坐标最大最小值  左右两边分别计算
  let leftKeyList = columns.concat();
  leftKeyList.splice(0, 1); // 第一个X轴数据不需要
  let rightKeyList = [];
  if (axisSite.right) {
    // 存在右坐标
    for (const key in axisSite.right) {
      let item = axisSite.right[key];
      leftKeyList.splice(leftKeyList.indexOf(item), 1);
      rightKeyList.push(item);
    }
  }

  let max1 = 0;
  leftKeyList.forEach(item => {
    let max = getMaxByKey(rows, item);
    if (max1 < max) {
      max1 = max;
    }
  });

  let max2 = 0;
  rightKeyList.forEach(item => {
    let max = getMaxByKey(rows, item);
    if (max2 < max) {
      max2 = max;
    }
  });

  let min1 = 0;
  let min2 = 0;

  let emax = [0, 0];
  if (!max[0] || !max[1]) {
    emax[0] = max1;
    emax[1] = max2;
  }
  let emin = [0, 0];
  if (!min[0] || !min[1]) {
    emin[0] = min1;
    emin[1] = min2;
  }

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
    max,
    emin,
    emax,
    splitNumber,
    axisSite
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
    showLine,
    dimAxisType,
    dimension,
    barGap,
    opacity,
    dims
  });
  const tooltipParams = {
    axisSite,
    isHistogram,
    meaAxisType,
    digit,
    labelMap,
    innerRows
  };
  const tooltip = tooltipVisible && getBarTooltip(tooltipParams);
  const title = getBarTitle();
  const _grid = getGrid(grid);
  const options = { legend, yAxis, series, xAxis, tooltip, title, grid: _grid };
  return options;
};
