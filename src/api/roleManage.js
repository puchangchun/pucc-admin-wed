import request from '@/utils/request'

export default {
  allRoleList() {
    return request({
      url: '/role/all',
      method: 'get'
    })
  },
  findRoleList(searchModel) {
    return request({
      url: '/role/find',
      method: 'get',
      params: {
        username: searchModel.username,
        role_name: searchModel.role_name
      }
    })
  },
  addRole(roleForm) {
    return request({
      url: '/role/add',
      method: 'get',
      params: {
        username: roleForm.username,
        role_name: roleForm.role_name
      }
    })
  }
}

