import request from '@/utils/request'

export default {
  initDatabaseOpt() {
    return request({
      url: '/usability/completeness/databaseOps',
      method: 'get'
    })
  },
  initTableOpt(databaseValue) {
    return request({
      url: '/usability/completeness/tableOps',
      method: 'get',
      params: {
        'databaseOpsValue': databaseValue
      }
    })
  },
  findData(databaseValue, tableValue) {
    return request({
      url: '/usability/completeness/findData',
      method: 'get',
      params: {
        'database': databaseValue,
        'table': tableValue
      }
    })
  }
}

