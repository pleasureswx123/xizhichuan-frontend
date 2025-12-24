import request from '@/utils/request'

/**
 * AI聊天 - 完整版接口
 * @param {Object} data 聊天请求数据
 * @param {string} data.message 用户消息内容（必填）
 * @param {string} data.systemPrompt 系统提示词（可选）
 * @param {Array} data.history 历史对话记录（可选）
 * @param {string} data.model 模型名称（可选）
 * @param {boolean} data.stream 是否流式返回（可选）
 * @returns {Promise}
 */
export function aiChat(data) {
  return request({
    url: '/ai/chat/send',
    method: 'post',
    data: data
  })
}

/**
 * AI聊天 - 简单版接口
 * @param {string} message 消息内容
 * @returns {Promise}
 */
export function aiSimpleChat(message) {
  return request({
    url: '/ai/chat/simple',
    method: 'get',
    params: { message }
  })
}

/**
 * 健康检查
 * @returns {Promise}
 */
export function aiHealthCheck() {
  return request({
    url: '/ai/chat/health',
    method: 'get'
  })
}

