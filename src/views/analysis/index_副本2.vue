<template>
  <div class="app-container ai-chat-simple">
<!--    <el-card class="chat-card">
      <template #header>
        <div class="card-header">
          <span>智能需求分析-产出初步销售订单</span>
        </div>
      </template>

      <div class="chat-content">
        &lt;!&ndash; 智能需求分析组件 &ndash;&gt;
        <DemandAnalysis @demand-created="handleDemandCreated" />

        &lt;!&ndash; 需求订单列表组件 &ndash;&gt;
        <DemandOrderList ref="demandOrderListRef" />
      </div>
    </el-card>-->
    
    <el-row>
      <el-col :span="12">
        <el-card class="chat-card">
          <template #header>
            <div class="card-header">
              <span>分析订单</span>
            </div>
          </template>
          <div class="demand-analysis-content">
            <DemandAnalysis @demand-created="handleDemandCreated" />
          </div>
        </el-card>
        <el-card class="chat-card">
          <template #header>
            <div class="card-header">
              <span>订单管理</span>
            </div>
          </template>
          <div class="chat-content">
            <DemandOrderList ref="demandOrderListRef" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chat-card">
          <template #header>
            <div class="card-header">
              <span>订单列表</span>
            </div>
          </template>
          <div class="chat-content">
            <DemandOrderTableList ref="DemandOrderTableListRef" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    
  </div>
</template>

<script setup name="AiChat">
import { ref } from 'vue'
import DemandAnalysis from './components/DemandAnalysis.vue'
import DemandOrderList from './components/DemandOrderList.vue'
import DemandOrderTableList from './components/DemandOrderTableList.vue'

// 订单列表组件引用
const demandOrderListRef = ref(null)
const DemandOrderTableListRef = ref(null)

// 处理需求创建完成事件
const handleDemandCreated = () => {
  // 刷新订单列表
  if (demandOrderListRef.value) {
    demandOrderListRef.value.getOrderData()
  }
  if (DemandOrderTableListRef.value) {
    DemandOrderTableListRef.value.getOrderData()
  }
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
    // 组件样式由各自的组件文件管理
  }
  .demand-analysis-content {
    overflow-y: scroll;
  }
}
</style>
