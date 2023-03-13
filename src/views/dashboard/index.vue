<template>
  <div class="dashboard-container">
    <!--搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <span class="demonstration">选择日期：</span>
          <el-date-picker
            v-model="searchModel.dt"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions">
          </el-date-picker>
          <span>预警级别：</span>
          <el-input v-model="searchModel.level" placeholder="请输入预警级别" clearable></el-input>
          <span>预警数据库：</span>
          <el-input v-model="searchModel.database" placeholder="请输入预警数据库" clearable></el-input>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="findWarningList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="warningList" stripe style="width: 100%">
        <el-table-column prop="dt" label="日期" width="140">
        </el-table-column>
        <el-table-column prop="db" label="数据库" width="160">
        </el-table-column>
        <el-table-column prop="tbl" label="数据表" width="160">
        </el-table-column>
        <el-table-column prop="col" label="数据字段" width="180">
        </el-table-column>
        <el-table-column prop="error" label="预警类型" width="180"></el-table-column>
        <el-table-column prop="notification_level" label="预警级别" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.notification_level == 0">普通</el-tag>
            <el-tag v-else-if="scope.row.notification_level == 1" type="warning">重要</el-tag>
            <el-tag v-else type="danger">紧急</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="openWarning(scope.row)" type="primary" icon="el-icon-view" size="mini"
                       circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 警告信息展示框  -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-row>
        <el-col :span="12">
          <el-form :model="warningInfo" ref="userFormRef">
            <el-form-item label="日期" prop="dt" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.dt" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="数据库名" prop="db" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.db" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="表名" prop="tbl" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.tbl" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="列名" prop="col" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.col" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="预警类型" prop="error" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.error" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <el-form :model="warningInfo" ref="userFormRef">
            <el-form-item label="异常值数量" prop="value" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.value" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="异常数量下限" prop="value_min" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.value_min" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="异常数量上限" prop="value_max" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.value_max" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="警告等级" prop="notification_level" :label-width="formLabelWidth">
              <el-input v-model="warningInfo.notification_level" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="warningInfo.error_type === 5" label="值域上限" prop="range_max"
                          :label-width="formLabelWidth">
              <el-input v-model="warningInfo.range_max" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item v-if="warningInfo.error_type === 5" label="值域下限" prop="range_min"
                          :label-width="formLabelWidth">
              <el-input v-model="warningInfo.range_min" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeWarningInfoUI">关 闭</el-button>
        <!--        <el-button type="primary" @click="saveRole">确 定</el-button>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
import dashboardApi from "@/api/dashboard"

export default {
  data() {
    return {
      formLabelWidth: '100px',
      title: '',
      dialogFormVisible: false,
      searchModel: {
        dt: '',
        database: '',
        level: ''
      },
      warningList: [],
      warningInfo: {}
    }
  },
  methods: {
    findWarningList() {
      dashboardApi.findWarningList(this.searchModel).then(response => {
        this.warningList = response.data
      })
    },
    completeDate(value) {
      return value < 10 ? "0" + value : value;
    },
    getNowFormatDay() {
      var char = "-"
      var nowDate = new Date()
      var day = nowDate.getDate()
      var month = nowDate.getMonth() + 1
      var year = nowDate.getFullYear()
      return year + char + this.completeDate(month) + char + this.completeDate(day);
    },
    openWarning(row) {
      dashboardApi.openWarning(row.dt, row.db, row.tbl, row.col, row.error_type).then(response => {
        this.warningInfo = response.data
        this.openWarningInfoUI()
      })
    },
    openWarningInfoUI() {
      this.title = "详细警告信息"
      this.dialogFormVisible = true
    },
    closeWarningInfoUI() {
      this.roleForm = {}
      this.dialogFormVisible = false
    },
  },
  created() {
    this.searchModel.dt = this.getNowFormatDay()
    this.findWarningList()
  }

}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }

  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

#search .el-input {
  width: 180px;
  margin-right: 20px;
}

#search .el-date-picker {
  width: 180px;
  margin-right: 20px;
}

.el-dialog .el-input {
  width: 75%;
}
</style>
