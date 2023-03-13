<template>
  <div>
    <!--搜索栏 -->
    <el-card id="search" style=" height: 80px;">
      <el-row>
        <el-col :span="20">
          <span>数据库：</span>
          <el-select v-model="databaseValue" clearable placeholder="请选择" filterable="true" @change="databaseOptChange">
            <el-option
              v-for="item in databaseOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!--          <span>{{ this.databaseValue }}</span>-->
          <span>数据表：</span>
          <el-select v-model="tableValue" clearable placeholder="请选择" filterable="true">
            <el-option
              v-for="item in tableOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button type="primary" round icon="el-icon-search" @click="findData">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button type="primary" icon="el-icon-plus" circle/>
        </el-col>
      </el-row>
    </el-card>

    <!-- 图表 -->
    <el-row
      style="font-family: Arial, sans-serif;
  font-size: 24px;"
    >
      <el-col :span="12">
        <el-card header="数据量每日同比增长速率" style="margin-right: 10px">
          <div ref="echart1" style="height:200px"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="数据量每月环比增长速率" style="margin-left: 10px">
          <div ref="echart2" style="height:200px;"/>
        </el-card>
      </el-col>
    </el-row>
    <el-card
      header="数据量增长速率对比"
      style="font-family: Arial, sans-serif;
  font-size: 24px;"
    >
      <div ref="echart3" style="height:350px;"/>
    </el-card>
    <el-card
      header="值域检测异常个数"
      style="font-family: Arial, sans-serif;
  font-size: 24px;"
    >
      <div ref="echart4" style="height:400px;"/>
    </el-card>
  </div>
</template>

<script>
import accuracyApi from "@/api/accuracy";

