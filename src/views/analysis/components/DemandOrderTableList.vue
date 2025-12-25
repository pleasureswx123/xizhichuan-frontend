<template>
  <div v-if="orderData.length" class="demand-order-list">
    <el-table
        :data="orderData"
        style="width: 100%">
      <el-table-column
          fixed
          type="selection"
          width="30">
      </el-table-column>
      <el-table-column width="30" type="expand" fixed>
        <template #default="{ row }">
          <el-table
              label-position="left" inline class="demo-table-expand"
              :data="row.productList"
              style="width: 90%; margin-left: 8%">
            <el-table-column
                label="序号"
                type="index"
                width="50">
            </el-table-column>
<!--            <el-table-column
                prop="id"
                label="产品 ID">
            </el-table-column>-->
<!--            <el-table-column
                prop="demandId"
                width="100"
                label="需求单 ID">
            </el-table-column>-->
            <el-table-column
                prop="productName"
                show-overflow-tooltip
                label="产品名称">
            </el-table-column>
            <el-table-column
                show-overflow-tooltip
                prop="specification"
                label="规格">
            </el-table-column>
            <el-table-column
                prop="unit"
                width="50"
                label="单位">
            </el-table-column>
            <el-table-column
                prop="quantity"
                width="50"
                label="数量">
            </el-table-column>
            <el-table-column
                width="50"
                prop="unitPrice"
                label="单价">
            </el-table-column>
            <el-table-column
                prop="amount"
                label="金额">
            </el-table-column>
            <el-table-column
                prop="remark"
                label="备注">
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="100" class-name="small-padding fixed-width">
              <template #default="scope">
                <el-button link type="primary">修改</el-button>
                <el-button link type="primary">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
<!--      <el-table-column
          label="需求单 ID"
          prop="id">
      </el-table-column>-->
      <el-table-column
          fixed
          width="130"
          label="需求单编号"
          prop="demandNo">
      </el-table-column>
      <el-table-column
          label="需求单日期"
          prop="demandDate">
      </el-table-column>
      <el-table-column
          label="客户名称"
          prop="customerName">
      </el-table-column>
      <el-table-column
          label="联系人"
          prop="contactName">
      </el-table-column>
      <el-table-column
          label="联系人电话"
          prop="contactPhone">
      </el-table-column>
      <el-table-column
          width="200"
          show-overflow-tooltip
          label="配送地址"
          prop="deliveryAddress">
      </el-table-column>
      <el-table-column
          label="计划配送时间"
          prop="planDeliveryDate">
      </el-table-column>
      <el-table-column
          prop="remark"
          label="备注">
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary">修改</el-button>
          <el-button link type="primary">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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

