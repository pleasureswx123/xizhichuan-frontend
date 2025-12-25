<template>
  <div class="app-container ai-chat-simple">
    <el-card class="chat-card">
      <template #header>
        <div class="card-header">
          <span>智能需求分析-产出初步销售订单</span>
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
              需求分析 (Ctrl+Enter)
            </el-button>
          </div>
        </div>

        <!-- AI 回复区域 -->
        <div v-if="response" class="response-section">
          <el-divider content-position="left">
            <el-icon><ChatDotRound /></el-icon>
            AI 回复
          </el-divider>
          <!-- 普通文本回复 -->
          <div class="response-content">
            <p>{{ typeof response === 'object' ? JSON.stringify(response, null, 2) : response }}</p>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-section">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>AI 正在思考中...</span>
        </div>
        
        
        <!-- 需求订单UI组件 -->
        <div v-if="orderData.length">
          <DemandOrderInvoice v-for="item in orderData" :order-data="item" />
        </div>
        
      </div>
    </el-card>
  </div>
</template>

<script setup name="AiChat">
import { ref, computed, getCurrentInstance } from 'vue'
import { aiSimpleChat } from "@/api/ai/chat"
import { addDemand, listWithProducts } from "@/api/demand/demand.js"
import { addProduct } from "@/api/demand/product.js"
import { ChatDotRound, Loading } from '@element-plus/icons-vue'
import DemandOrderInvoice from '@/components/DemandOrderInvoice/index.vue'

const { proxy } = getCurrentInstance()

// 响应式数据
const message = ref('')
const response = ref('')
const orderData = ref([])
const loading = ref(false)

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
    // 解析 JSON 字符串
    try {
      response.value = JSON.parse(res.data.content)
      
      if (response.value.demandInfo) {
        const {contactName,  contactPhone, customerName, deliveryAddress, demandDate, demandNo, planDeliveryDate, remark} = response.value.demandInfo || {};
        const params = {
          contactName,
          contactPhone,
          customerName,
          deliveryAddress,
          demandDate,
          demandNo: Date.now(),
          planDeliveryDate,
          remark
        };

        const demandRes = await addDemand(params);
        const demandId = demandRes.id;

        // 批量添加产品
        if (response.value.productList && response.value.productList.length > 0) {
          // 创建所有产品添加的 Promise 数组
          const productPromises = response.value.productList.map(productItem => {
            const { productName, unit, unitPrice, quantity, remark, specification } = productItem || {};
            const params = {
              demandId,
              productName,
              unit,
              unitPrice,
              quantity,
              remark,
              specification,
              amount: unitPrice * quantity
            };
            return addProduct(params);
          });

          // 等待所有产品添加完成
          await Promise.all(productPromises);
          console.log('所有产品添加成功');

          // 获取完整的订单数据（包含产品列表）
          await getOrderData();
        }
      }
      
    } catch (parseError) {
      // 如果解析失败，使用原始数据
      response.value = res.data.content || res.data || '暂无回复'
    }
    proxy.$modal.msgSuccess('发送成功')
  } catch (error) {
    proxy.$modal.msgError('发送失败：' + (error.message || '未知错误'))
    console.error('AI 聊天错误:', error)
  } finally {
    loading.value = false
  }
}

// 获取完整的订单数据（包含产品列表）
const getOrderData = async () => {
  const responseData = await listWithProducts();
  orderData.value = responseData.rows || [];
}

getOrderData();


// 清空消息
const clearMessage = () => {
  message.value = ''
}
</script>

<style lang="scss" scoped>
.ai-chat-simple {
  .chat-card {
    max-width: 1200px;
    margin: 0 auto;

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
}
</style>
