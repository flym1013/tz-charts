export default {
  name: "饼图",
  type: "pie",
  data: [
    {
      name: "简单饼图",
      data: {
        columns: ["日期", "余额", "余额1"],
        rows: [
          { 日期: "我的", 余额: 123, 余额1: 123 },
          { 日期: "1-2", 余额: 1223, 余额1: 123 },
          { 日期: "1-3", 余额: 2123, 余额1: 123 },
          { 日期: "1-4", 余额: 4123, 余额1: 123 },
          { 日期: "1-5", 余额: 3123, 余额1: 123 },
          { 日期: "1-6", 余额: 7123, 余额1: 123 }
        ]
      },
      settings: {
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        tooltipMap: { 余额: "我的余额", 余额1: "我的余额1" }
      }
    },
    {
      name: "简单饼图-显示label",
      data: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 123 },
          { 日期: "1-2", 余额: 1223 },
          { 日期: "1-3", 余额: 2123 },
          { 日期: "1-4", 余额: 4123 },
          { 日期: "1-5", 余额: 3123 },
          { 日期: "1-6", 余额: 7123 }
        ]
      },
      settings: {}
    },
    {
      name: "自定义label",
      data: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 123 },
          { 日期: "1-2", 余额: 1223 },
          { 日期: "1-3", 余额: 2123 },
          { 日期: "1-4", 余额: 4123 },
          { 日期: "1-5", 余额: 3123 },
          { 日期: "1-6", 余额: 7123 }
        ]
      },
      settings: {
        label: {
          formatter: "{b} : {c} ({d}%)"
        }
      }
    },
    {
      name: "基础环图",
      data: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 123 },
          { 日期: "1-2", 余额: 1223 },
          { 日期: "1-3", 余额: 2123 },
          { 日期: "1-4", 余额: 4123 },
          { 日期: "1-5", 余额: 3123 },
          { 日期: "1-6", 余额: 7123 }
        ]
      },
      settings: {
        level: [[], ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6"]]
      }
    },
    {
      name: "基础环图(下钻)",
      data: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 123 },
          { 日期: "1-2", 余额: 1223 },
          { 日期: "1-3", 余额: 2123 },
          { 日期: "1-4", 余额: 4123 },
          { 日期: "1-5", 余额: 3123 },
          { 日期: "1-6", 余额: 7123 }
        ]
      },
      settings: {
        level: [[], ["1-1", "1-2", "1-3", "1-4", "1-5", "1-6"]],
        downPie: true
      }
    },
    {
      name: "嵌套饼图",
      data: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 123 },
          { 日期: "1-2", 余额: 1223 },
          { 日期: "1-3", 余额: 2123 },
          { 日期: "1-4", 余额: 4123 },
          { 日期: "1-5", 余额: 3123 },
          { 日期: "1-6", 余额: 7123 }
        ]
      },
      settings: {
        level: [
          ["1-5", "1-6"],
          ["1-1", "1-2", "1-3", "1-4"]
        ]
      }
    },
    {
      name: "限制显示条数饼图",
      data: {
        columns: ["日期", "余额"],
        rows: [
          { 日期: "1-1", 余额: 123 },
          { 日期: "1-2", 余额: 1223 },
          { 日期: "1-3", 余额: 2123 },
          { 日期: "1-4", 余额: 4123 },
          { 日期: "1-5", 余额: 3123 },
          { 日期: "1-6", 余额: 7123 }
        ]
      },
      settings: {
        limitShowNum: 4
      }
    }
    // {
    //   name: '玫瑰图',
    //   data: {
    //     columns: ['日期', '余额', '年龄'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '年龄': 3 },
    //       { '日期': '1-2', '余额': 1223, '年龄': 6 },
    //       { '日期': '1-3', '余额': 2123, '年龄': 9 },
    //       { '日期': '1-4', '余额': 4123, '年龄': 12 },
    //       { '日期': '1-5', '余额': 3123, '年龄': 15 },
    //       { '日期': '1-6', '余额': 7123, '年龄': 20 }
    //     ]
    //   },
    //   settings: {
    //     roseType: 'radius'
    //   }
    // },
    // {
    //   name: '限制显示条数',
    //   data: {
    //     columns: ['日期', '余额', '年龄'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '年龄': 3 },
    //       { '日期': '1-2', '余额': 1223, '年龄': 6 },
    //       { '日期': '1-3', '余额': 2123, '年龄': 9 },
    //       { '日期': '1-4', '余额': 4123, '年龄': 12 },
    //       { '日期': '1-5', '余额': 3123, '年龄': 15 },
    //       { '日期': '1-6', '余额': 7123, '年龄': 20 },
    //       { '日期': '1-7', '余额': 4123, '年龄': 20 },
    //       { '日期': '1-8', '余额': 1123, '年龄': 20 },
    //       { '日期': '1-9', '余额': 5223, '年龄': 20 },
    //       { '日期': '1-10', '余额': 9123, '年龄': 20 },
    //       { '日期': '1-11', '余额': 4123, '年龄': 20 }
    //     ]
    //   },
    //   settings: {
    //     limitShowNum: 5
    //   }
    // },
    // {
    //   name: '多圆饼图',
    //   data: {
    //     columns: ['日期', '余额', '年龄'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '年龄': 3 },
    //       { '日期': '1-2', '余额': 1223, '年龄': 6 },
    //       { '日期': '1-3', '余额': 2123, '年龄': 9 },
    //       { '日期': '1-4', '余额': 4123, '年龄': 12 },
    //       { '日期': '1-5', '余额': 3123, '年龄': 15 },
    //       { '日期': '1-6', '余额': 7123, '年龄': 20 },
    //       { '日期': '1-7', '余额': 4123, '年龄': 20 },
    //       { '日期': '1-8', '余额': 1123, '年龄': 20 },
    //       { '日期': '1-9', '余额': 5223, '年龄': 20 },
    //       { '日期': '1-10', '余额': 9123, '年龄': 20 },
    //       { '日期': '1-11', '余额': 4123, '年龄': 20 }
    //     ]
    //   },
    //   settings: {
    //     level: [
    //       ['1-1', '1-2', '1-3'],
    //       ['1-4', '1-5']
    //     ]
    //   }
    // },
    // {
    //   name: '设置数据类型',
    //   data: {
    //     columns: ['日期', '比率'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '比率': 0.00001 },
    //       { '日期': '1-2', '余额': 1223, '比率': 0.0002 },
    //       { '日期': '1-3', '余额': 2123, '比率': 0.003 },
    //       { '日期': '1-4', '余额': 4123, '比率': 0.0004 },
    //       { '日期': '1-5', '余额': 3123, '比率': 0.005 },
    //       { '日期': '1-6', '余额': 7123, '比率': 0.06 }
    //     ]
    //   },
    //   settings: {
    //     dataType: 'percent',
    //     digit: 4
    //   }
    // },
    // {
    //   name: '指标维度配置',
    //   data: {
    //     columns: ['日期', '余额', '年龄'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '年龄': 3 },
    //       { '日期': '1-2', '余额': 1223, '年龄': 6 },
    //       { '日期': '1-3', '余额': 2123, '年龄': 9 },
    //       { '日期': '1-4', '余额': 4123, '年龄': 12 },
    //       { '日期': '1-5', '余额': 3123, '年龄': 15 },
    //       { '日期': '1-6', '余额': 7123, '年龄': 20 }
    //     ]
    //   },
    //   settings: {
    //     dimension: '余额',
    //     metrics: '年龄'
    //   }
    // },
    // {
    //   name: '限制legend显示长度',
    //   data: {
    //     columns: ['日期', '余额', '比率'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '比率': 0.1 },
    //       { '日期': '1-2', '余额': 1223, '比率': 0.2 },
    //       { '日期': '1-3', '余额': 2123, '比率': 0.3 },
    //       { '日期': '1-4', '余额': 4123, '比率': 0.4 },
    //       { '日期': '1-5', '余额': 3123, '比率': 0.5 },
    //       { '日期': '1-6', '余额': 7123, '比率': 0.6 }
    //     ]
    //   },
    //   settings: {
    //     legendLimit: 2
    //   }
    // },
    // {
    //   name: '设置饼图样式1',
    //   data: {
    //     columns: ['日期', '余额', '比率'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '比率': 0.1 },
    //       { '日期': '1-2', '余额': 1223, '比率': 0.2 },
    //       { '日期': '1-3', '余额': 2123, '比率': 0.3 },
    //       { '日期': '1-4', '余额': 4123, '比率': 0.4 },
    //       { '日期': '1-5', '余额': 3123, '比率': 0.5 },
    //       { '日期': '1-6', '余额': 7123, '比率': 0.6 }
    //     ]
    //   },
    //   settings: {
    //     radius: 10,
    //     offsetY: 300
    //   }
    // },
    // {
    //   name: '设置饼图样式2',
    //   data: {
    //     columns: ['日期', '余额', '比率'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '比率': 0.1 },
    //       { '日期': '1-2', '余额': 1223, '比率': 0.2 },
    //       { '日期': '1-3', '余额': 2123, '比率': 0.3 },
    //       { '日期': '1-4', '余额': 4123, '比率': 0.4 },
    //       { '日期': '1-5', '余额': 3123, '比率': 0.5 },
    //       { '日期': '1-6', '余额': 7123, '比率': 0.6 }
    //     ]
    //   },
    //   settings: {
    //     itemStyle: {
    //       normal: {
    //         borderWidth: 4,
    //         borderColor: '#58b4ff'
    //       }
    //     }
    //   }
    // },
    // {
    //   name: '设置legend别名饼图',
    //   data: {
    //     columns: ['日期', '余额', '比率'],
    //     rows: [
    //       { '日期': '1-1', '余额': 123, '比率': 0.1 },
    //       { '日期': '1-2', '余额': 1223, '比率': 0.2 },
    //       { '日期': '1-3', '余额': 2123, '比率': 0.3 },
    //       { '日期': '1-4', '余额': 4123, '比率': 0.4 },
    //       { '日期': '1-5', '余额': 3123, '比率': 0.5 },
    //       { '日期': '1-6', '余额': 7123, '比率': 0.6 }
    //     ]
    //   },
    //   settings: {
    //     limitShowNum: 5,
    //     legendName: {
    //       '其他': '别的时间的时候biu~'
    //     }
    //   }
    // }
  ]
};
