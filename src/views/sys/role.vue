<template>
  <div>
    <!--搜索栏 -->
    <el-card id="search">
      <el-row>
        <el-col :span="20">
          <span>用户名：</span>
          <el-input v-model="searchModel.username" placeholder="请输入用户名" clearable></el-input>
          <span>角色名：</span>
          <el-input v-model="searchModel.role_name" placeholder="请输入角色名" clearable></el-input>
          <el-button @click="findRoleList" type="primary" round icon="el-icon-search">查询</el-button>
        </el-col>
        <el-col :span="4" align="right">
          <el-button @click="openRoleEditUI(null)" type="primary" icon="el-icon-plus" circle></el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 结果列表 -->
    <el-card>
      <el-table :data="roleList" stripe style="width: 100%">
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色名" width="180">
        </el-table-column>
        <el-table-column prop="role_desc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column prop="status" label="用户状态" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="email" label="电子邮件"></el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button @click="deleteRole(scope.row)" type="danger" icon="el-icon-delete" size="mini"
                       circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>


    <!-- 用户信息编辑对话框  -->
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="roleForm" ref="userFormRef">
        <el-form-item label="用户名" prop="username" :label-width="formLabelWidth">
          <el-input v-model="roleForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="phone" :label-width="formLabelWidth">
          <el-input v-model="roleForm.role_name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeRoleEditUI">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import roleApi from '@/api/roleManage'

export default {
  data() {
    return {
      formLabelWidth: '100px',
      title: '',
      total: 0,
      userStatus: '',
      dialogFormVisible: false,
      searchModel: {
        username: '',
        role_name: ''
      },
      roleList: [],
      roleForm: {}
    }
  },
  methods: {
    allRoleList() {
      roleApi.allRoleList().then(response => {
        this.roleList = response.data
      })
    },
    findRoleList() {
      roleApi.findRoleList(this.searchModel).then(response => {
        this.roleList = response.data
      })
    },
    openRoleEditUI(id) {
      this.title = "新增角色"
      this.dialogFormVisible = true
    },
    closeRoleEditUI() {
      this.roleForm = {}
      this.dialogFormVisible = false
    },
    saveRole() {
      roleApi.addRole(this.roleForm).then(response => {
        this.allRoleList()
        this.closeRoleEditUI()
      })
    }

  },
  created() {
    this.allRoleList()
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
