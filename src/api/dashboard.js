import request from '@/utils/request'

export default {
  openWarning(dt, db, tbl, col, error_type) {
    return request({
      url: '/usability/dashboard/findWarning',
      method: 'get',
      params: {
        'dt': dt,
        'db': db,
        'tbl': tbl,
        'col': col,
        'error_type': error_type
      }
    })
  },
  findWarningList(searchModel) {
    return request({
      url: '/usability/dashboard/warning',
      method: 'get',
      params: {
        'dt': searchModel.dt,
        'level': searchModel.level,
        'database': searchModel.database
      }
    })
  }
}

