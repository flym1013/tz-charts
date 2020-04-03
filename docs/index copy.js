(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('echarts/lib/echarts'), require('echarts/lib/component/tooltip'), require('echarts/lib/component/legend'), require('echarts/lib/chart/bar'), require('echarts'), require('echarts/lib/chart/line')) :
  typeof define === 'function' && define.amd ? define(['echarts/lib/echarts', 'echarts/lib/component/tooltip', 'echarts/lib/component/legend', 'echarts/lib/chart/bar', 'echarts', 'echarts/lib/chart/line'], factory) :
  (global.VeIndex = factory(global.echarts,null,null,null,null));
}(this, (function (echartsLib,tooltip,legend,bar,echarts) { 'use strict';

  echartsLib = echartsLib && echartsLib.hasOwnProperty('default') ? echartsLib['default'] : echartsLib;
  echarts = echarts && echarts.hasOwnProperty('default') ? echarts['default'] : echarts;

  var DEFAULT_THEME = {
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
  var DEFAULT_COLORS = ["#709DFF", "#47CF88", "#FED723", "#FF6265", "#8C7EF9", "#687B9B"];

  // 默认颜色  大于6小于等于10使用
  var DEFAULT_COLORS_10 = ["#719CFF", "#28D1D1", "#51E7C2", "#45D08A", "#FED725", "#FF9C59", "#FF6165", "#9F95FD", "#3B7FFE", "#667B9F"];

  // 默认颜色  大于10小于等于20使用
  var DEFAULT_COLORS_20 = ["#7CA7FF", "#CADCFE", "#2CD7D4", "#BAF6E9", "#A2EFEE", "#5BE9C7", "#4ED696", "#B4EFD5", "#FEDC2A", "#FEF1A1", "#FF9C5A", "#FEE0C5", "#FF6262", "#8A7FFC", "#A095FC", "#3B7FFF", "#AFCFFF", "#687B9D", "#B3BDCE"];

  var itemPoint = function itemPoint(color) {
    return ['<span style="', "background-color:" + color + ";", "display: inline-block;", "width: 10px;", "height: 10px;", "border-radius: 50%;", "margin-right:2px;", '"></span>'].join("");
  };

  var STATIC_PROPS = ["initOptions", "loading", "dataEmpty", "judgeWidth", "widthChangeDelay"];

  var ECHARTS_SETTINGS = ["grid", "dataZoom", "visualMap", "toolbox", "title", "legend", "xAxis", "yAxis", "radar", "tooltip", "axisPointer", "brush", "geo", "timeline", "graphic", "series", "backgroundColor", "textStyle"];

  var ABBR = {
    th: 3,
    mi: 6,
    bi: 9,
    tr: 12
  };

  var DEFAULT_OPTIONS = {
    zeroFormat: null,
    nullFormat: null,
    defaultFormat: '0,0',
    scalePercentBy100: true,
    abbrLabel: {
      th: 'k',
      mi: 'm',
      bi: 'b',
      tr: 't'
    }
  };

  var TRILLION = 1e12;
  var BILLION = 1e9;
  var MILLION = 1e6;
  var THOUSAND = 1e3;

  function numIsNaN(value) {
    return typeof value === 'number' && isNaN(value);
  }

  function toFixed(value, maxDecimals, roundingFunction, optionals) {
    var splitValue = value.toString().split('.');
    var minDecimals = maxDecimals - (optionals || 0);
    var boundedPrecision = splitValue.length === 2 ? Math.min(Math.max(splitValue[1].length, minDecimals), maxDecimals) : minDecimals;
    var power = Math.pow(10, boundedPrecision);
    var output = (roundingFunction(value + 'e+' + boundedPrecision) / power).toFixed(boundedPrecision);

    if (optionals > maxDecimals - boundedPrecision) {
      var optionalsRegExp = new RegExp('\\.?0{1,' + (optionals - (maxDecimals - boundedPrecision)) + '}$');
      output = output.replace(optionalsRegExp, '');
    }

    return output;
  }

  function numberToFormat(options, value, format, roundingFunction) {
    var abs = Math.abs(value);
    var negP = false;
    var optDec = false;
    var abbr = '';
    var decimal = '';
    var neg = false;
    var abbrForce = void 0;
    var signed = void 0;
    format = format || '';

    value = value || 0;

    if (~format.indexOf('(')) {
      negP = true;
      format = format.replace(/[(|)]/g, '');
    } else if (~format.indexOf('+') || ~format.indexOf('-')) {
      signed = ~format.indexOf('+') ? format.indexOf('+') : value < 0 ? format.indexOf('-') : -1;
      format = format.replace(/[+|-]/g, '');
    }
    if (~format.indexOf('a')) {
      abbrForce = format.match(/a(k|m|b|t)?/);

      abbrForce = abbrForce ? abbrForce[1] : false;

      if (~format.indexOf(' a')) abbr = ' ';
      format = format.replace(new RegExp(abbr + 'a[kmbt]?'), '');

      if (abs >= TRILLION && !abbrForce || abbrForce === 't') {
        abbr += options.abbrLabel.tr;
        value = value / TRILLION;
      } else if (abs < TRILLION && abs >= BILLION && !abbrForce || abbrForce === 'b') {
        abbr += options.abbrLabel.bi;
        value = value / BILLION;
      } else if (abs < BILLION && abs >= MILLION && !abbrForce || abbrForce === 'm') {
        abbr += options.abbrLabel.mi;
        value = value / MILLION;
      } else if (abs < MILLION && abs >= THOUSAND && !abbrForce || abbrForce === 'k') {
        abbr += options.abbrLabel.th;
        value = value / THOUSAND;
      }
    }
    if (~format.indexOf('[.]')) {
      optDec = true;
      format = format.replace('[.]', '.');
    }
    var int = value.toString().split('.')[0];
    var precision = format.split('.')[1];
    var thousands = format.indexOf(',');
    var leadingCount = (format.split('.')[0].split(',')[0].match(/0/g) || []).length;

    if (precision) {
      if (~precision.indexOf('[')) {
        precision = precision.replace(']', '');
        precision = precision.split('[');
        decimal = toFixed(value, precision[0].length + precision[1].length, roundingFunction, precision[1].length);
      } else {
        decimal = toFixed(value, precision.length, roundingFunction);
      }

      int = decimal.split('.')[0];
      decimal = ~decimal.indexOf('.') ? '.' + decimal.split('.')[1] : '';
      if (optDec && +decimal.slice(1) === 0) decimal = '';
    } else {
      int = toFixed(value, 0, roundingFunction);
    }
    if (abbr && !abbrForce && +int >= 1000 && abbr !== ABBR.trillion) {
      int = '' + +int / 1000;
      abbr = ABBR.million;
    }
    if (~int.indexOf('-')) {
      int = int.slice(1);
      neg = true;
    }
    if (int.length < leadingCount) {
      for (var i = leadingCount - int.length; i > 0; i--) {
        int = '0' + int;
      }
    }

    if (thousands > -1) {
      int = int.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',');
    }

    if (!format.indexOf('.')) int = '';

    var output = int + decimal + (abbr || '');

    if (negP) {
      output = (negP && neg ? '(' : '') + output + (negP && neg ? ')' : '');
    } else {
      if (signed >= 0) {
        output = signed === 0 ? (neg ? '-' : '+') + output : output + (neg ? '-' : '+');
      } else if (neg) {
        output = '-' + output;
      }
    }

    return output;
  }

  function extend(target, sub) {
    Object.keys(sub).forEach(function (key) {
      target[key] = sub[key];
    });
  }

  var numerifyPercent = {
    regexp: /%/,
    format: function format(value, formatType, roundingFunction, numerify) {
      var space = ~formatType.indexOf(' %') ? ' ' : '';
      var output = void 0;

      if (numerify.options.scalePercentBy100) value = value * 100;

      formatType = formatType.replace(/\s?%/, '');

      output = numerify._numberToFormat(value, formatType, roundingFunction);

      if (~output.indexOf(')')) {
        output = output.split('');
        output.splice(-1, 0, space + '%');
        output = output.join('');
      } else {
        output = output + space + '%';
      }

      return output;
    }
  };

  var options = {};
  var formats = {};

  extend(options, DEFAULT_OPTIONS);

  function format(value, formatType, roundingFunction) {
    formatType = formatType || options.defaultFormat;
    roundingFunction = roundingFunction || Math.round;
    var output = void 0;
    var formatFunction = void 0;

    if (value === 0 && options.zeroFormat !== null) {
      output = options.zeroFormat;
    } else if (value === null && options.nullFormat !== null) {
      output = options.nullFormat;
    } else {
      for (var kind in formats) {
        if (formats[kind] && formatType.match(formats[kind].regexp)) {
          formatFunction = formats[kind].format;
          break;
        }
      }
      formatFunction = formatFunction || numberToFormat.bind(null, options);
      output = formatFunction(value, formatType, roundingFunction, numerify);
    }

    return output;
  }

  function numerify(input, formatType, roundingFunction) {
    var value = void 0;

    if (input === 0 || typeof input === 'undefined') {
      value = 0;
    } else if (input === null || numIsNaN(input)) {
      value = null;
    } else if (typeof input === 'string') {
      if (options.zeroFormat && input === options.zeroFormat) {
        value = 0;
      } else if (options.nullFormat && input === options.nullFormat || !input.replace(/[^0-9]+/g, '').length) {
        value = null;
      } else {
        value = +input;
      }
    } else {
      value = +input || null;
    }

    return format(value, formatType, roundingFunction);
  }

  numerify.options = options;
  numerify._numberToFormat = numberToFormat.bind(null, options);
  numerify.register = function (name, format) {
    formats[name] = format;
  };
  numerify.unregister = function (name) {
    formats[name] = null;
  };
  numerify.setOptions = function (opts) {
    extend(options, opts);
  };
  numerify.reset = function () {
    extend(options, DEFAULT_OPTIONS);
  };

  numerify.register('percentage', numerifyPercent);

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var defineProperty = function (obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  };

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  function debounce(fn, delay) {
    var timer = null;
    return function () {
      var self = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(self, args);
      }, delay);
    };
  }

  function set$1(target, path, value) {
    if (!path) return;
    var targetTemp = target;
    var pathArr = path.split('.');
    pathArr.forEach(function (item, index) {
      if (index === pathArr.length - 1) {
        targetTemp[item] = value;
      } else {
        if (!targetTemp[item]) targetTemp[item] = {};
        targetTemp = targetTemp[item];
      }
    });
  }

  function get$1(target, path, defaultValue) {
    if (!path) return target;
    var pathArr = path.split('.');
    var targetTemp = target;
    pathArr.some(function (item, index) {
      if (targetTemp[item] === undefined) {
        targetTemp = defaultValue;
        return true;
      } else {
        targetTemp = targetTemp[item];
      }
    });
    return targetTemp;
  }

  var _typeof$1 = typeof Symbol === "function" && _typeof(Symbol.iterator) === "symbol" ? function (obj) {
    return typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  };

  function getType(v) {
    return Object.prototype.toString.call(v);
  }

  function getTypeof(v) {
    return typeof v === 'undefined' ? 'undefined' : _typeof$1(v);
  }

  function isObject(v) {
    return getType(v) === '[object Object]';
  }

  function isArray(v) {
    return getType(v) === '[object Array]';
  }

  function isFunction(v) {
    return getType(v) === '[object Function]';
  }

  function cloneDeep(v) {
    return JSON.parse(JSON.stringify(v));
  }

  function camelToKebab(s) {
    return s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  function hasOwn(source, target) {
    return Object.prototype.hasOwnProperty.call(source, target);
  }

  function isEqual(alice, bob) {
    if (alice === bob) return true;
    if (alice === null || bob === null || getTypeof(alice) !== 'object' || getTypeof(bob) !== 'object') {
      return alice === bob;
    }

    for (var key in alice) {
      if (!hasOwn(alice, key)) continue;
      var aliceValue = alice[key];
      var bobValue = bob[key];
      var aliceType = getTypeof(aliceValue);

      if (getTypeof(bobValue) === 'undefined') {
        return false;
      } else if (aliceType === 'object') {
        if (!isEqual(aliceValue, bobValue)) return false;
      } else if (aliceValue !== bobValue) {
        return false;
      }
    }
    for (var _key in bob) {
      if (!hasOwn(bob, _key)) continue;
      if (getTypeof(alice)[_key] === 'undefined') return false;
    }

    return true;
  }

  var getFormated = function getFormated(val, type, digit) {
    var defaultVal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '-';

    if (isNaN(val)) return defaultVal;
    if (!type) return val;
    if (isFunction(type)) return type(val, numerify);

    digit = isNaN(digit) ? 0 : ++digit;
    var digitStr = '.[' + new Array(digit).join(0) + ']';
    var formatter = type;
    switch (type) {
      case 'KMB':
        formatter = digit ? '0,0' + digitStr + 'a' : '0,0a';
        break;
      case 'normal':
        formatter = digit ? '0,0' + digitStr : '0,0';
        break;
      case 'percent':
        formatter = digit ? '0,0' + digitStr + '%' : '0,0.[00]%';
        break;
    }
    return numerify(val, formatter);
  };

  var getStackMap = function getStackMap(stack) {
    var stackMap = {};
    Object.keys(stack).forEach(function (item) {
      stack[item].forEach(function (name) {
        stackMap[name] = item;
      });
    });
    return stackMap;
  };

  // default opacity of bar while dim-axis type is 'value'
  var VALUE_AXIS_OPACITY = 0.5;

  function getBarDimAxis(args) {
    var innerRows = args.innerRows,
        dimAxisName = args.dimAxisName,
        dimension = args.dimension,
        axisVisible = args.axisVisible,
        dimAxisType = args.dimAxisType,
        dims = args.dims;

    return dimension.map(function (item) {
      return {
        type: 'category',
        name: dimAxisName,
        nameLocation: 'middle',
        nameGap: 22,
        data: dimAxisType === 'value' ? getValueAxisData(dims) : innerRows.map(function (row) {
          return row[item];
        }),
        axisLabel: {
          formatter: function formatter(v) {
            return String(v);
          }
        },
        show: axisVisible
      };
    });
  }
  function getValueAxisData(dims) {
    var max = Math.max.apply(null, dims);
    var min = Math.min.apply(null, dims);
    var result = [];
    for (var i = min; i <= max; i++) {
      result.push(i);
    }
    return result;
  }

  function getBarMeaAxis(args) {
    var meaAxisName = args.meaAxisName,
        meaAxisType = args.meaAxisType,
        axisVisible = args.axisVisible,
        digit = args.digit,
        scale = args.scale,
        min = args.min,
        max = args.max;

    var meaAxisBase = {
      type: 'value',
      axisTick: {
        show: false
      },
      show: axisVisible
    };
    var meaAxis = [];

    var _loop = function _loop(i) {
      if (meaAxisType[i]) {
        meaAxis[i] = _extends({}, meaAxisBase, {
          axisLabel: {
            formatter: function formatter(val) {
              return getFormated(val, meaAxisType[i], digit);
            }
          }
        });
      } else {
        meaAxis[i] = _extends({}, meaAxisBase);
      }
      meaAxis[i].name = meaAxisName[i] || '';
      meaAxis[i].scale = scale[i] || false;
      meaAxis[i].min = min[i] || null;
      meaAxis[i].max = max[i] || null;
    };

    for (var i = 0; i < 2; i++) {
      _loop(i);
    }

    return meaAxis;
  }

  function getBarTooltip(args) {
    var axisSite = args.axisSite,
        isHistogram = args.isHistogram,
        meaAxisType = args.meaAxisType,
        digit = args.digit,
        labelMap = args.labelMap;

    var secondAxis = isHistogram ? axisSite.right || [] : axisSite.top || [];
    if (labelMap) {
      secondAxis = secondAxis.map(function (item) {
        return labelMap[item] === undefined ? item : labelMap[item];
      });
    }
    return {
      trigger: 'axis',
      formatter: function formatter(items) {
        var tpl = [];
        tpl.push(items[0].name + '<br>');
        items.forEach(function (item) {
          var seriesName = item.seriesName;
          var type = ~secondAxis.indexOf(seriesName) ? meaAxisType[1] : meaAxisType[0];
          tpl.push(itemPoint(item.color));
          tpl.push(seriesName + ': ');
          tpl.push(getFormated(item.value, type, digit));
          tpl.push('<br>');
        });

        return tpl.join('');
      }
    };
  }

  function getValueData(seriesTemp, dims) {
    var max = Math.max.apply(null, dims);
    var min = Math.min.apply(null, dims);
    var result = [];
    for (var i = min; i <= max; i++) {
      var index = dims.indexOf(i);
      if (~index) {
        result.push(seriesTemp[index]);
      } else {
        result.push(null);
      }
    }
    return result;
  }

  function getBarSeries(args) {
    var innerRows = args.innerRows,
        metrics = args.metrics,
        stack = args.stack,
        axisSite = args.axisSite,
        isHistogram = args.isHistogram,
        labelMap = args.labelMap,
        itemStyle = args.itemStyle,
        label = args.label,
        _args$showLine = args.showLine,
        showLine = _args$showLine === undefined ? [] : _args$showLine,
        dimAxisType = args.dimAxisType,
        barGap = args.barGap,
        opacity = args.opacity,
        dims = args.dims;

    var series = [];
    var seriesTemp = {};
    var secondAxis = isHistogram ? axisSite.right || [] : axisSite.top || [];
    var secondDimAxisIndex = isHistogram ? 'yAxisIndex' : 'xAxisIndex';
    var stackMap = stack && getStackMap(stack);
    metrics.forEach(function (item) {
      seriesTemp[item] = [];
    });
    innerRows.forEach(function (row) {
      metrics.forEach(function (item) {
        seriesTemp[item].push(row[item]);
      });
    });
    series = Object.keys(seriesTemp).map(function (item, index) {
      var data = dimAxisType === 'value' ? getValueData(seriesTemp[item], dims) : seriesTemp[item];
      var seriesItem = defineProperty({
        name: labelMap[item] != null ? labelMap[item] : item,
        type: ~showLine.indexOf(item) ? 'line' : 'bar',
        data: data
      }, secondDimAxisIndex, ~secondAxis.indexOf(item) ? '1' : '0');

      if (stack && stackMap[item]) seriesItem.stack = stackMap[item];

      if (label) seriesItem.label = label;
      if (itemStyle) seriesItem.itemStyle = itemStyle;

      var itemOpacity = opacity || get$1(seriesItem, 'itemStyle.normal.opacity');
      if (dimAxisType === 'value') {
        seriesItem.barGap = barGap;
        seriesItem.barCategoryGap = '1%';
        if (itemOpacity == null) itemOpacity = VALUE_AXIS_OPACITY;
      }

      if (itemOpacity != null) {
        set$1(seriesItem, 'itemStyle.normal.opacity', itemOpacity);
      }

      return seriesItem;
    });

    return series.length ? series : false;
  }

  function getLegend(args) {
    var metrics = args.metrics,
        labelMap = args.labelMap,
        legendName = args.legendName;

    if (!legendName && !labelMap) return { data: metrics };
    var data = labelMap ? metrics.map(function (item) {
      return labelMap[item] == null ? item : labelMap[item];
    }) : metrics;
    return {
      data: data,
      formatter: function formatter(name) {
        return legendName[name] != null ? legendName[name] : name;
      }
    };
  }

  function getDims(rows, dimension) {
    return rows.map(function (row) {
      return row[dimension[0]];
    });
  }

  var bar$1 = function bar$$1(columns, rows, settings, extra) {
    var innerRows = cloneDeep(rows);
    var _settings$axisSite = settings.axisSite,
        axisSite = _settings$axisSite === undefined ? {} : _settings$axisSite,
        _settings$dimension = settings.dimension,
        dimension = _settings$dimension === undefined ? [columns[0]] : _settings$dimension,
        _settings$stack = settings.stack,
        stack = _settings$stack === undefined ? {} : _settings$stack,
        _settings$axisVisible = settings.axisVisible,
        axisVisible = _settings$axisVisible === undefined ? true : _settings$axisVisible,
        _settings$digit = settings.digit,
        digit = _settings$digit === undefined ? 2 : _settings$digit,
        _settings$dataOrder = settings.dataOrder,
        dataOrder = _settings$dataOrder === undefined ? false : _settings$dataOrder,
        _settings$scale = settings.scale,
        scale = _settings$scale === undefined ? [false, false] : _settings$scale,
        _settings$min = settings.min,
        min = _settings$min === undefined ? [null, null] : _settings$min,
        _settings$max = settings.max,
        max = _settings$max === undefined ? [null, null] : _settings$max,
        _settings$legendName = settings.legendName,
        legendName = _settings$legendName === undefined ? {} : _settings$legendName,
        _settings$labelMap = settings.labelMap,
        labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
        label = settings.label,
        itemStyle = settings.itemStyle,
        showLine = settings.showLine,
        _settings$barGap = settings.barGap,
        barGap = _settings$barGap === undefined ? '-100%' : _settings$barGap,
        opacity = settings.opacity;
    var tooltipVisible = extra.tooltipVisible,
        legendVisible = extra.legendVisible;

    var metrics = columns.slice();
    if (axisSite.top && axisSite.bottom) {
      metrics = axisSite.top.concat(axisSite.bottom);
    } else if (axisSite.bottom && !axisSite.right) {
      metrics = axisSite.bottom;
    } else if (settings.metrics) {
      metrics = settings.metrics;
    } else {
      metrics.splice(columns.indexOf(dimension[0]), 1);
    }
    var meaAxisType = settings.xAxisType || ['normal', 'normal'];
    var dimAxisType = settings.yAxisType || 'category';
    var meaAxisName = settings.xAxisName || [];
    var dimAxisName = settings.yAxisName || '';
    var isHistogram = false;

    if (dataOrder) {
      var _label = dataOrder.label,
          order = dataOrder.order;

      if (!_label || !order) {
        console.warn('Need to provide name and order parameters');
      } else {
        innerRows.sort(function (a, b) {
          if (order === 'desc') {
            return a[_label] - b[_label];
          } else {
            return b[_label] - a[_label];
          }
        });
      }
    }
    var dims = getDims(innerRows, dimension);

    var legend$$1 = legendVisible && getLegend({ metrics: metrics, labelMap: labelMap, legendName: legendName });
    var yAxis = getBarDimAxis({
      innerRows: innerRows,
      dimAxisName: dimAxisName,
      dimension: dimension,
      axisVisible: axisVisible,
      dimAxisType: dimAxisType,
      dims: dims
    });
    var xAxis = getBarMeaAxis({
      meaAxisName: meaAxisName,
      meaAxisType: meaAxisType,
      axisVisible: axisVisible,
      digit: digit,
      scale: scale,
      min: min,
      max: max
    });
    var series = getBarSeries({
      innerRows: innerRows,
      metrics: metrics,
      stack: stack,
      axisSite: axisSite,
      isHistogram: isHistogram,
      labelMap: labelMap,
      itemStyle: itemStyle,
      label: label,
      showLine: showLine,
      dimAxisType: dimAxisType,
      dimension: dimension,
      barGap: barGap,
      opacity: opacity,
      dims: dims
    });
    var tooltipParams = { axisSite: axisSite, isHistogram: isHistogram, meaAxisType: meaAxisType, digit: digit, labelMap: labelMap };
    var tooltip$$1 = tooltipVisible && getBarTooltip(tooltipParams);
    var options = { legend: legend$$1, yAxis: yAxis, series: series, xAxis: xAxis, tooltip: tooltip$$1 };
    return options;
  };

  function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
      if (typeof shadowMode !== 'boolean') {
          createInjectorSSR = createInjector;
          createInjector = shadowMode;
          shadowMode = false;
      }
      // Vue.extend constructor export interop.
      var options = typeof script === 'function' ? script.options : script;
      // render functions
      if (template && template.render) {
          options.render = template.render;
          options.staticRenderFns = template.staticRenderFns;
          options._compiled = true;
          // functional template
          if (isFunctionalTemplate) {
              options.functional = true;
          }
      }
      // scopedId
      if (scopeId) {
          options._scopeId = scopeId;
      }
      var hook = void 0;
      if (moduleIdentifier) {
          // server build
          hook = function hook(context) {
              // 2.3 injection
              context = context || // cached call
              this.$vnode && this.$vnode.ssrContext || // stateful
              this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
              // 2.2 with runInNewContext: true
              if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                  context = __VUE_SSR_CONTEXT__;
              }
              // inject component styles
              if (style) {
                  style.call(this, createInjectorSSR(context));
              }
              // register component module identifier for async chunk inference
              if (context && context._registeredComponents) {
                  context._registeredComponents.add(moduleIdentifier);
              }
          };
          // used by ssr in case component is cached and beforeCreate
          // never gets called
          options._ssrRegister = hook;
      } else if (style) {
          hook = shadowMode ? function (context) {
              style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
          } : function (context) {
              style.call(this, createInjector(context));
          };
      }
      if (hook) {
          if (options.functional) {
              // register for functional component in vue file
              var originalRender = options.render;
              options.render = function renderWithStyleInjection(h, context) {
                  hook.call(context);
                  return originalRender(h, context);
              };
          } else {
              // inject component registration as beforeCreate hook
              var existing = options.beforeCreate;
              options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
          }
      }
      return script;
  }

  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  function createInjector(context) {
      return function (id, style) {
          return addStyle(id, style);
      };
  }
  var HEAD = void 0;
  var styles = {};
  function addStyle(id, css) {
      var group = isOldIE ? css.media || 'default' : id;
      var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
      if (!style.ids.has(id)) {
          style.ids.add(id);
          var code = css.source;
          if (css.map) {
              // https://developer.chrome.com/devtools/docs/javascript-debugging
              // this makes source maps inside style tags work properly in Chrome
              code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
              // http://stackoverflow.com/a/26603875
              code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
          }
          if (!style.element) {
              style.element = document.createElement('style');
              style.element.type = 'text/css';
              if (css.media) style.element.setAttribute('media', css.media);
              if (HEAD === undefined) {
                  HEAD = document.head || document.getElementsByTagName('head')[0];
              }
              HEAD.appendChild(style.element);
          }
          if ('styleSheet' in style.element) {
              style.styles.push(code);
              style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
          } else {
              var index = style.ids.size - 1;
              var textNode = document.createTextNode(code);
              var nodes = style.element.childNodes;
              if (nodes[index]) style.element.removeChild(nodes[index]);
              if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
          }
      }
  }

  /* script */

  /* template */
  var __vue_render__ = function __vue_render__() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "v-charts-component-loading" }, [_c("div", { staticClass: "loader" }, [_c("div", { staticClass: "loading-spinner" }, [_c("svg", { staticClass: "circular", attrs: { viewBox: "25 25 50 50" } }, [_c("circle", {
      staticClass: "path",
      attrs: { cx: "50", cy: "50", r: "20", fill: "none" }
    })])])])]);
  };
  var __vue_staticRenderFns__ = [];
  __vue_render__._withStripped = true;

  /* style */
  var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
    if (!inject) return;
    inject("data-v-55d580e4_0", { source: "\n.v-charts-component-loading {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, .9);\n}\n.v-charts-mask-status {\n  filter: blur(1px);\n}\n.v-charts-component-loading .circular {\n  width: 42px;\n  height: 42px;\n  animation: loading-rotate 2s linear infinite;\n}\n.v-charts-component-loading .path {\n  animation: loading-dash 1.5s ease-in-out infinite;\n  stroke-dasharray: 90,150;\n  stroke-dashoffset: 0;\n  stroke-width: 2;\n  stroke: #20a0ff;\n  stroke-linecap: round;\n}\n@keyframes loading-rotate {\n100% {\n    transform: rotate(360deg);\n}\n}\n@keyframes loading-dash {\n0% {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0;\n}\n50% {\n    stroke-dasharray: 90, 150;\n    stroke-dashoffset: -40px;\n}\n100% {\n    stroke-dasharray: 90, 150;\n    stroke-dashoffset: -120px;\n}\n}\n", map: { "version": 3, "sources": ["/Users/gaowujun/tanzhou/tz-chart/src/components/loading.vue"], "names": [], "mappings": ";AAaA;EACA,kBAAA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,SAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,yCAAA;AACA;AAEA;EACA,iBAAA;AACA;AAEA;EACA,WAAA;EACA,YAAA;EACA,4CAAA;AACA;AAEA;EACA,iDAAA;EACA,wBAAA;EACA,oBAAA;EACA,eAAA;EACA,eAAA;EACA,qBAAA;AACA;AAEA;AACA;IACA,yBAAA;AACA;AACA;AAEA;AACA;IACA,wBAAA;IACA,oBAAA;AACA;AACA;IACA,yBAAA;IACA,wBAAA;AACA;AACA;IACA,yBAAA;IACA,yBAAA;AACA;AACA", "file": "loading.vue", "sourcesContent": ["<template>\n  <div class=\"v-charts-component-loading\">\n    <div class=\"loader\">\n      <div class=\"loading-spinner\">\n        <svg class=\"circular\" viewBox=\"25 25 50 50\">\n          <circle class=\"path\" cx=\"50\" cy=\"50\" r=\"20\" fill=\"none\"/>\n        </svg>\n      </div>\n    </div>\n  </div>\n</template>\n\n<style>\n.v-charts-component-loading {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, .9);\n}\n\n.v-charts-mask-status {\n  filter: blur(1px);\n}\n\n.v-charts-component-loading .circular {\n  width: 42px;\n  height: 42px;\n  animation: loading-rotate 2s linear infinite;\n}\n\n.v-charts-component-loading .path {\n  animation: loading-dash 1.5s ease-in-out infinite;\n  stroke-dasharray: 90,150;\n  stroke-dashoffset: 0;\n  stroke-width: 2;\n  stroke: #20a0ff;\n  stroke-linecap: round;\n}\n\n@keyframes loading-rotate {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loading-dash {\n  0% {\n    stroke-dasharray: 1, 200;\n    stroke-dashoffset: 0;\n  }\n  50% {\n    stroke-dasharray: 90, 150;\n    stroke-dashoffset: -40px;\n  }\n  100% {\n    stroke-dasharray: 90, 150;\n    stroke-dashoffset: -120px;\n  }\n}\n</style>\n"] }, media: undefined });
  };
  /* scoped */
  var __vue_scope_id__ = undefined;
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = false;
  /* style inject SSR */

  /* style inject shadow dom */

  var __vue_component__ = normalizeComponent({ render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ }, __vue_inject_styles__, {}, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

  /* script */

  /* template */
  var __vue_render__$1 = function __vue_render__() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "v-charts-data-empty" }, [_vm._v("\n  暂无数据\n")]);
  };
  var __vue_staticRenderFns__$1 = [];
  __vue_render__$1._withStripped = true;

  /* style */
  var __vue_inject_styles__$1 = function __vue_inject_styles__(inject) {
    if (!inject) return;
    inject("data-v-a8d93b58_0", { source: "\n.v-charts-data-empty {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, .9);\n  color: #888;\n  font-size: 14px;\n}\n", map: { "version": 3, "sources": ["/Users/gaowujun/tanzhou/tz-chart/src/components/data-empty.vue"], "names": [], "mappings": ";AAOA;EACA,kBAAA;EACA,OAAA;EACA,QAAA;EACA,MAAA;EACA,SAAA;EACA,aAAA;EACA,uBAAA;EACA,mBAAA;EACA,yCAAA;EACA,WAAA;EACA,eAAA;AACA", "file": "data-empty.vue", "sourcesContent": ["<template>\n  <div class=\"v-charts-data-empty\">\n    暂无数据\n  </div>\n</template>\n\n<style>\n.v-charts-data-empty {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background-color: rgba(255, 255, 255, .9);\n  color: #888;\n  font-size: 14px;\n}\n</style>\n"] }, media: undefined });
  };
  /* scoped */
  var __vue_scope_id__$1 = undefined;
  /* module identifier */
  var __vue_module_identifier__$1 = undefined;
  /* functional template */
  var __vue_is_functional_template__$1 = false;
  /* style inject SSR */

  /* style inject shadow dom */

  var __vue_component__$1 = normalizeComponent({ render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 }, __vue_inject_styles__$1, {}, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, false, createInjector, undefined, undefined);

  function setExtend (options, extend) {
    Object.keys(extend).forEach(function (attr) {
      var value = extend[attr];
      if (~attr.indexOf('.')) {
        // eg: a.b.c a.1.b
        set$1(options, attr, value);
      } else if (typeof value === 'function') {
        // get callback value
        options[attr] = value(options[attr]);
      } else {
        // mixin extend value
        if (isArray(options[attr]) && isObject(options[attr][0])) {
          // eg: [{ xx: 1 }, { xx: 2 }]
          options[attr].forEach(function (option, index) {
            options[attr][index] = _extends({}, option, value);
          });
        } else if (isObject(options[attr])) {
          // eg: { xx: 1, yy: 2 }
          options[attr] = _extends({}, options[attr], value);
        } else {
          options[attr] = value;
        }
      }
    });
  }

  function setMark (seriesItem, marks) {
    Object.keys(marks).forEach(function (key) {
      if (marks[key]) seriesItem[key] = marks[key];
    });
  }

  function setAnimation (options, animation) {
    Object.keys(animation).forEach(function (key) {
      options[key] = animation[key];
    });
  }

  var Core = {
    render: function render(h) {
      return h("div", {
        class: [camelToKebab(this.$options.name || this.$options._componentTag)],
        style: this.canvasStyle
      }, [h("div", {
        style: this.canvasStyle,
        class: { "v-charts-mask-status": this.dataEmpty || this.loading },
        ref: "canvas"
      }), h(__vue_component__$1, {
        style: { display: this.dataEmpty ? "" : "none" }
      }), h(__vue_component__, {
        style: { display: this.loading ? "" : "none" }
      }), this.$slots.default]);
    },


    props: {
      data: {
        type: [Object, Array],
        default: function _default() {
          return {};
        }
      },
      settings: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      width: { type: String, default: "auto" },
      height: { type: String, default: "400px" },
      beforeConfig: { type: Function },
      afterConfig: { type: Function },
      afterSetOption: { type: Function },
      afterSetOptionOnce: { type: Function },
      events: { type: Object },
      grid: { type: [Object, Array] },
      colors: { type: Array },
      tooltipVisible: { type: Boolean, default: true },
      legendVisible: { type: Boolean, default: true },
      legendPosition: { type: String },
      markLine: { type: Object },
      markArea: { type: Object },
      markPoint: { type: Object },
      visualMap: { type: [Object, Array] },
      dataZoom: { type: [Object, Array] },
      toolbox: { type: [Object, Array] },
      initOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      title: [Object, Array],
      legend: [Object, Array],
      xAxis: [Object, Array],
      yAxis: [Object, Array],
      radar: Object,
      tooltip: Object,
      axisPointer: [Object, Array],
      brush: [Object, Array],
      geo: [Object, Array],
      timeline: [Object, Array],
      graphic: [Object, Array],
      series: [Object, Array],
      backgroundColor: [Object, String],
      textStyle: [Object, Array],
      animation: Object,
      theme: Object,
      themeName: String,
      loading: Boolean,
      dataEmpty: Boolean,
      extend: Object,
      judgeWidth: { type: Boolean, default: false },
      widthChangeDelay: { type: Number, default: 300 },
      tooltipFormatter: { type: Function },
      resizeable: { type: Boolean, default: true },
      resizeDelay: { type: Number, default: 200 },
      changeDelay: { type: Number, default: 0 },
      setOptionOpts: { type: [Boolean, Object], default: true },
      cancelResizeCheck: Boolean,
      notSetUnchange: Array,
      log: Boolean
    },

    watch: {
      data: {
        deep: true,
        handler: function handler(v) {
          if (v) {
            this.changeHandler();
          }
        }
      },

      settings: {
        deep: true,
        handler: function handler(v) {
          if (v.type && this.chartLib) this.chartHandler = this.chartLib[v.type];
          this.changeHandler();
        }
      },

      width: "nextTickResize",
      height: "nextTickResize",

      events: {
        deep: true,
        handler: "createEventProxy"
      },

      theme: {
        deep: true,
        handler: "themeChange"
      },

      themeName: "themeChange",

      resizeable: "resizeableHandler"
    },

    computed: {
      canvasStyle: function canvasStyle() {
        return {
          width: this.width,
          height: this.height,
          position: "relative"
        };
      },
      chartColor: function chartColor() {
        return this.colors || this.theme && this.theme.color || DEFAULT_COLORS;
      }
    },

    methods: {
      dataHandler: function dataHandler() {
        if (!this.chartHandler) return;
        var data = this.data;
        var _data = data,
            _data$columns = _data.columns,
            columns = _data$columns === undefined ? [] : _data$columns,
            _data$rows = _data.rows,
            rows = _data$rows === undefined ? [] : _data$rows;

        var extra = {
          tooltipVisible: this.tooltipVisible,
          legendVisible: this.legendVisible,
          echarts: this.echarts,
          color: this.chartColor,
          tooltipFormatter: this.tooltipFormatter,
          _once: this._once
        };
        if (this.beforeConfig) data = this.beforeConfig(data);
        var options = this.chartHandler(columns, rows, this.settings, extra);
        if (options) {
          if (typeof options.then === "function") {
            options.then(this.optionsHandler);
          } else {
            this.optionsHandler(options);
          }
        }
      },
      nextTickResize: function nextTickResize() {
        this.$nextTick(this.resize);
      },
      resize: function resize() {
        if (!this.cancelResizeCheck) {
          if (this.$el && this.$el.clientWidth && this.$el.clientHeight) {
            this.echartsResize();
          }
        } else {
          this.echartsResize();
        }
      },
      echartsResize: function echartsResize() {
        this.echarts && this.echarts.resize();
      },


      // 递归合拼数据
      mergeData: function mergeData(options, setting) {
        if (!options) {
          options = {};
        }
        for (var item in setting) {
          if (setting[item]) {
            if (setting[item] instanceof Object) {
              options[item] = this.mergeData(options[item], setting[item]);
            } else {
              options[item] = setting[item];
            }
          }
        }
        return options;
      },
      optionsHandler: function optionsHandler(options) {
        var _this = this;

        // legend
        if (this.legendPosition && options.legend) {
          options.legend[this.legendPosition] = 10;
          if (~["left", "right"].indexOf(this.legendPosition)) {
            options.legend.top = "middle";
            options.legend.orient = "vertical";
          }
        }
        // color
        options.color = this.chartColor;
        // 遍历用户设置属性，合并数据
        ECHARTS_SETTINGS.forEach(function (setting) {
          if (_this[setting]) {
            options[setting] = _this.mergeData(options[setting], _this[setting]);
          }
        });
        // animation
        if (this.animation) setAnimation(options, this.animation);
        // marks
        if (this.markArea || this.markLine || this.markPoint) {
          var marks = {
            markArea: this.markArea,
            markLine: this.markLine,
            markPoint: this.markPoint
          };
          var series = options.series;
          if (isArray(series)) {
            series.forEach(function (item) {
              setMark(item, marks);
            });
          } else if (isObject(series)) {
            setMark(series, marks);
          }
        }
        // change inited echarts settings
        if (this.extend) setExtend(options, this.extend);
        if (this.afterConfig) options = this.afterConfig(options);
        var setOptionOpts = this.setOptionOpts;
        // map chart not merge
        if ((this.settings.bmap || this.settings.amap) && !isObject(setOptionOpts)) {
          setOptionOpts = false;
        }
        // exclude unchange options
        if (this.notSetUnchange && this.notSetUnchange.length) {
          this.notSetUnchange.forEach(function (item) {
            var value = options[item];
            if (value) {
              if (isEqual(value, _this._store[item])) {
                options[item] = undefined;
              } else {
                _this._store[item] = cloneDeep(value);
              }
            }
          });
          if (isObject(setOptionOpts)) {
            setOptionOpts.notMerge = false;
          } else {
            setOptionOpts = false;
          }
        }

        if (this._isDestroyed) return;
        if (this.log) console.log(options);
        // 将参数设置到图表
        this.echarts.setOption(options, setOptionOpts);
        this.$emit("ready", this.echarts, options, echartsLib);
        if (!this._once["ready-once"]) {
          this._once["ready-once"] = true;
          this.$emit("ready-once", this.echarts, options, echartsLib);
        }
        if (this.judgeWidth) this.judgeWidthHandler(options);
        if (this.afterSetOption) {
          this.afterSetOption(this.echarts, options, echartsLib);
        }
        if (this.afterSetOptionOnce && !this._once["afterSetOptionOnce"]) {
          this._once["afterSetOptionOnce"] = true;
          this.afterSetOptionOnce(this.echarts, options, echartsLib);
        }
      },
      judgeWidthHandler: function judgeWidthHandler(options) {
        var _this2 = this;

        var widthChangeDelay = this.widthChangeDelay,
            resize = this.resize;

        if (this.$el.clientWidth || this.$el.clientHeight) {
          resize();
        } else {
          this.$nextTick(function (_) {
            if (_this2.$el.clientWidth || _this2.$el.clientHeight) {
              resize();
            } else {
              setTimeout(function (_) {
                resize();
                if (!_this2.$el.clientWidth || !_this2.$el.clientHeight) {
                  console.warn(" Can't get dom width or height ");
                }
              }, widthChangeDelay);
            }
          });
        }
      },
      resizeableHandler: function resizeableHandler(resizeable) {
        if (resizeable && !this._once.onresize) this.addResizeListener();
        if (!resizeable && this._once.onresize) this.removeResizeListener();
      },
      init: function init() {
        if (this.echarts) return;
        var themeName = this.themeName || this.theme || DEFAULT_THEME;
        this.echarts = echartsLib.init(this.$refs.canvas, themeName, this.initOptions);
        if (this.data) this.changeHandler();
        this.createEventProxy();
        if (this.resizeable) this.addResizeListener();
      },
      addResizeListener: function addResizeListener() {
        window.addEventListener("resize", this.resizeHandler);
        this._once.onresize = true;
      },
      removeResizeListener: function removeResizeListener() {
        window.removeEventListener("resize", this.resizeHandler);
        this._once.onresize = false;
      },
      addWatchToProps: function addWatchToProps() {
        var _this3 = this;

        var watchedVariable = this._watchers.map(function (watcher) {
          return watcher.expression;
        });
        Object.keys(this.$props).forEach(function (prop) {
          if (!~watchedVariable.indexOf(prop) && !~STATIC_PROPS.indexOf(prop)) {
            var opts = {};
            if (~["[object Object]", "[object Array]"].indexOf(getType(_this3.$props[prop]))) {
              opts.deep = true;
            }
            _this3.$watch(prop, function () {
              _this3.changeHandler();
            }, opts);
          }
        });
      },
      createEventProxy: function createEventProxy() {
        var _this4 = this;

        // 只要用户使用 on 方法绑定的事件都做一层代理，
        // 是否真正执行相应的事件方法取决于该方法是否仍然存在 events 中
        // 实现 events 的动态响应
        var self = this;
        var keys = Object.keys(this.events || {});
        keys.length && keys.forEach(function (ev) {
          if (_this4.registeredEvents.indexOf(ev) === -1) {
            _this4.registeredEvents.push(ev);
            _this4.echarts.on(ev, function (ev) {
              return function () {
                if (ev in self.events) {
                  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }

                  self.events[ev].apply(null, args);
                }
              };
            }(ev));
          }
        });
      },
      themeChange: function themeChange(theme) {
        this.clean();
        this.echarts = null;
        this.init();
      },
      clean: function clean() {
        if (this.resizeable) this.removeResizeListener();
        this.echarts.dispose();
      }
    },

    created: function created() {
      this.echarts = null;
      this.registeredEvents = [];
      this._once = {};
      this._store = {};
      this.resizeHandler = debounce(this.resize, this.resizeDelay);
      this.changeHandler = debounce(this.dataHandler, this.changeDelay);
      this.addWatchToProps();
    },
    mounted: function mounted() {
      this.init();
    },
    beforeDestroy: function beforeDestroy() {
      this.clean();
    },


    _numerify: numerify
  };

  var VeBar = _extends({}, Core, {
    name: 'VeBar',
    data: function data() {
      this.chartHandler = bar$1;
      return {};
    }
  });

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
    var rows = args.rows,
        axisSite = args.axisSite,
        metrics = args.metrics,
        area = args.area,
        stack = args.stack,
        nullAddZero = args.nullAddZero,
        labelMap = args.labelMap,
        label = args.label,
        itemStyle = args.itemStyle,
        _args$lineStyle = args.lineStyle,
        lineStyle = _args$lineStyle === undefined ? {
      normal: {
        width: 2,
        type: "solid"
      }
    } : _args$lineStyle,
        areaStyle = args.areaStyle,
        dimension = args.dimension;

    var series = [];
    var dataTemp = {};
    var stackMap = stack && getStackMap(stack);

    // 构造 itemStyle 数据
    var itemStyleList = [];
    if (itemStyle && itemStyle.length === metrics.length) {
      // 用户设置样式
      itemStyleList = itemStyle;
    } else {
      // 默认线条样式
      metrics.forEach(function (item) {
        var index = metrics.indexOf(item);
        var color = getColor(metrics, index);
        var colorItem = {
          normal: {
            color: color
          }
        };
        itemStyleList.push(colorItem);
      });
    }

    metrics.forEach(function (item) {
      dataTemp[item] = [];
    });
    rows.forEach(function (row) {
      metrics.forEach(function (item) {
        var value = null;
        if (row[item] != null) {
          value = row[item];
        } else if (nullAddZero) {
          value = 0;
        }
        dataTemp[item].push([row[dimension[0]], value]);
      });
    });
    metrics.forEach(function (item) {
      var seriesItem = {
        name: labelMap[item] != null ? labelMap[item] : item,
        type: "line",
        data: dataTemp[item]
      };

      if (area) {
        seriesItem.areaStyle = {
          // 自定义
          normal: {
            // eslint-disable-next-line no-undef
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: "rgba(255, 205, 47, 0.2)"
            }, {
              offset: 1,
              color: "rgba(255, 205, 47, 0)"
            }], false),
            shadowColor: "rgba(255, 205, 47, 0.1)",
            shadowBlur: 10
          }
        };
      }

      seriesItem.yAxisIndex = 0;

      if (axisSite.right) {
        seriesItem.yAxisIndex = axisSite.right.indexOf(seriesItem.name) >= 0 ? 1 : 0;
      }

      if (stack && stackMap[item]) seriesItem.stack = stackMap[item];
      var index = metrics.indexOf(item);
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

  function getLeftData(min, max) {
    // 最高位向上取整
    if (max > 1) {
      var strMax = (max + "").split(".")[0];
      var firstC = parseInt(strMax.substring(0, 1)) + 1;
      for (var i = 0; i < strMax.substring(1, strMax.length).length; i++) {
        firstC = firstC + "0";
      }
      max = parseInt(firstC);
    } else {
      // 小于1的情况暂时不处理直接为1
      max = 1;
    }
    // 控制分割条数，
    var distance = parseFloat(((max - min) / 4).toString(), 10);
    return {
      max: max,
      min: min,
      interval: distance
    };
  }

  function getLineYAxis(args) {
    var yAxisName = args.yAxisName,
        yAxisType = args.yAxisType,
        axisVisible = args.axisVisible,
        scale = args.scale,
        emin = args.emin,
        emax = args.emax,
        digit = args.digit;


    var yAxisBase = {
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
    var yAxis = [];

    var _loop = function _loop(i) {
      if (yAxisType[i]) {
        yAxis[i] = _extends({}, yAxisBase, {
          axisLabel: {
            formatter: function formatter(val) {
              return getFormated(val, yAxisType[i], digit);
            },

            textStyle: {
              fontSize: 10,
              color: "rgba(153, 153, 153, 1)"
            }
          }
        });
      } else {
        yAxis[i] = _extends({}, yAxisBase);
      }
      yAxis[i].name = yAxisName[i] || "";
      yAxis[i].scale = scale[i] || false;
      yAxis[i].min = emin[i] || null;
      yAxis[i].max = getLeftData(emin[i], emax[i]).max;
      yAxis[i].interval = getLeftData(emin[i], emax[i]).interval;
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
    };

    for (var i = 0; i < 2; i++) {
      _loop(i);
    }
    return yAxis;
  }

  function getLineXAxis(args) {
    var dimension = args.dimension,
        rows = args.rows,
        xAxisName = args.xAxisName,
        axisVisible = args.axisVisible,
        xAxisType = args.xAxisType;

    return dimension.map(function (item, index) {
      return {
        type: xAxisType,
        nameLocation: "middle",
        nameGap: 22,
        name: xAxisName[index] || "",
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: { color: "#E4E7ED" }
        },
        data: rows.map(function (row) {
          return row[item];
        }),
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
      };
    });
  }

  function getLineTooltip(args) {
    var axisSite = args.axisSite,
        yAxisType = args.yAxisType,
        digit = args.digit,
        labelMap = args.labelMap,
        tooltipFormatter = args.tooltipFormatter;

    var rightItems = axisSite.right || [];
    var rightList = labelMap ? rightItems.map(function (item) {
      return labelMap[item] === undefined ? item : labelMap[item];
    }) : rightItems;
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
      formatter: function formatter(items) {
        if (tooltipFormatter) {
          return tooltipFormatter.apply(null, arguments);
        }
        var tpl = [];
        var _items$ = items[0],
            name = _items$.name,
            axisValueLabel = _items$.axisValueLabel;

        var title = name || axisValueLabel;
        tpl.push(title + "<br>");
        items.forEach(function (_ref) {
          var seriesName = _ref.seriesName,
              data = _ref.data,
              color = _ref.color;

          var showData = null;
          var type = ~rightList.indexOf(seriesName) ? yAxisType[1] : yAxisType[0];
          var itemData = isArray(data) ? data[1] : data;
          showData = getFormated(itemData, type, digit);
          var marker = "<span style=\"display:inline-block;margin-right:5px;border-radius:6px;width:6px;height:6px;background-color:" + color + ";\"></span>";
          tpl.push(marker);
          tpl.push(seriesName + ": " + showData);
          tpl.push("<br>");
        });
        return tpl.join("");
      }
    };
  }

  function getLegend$1(args) {
    var legend$$1 = {
      top: 18,
      right: 20
    };
    var legendFontStyle = {
      fontSize: 10,
      color: "#999999"
    };

    var metrics = args.metrics,
        legendName = args.legendName,
        labelMap = args.labelMap;

    if (!legendName && !labelMap) return { data: metrics };
    var data = labelMap ? metrics.map(function (item) {
      return labelMap[item] == null ? item : labelMap[item];
    }) : metrics;
    return _extends({
      itemWidth: 15,
      itemHeight: 8,
      itemGap: 14
    }, legend$$1, {
      data: data,
      textStyle: legendFontStyle,
      formatter: function formatter(name) {
        return legendName[name] != null ? legendName[name] : name;
      }
    });
  }

  function getGrid(args) {
    var grid = {
      left: 20,
      right: 20,
      bottom: 20,
      top: 60,
      containLabel: true
    };

    return _extends({}, grid, args);
  }

  var line$1 = function line$$1(columns, rows, settings, extra) {
    rows = isArray(rows) ? rows : [];
    columns = isArray(columns) ? columns : [];
    var _settings$axisSite = settings.axisSite,
        axisSite = _settings$axisSite === undefined ? {} : _settings$axisSite,
        _settings$yAxisType = settings.yAxisType,
        yAxisType = _settings$yAxisType === undefined ? ["normal", "normal"] : _settings$yAxisType,
        _settings$xAxisType = settings.xAxisType,
        xAxisType = _settings$xAxisType === undefined ? "category" : _settings$xAxisType,
        _settings$yAxisName = settings.yAxisName,
        yAxisName = _settings$yAxisName === undefined ? [] : _settings$yAxisName,
        _settings$dimension = settings.dimension,
        dimension = _settings$dimension === undefined ? [columns[0]] : _settings$dimension,
        _settings$xAxisName = settings.xAxisName,
        xAxisName = _settings$xAxisName === undefined ? [] : _settings$xAxisName,
        _settings$axisVisible = settings.axisVisible,
        axisVisible = _settings$axisVisible === undefined ? true : _settings$axisVisible,
        area = settings.area,
        stack = settings.stack,
        _settings$scale = settings.scale,
        scale = _settings$scale === undefined ? [false, false] : _settings$scale,
        min = settings.min,
        max = settings.max,
        _settings$nullAddZero = settings.nullAddZero,
        nullAddZero = _settings$nullAddZero === undefined ? false : _settings$nullAddZero,
        _settings$digit = settings.digit,
        digit = _settings$digit === undefined ? 2 : _settings$digit,
        _settings$legendName = settings.legendName,
        legendName = _settings$legendName === undefined ? {} : _settings$legendName,
        _settings$labelMap = settings.labelMap,
        labelMap = _settings$labelMap === undefined ? {} : _settings$labelMap,
        label = settings.label,
        itemStyle = settings.itemStyle,
        lineStyle = settings.lineStyle,
        areaStyle = settings.areaStyle,
        grid = settings.grid;


    function getMaxByKey(list, key) {
      var max = 0;
      list.forEach(function (item) {
        if (max < item[key]) {
          max = item[key];
        }
      });
      return max;
    }
    // 计算Y轴坐标最大最小值  左右两边分别计算
    var leftKeyList = columns.concat();
    leftKeyList.splice(0, 1); // 第一个X轴数据不需要
    var rightKeyList = [];
    if (axisSite.right) {
      // 存在右坐标
      for (var key in axisSite.right) {
        var item = axisSite.right[key];
        leftKeyList.splice(leftKeyList.indexOf(item), 1);
        rightKeyList.push(item);
      }
    }

    var max1 = 0;
    leftKeyList.forEach(function (item) {
      var max = getMaxByKey(rows, item);
      if (max1 < max) {
        max1 = max;
      }
    });

    var max2 = 0;
    rightKeyList.forEach(function (item) {
      var max = getMaxByKey(rows, item);
      if (max2 < max) {
        max2 = max;
      }
    });

    var min1 = 0;
    var min2 = 0;

    var emax = [0, 0];
    if (!max) {
      emax[0] = max1;
      emax[1] = max2;
    }
    var emin = [0, 0];
    if (!min) {
      emin[0] = min1;
      emin[1] = min2;
    }

    var tooltipVisible = extra.tooltipVisible,
        legendVisible = extra.legendVisible,
        tooltipFormatter = extra.tooltipFormatter;

    var metrics = columns.slice();

    if (axisSite.left && axisSite.right) {
      metrics = axisSite.left.concat(axisSite.right);
    } else if (axisSite.left && !axisSite.right) {
      metrics = axisSite.left;
    } else if (settings.metrics) {
      metrics = settings.metrics;
    } else {
      metrics.splice(columns.indexOf(dimension[0]), 1);
    }

    var legend$$1 = legendVisible && getLegend$1({ metrics: metrics, legendName: legendName, labelMap: labelMap });
    var tooltip$$1 = tooltipVisible && getLineTooltip({
      axisSite: axisSite,
      yAxisType: yAxisType,
      digit: digit,
      labelMap: labelMap,
      xAxisType: xAxisType,
      tooltipFormatter: tooltipFormatter
    });
    var xAxis = getLineXAxis({
      dimension: dimension,
      rows: rows,
      xAxisName: xAxisName,
      axisVisible: axisVisible,
      xAxisType: xAxisType
    });
    var yAxis = getLineYAxis({
      yAxisName: yAxisName,
      yAxisType: yAxisType,
      axisVisible: axisVisible,
      scale: scale,
      emin: emin,
      emax: emax,
      digit: digit
    });
    var series = getLineSeries({
      rows: rows,
      axisSite: axisSite,
      metrics: metrics,
      area: area,
      stack: stack,
      nullAddZero: nullAddZero,
      labelMap: labelMap,
      label: label,
      itemStyle: itemStyle,
      lineStyle: lineStyle,
      areaStyle: areaStyle,
      xAxisType: xAxisType,
      dimension: dimension
    });

    // 标题
    var title = {
      textStyle: {
        fontSize: 16,
        fontWeight: 500
      },
      padding: [20, // 上
      20, // 右
      20, // 下
      20 // 左
      ]
    };
    var _grid = getGrid(grid);
    var options = { title: title, legend: legend$$1, xAxis: xAxis, series: series, yAxis: yAxis, tooltip: tooltip$$1, grid: _grid };
    return options;
  };

  var VeLine = _extends({}, Core, {
    name: "VeLine",
    data: function data() {
      this.chartHandler = line$1;
      return {};
    }
  });

  var components = [VeBar, VeLine];

  function install(Vue, _) {
    components.forEach(function (component) {
      Vue.component(component.name, component);
    });
  }

  if (typeof window !== "undefined" && window.Vue) {
    install(window.Vue);
  }

  var index = {
    VeBar: VeBar,
    VeLine: VeLine,
    install: install
  };

  return index;

})));
