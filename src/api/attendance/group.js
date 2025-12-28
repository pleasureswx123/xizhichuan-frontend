import request from '@/utils/request'

// 查询班组配置列表
export function listGroup(query) {
  return request({
    url: '/attendance/group/list',
    method: 'get',
    params: query
  })
}

// 查询班组配置详细
export function getGroup(groupId) {
  return request({
    url: '/attendance/group/' + groupId,
    method: 'get'
  })
}

// 新增班组配置
export function addGroup(data) {
  return request({
    url: '/attendance/group',
    method: 'post',
    data: data
  })
}

// 修改班组配置
export function updateGroup(data) {
  return request({
    url: '/attendance/group',
    method: 'put',
    data: data
  })
}

// 删除班组配置
export function delGroup(groupId) {
  return request({
    url: '/attendance/group/' + groupId,
    method: 'delete'
  })
}
