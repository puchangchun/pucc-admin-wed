import request from '@/utils/request'

export default {
  initDatabaseOpt() {
    return request({
      url: '/usability/accuracy/databaseOps',
      method: 'get'
    })
  },
  initTableOpt(databaseValue) {
    return request({
      url: '/usability/accuracy/tableOps',
      method: 'get',
      params: {
        'databaseOpsValue': databaseValue
      }
    })
  },
  findData(databaseValue, tableValue) {
    return request({
      url: '/usability/accuracy/findData',
      method: 'get',
      params: {
        'database': databaseValue,
        'table': tableValue
      }
    })
  }
}

