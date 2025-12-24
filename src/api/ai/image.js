import request from '@/utils/request'

/**
 * AI图片生成 - 完整版接口
 * @param {Object} data 图片生成请求数据
 * @param {string} data.prompt 图片描述提示词（必填）
 * @param {string} data.model 模型名称（可选）
 * @param {string} data.size 图片尺寸（可选，如：1024x1024, 2K, 4K）
 * @param {boolean} data.watermark 是否添加水印（可选）
 * @param {string} data.responseFormat 响应格式（可选：url 或 base64）
 * @param {boolean} data.stream 是否流式返回（可选）
 * @param {string} data.sequentialImageGeneration 顺序图片生成（可选：enabled 或 disabled）
 * @returns {Promise}
 */
export function aiGenerateImage(data) {
  return request({
    url: '/ai/image/generate',
    method: 'post',
    data: data
  })
}

/**
 * AI图片生成 - 简单版接口
 * @param {string} prompt 图片描述
 * @returns {Promise}
 */
export function aiSimpleGenerateImage(prompt) {
  return request({
    url: '/ai/image/simple',
    method: 'get',
    params: { prompt }
  })
}

/**
 * 健康检查
 * @returns {Promise}
 */
export function aiImageHealthCheck() {
  return request({
    url: '/ai/image/health',
    method: 'get'
  })
}

