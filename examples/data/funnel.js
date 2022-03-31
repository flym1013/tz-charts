export default {
  name: "漏斗图",
  type: "funnel",
  data: [
    {
      name: "简单漏斗图",
      data: {
        columns: ["状态", "数值"],
        rows: [
          { 状态: "展示", 数值: 900, 数值1: 123 },
          { 状态: "访问", 数值: 600, 数值1: 123 },
          { 状态: "点击", 数值: 300, 数值1: 34 },
          { 状态: "订单", 数值: 100, 数值1: 940 }
        ]
      },
      settings: {
        tooltipMap: { 数值: "我的数值", 数值1: "我的数值1" }
      }
    },
    {
      name: "使用默认顺序",
      data: {
        columns: ["状态", "数值"],
        rows: [
          { 状态: "展示", 数值: 900 },
          { 状态: "访问", 数值: 100 },
          { 状态: "零", 数值: 0 },
          { 状态: "点击", 数值: 300 },
          { 状态: "订单", 数值: 200 }
        ]
      },
      settings: {
        useDefaultOrder: true,
        filterZero: true
      }
    },
    {
      name: "定制维度顺序",
      data: {
        columns: ["状态", "数值"],
        rows: [
          { 状态: "展示", 数值: 900 },
          { 状态: "访问", 数值: 600 },
          { 状态: "点击", 数值: 300 },
          { 状态: "订单", 数值: 100 }
        ]
      },
      settings: {
        sequence: ["订单", "点击", "访问", "展示"]
      }
    },
    {
      name: "数据类型配置",
      data: {
        columns: ["状态", "数值"],
        rows: [
          { 状态: "展示", 数值: 0.9 },
          { 状态: "访问", 数值: 0.6 },
          { 状态: "点击", 数值: 0.3 },
          { 状态: "订单", 数值: 0.00001 }
        ]
      },
      settings: {
        dataType: "percent",
        digit: 4
      }
    },
    {
      name: "金字塔",
      data: {
        columns: ["状态", "数值"],
        rows: [
          { 状态: "展示", 数值: 900 },
          { 状态: "访问", 数值: 600 },
          { 状态: "点击", 数值: 300 },
          { 状态: "订单", 数值: 100 }
        ]
      },
      settings: {
        ascending: true
      }
    },
    {
      name: "指标维度配置",
      data: {
        columns: ["状态", "状态1", "数值"],
        rows: [
          { 状态: "展示", 状态1: "展示1", 数值: 900 },
          { 状态: "访问", 状态1: "访问1", 数值: 600 },
          { 状态: "点击", 状态1: "点击1", 数值: 300 },
          { 状态: "订单", 状态1: "订单1", 数值: 100 }
        ]
      },
      settings: {
        dimension: "状态1",
        metrics: "数值"
      }
    },
    {
      name: "样式配置",
      data: {
        columns: ["状态", "状态1", "数值"],
        rows: [
          { 状态: "展示", 状态1: "展示1", 数值: 900 },
          { 状态: "访问", 状态1: "访问1", 数值: 600 },
          { 状态: "点击", 状态1: "点击1", 数值: 300 },
          { 状态: "订单", 状态1: "订单1", 数值: 100 }
        ]
      },
      settings: {
        dimension: "状态1",
        metrics: "数值",
        label: {
          normal: {
            show: true,
            color: "#00f"
          }
        }
      }
    },
    {
      name: "设置legend别名漏斗图",
      data: {
        columns: ["状态", "数值"],
        rows: [
          { 状态: "展示", 数值: 0.9 },
          { 状态: "访问", 数值: 0.6 },
          { 状态: "点击", 数值: 0.3 },
          { 状态: "订单", 数值: 0.00001 }
        ]
      },
      settings: {
        legendName: {
          订单: "订单biubiu～"
        }
      }
    }
  ]
};
