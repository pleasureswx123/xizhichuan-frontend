import request from '@/utils/request'

// 查询班组管理列表
export function listTeam(query) {
  return request({
    url: '/attendance/team/list',
    method: 'get',
    params: query
  })
}

// 查询班组管理详细
export function getTeam(id) {
  return request({
    url: '/attendance/team/' + id,
    method: 'get'
  })
}

// 新增班组管理
export function addTeam(data) {
  return request({
    url: '/attendance/team',
    method: 'post',
    data: data
  })
}

// 修改班组管理
export function updateTeam(data) {
  return request({
    url: '/attendance/team',
    method: 'put',
    data: data
  })
}

// 删除班组管理
export function delTeam(id) {
  return request({
    url: '/attendance/team/' + id,
    method: 'delete'
  })
}
