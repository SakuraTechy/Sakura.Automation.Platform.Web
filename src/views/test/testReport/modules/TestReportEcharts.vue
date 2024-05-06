<template>
  <div class="test">
    <v-chart class="chart" :option="getPieOption()" autoresize />
    <v-chart class="chart" :option="getBarOption()" autoresize />
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { BarChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'

use([TooltipComponent, LegendComponent, GridComponent, CanvasRenderer, PieChart, BarChart])

import { ref } from 'vue'
import VChart, { THEME_KEY } from 'vue-echarts'
import '../../../../assets/fonts/font.css';

export default {
  name: 'Echarts',
  props: {
    record: {
      type: Object,
    },
  },
  components: {
    VChart,
  },
  provide: {
    // 主题颜色（white/dark）
    [THEME_KEY]: 'white',
  },
  data() {
    return {
      pieOption: {},
      barOption: {},
      PieOptionData: [
        { value: this.record.statisticAnalysis.ui.scenePass, name: '通过' },
        { value: this.record.statisticAnalysis.ui.sceneFail, name: '失败' },
        { value: this.record.statisticAnalysis.ui.sceneSkip, name: '跳过' },
      ],
      BarOptionPassData: [
        this.record.statisticAnalysis.ui.stepPass,
        this.record.statisticAnalysis.ui.casePass,
        this.record.statisticAnalysis.ui.scenePass,
      ],
      BarOptionFailData: [
        this.record.statisticAnalysis.ui.stepFail,
        this.record.statisticAnalysis.ui.caseFail,
        this.record.statisticAnalysis.ui.sceneFail,
      ],
      BarOptionSkipData: [
        this.record.statisticAnalysis.ui.stepSkip,
        this.record.statisticAnalysis.ui.caseSkip,
        this.record.statisticAnalysis.ui.sceneSkip,
      ],
    }
  },
  created() {
    // console.log(this.record)
  },
  mounted() {
    //   this.option = {
    //     xAxis: {
    //       type: "category",
    //       data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //     },
    //     yAxis: {
    //       type: "value",
    //     },
    //     series: [
    //       {
    //         data: [150, 230, 224, 218, 135, 147, 260],
    //         type: "line",
    //       },
    //     ],
    //   }
    // this.PieOptionData = this.filterPositiveValues(this.PieOptionData)
    // this.BarOptionPassData = this.filterPositive(this.BarOptionPassData)
    // this.BarOptionFailData = this.filterPositive(this.BarOptionFailData)
    // this.BarOptionSkipData = this.filterPositive(this.BarOptionSkipData)
    // console.log(this.BarOptionPassData)
  },
  methods: {
    filterPositiveValues(data) {
      return data.filter((item) => item.value > 0)
    },
    filterPositiveValues1(data) {
      return data.filter((item) => item.value > 0)
    },
    filterPositive(data) {
      return data.filter(item => item != 0)
    },
    getPieOption() {
      return (this.pieOption = {
        // title: {
        //   text: 'World Population'
        // },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)',
        },
        textStyle: {
          fontFamily: 'PingFang SC', // 将这里替换为你的自定义字体名称
        },
        legend: {
          x: 'center', // 图例水平位置，可选：'left', 'center', 'right'
          y: 'top', // 图例垂直位置，可选：'top', 'middle', 'bottom'
          itemGap: 10, // 图例项之间的间距
          top: -5, // 设置图例距离series的距离
          data: ['通过', '失败', '跳过'], // 图例数据
        },
        series: [
          // {
          //   name: '测试场景统计',
          //   type: 'pie',
          //   color: ['#91CC75', '#F56A6A', '#FAC858'],
          //   selectedMode: 'single',
          //   radius: [0, '30%'],
          //   label: {
          //     position: 'inner',
          //     fontSize: 14,
          //   },
          //   labelLine: {
          //     show: false,
          //   },
          //   data: [
          //     { value: 1548, name: '通过' },
          //     { value: 775, name: '失败', selected: true },
          //     { value: 679, name: '跳过' },
          //   ],
          // },
          {
            name: '测试场景统计',
            type: 'pie',
            color: [
              '#00C853',
              '#EF5350',
              '#FAC858',
            ],
            radius: ['35%', '55%'],
            // avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2,
            },
            labelLine: {
              length: 30,
            },
            label: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#F6F8FC',
              borderColor: '#8C8D8E',
              borderWidth: 1,
              borderRadius: 4,
              rich: {
                a: {
                  fontFamily: 'Arial',
                  color: '#6E7079',
                  lineHeight: 22,
                  align: 'center',
                },
                hr: {
                  fontFamily: 'Microsoft YaHei',
                  borderColor: '#8C8D8E',
                  width: '100%',
                  borderWidth: 1,
                  height: 0,
                },
                b: {
                  fontFamily: 'Microsoft YaHei',
                  color: '#4C5058',
                  fontSize: 14,
                  fontWeight: 'bold',
                  lineHeight: 33,
                },
                per: {
                  fontFamily: 'Microsoft YaHei',
                  color: '#fff',
                  backgroundColor: '#4C5058',
                  padding: [3, 4],
                  borderRadius: 4,
                },
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold',
              },
            },
            data: this.PieOptionData,
          },
        ],
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          borderWidth: 0,
          containLabel: true,
        },
      })
    },
    getBarOption() {
      return (this.barOption = {
        // title: {
        //   text: 'World Population'
        // },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
          },
        },
        textStyle: {
          fontFamily: 'PingFang SC', // 将这里替换为你的自定义字体名称
        },
        legend: {
          itemGap: 10,
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['测试步骤统计', '测试用例统计', '测试场景统计'],
        },
        series: [
          {
            name: '通过',
            type: 'bar',
            color: '#00C853',
            // stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.BarOptionPassData
            // data: [1, 1, 1]
          },
          {
            name: '失败',
            type: 'bar',
            color: '#EF5350',
            // stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.BarOptionFailData
            // data: [0, 0, 1]
          },
          {
            name: '跳过',
            type: 'bar',
            color: '#FAC858',
            // stack: 'total',
            label: {
              show: true,
            },
            emphasis: {
              focus: 'series',
            },
            data: this.BarOptionSkipData
            // data: [1, 1, 1]
          },
        ],
      })
    },
  },
}
</script>

<style lang="less" scope>
.test {
  // width: 100%;
  height: 380px;
  // margin-top: -5px;
  display: flex;
}
.chart {
  flex: 1;
}
</style>
