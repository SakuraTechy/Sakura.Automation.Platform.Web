<template>
  <div class="report-info">
    <a-card :bordered="false" style="margin-bottom: 10px">
      <div class="header-info">
        <span>测试场景1</span>
        <span>开始时间：2022-8-23 9:00:00</span>
        <span>结束时间：2022-8-23 9:02:00</span>
      </div>
      <div class="header-chart">
        <div class="chart">
          <div>479ms</div>
          <div ref="reportChart" id="report-chart">
          </div>
          <div>
            <div class="chart-success">
              <span class="success-circle"></span>
              <span>2 成功</span>
            </div>
            <div class="chart-fail">
              <span class="fail-circle"></span>
              <span>1 失败</span>
            </div>
          </div>
        </div>
        <div class="chart-info">
          场景
        </div>
        <div class="chart-result">
          结果
        </div>
      </div>

    </a-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'ReportInfo',
  data() {
    return {
      reportChart: null,
      total: 3,
      reportData: [
        { value: 2, name: '成功' },
        { value: 1, name: '失败' }
      ]
    }
  },
  mounted() {
    this.getFirstChart()
    window.addEventListener('resize', () => {
      this.reportChart.resize()
    })
  },
  methods: {
    getFirstChart() {
      const option = {
        title: {
          text: this.total,
          subtext: '指令',
          left: 'center',
          top: 'center'
        },
        color: ['#69c242', '#f36b6e'],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '测试报告',
            type: 'pie',
            radius: ['40%', '55%'],
            center: ['50%', '50%'],
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: this.reportData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.reportChart = echarts.init(this.$refs.reportChart, 'reportChart')
      this.reportChart.setOption(option)
    }
  }
}
</script>
<style lang="less" scoped>
.report-info {
  width: 100%;
  background-color: #f0f2f5;
}
.header-info {
  font-size: 16px;
  font-weight: 700;
  margin-top: 10px;
  span {
    margin: 0 10px;
  }
}
#report-chart {
  width: 300px;
  height: 300px;
}
.header-chart {
  display: flex;
  height: 300px;
  justify-content: center;
  align-items: center;
  >div {
    flex:1;
    margin: 0 10px;
  }
  .chart {
    display: flex;
    height: 300px;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    font-weight: 700;
    .chart-success {
      text-align: center;
      line-height: 50px;
      width: 100px;
      height: 50px;
      border-bottom: 1px solid #ccc;
      .success-circle {
         display: inline-block;
         width: 10px;
         height: 10px;
         border-radius: 50%;
         background-color: #69c242;
         margin-right: 10px;
      }
    }
    .chart-fail {
      text-align: center;
      line-height: 50px;
      width: 100px;
      height: 50px;
      .fail-circle {
        display: inline-block;
         width: 10px;
         height: 10px;
         border-radius: 50%;
         background-color: #f36b6e;
         margin-right: 10px;
      }
    }
  }
}
</style>
