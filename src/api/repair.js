import request from '@/utils/request'

export default {
  initDatabaseOpt() {
    return request({
      url: '/usability/repair/databaseOps',
      method: 'get'
    })
  },
  initTableOpt(databaseValue) {
    return request({
      url: '/usability/repair/tableOps',
      method: 'get',
      params: {
        'databaseOpsValue': databaseValue
      }
    })
  },
  initResTableOpt(databaseValue, tableValue) {
    return request({
      url: '/usability/repair/resTableOps',
      method: 'get',
      params: {
        'databaseOpsValue': databaseValue,
        'tableOpsValue': tableValue
      }
    })
  },
  findData(resTableValue) {
    return request({
      url: '/usability/repair/findData',
      method: 'get',
      params: {
        'resTableValue': resTableValue
      }
    })
  }
}

