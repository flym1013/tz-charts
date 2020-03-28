export const DEFAULT_THEME = {
  categoryAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false }
  },
  valueAxis: {
    axisLine: { show: false }
  },
  line: {
    smooth: true
  },
  grid: {
    containLabel: true,
    left: 10,
    right: 10
  }
};

// 默认颜色  小于等于6使用
export const DEFAULT_COLORS = [
  "#709DFF",
  "#47CF88",
  "#FED723",
  "#FF6265",
  "#8C7EF9",
  "#687B9B"
];

// 默认颜色  大于6小于等于10使用
export const DEFAULT_COLORS_10 = [
  "#719CFF",
  "#28D1D1",
  "#51E7C2",
  "#45D08A",
  "#FED725",
  "#FF9C59",
  "#FF6165",
  "#9F95FD",
  "#3B7FFE",
  "#667B9F"
];

// 默认颜色  大于10小于等于20使用
export const DEFAULT_COLORS_20 = [
  "#7CA7FF",
  "#CADCFE",
  "#2CD7D4",
  "#BAF6E9",
  "#A2EFEE",
  "#5BE9C7",
  "#4ED696",
  "#B4EFD5",
  "#FEDC2A",
  "#FEF1A1",
  "#FF9C5A",
  "#FEE0C5",
  "#FF6262",
  "#8A7FFC",
  "#A095FC",
  "#3B7FFF",
  "#AFCFFF",
  "#687B9D",
  "#B3BDCE"
];

export const HEAT_MAP_COLOR = [
  "#313695",
  "#4575b4",
  "#74add1",
  "#abd9e9",
  "#e0f3f8",
  "#ffffbf",
  "#fee090",
  "#fdae61",
  "#f46d43",
  "#d73027",
  "#a50026"
];

export const HEAT_BMAP_COLOR = ["blue", "blue", "green", "yellow", "red"];

export const itemPoint = color => {
  return [
    '<span style="',
    `background-color:${color};`,
    "display: inline-block;",
    "width: 10px;",
    "height: 10px;",
    "border-radius: 50%;",
    "margin-right:2px;",
    '"></span>'
  ].join("");
};

export const STATIC_PROPS = [
  "initOptions",
  "loading",
  "dataEmpty",
  "judgeWidth",
  "widthChangeDelay"
];

export const ECHARTS_SETTINGS = [
  "grid",
  "dataZoom",
  "visualMap",
  "toolbox",
  "title",
  "legend",
  "xAxis",
  "yAxis",
  "radar",
  "tooltip",
  "axisPointer",
  "brush",
  "geo",
  "timeline",
  "graphic",
  "series",
  "backgroundColor",
  "textStyle"
];