export default {

  data() {
    return {
      myChart1: null,
      myChart2: null,
      myChart3: null,
      databaseOpts: [],
      tableOpts: [],
      databaseValue: '',
      tableValue: '',
      value: '',
      e1: {},
      e2: {},
      e3: {},
      e4: {
        source: [[]],
        series: []
      }
    }
  },
  created() {
    this.initDatabaseOpt()
  },
  mounted() {
    this.initEchart1()
    this.initEchart2()
    this.initEchart3()
    this.initEchart4()
    window.addEventListener('resize', () => {
      // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
      this.myChart4.resize()
    })
  },
  beforeDestroy() {
    /* 页面组件销毁的时候，别忘了移除绑定的监听resize事件，否则的话，多渲染几次
    容易导致内存泄漏和额外CPU或GPU占用哦*/
    window.removeEventListener('resize', () => {
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
      this.myChart4.resize()
    })
  },
  methods:
    {
      findData() {
        if (this.databaseValue.length !== 0 && this.tableValue.length !== 0) {
          accuracyApi.findData(this.databaseValue, this.tableValue).then(
            response => {
              this.e1 = response.data.e1Data
              this.e2 = response.data.e2Data
              this.e3 = response.data.e3Data
              this.e4 = response.data.e4Data
              this.initEchart1()
              this.initEchart2()
              this.initEchart3()
              this.initEchart4()
            }
          )
        } else {
          this.$message({
            message: '请选择数据库与数据表',
            type: 'fail'
          })
        }
      },
      initDatabaseOpt() {
        accuracyApi.initDatabaseOpt().then(response => {
          this.databaseOpts = response.data
        })
      },
      databaseOptChange(value) {
        this.tableValue = ''
        this.initTableOpt(value)
      },
      initTableOpt(value) {
        accuracyApi.initTableOpt(value).then(response => {
          this.tableOpts = response.data
        })
      },
      initEchart1() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart1 = this.$echarts.init(this.$refs.echart1)

        // 指定图表的配置项和数据
        var option = {
          xAxis: {
            type: 'category',
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '30%'],
            axisLabel: {
              inside: false,
              formatter: '{value}%\n'
            }
          },
          visualMap: {
            type: 'piecewise',
            show: false,
            dimension: 0,
            seriesIndex: 0,
            pieces: [
              {
                gt: 1,
                lt: 3,
                color: 'rgba(0, 0, 180, 0.4)'
              },
              {
                gt: 5,
                lt: 7,
                color: 'rgba(0, 0, 180, 0.4)'
              }
            ]
          },
          series: [
            {
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#5470C6',
                width: 2
              },
              markLine: {
                symbol: ['none', 'none'],
                label: {show: false},
                data: [{xAxis: 1}, {xAxis: 3}, {xAxis: 5}, {xAxis: 7}]
              },
              areaStyle: {},
              data: this.e1
            }
          ],
          grid: { // 让图表占满容器
            top: '20px',
            bottom: '20px'
          }
        }

        // 使用刚指定的配置项和数据显示图表。
        this.myChart1.setOption(option)
      },
      initEchart2() {
        this.myChart2 = this.$echarts.init(this.$refs.echart2)
        var option = {
          xAxis: {
            type: 'category',
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            boundaryGap: [0, '30%'],
            axisLabel: {
              inside: false,
              formatter: '{value}%\n'
            }
          },
          visualMap: {
            type: 'piecewise',
            show: false,
            dimension: 0,
            seriesIndex: 0,
            pieces: [
              {
                gt: 1,
                lt: 3,
                color: 'rgba(0, 0, 180, 0.4)'
              },
              {
                gt: 5,
                lt: 7,
                color: 'rgba(0, 0, 180, 0.4)'
              }
            ]
          },
          series: [
            {
              type: 'line',
              smooth: 0.6,
              symbol: 'none',
              lineStyle: {
                color: '#5470C6',
                width: 2
              },
              markLine: {
                symbol: ['none', 'none'],
                label: {show: false},
                data: [{xAxis: 1}, {xAxis: 3}, {xAxis: 5}, {xAxis: 7}]
              },
              areaStyle: {},
              data: this.e2
            }
          ],
          grid: { // 让图表占满容器
            top: '20px',
            bottom: '20px'
          }
        }
        // 使用刚指定的配置项和数据显示图表。
        this.myChart2.setOption(option)
      },
      initEchart3() {
        this.myChart3 = this.$echarts.init(this.$refs.echart3)
        var ec = this.$echarts
        var option = {
          title: {
            left: 'center',
            text: ''
          },
          legend: {
            top: 'bottom',
            data: ['Intention']
          },
          tooltip: {
            triggerOn: 'none',
            position: function (pt) {
              return [pt[0], 130]
            }
          },
          toolbox: {
            left: 'center',
            itemSize: 25,
            top: 55,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              restore: {}
            }
          },
          xAxis: {
            type: 'time',
            axisPointer: {
              value: '2016-10-7',
              snap: true,
              lineStyle: {
                color: '#7581BD',
                width: 2
              },
              label: {
                show: true,
                // formatter: function (params) {
                //   return ec.format.formatTime('yyyy-MM-dd', params.value)
                // },
                backgroundColor: '#7581BD'
              },
              handle: {
                show: true,
                color: '#7581BD'
              }
            },
            splitLine: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            axisTick: {
              inside: true
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              inside: true,
              formatter: '{value}%\n'
            },
            z: 10
          },
          grid: {
            top: 80,
            left: 15,
            right: 15,
            height: 160
          },
          dataZoom: [
            {
              type: 'inside',
              throttle: 50
            }
          ],
          series: [
            {
              name: '环比增长率',
              type: 'line',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              sampling: 'average',
              itemStyle: {
                color: '#0770FF'
              },
              stack: 'a',
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(58,77,233,0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(58,77,233,0.3)'
                  }
                ])
              },
              data: this.e1
            },
            {
              name: '同比增长率',
              type: 'line',
              smooth: true,
              stack: 'a',
              symbol: 'circle',
              symbolSize: 5,
              sampling: 'average',
              itemStyle: {
                color: '#F2597F'
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgba(213,72,120,0.8)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(213,72,120,0.3)'
                  }
                ])
              },
              data: this.e2
            }
          ]
        }
        this.myChart3.setOption(option)
      },
      initEchart4() {
        this.myChart4 = new this.$echarts.init(this.$refs.echart4)
        var option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: this.e4.source
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: this.e4.series,
          grid: { // 让图表占满容器
            // top: '10px',
            bottom: '20px'
          }
        }

        // 使用刚指定的配置项和数据显示图表。
        this.myChart4.setOption(option)
      }
    }
}

</script>

<style>
#search .el-input {
  width: 230px;
  margin-right: 50px;
}

.el-dialog .el-input {
  width: 75%;
}

</style>
