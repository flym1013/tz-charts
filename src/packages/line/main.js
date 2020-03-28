import { getFormated, getStackMap } from "../../utils.js";
import { isArray } from "utils-lite";
import {
  DEFAULT_COLORS,
  DEFAULT_COLORS_10,
  DEFAULT_COLORS_20
} from "../../constants.js";

function getLineXAxis(args) {
  const { dimension, rows, xAxisName, axisVisible, xAxisType } = args;
  return dimension.map((item, index) => ({
    type: xAxisType,
    nameLocation: "middle",
    nameGap: 22,
    name: xAxisName[index] || "",
    axisTick: {
      show: true,
      alignWithLabel: true,
      lineStyle: { color: "#E4E7ED" }
    },
    data: rows.map(row => row[item]),
    show: axisVisible,
    // 自定义
    axisLabel: {
      margin: 10,
      textStyle: {
        fontSize: 10,
        color: "rgba(153, 153, 153, 1)"
      }
    },
    axisLine: {
      lineStyle: {
        color: "#E4E7ED"
      }
    }
  }));
}

// 获取线的颜色
function getColor(list, index) {
  if (list.length <= 6) {
    return DEFAULT_COLORS[index];
  } else if (list.length > 6 && list.length <= 10) {
    return DEFAULT_COLORS_10[index];
  } else if (list.length > 10 && list.length <= 20) {
    return DEFAULT_COLORS_20[index];
  } else {
    return DEFAULT_COLORS_20[0];
  }
}

function getLineSeries(args) {
  const {
    rows,
    axisSite,
    metrics,
    area,
    stack,
    nullAddZero,
    labelMap,
    label,
    itemStyle,
    lineStyle = {
      normal: {
        width: 2,
        type: "solid"
      }
    },
    areaStyle,
    dimension
  } = args;
  let series = [];
  const dataTemp = {};
  const stackMap = stack && getStackMap(stack);

  // 构造 itemStyle 数据
  let itemStyleList = [];
  if (itemStyle && itemStyle.length === metrics.length) {
    // 用户设置样式
    itemStyleList = itemStyle;
  } else {
    // 默认线条样式
    metrics.forEach(item => {
      let index = metrics.indexOf(item);

      let color = getColor(metrics, index);

      let colorItem = {
        normal: {
          color: color,
          borderColor: color,
          borderWidth: 3
        }
      };

      itemStyleList.push(colorItem);
    });
  }

  metrics.forEach(item => {
    dataTemp[item] = [];
  });
  rows.forEach(row => {
    metrics.forEach(item => {
      let value = null;
      if (row[item] != null) {
        value = row[item];
      } else if (nullAddZero) {
        value = 0;
      }
      dataTemp[item].push([row[dimension[0]], value]);
    });
  });
  metrics.forEach(item => {
    let seriesItem = {
      name: labelMap[item] != null ? labelMap[item] : item,
      type: "line",
      data: dataTemp[item]
    };

    if (area) {
      seriesItem.areaStyle = {
        // 自定义
        normal: {
          // eslint-disable-next-line no-undef
          // new echarts.graphic.LinearGradient(
          //   0,
          //   0,
          //   0,
          //   1,
          //   [
          //     {
          //       offset: 0,
          //       color: "rgba(255, 205, 47, 0.2)"
          //     },
          //     {
          //       offset: 1,
          //       color: "rgba(255, 205, 47, 0)"
          //     }
          //   ],
          //   false
          // )

          color: "rgba(255, 205, 47, 0.1)",
          shadowColor: "rgba(255, 205, 47, 0.1)",
          shadowBlur: 10
        }
      };
    }
    if (axisSite.right) {
      seriesItem.yAxisIndex = ~axisSite.right.indexOf(item) ? 1 : 0;
    }

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item];
    let index = metrics.indexOf(item);
    if (label) seriesItem.label = label;
    if (itemStyleList[index]) seriesItem.itemStyle = itemStyleList[index];
    if (lineStyle) seriesItem.lineStyle = lineStyle;
    if (areaStyle) seriesItem.areaStyle = areaStyle;
    seriesItem.smooth = false;
    seriesItem.symbol = "circle";
    seriesItem.symbolSize = 1;
    seriesItem.showSymbol = true;
    seriesItem.yAxisIndex = 1;
    seriesItem.barGap = "15";
    series.push(seriesItem);
  });
  return series;
}

