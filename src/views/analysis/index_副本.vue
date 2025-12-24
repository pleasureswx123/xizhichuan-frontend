<template>
  <div class="app-container ai-chat-simple">
    <!-- AI 智能对话模块 -->
    <el-card class="chat-card">
      <template #header>
        <div class="card-header">
          <span>AI 智能对话</span>
        </div>
      </template>

      <div class="chat-content">
        <!-- 消息输入区域 -->
        <div class="input-section">
          <el-input
            v-model="message"
            type="textarea"
            :rows="10"
            placeholder="请输入您的问题..."
            maxlength="2000"
            show-word-limit
            @keyup.ctrl.enter="sendMessage"
          />
          <div class="button-group">
            <el-button @click="clearMessage">清空</el-button>
            <el-button type="primary" @click="sendMessage" :loading="loading">
              发送 (Ctrl+Enter)
            </el-button>
          </div>
        </div>

        <!-- AI 回复区域 -->
        <div v-if="response" class="response-section">
          <el-divider content-position="left">
            <el-icon><ChatDotRound /></el-icon>
            AI 回复
          </el-divider>
          <div class="response-content">
            <p>{{ response }}</p>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-section">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>AI 正在思考中...</span>
        </div>
      </div>
    </el-card>

    <!-- AI 图片生成模块 -->
    <el-card class="image-card">
      <template #header>
        <div class="card-header">
          <span>AI 图片生成</span>
        </div>
      </template>

      <div class="ai-image-advanced">
        <!-- 图片描述 -->
        <el-form :model="imageForm" label-width="120px">
          <el-form-item label="图片描述">
            <el-input
              v-model="imageForm.prompt"
              type="textarea"
              :rows="4"
              placeholder="详细描述你想要生成的图片..."
            />
          </el-form-item>

          <el-form-item label="图片尺寸">
            <el-select v-model="imageForm.size" placeholder="请选择">
              <el-option label="1024x1024" value="1024x1024"></el-option>
              <el-option label="2K" value="2K"></el-option>
              <el-option label="4K" value="4K"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="添加水印">
            <el-switch v-model="imageForm.watermark"></el-switch>
          </el-form-item>

          <el-form-item label="响应格式">
            <el-radio-group v-model="imageForm.responseFormat">
              <el-radio label="url">URL链接</el-radio>
              <el-radio label="base64">Base64数据</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="generateImage" :loading="imageLoading">
              生成图片
            </el-button>
            <el-button @click="resetImageForm">重置</el-button>
          </el-form-item>
        </el-form>

        <!-- 生成结果 -->
        <div v-if="generatedImages.length > 0" class="image-gallery">
          <h4>生成的图片：</h4>
          <div class="images">
            <div v-for="(img, index) in generatedImages" :key="index" class="image-item">
              <img v-if="imageForm.responseFormat === 'url'" :src="img" alt="AI生成的图片" />
              <img v-else :src="'data:image/png;base64,' + img" alt="AI生成的图片" />
            </div>
          </div>
        </div>

        <!-- 图片生成加载状态 -->
        <div v-if="imageLoading" class="loading-section">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>AI 正在生成图片中...</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup name="AiChat">
import { ref, getCurrentInstance } from 'vue'
import { aiSimpleChat } from "@/api/ai/chat"
import { aiGenerateImage } from "@/api/ai/image.js"
import { ChatDotRound, Loading } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

// AI 对话相关数据
const message = ref('')
const response = ref('')
const loading = ref(false)

// AI 图片生成相关数据
const imageForm = ref({
  prompt: '',
  size: '2K',
  watermark: true,
  responseFormat: 'url'
})
const generatedImages = ref([])
const imageLoading = ref(false)

// 发送消息
const sendMessage = async () => {
  if (!message.value.trim()) {
    proxy.$modal.msgWarning('请输入消息')
    return
  }

  loading.value = true
  response.value = ''

  try {
    const res = await aiSimpleChat(message.value)
    response.value = res.data.content || res.data || '暂无回复'
    proxy.$modal.msgSuccess('发送成功')
  } catch (error) {
    proxy.$modal.msgError('发送失败：' + (error.message || '未知错误'))
    console.error('AI 聊天错误:', error)
  } finally {
    loading.value = false
  }
}

// 清空消息
const clearMessage = () => {
  message.value = ''
}

// 生成图片
const generateImage = async () => {
  if (!imageForm.value.prompt.trim()) {
    proxy.$modal.msgWarning('请输入图片描述')
    return
  }

  imageLoading.value = true
  try {
    const res = await aiGenerateImage(imageForm.value)
    generatedImages.value = res.data.images || []
    proxy.$modal.msgSuccess('图片生成成功')
  } catch (error) {
    proxy.$modal.msgError('生成失败：' + (error.message || '未知错误'))
    console.error('AI 图片生成错误:', error)
  } finally {
    imageLoading.value = false
  }
}

// 重置图片表单
const resetImageForm = () => {
  imageForm.value = {
    prompt: '',
    size: '2K',
    watermark: true,
    responseFormat: 'url'
  }
  generatedImages.value = []
}
</script>

<style lang="scss" scoped>
.ai-chat-simple {
  .chat-card,
  .image-card {
    max-width: 1200px;
    margin: 0 auto 20px;

    .card-header {
      display: flex;
      align-items: center;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .chat-content {
    .input-section {
      margin-bottom: 20px;

      .button-group {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 10px;
      }
    }

    .response-section {
      margin-top: 30px;

      .response-content {
        background-color: #f5f7fa;
        border-radius: 8px;
        padding: 20px;
        min-height: 100px;
        line-height: 1.8;
        white-space: pre-wrap;
        word-wrap: break-word;

        p {
          margin: 0;
          color: #303133;
        }
      }
    }

    .loading-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 20px;
      color: #409eff;
      font-size: 14px;

      .el-icon {
        font-size: 20px;
      }
    }
  }

  .ai-image-advanced {
    .image-gallery {
      margin-top: 30px;

      h4 {
        margin-bottom: 20px;
        color: #303133;
        font-size: 16px;
      }

      .images {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;

        .image-item {
          img {
            width: 100%;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;

            &:hover {
              transform: scale(1.02);
            }
          }
        }
      }
    }

    .loading-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 20px;
      color: #409eff;
      font-size: 14px;

      .el-icon {
        font-size: 20px;
      }
    }
  }
}
</style>
