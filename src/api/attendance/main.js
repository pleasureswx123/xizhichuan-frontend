import request from '@/utils/request'

// 查询每日考勤主列表
export function listMain(query) {
  return request({
    url: '/attendance/main/list',
    method: 'get',
    params: query
  })
}

// 查询每日考勤主详细
export function getMain(mainId) {
  return request({
    url: '/attendance/main/' + mainId,
    method: 'get'
  })
}

// 新增每日考勤主
export function addMain(data) {
  return request({
    url: '/attendance/main',
    method: 'post',
    data: data
  })
}

// 修改每日考勤主
export function updateMain(data) {
  return request({
    url: '/attendance/main',
    method: 'put',
    data: data
  })
}

// 删除每日考勤主
export function delMain(mainId) {
  return request({
    url: '/attendance/main/' + mainId,
    method: 'delete'
  })
}
