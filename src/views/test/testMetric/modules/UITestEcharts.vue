<template>
  <!-- <div class="container">
    <a-card class="card-container">
      <div class="chart-container">
        <v-chart class="chart" :option="chartOptions" />
      </div>
    </a-card>
    <a-card class="card-container">
      <div class="chart-container">
        <v-chart class="chart" :option="chartOptions" />
      </div>
    </a-card>
  </div> -->
  <!-- <a-row :gutter="10" class="flex-container">
    <a-col :span="16" class="flex-item">
      <a-card class="card-container">
        <div class="chart-container">
          <v-chart class="chart" :option="chartOptions" />
        </div>
      </a-card>
    </a-col>
    <a-col :span="8" class="flex-item">
      <a-card class="card-container">
        <div class="chart-container">
          <v-chart class="chart" :option="chartOptions" />
        </div>
      </a-card>
    </a-col>
  </a-row> -->
  <!-- <a-card title="功能模块数量统计" class="card-container">
    <div class="chart-container">
      <v-chart class="chart" :option="chartOptions" />
    </div>
  </a-card> -->
  <div class="chart-container">
    <!-- <button @click="updateChartData1">更新数据</button> -->
    <v-chart ref="myChart" class="chart" :option="chartOptions" autoresize />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import VChart, { THEME_KEY } from 'vue-echarts'
import '../../../../assets/fonts/font.css'

