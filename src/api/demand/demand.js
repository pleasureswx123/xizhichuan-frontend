import request from '@/utils/request'

// 查询需求表列表
export function listDemand(query) {
  return request({
    url: '/demand/demand/list',
    method: 'get',
    params: query
  })
}
// 查询需求及商品信息列表
export function listWithProducts(query) {
  return request({
    url: '/demand/demand/listWithProducts',
    method: 'get',
    params: query
  })
}

// 查询需求表详细
export function getDemand(id) {
  return request({
    url: '/demand/demand/' + id,
    method: 'get'
  })
}

// 新增需求表
export function addDemand(data) {
  return request({
    url: '/demand/demand',
    method: 'post',
    data: data
  })
}

// 修改需求表
export function updateDemand(data) {
  return request({
    url: '/demand/demand',
    method: 'put',
    data: data
  })
}

// 删除需求表
export function delDemand(id) {
  return request({
    url: '/demand/demand/' + id,
    method: 'delete'
  })
}
