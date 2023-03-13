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
    <el-card
      header="字段空值检测"
      style="font-family: Arial, sans-serif;
  font-size: 24px;"
    >
      <div ref="echart1" style="height:320px;"/>
    </el-card>
    <el-card
      header="重复数据检测"
      style="font-family: Arial, sans-serif;
  font-size: 24px;"
    >
      <div ref="echart2" style="height:300px;"/>
    </el-card>
  </div>
</template>

<script>
import completenessApi from '@/api/completeness'

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
      e1: {
        xData: [],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            stack: 'total',
            label: {
              show: true
            },
            emphasis: {
              focus: 'series'
            },
            data: []
          }
        ]
      },
      e2: {
        source: [[]],
        series: []
      }
    }
  },
  created() {
    this.initDatabaseOpt()
  },
  mounted() {
    // this.initEchart1()
    // this.initEchart2()
    window.addEventListener('resize', () => {
      // 第六步，执行echarts自带的resize方法，即可做到让echarts图表自适应
      this.myChart1.resize()
      this.myChart2.resize()
    })
  },
  beforeDestroy() {
    /* 页面组件销毁的时候，别忘了移除绑定的监听resize事件，否则的话，多渲染几次
    容易导致内存泄漏和额外CPU或GPU占用哦*/
    window.removeEventListener('resize', () => {
      this.myChart1.resize()
      this.myChart2.resize()
    })
  },
  methods:
    {
      findData() {
        if (this.databaseValue.length !== 0 && this.tableValue.length !== 0) {
          completenessApi.findData(this.databaseValue, this.tableValue).then(
            response => {
              this.e1 = response.data.e1Data
              this.e2 = response.data.e2Data
              this.initEchart1()
              this.initEchart2()
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
        completenessApi.initDatabaseOpt().then(response => {
          this.databaseOpts = response.data
        })
      },
      databaseOptChange(value) {
        this.tableValue = ''
        this.initTableOpt(value)
      },
      initTableOpt(value) {
        completenessApi.initTableOpt(value).then(response => {
          this.tableOpts = response.data
        })
      },
      initEchart1() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart1 = this.$echarts.init(this.$refs.echart1)

        // 指定图表的配置项和数据
        var option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // Use axis to trigger tooltip
              type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
            }
          },
          legend: {},
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value'
          },
          yAxis: {
            type: 'category',
            data: this.e1.xData
          },
          series: this.e1.series
        }

        // 使用刚指定的配置项和数据显示图表。
        this.myChart1.setOption(option)
      },
      initEchart2() {
        this.myChart2 = this.$echarts.init(this.$refs.echart2)
        var option = {
          legend: {},
          tooltip: {},
          dataset: {
            source: this.e2.source
          },
          xAxis: {type: 'category'},
          yAxis: {},
          // Declare several bar series, each will be mapped
          // to a column of dataset.source by default.
          series: this.e2.series,
          grid: { // 让图表占满容器
            // top: '10px',
            bottom: '20px'
          }
        }
        // 使用刚指定的配置项和数据显示图表。
        this.myChart2.setOption(option)
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
