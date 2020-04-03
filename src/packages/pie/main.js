import {
  // itemPoint,
  DEFAULT_COLORS,
  DEFAULT_COLORS_10,
  DEFAULT_COLORS_20
} from "../../constants.js";
import { getFormated, setArrayValue } from "../../utils.js";
import { cloneDeep } from "utils-lite";

const pieRadius = 100;
const ringRadius = [70, 100];
const roseRingRadius = [20, 100];
const pieOffsetY = 200;

function getPieSeries(args) {
  const {
    innerRows,
    dataType,
    percentShow,
    dimension,
    metrics,
    radius,
    offsetY,
    selectedMode,
    hoverAnimation,
    digit,
    roseType,
    label,
    level,
    limitShowNum,
    isRing,
    labelLine,
    itemStyle,
    downPie
  } = args;
  let series = [];
  let levelTemp = {};
  let rowsTemp = [];
  if (level) {
    level.forEach((levelItems, index) => {
      levelItems.forEach(item => {
        setArrayValue(levelTemp, item, index);
      });
    });
    innerRows.forEach(row => {
      const itemLevel = levelTemp[row[dimension]];
      if (itemLevel && itemLevel.length) {
        itemLevel.forEach(levelItem => {
          setArrayValue(rowsTemp, levelItem, row);
        });
      }
    });
  } else {
    rowsTemp.push(innerRows);
  }
  let seriesBase = {
    type: "pie",
    selectedMode,
    hoverAnimation,
    roseType,
    center: ["50%", offsetY]
  };
  let rowsTempLength = rowsTemp.length;
  rowsTemp.forEach((dataRows, index) => {
    let seriesItem = Object.assign({ data: [] }, seriesBase);
    const centerWidth = radius / rowsTempLength;
    if (!index) {
      seriesItem.radius = isRing ? radius : centerWidth;
    } else {
      const outerWidth =
        centerWidth + (radius / (2 * rowsTempLength)) * (2 * index - 1);
      const innerWidth = outerWidth + radius / (2 * rowsTempLength);
      seriesItem.radius = [outerWidth - 5, innerWidth];
    }
    if (rowsTempLength > 1 && index === 0) {
      seriesItem.label = {
        normal: { position: "inner" }
      };
    }
    if (label) seriesItem.label = label;
    if (labelLine) seriesItem.labelLine = labelLine;
    if (itemStyle) seriesItem.itemStyle = itemStyle;
    if (percentShow) {
      seriesItem.label = {
        normal: {
          show: true,
          position: rowsTempLength > 1 && index === 0 ? "inner" : "outside",
          formatter(item) {
            let tpl = [];
            tpl.push(`${item.name}:`);
            tpl.push(getFormated(item.value, dataType, digit));
            tpl.push(`(${item.percent}%)`);
            return tpl.join(" ");
          }
        }
      };
    }
    seriesItem.data = dataRows.map(row => ({
      name: row[dimension],
      value: row[metrics]
    }));
    series.push(seriesItem);
  });
  if (limitShowNum && limitShowNum < series[0].data.length) {
    const firstData = series[0].data;
    const remainArr = firstData.slice(limitShowNum, firstData.length);
    let sum = 0;
    remainArr.forEach(item => {
      sum += item.value;
    });
    series[0].data = firstData.slice(0, limitShowNum);
    series[0].data.push({ name: "其他", value: sum });
  }
  if (series.length) {
    const borderSeries = {
      type: "pie",
      radius: [
        series[series.length - 1].radius[1] - 8,
        series[series.length - 1].radius[1]
      ],
      center: series[series.length - 1].center,
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      labelLine: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      animation: false,
      tooltip: {
        show: false
      },
      itemStyle: {
        normal: {
          color: "rgba(250,250,250,0.5)"
        }
      },
      data: [
        {
          value: 1
        }
      ]
    };
    if (downPie) {
      series.push(borderSeries);
    }
  }
  return series;
}

function getPieLegend(args) {
  const {
    innerRows,
    dimension,
    legendLimit,
    legendName,
    level,
    limitShowNum
  } = args;
  let legend = [];
  const levelTemp = [];
  const defaultSet = {
    icon: "circle",
    orient: "horizontal",
    x: "center",
    bottom: 20,
    itemWidth: 6,
    itemHeight: 6
  };
  if (level) {
    level.forEach(levelItem => {
      levelItem.forEach(item => {
        levelTemp.push(item);
      });
    });
    legend = levelTemp;
  } else if (limitShowNum && limitShowNum < innerRows.length) {
    for (let i = 0; i < limitShowNum; i++) {
      legend.push(innerRows[i][dimension]);
    }
    legend.push("其他");
  } else {
    legend = innerRows.map(row => row[dimension]);
  }
  if (legend.length) {
    return {
      ...defaultSet,
      data: legend,
      show: legend.length < legendLimit,
      formatter(name) {
        return legendName[name] != null ? legendName[name] : name;
      }
    };
  } else {
    return false;
  }
}

