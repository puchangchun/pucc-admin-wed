<template>
  <div>
    <!--搜索栏 -->
    <el-card id="search" style=" height: 80px;">
      <el-row>
        <el-col :span="22">
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
          <el-select v-model="tableValue" clearable placeholder="请选择" filterable="true" @change="tableOptChange">
            <el-option
              v-for="item in tableOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>

          <span>分析结果：</span>
          <el-select v-model="resTableValue" clearable placeholder="请选择" filterable="true">
            <el-option
              v-for="item in resTableOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="2" align="right">
          <el-button type="primary" round icon="el-icon-search" @click="findData">查询</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="repairList" stripe style="width: 100%">
        <el-table-column prop="tid" label="主键" width="180">
        </el-table-column>
        <el-table-column prop="attribute" label="属性名" width="180">
        </el-table-column>
        <el-table-column prop="current_value" label="原始值" width="180">
        </el-table-column>
        <el-table-column prop="repaired" label="修复值" width="180">
        </el-table-column>
        <el-table-column prop="prob" label="修复准确率"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="openEditUI(scope.row.id)" type="primary" icon="el-icon-edit" size="mini"
                       circle></el-button>
            <el-button @click="deleteUser(scope.row)" type="danger" icon="el-icon-delete" size="mini"
                       circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


  </div>

</template>

<script>
import repairApi from "@/api/repair";

export default {
  data() {
    return {
      formLabelWidth: '100px',
      databaseValue: '',
      tableValue: '',
      resTableValue: '',
      databaseOpts: '',
      tableOpts: '',
      resTableOpts: '',
      userForm: {},
      repairList: [],
      title: '',
      total: 0,
      userStatus: '',
    }
  },
  methods: {
    findData() {
      repairApi.findData(this.resTableValue).then(response => {
        this.repairList = response.data
      })
    },
    initDatabaseOpt() {
      repairApi.initDatabaseOpt().then(response => {
        this.databaseOpts = response.data
      })
    },
    databaseOptChange(value) {
      this.tableValue = ''
      this.initTableOpt(value)
    },
    tableOptChange() {
      this.initResTableOpt()
    },
    initTableOpt(value) {
      repairApi.initTableOpt(value).then(response => {
        this.tableOpts = response.data
      })
    },
    initResTableOpt() {
      repairApi.initResTableOpt(this.databaseValue, this.tableValue).then(response => {
        this.resTableOpts = response.data
      })
    }

  },
  created() {
    this.initDatabaseOpt()
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
