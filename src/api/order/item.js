import request from '@/utils/request'

// 查询购物车订单商品明细（订单下商品列）列表
export function listItem(query) {
  return request({
    url: '/order/item/list',
    method: 'get',
    params: query
  })
}

// 查询购物车订单商品明细（订单下商品列）详细
export function getItem(id) {
  return request({
    url: '/order/item/' + id,
    method: 'get'
  })
}

// 新增购物车订单商品明细（订单下商品列）
export function addItem(data) {
  return request({
    url: '/order/item',
    method: 'post',
    data: data
  })
}

// 修改购物车订单商品明细（订单下商品列）
export function updateItem(data) {
  return request({
    url: '/order/item',
    method: 'put',
    data: data
  })
}

// 删除购物车订单商品明细（订单下商品列）
export function delItem(id) {
  return request({
    url: '/order/item/' + id,
    method: 'delete'
  })
}