function getPieTooltip(args) {
  const { dataType, innerRows, limitShowNum, digit, metrics, dimension } = args;
  // eslint-disable-next-line no-unused-vars
  let sum = 0;
  const remainArr = innerRows
    .map(row => {
      sum += row[metrics];
      return {
        name: row[dimension],
        value: row[metrics]
      };
    })
    .slice(limitShowNum, innerRows.length);
  return {
    extraCssText: "box-shadow:0px 4px 10px 0px rgba(0,52,113,0.1);",
    backgroundColor: "#fff",
    show: true,
    trigger: "item",
    padding: 10,
    formatter(item) {
      let tpl = [];
      // tpl.push(itemPoint(item.color));
      tpl.push(
        `<span style="display:inline-block;border-radius:4px;width:6px;height:6px;background-color:${item.color}"></span>`
      );
      if (limitShowNum && item.name === "其他") {
        tpl.push(`<span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI;
        '>其他:</span>`);
        remainArr.forEach(({ name, value }) => {
          // const percent = getFormated(value / sum, "percent");
          // tpl.push(`<br>${name}:`);
          // tpl.push(getFormated(value, dataType, digit));
          // tpl.push(`(${percent})`);
          tpl.push(`<br/><span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI;padding-left: 10px;
          '>${getFormated(item.value, dataType, digit)}</span>`);
        });
      } else {
        // tpl.push(`${item.name}:`);
        tpl.push(
          `<span style='font-size:12px;color:rgba(153,153,153,1);font-family:MicrosoftYaHeiUI;'>${item.name}</span>`
        );
        // tpl.push(getFormated(item.value, dataType, digit));
        tpl.push(`<br/><span style='font-size:12px;color:rgba(48,48,48,1);font-family:MicrosoftYaHeiUI;padding-left: 10px;
        '>${getFormated(item.value, dataType, digit)}</span>`);
        // tpl.push(`(${item.percent}%)`);
      }
      return tpl.join(" ");
    }
  };
}

function getColor(length) {
  if (length <= 6) {
    return DEFAULT_COLORS;
  } else if (length > 6 && length <= 10) {
    return DEFAULT_COLORS_10;
  } else if (length > 10 && length <= 20) {
    return DEFAULT_COLORS_20;
  } else {
    return DEFAULT_COLORS_20;
  }
}

function getPieTitle() {
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

export const pie = (columns, rows, settings, extra, isRing) => {
  const innerRows = cloneDeep(rows);
  const color = getColor(rows.length);
  const {
    dataType = "normal",
    percentShow,
    dimension = columns[0],
    metrics = columns[1],
    roseType = false,
    radius = isRing ? (roseType ? roseRingRadius : ringRadius) : pieRadius,
    offsetY = pieOffsetY,
    legendLimit = 30,
    selectedMode = false,
    hoverAnimation = true,
    digit = 2,
    legendName = {},
    label = false,
    level = false,
    limitShowNum = 0,
    labelLine,
    itemStyle,
    downPie = false
  } = settings;
  const { tooltipVisible, legendVisible } = extra;
  if (limitShowNum) innerRows.sort((a, b) => b[metrics] - a[metrics]);
  const seriesParams = {
    innerRows,
    dataType,
    percentShow,
    dimension,
    metrics,
    radius,
    offsetY,
    selectedMode,
    hoverAnimation,
    digit,
    roseType,
    label,
    level,
    legendName,
    limitShowNum,
    isRing,
    labelLine,
    itemStyle,
    downPie
  };
  const series = getPieSeries(seriesParams);
  const legendParams = {
    innerRows,
    dimension,
    legendLimit,
    legendName,
    level,
    limitShowNum
  };
  const legend = legendVisible && getPieLegend(legendParams);
  const tooltip =
    tooltipVisible &&
    getPieTooltip({
      dataType,
      innerRows,
      limitShowNum,
      digit,
      metrics,
      dimension
    });
  const title = getPieTitle();
  const options = { series, legend, tooltip, color, title };
  return options;
};

export const ring = (columns, rows, settings, extra) => {
  return pie(columns, rows, settings, extra, true);
};
