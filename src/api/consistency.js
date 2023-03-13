import request from '@/utils/request'

export default {
  initDatabaseOpt() {
    return request({
      url: '/usability/consistency/databaseOps',
      method: 'get'
    })
  },
  initTableOpt(databaseValue) {
    return request({
      url: '/usability/consistency/tableOps',
      method: 'get',
      params: {
        'databaseOpsValue': databaseValue
      }
    })
  },
  findData(databaseValue, tableValue) {
    return request({
      url: '/usability/consistency/findData',
      method: 'get',
      params: {
        'database': databaseValue,
        'table': tableValue
      }
    })
  }
}