function getLineYAxis(args) {
  const { yAxisName, yAxisType, axisVisible, scale, min, max, digit } = args;
  const yAxisBase = {
    type: "value",
    axisTick: {
      show: false
    },
    show: axisVisible,
    // 自定义
    axisLine: {
      lineStyle: {
        color: "#fff"
      }
    },
    position: "left"
  };
  let yAxis = [];
  for (let i = 0; i < 2; i++) {
    if (yAxisType[i]) {
      yAxis[i] = Object.assign({}, yAxisBase, {
        axisLabel: {
          formatter(val) {
            return getFormated(val, yAxisType[i], digit);
          },
          textStyle: {
            fontSize: 10,
            color: "rgba(153, 153, 153, 1)"
          }
        }
      });
    } else {
      yAxis[i] = Object.assign({}, yAxisBase);
    }
    yAxis[i].name = yAxisName[i] || "";
    yAxis[i].scale = scale[i] || false;
    yAxis[i].min = min[i] || null;
    yAxis[i].max = max[i] || null;
    // 自定义
    yAxis[i].splitLine = {
      lineStyle: {
        type: "dashed",
        color: "#E4E7ED"
      }
    };
  }
  return yAxis;
}

function getLineTooltip(args) {
  const { axisSite, yAxisType, digit, labelMap, tooltipFormatter } = args;
  const rightItems = axisSite.right || [];
  const rightList = labelMap
    ? rightItems.map(item => {
        return labelMap[item] === undefined ? item : labelMap[item];
      })
    : rightItems;
  return {
    trigger: "axis",
    // 自定义
    extraCssText: "box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);",
    backgroundColor: "#fff",
    textStyle: {
      fontSize: 12,
      color: "#57617B"
    },
    axisPointer: {
      type: "line",
      lineStyle: {
        color: "#E4E7ED",
        width: 1,
        type: "dashed"
      }
    },
    formatter(items) {
      if (tooltipFormatter) {
        return tooltipFormatter.apply(null, arguments);
      }
      let tpl = [];
      const { name, axisValueLabel } = items[0];
      const title = name || axisValueLabel;
      tpl.push(`${title}<br>`);
      items.forEach(({ seriesName, data, marker }) => {
        let showData = null;
        const type = ~rightList.indexOf(seriesName)
          ? yAxisType[1]
          : yAxisType[0];
        const itemData = isArray(data) ? data[1] : data;
        showData = getFormated(itemData, type, digit);
        tpl.push(marker);
        tpl.push(`${seriesName}: ${showData}`);
        tpl.push("<br>");
      });
      return tpl.join("");
    }
  };
}

function getLegend(args) {
  const legend = {
    top: 18,
    right: 20
  };
  const legendFontStyle = {
    fontSize: 10,
    color: "#999999"
  };

  const { metrics, legendName, labelMap } = args;
  if (!legendName && !labelMap) return { data: metrics };
  const data = labelMap
    ? metrics.map(item => (labelMap[item] == null ? item : labelMap[item]))
    : metrics;
  return {
    itemWidth: 15,
    itemHeight: 8,
    itemGap: 14,
    ...legend,
    data,
    textStyle: legendFontStyle,
    formatter(name) {
      return legendName[name] != null ? legendName[name] : name;
    }
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

export const line = (columns, rows, settings, extra) => {
  rows = isArray(rows) ? rows : [];
  columns = isArray(columns) ? columns : [];
  const {
    axisSite = {},
    yAxisType = ["normal", "normal"],
    xAxisType = "category",
    yAxisName = [],
    dimension = [columns[0]],
    xAxisName = [],
    axisVisible = true,
    area,
    stack,
    scale = [false, false],
    min = [null, null],
    max = [null, null],
    nullAddZero = false,
    digit = 2,
    legendName = {},
    labelMap = {},
    label,
    itemStyle,
    lineStyle,
    areaStyle,
    grid
  } = settings;
  const { tooltipVisible, legendVisible, tooltipFormatter } = extra;
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

  const legend = legendVisible && getLegend({ metrics, legendName, labelMap });
  const tooltip =
    tooltipVisible &&
    getLineTooltip({
      axisSite,
      yAxisType,
      digit,
      labelMap,
      xAxisType,
      tooltipFormatter
    });
  const xAxis = getLineXAxis({
    dimension,
    rows,
    xAxisName,
    axisVisible,
    xAxisType
  });
  const yAxis = getLineYAxis({
    yAxisName,
    yAxisType,
    axisVisible,
    scale,
    min,
    max,
    digit
  });
  const series = getLineSeries({
    rows,
    axisSite,
    metrics,
    area,
    stack,
    nullAddZero,
    labelMap,
    label,
    itemStyle,
    lineStyle,
    areaStyle,
    xAxisType,
    dimension
  });

  // 标题样式
  const title = {
    textStyle: {
      fontSize: 16,
      fontWeight: 500
    },
    padding: [
      20, // 上
      10, // 右
      5, // 下
      20 // 左
    ],
    left: 10,
    top: 10,
    show: true
  };
  const _grid = getGrid(grid);
  let options = { title, legend, xAxis, series, yAxis, tooltip, grid: _grid };
  return options;
};
