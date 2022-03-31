import { getFormated, getStackMap } from "../../utils.js";
import { isArray } from "utils-lite";
import {
  DEFAULT_COLORS,
  DEFAULT_COLORS_10,
  DEFAULT_COLORS_20
} from "../../constants.js";

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
          color: color
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
      dataTemp[item].push([row[dimension[0]], value, row]);
    });
  });
  metrics.forEach(item => {
    let seriesItem = {
      name: labelMap[item] != null ? labelMap[item] : item,
      realName: item,
      type: "line",
      data: dataTemp[item]
    };

    if (area) {
      seriesItem.areaStyle = {
        // 自定义
        normal: {}
      };
    }

    seriesItem.yAxisIndex = 0;

    if (axisSite.right) {
      seriesItem.yAxisIndex =
        axisSite.right.indexOf(seriesItem.realName) >= 0 ? 1 : 0;
    }

    if (stack && stackMap[item]) seriesItem.stack = stackMap[item];
    let index = metrics.indexOf(item);
    if (label) seriesItem.label = label;
    if (itemStyleList[index]) seriesItem.itemStyle = itemStyleList[index];
    if (lineStyle) seriesItem.lineStyle = lineStyle;
    if (areaStyle) seriesItem.areaStyle = areaStyle;
    seriesItem.smooth = false;
    seriesItem.symbol = "circle";
    seriesItem.symbolSize = 6;
    seriesItem.showSymbol = true;
    seriesItem.barGap = "15";
    series.push(seriesItem);
  });
  return series;
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

function getLineYAxis(args) {
  const {
    yAxisName,
    yAxisType,
    axisVisible,
    scale,
    emin,
    emax,
    min,
    max,
    splitNumber,
    axisSite,
    digit
  } = args;

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
    if (axisSite.right) {
      yAxis[i].min = emin[i] || null;
      yAxis[i].max = getLeftData(emin[i], emax[i], splitNumber).max;
      yAxis[i].interval = getLeftData(emin[i], emax[i], splitNumber).interval;
    } else {
      yAxis[i].min = min[i] || null;
      yAxis[i].max = max[i] || null;
    }

    // 自定义
    yAxis[i].splitLine = {
      lineStyle: {
        type: "dashed",
        color: "#E4E7ED"
      }
    };
    if (i === 1) {
      yAxis[i].position = "right";
    }
  }
  return yAxis;
}

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

function getLineTooltip(args) {
  const {
    axisSite,
    yAxisType,
    digit,
    labelMap,
    tooltipFormatter,
    tooltipMap
  } = args;
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
      items.forEach(({ seriesName, data, color }) => {
        let showData = null;
        const type = ~rightList.indexOf(seriesName)
          ? yAxisType[1]
          : yAxisType[0];
        const itemData = isArray(data) ? data[1] : data;
        showData = getFormated(itemData, type, digit);
        let marker = `<span style="display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;background-color:${color};"></span>`;
        tpl.push(marker);
        tpl.push(`${seriesName}: ${showData}`);
        tpl.push("<br>");
      });
      if (Object.keys(tooltipMap).length) {
        Object.keys(tooltipMap).forEach(val => {
          let marker = `<span style="display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;background-color:${items[0].color};"></span>`;
          tpl.push(marker);
          tpl.push(
            `${tooltipMap[val] || val}: ${items[0].data[2][val] || "-"}`
          );
          tpl.push("<br>");
        });
      }
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
    grid,
    splitNumber = 5,
    tooltipMap = []
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
      tooltipFormatter,
      tooltipMap
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
    emin,
    emax,
    min,
    max,
    splitNumber,
    axisSite,
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

  // 标题
  const title = {
    textStyle: {
      fontSize: 16,
      fontWeight: 500
    },
    padding: [
      20, // 上
      20, // 右
      20, // 下
      20 // 左
    ]
  };
  const _grid = getGrid(grid);
  let options = { title, legend, xAxis, series, yAxis, tooltip, grid: _grid };
  return options;
};
