<template>
  <div v-if="orderData.length" class="demand-order-list">
    <DemandOrderInvoice v-for="item in orderData" :key="item.id" :order-data="item" />
  </div>
</template>

<script setup name="DemandOrderList">
import { ref, onMounted } from 'vue'
import { listWithProducts } from "@/api/demand/demand.js"
import DemandOrderInvoice from '@/components/DemandOrderInvoice/index.vue'

// 响应式数据
const orderData = ref([])

// 获取完整的订单数据（包含产品列表）
const getOrderData = async () => {
  const responseData = await listWithProducts();
  orderData.value = responseData.rows || [];
}

// 暴露方法给父组件调用
defineExpose({
  getOrderData
})

// 组件挂载时获取数据
onMounted(() => {
  getOrderData();
})
</script>

<style lang="scss" scoped>
.demand-order-list {
  margin-top: 20px;
}
</style>

