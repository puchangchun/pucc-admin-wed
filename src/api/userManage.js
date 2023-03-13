import request from '@/utils/request'

export default {
  findUserList(searchModel) {
    return request({
      url: '/user/find',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        phone: searchModel.phone
      }
    })
  },

  addUser(user) {
    return request({
      url: '/user/add',
      method: 'post',
      data: user
    })
  },
  saveUser(user) {
    if (user.id == null) {
      // 新增请求
      return this.addUser(user)
    } else {
      // 修改请求
      return request({
        url: '/user/update',
        method: 'put',
        data: user
      })
    }
  },
  getUserById(id) {
    return request({
      url: '/user/' + id,
      // url: `/user/${id}`,
      method: 'get'
    })
  },
  deleteUserById(id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  }
}