export default {
  name: 'Echarts',
  props: {
    seriesData: {
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
      chart: null,
      chartOptions: null,
      seriesData1: [
        { value: 35, name: '系统管理平台' },
        { value: 20, name: '安全管理平台' },
        { value: 6, name: '审计管理平台' },
        { value: 0, name: '其他' },
      ],
    }
  },
  created() {
    // console.log(this.seriesData)
  },
  watch: {
    seriesData: {
      handler(newVal, oldVal) {
        // console.info(newVal, oldVal)
        this.updateChartData(newVal)
      },
      deep: true,
    },
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      // console.log(this.seriesData)
      // const seriesData = this.seriesData1
      const seriesData = this.seriesData.seriesDataList
      // seriesData.forEach((item) => {
      //   item.value = item.total
      //   // delete item.total
      // })
      seriesData.map((item, index) => {
        item.value = seriesData[index].total
      })
      // console.log(seriesData)
      this.chartOptions = {
        // title: {
        //   text: '功能模块数量统计',
        //   // subtext: '1',
        //   top: '3%',
        //   left: '2%',
        //   textStyle: {
        //     fontSize: 18,
        //     fontWeight: 'normal',
        //     fontFamily: 'PingFang SC',
        //   },
        // },
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 15,
            fontWeight: 'normal',
            fontFamily: 'PingFang SC',
          },
        },
        legend: {
          type: 'scroll',
          // type: 'html',
          orient: 'vertical',
          top: '20%',
          left: '60%',
          // right: '-10%',
          algin: 'right',
          padding: [0, 0, 0, 0],
          itemGap: 15,
          textStyle: {
            fontSize: 15,
            fontWeight: 'normal',
            fontFamily: 'PingFang SC',
          },
          formatter: function (name) {
            let data = seriesData.find((item) => item.name === name)
            return `${name}                    ${data.value}`
            // return `<div class="legend-item" style="text-align: right;">${name} (${data.value})</div>`;
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            top: '-35%',
            left: '-50%',
            bottom: '-30%',
            radius: ['40%', '55%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            tooltip: {
              formatter: '{a} <br/>{b} : {c} ({d}%)', // 鼠标悬停时提示框显示的数据格式
            },
            data: seriesData,
          },
        ],
        graphic: {
          elements: [
            {
              type: 'text',
              z: 100,
              top: '25%',
              left: '21.3%',
              style: {
                fill: '#777',
                width: '100%',
                overflow: 'break',
                // text: '模块数量',
                text: this.seriesData.name,
                font: '15px PingFang SC',
              },
              onclick: {},
            },
            {
              type: 'text',
              z: 100,
              top: '36%',
              // left: '20%',
              left: this.seriesData.totalAll > 99 ? '20%' : this.seriesData.totalAll < 10 ? '23%' : '21.2%',
              style: {
                fill: '#333',
                width: '100%',
                overflow: 'break',
                // text: '100',
                text: this.seriesData.totalAll,
                font: '50px PingFang SC',
              },
            },
            {
              type: 'text',
              z: 100,
              top: '63%',
              left: this.seriesData.createdInCustomAll.week > 99 ? '19%' : '20%',
              style: {
                fill: '#777',
                width: '100%',
                overflow: 'break',
                // text: '本周：+ 100 >',
                text: `本周：+ ${this.seriesData.createdInCustomAll.week} >`,
                font: '16px PingFang SC',
              },
            },
          ],
        },
      }
    },
    updateChartData(newVal) {
      const seriesData = newVal.seriesDataList
      seriesData.map((item, index) => {
        item.value = seriesData[index].total
      })
      // console.log(seriesData)
      // 更新图表数据
      this.chartOptions = {
        // title: {
        //   text: '功能模块数量统计',
        //   // subtext: '1',
        //   top: '3%',
        //   left: '2%',
        //   textStyle: {
        //     fontSize: 18,
        //     fontWeight: 'normal',
        //     fontFamily: 'PingFang SC',
        //   },
        // },
        tooltip: {
          trigger: 'item',
          textStyle: {
            fontSize: 15,
            fontWeight: 'normal',
            fontFamily: 'PingFang SC',
          },
        },
        legend: {
          type: 'scroll',
          // type: 'html',
          orient: 'vertical',
          top: '20%',
          left: '60%',
          // right: '-10%',
          algin: 'right',
          padding: [0, 0, 0, 0],
          itemGap: 15,
          textStyle: {
            fontSize: 15,
            fontWeight: 'normal',
            fontFamily: 'PingFang SC',
          },
          formatter: function (name) {
            let data = seriesData.find((item) => item.name === name)
            return `${name}                    ${data.value}`
            // return `<div class="legend-item" style="text-align: right;">${name} (${data.value})</div>`;
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            top: '-35%',
            left: '-50%',
            bottom: '-30%',
            radius: ['40%', '55%'],
            avoidLabelOverlap: true,
            itemStyle: {
              borderRadius: 5,
              borderColor: '#fff',
              borderWidth: 2,
            },
            label: {
              show: false,
              position: 'center',
            },
            emphasis: {
              label: {
                show: false,
                fontSize: 40,
                fontWeight: 'bold',
              },
            },
            labelLine: {
              show: false,
            },
            tooltip: {
              formatter: '{a} <br/>{b} : {c} ({d}%)', // 鼠标悬停时提示框显示的数据格式
            },
            data: seriesData,
          },
        ],
        graphic: {
          elements: [
            {
              type: 'text',
              z: 100,
              top: '25%',
              left: '21.3%',
              style: {
                fill: '#777',
                width: '100%',
                overflow: 'break',
                // text: '模块数量',
                text: this.seriesData.name,
                font: '15px PingFang SC',
              },
              onclick: {},
            },
            {
              type: 'text',
              z: 100,
              top: '36%',
              // left: '20%',
              left: this.seriesData.totalAll > 99 ? '20%' : '21.5%',
              style: {
                fill: '#333',
                width: '100%',
                overflow: 'break',
                // text: '100',
                text: this.seriesData.totalAll,
                font: '50px PingFang SC',
              },
            },
            {
              type: 'text',
              z: 100,
              top: '63%',
              left: this.seriesData.createdInCustomAll.week > 99 ? '19%' : '20%',
              style: {
                fill: '#777',
                width: '100%',
                overflow: 'break',
                // text: '本周：+ 100 >',
                text: `本周：+ ${this.seriesData.createdInCustomAll.week} >`,
                font: '16px PingFang SC',
              },
            },
          ],
        },
      }
      // 触发图表重绘
      this.$refs.myChart.echarts && this.$refs.myChart.echarts.setOption(this.chartOptions, true);
    },
    updateChartData1() {
      this.chartOptions = {
        series: [
          {
            type: 'pie',
            radius: ['20%', '50%'],
            data: [
              { value: 3351, name: '直接访问' },
              { value: 3101, name: '邮件营销' },
              { value: 2341, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      // 触发图表重绘
      this.$refs.myChart.echarts && this.$refs.myChart.echarts.setOption(this.chartOptions, true);
    },
  },
}
</script>

<style lang="less" scope>
// .container {
//   // width: 100%;
//   // height: 350px;
//   // margin-top: -5px;
//   display: flex;
//   justify-content: space-between;

//   .card-container {
//     width: 50%;
//     height: 300px;
//     margin: 10px;

//     .chart-container {
//       // margin-left: -140px;
//       background-color: white;
//       width: 100%;
//       height: 300px;
//     }

//     .chart {
//       margin-left: -240px;
//       // flex: 1;
//     }
//   }
// }
.flex-container {
  display: flex;
}
.flex-item {
  flex: 1;
}
.card-container {
  // background-color: white;
  // width: 100%;
  // height: 320px;

  .chart-container {
    // margin-right: 40px;
    // background-color: white;
    width: 100%;
    height: 255px;
  }
}
.chart {
  // margin-right: 40px;
  flex: 1;
}
</style>
