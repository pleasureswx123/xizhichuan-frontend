import request from '@/utils/request'

// 查询购物车订单主列表
export function listMain(query) {
  return request({
    url: '/order/main/list',
    method: 'get',
    params: query
  })
}

// 查询购物车订单主详细
export function getMain(id) {
  return request({
    url: '/order/main/' + id,
    method: 'get'
  })
}

// 新增购物车订单主
export function addMain(data) {
  return request({
    url: '/order/main',
    method: 'post',
    data: data
  })
}

// 修改购物车订单主
export function updateMain(data) {
  return request({
    url: '/order/main',
    method: 'put',
    data: data
  })
}

// 删除购物车订单主
export function delMain(id) {
  return request({
    url: '/order/main/' + id,
    method: 'delete'
  })
}
