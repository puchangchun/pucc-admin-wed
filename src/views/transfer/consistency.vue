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
        <el-card header="数据量一致性分析" style="margin-right: 10px">
          <div ref="echart1" style="height:260px"/>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="源表血源关系分析" style="margin-left: 10px">
          <div ref="echart2" style="height:260px;"/>
        </el-card>
      </el-col>
    </el-row>
    <el-card
      header="数据量对比分析"
      style="font-family: Arial, sans-serif;
  font-size: 24px;"
    >
      <div ref="echart3" style="height:400px;"/>
    </el-card>
  </div>
</template>

<script>
import consistencyApi from '@/api/consistency'

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
      searchModel: {},
      e1: {
        xData: [],
        yData1: [],
        yData2: []
      },
      e2: {
        data: [],
        links: []
      },
      e3: {
        xData: [],
        y1Data: [],
        y2Data: [],
        y3Data: [],
        y4Data: []
      },
      e4: {}
    }
  },
  mounted() {
    // this.initEchart1()
    // this.initEchart2()
    // this.initEchart3()
    window.addEventListener('resize', () => {
      // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
    })
  },
  beforeDestroy() {
    /* 页面组件销毁的时候，别忘了移除绑定的监听resize事件，否则的话，多渲染几次
    容易导致内存泄漏和额外CPU或GPU占用哦*/
    window.removeEventListener('resize', () => {
      this.myChart1.resize()
      this.myChart2.resize()
      this.myChart3.resize()
    })
  },
  created() {
    this.initDatabaseOpt()
  },
  methods:
    {
      findData() {
        if (this.databaseValue.length !== 0 && this.tableValue.length !== 0) {
          consistencyApi.findData(this.databaseValue, this.tableValue).then(
            response => {
              this.e1 = response.data.e1Data
              this.e2 = response.data.e2Data
              this.e3 = response.data.e3Data
              this.initEchart1()
              this.initEchart2()
              this.initEchart3()
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
        consistencyApi.initDatabaseOpt().then(response => {
          this.databaseOpts = response.data
        })
      },
      databaseOptChange(value) {
        this.tableValue = ''
        this.initTableOpt(value)
      },
      initTableOpt(value) {
        consistencyApi.initTableOpt(value).then(response => {
          this.tableOpts = response.data
        })
      },
      initEchart1() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart1 = this.$echarts.init(this.$refs.echart1)

        // 指定图表的配置项和数据
        var option = {
          title: {
            text: '',
            subtext: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: ['目标表数据量', '源表数据量']
          },
          toolbox: {
            show: true,
            feature: {
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar']},
              restore: {show: true},
              saveAsImage: {show: true}
            }
          },
          calculable: true,
          xAxis: [
            {
              type: 'category',
              // prettier-ignore
              data: this.e1.xData.reverse()
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              name: '目标表数据量',
              type: 'bar',
              data: this.e1.yData1.reverse(),
              markPoint: {
                data: [
                  {type: 'max', name: 'Max'}
                ]
              }
            },
            {
              name: '源表数据量',
              type: 'bar',
              data: this.e1.yData2.reverse(),
              markPoint: {
                data: [
                  {type: 'max', name: 'Max'}
                ]
              }
            }
          ],
          grid: { // 让图表占满容器
            // top: '10px',
            bottom: '20px'
          }
        }

        // 使用刚指定的配置项和数据显示图表。
        this.myChart1.setOption(option)
      },
      initEchart2() {
        this.myChart2 = this.$echarts.init(this.$refs.echart2)
        var option = {
          title: {
            text: ''
          },
          tooltip: {},
          animationDurationUpdate: 1500,
          animationEasingUpdate: 'quinticInOut',
          series: [
            {
              type: 'graph',
              layout: 'none',
              symbolSize: 50,
              roam: true,
              label: {
                show: true
              },
              edgeSymbol: ['circle', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                fontSize: 20
              },
              data: this.e2.data,
              links: this.e2.links,
              lineStyle: {
                opacity: 0.9,
                width: 2,
                curveness: 0
              }
            }
          ],
          grid: { // 让图表占满容器
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px'
          }
        }
        // 使用刚指定的配置项和数据显示图表。
        this.myChart2.setOption(option)
      },
      initEchart3() {
        this.myChart3 = this.$echarts.init(this.$refs.echart3)
        var option = {
          color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#6a7985'
              }
            }
          },
          legend: {
            data: ['目标表数据量', '两表一致数据量', '源表数据量', '目标表重复数据量']
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              data: this.e3.xData.reverse()
            }
          ],
          yAxis: [
            {
              type: 'value',
              show: false
            }
          ],
          series: [
            {
              name: '目标表数据量',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(128, 255, 165)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(1, 191, 236)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: this.e3.y1Data.reverse()
            },
            {
              name: '两表一致数据量',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(0, 221, 255)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(77, 119, 255)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: this.e3.y2Data.reverse()
            },
            {
              name: '源表数据量',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(55, 162, 255)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(116, 21, 219)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: this.e3.y3Data.reverse()
            },
            {
              name: '目标表重复数据量',
              type: 'line',
              stack: 'Total',
              smooth: true,
              lineStyle: {
                width: 0
              },
              showSymbol: false,
              areaStyle: {
                opacity: 0.8,
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: 'rgb(255, 0, 135)'
                  },
                  {
                    offset: 1,
                    color: 'rgb(135, 0, 157)'
                  }
                ])
              },
              emphasis: {
                focus: 'series'
              },
              data: this.e3.y4Data.reverse()
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表。
        this.myChart3.setOption(option)
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
