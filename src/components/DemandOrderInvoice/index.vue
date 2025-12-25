<template>
  <div class="order-invoice">
    <!-- 标题 -->
    <div class="invoice-header">
      <h1 class="company-name">喜之船</h1>
      <h2 class="invoice-title">销售订单</h2>
    </div>

    <!-- 基本信息 -->
    <div class="basic-info">
      <div class="info-row">
        <div class="info-item">
          <span class="label">单据日期：</span>
          <span class="value">{{ formatDate(orderData?.createTime) }}</span>
        </div>
        <div class="info-item">
          <span class="label">订单编号：</span>
          <span class="value">{{ orderData?.demandNo }}</span>
        </div>
        <div class="info-item">
          <span class="label">客户名称：</span>
          <span class="value">{{ orderData?.customerName }}</span>
        </div>
      </div>
      <div class="info-row">
        <div class="info-item">
          <span class="label">联系人：</span>
          <span class="value">{{ orderData?.contactName }}</span>
        </div>
        <div class="info-item">
          <span class="label">联系电话：</span>
          <span class="value">{{ orderData?.contactPhone }}</span>
        </div>
      </div>
      <div class="info-row full-width">
        <div class="info-item">
          <span class="label">收货地址：</span>
          <span class="value">{{ orderData?.deliveryAddress }}</span>
        </div>
      </div>
    </div>

    <!-- 产品列表表格 -->
    <div class="product-table">
      <table>
        <thead>
          <tr>
            <th>行号</th>
            <th>商品名称</th>
            <th>规格型号</th>
            <th>单位</th>
            <th>数量</th>
            <th>单价（元）</th>
            <th>金额（元）</th>
            <th>备注</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in orderData?.productList" :key="product.id">
            <td class="center">{{ index + 1 }}</td>
            <td>{{ product.productName }}</td>
            <td>{{ product.specification }}</td>
            <td class="center">{{ product.unit }}</td>
            <td class="right">{{ product.quantity }}</td>
            <td class="right">{{ formatNumber(product.unitPrice) }}</td>
            <td class="right">{{ formatNumber(product.amount) }}</td>
            <td>{{ product.remark || '' }}</td>
          </tr>
          <!-- 合计行 -->
          <tr class="total-row">
            <td colspan="4" class="center bold">合计</td>
            <td class="right bold">{{ orderData?.summary?.totalQuantity }}</td>
            <td></td>
            <td class="right bold">{{ formatNumber(orderData?.summary?.totalAmount) }}</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 底部信息 -->
    <div class="footer-info">
      <div class="footer-row">
        <div class="footer-item">
          <span class="label">计划发货日期：</span>
          <span class="value highlight">{{ orderData?.planDeliveryDate }}</span>
        </div>
        <div class="footer-item" style="margin-left: auto">
          <span class="label">其他费用：</span>
          <span class="value">-</span>
        </div>
        <div class="footer-item">
          <span class="label">优惠金额：</span>
          <span class="value">-</span>
        </div>
      </div>
      <div class="footer-row total-amount">
        <span class="label">订单金额：</span>
        <span class="value">{{ formatNumber(orderData?.summary?.totalAmount) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  orderData: {
    type: Object,
    default: () => ({})
  }
})

// 格式化数字，添加千分位
const formatNumber = (value) => {
  if (!value) return '0.00'
  const num = parseFloat(value)
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// 格式化日期时间，只显示日期部分
const formatDate = (dateTime) => {
  if (!dateTime) return ''
  // 如果是 "2025-12-24 16:04:57" 格式，提取日期部分
  return dateTime.split(' ')[0]
}
</script>

<style lang="scss" scoped>
.order-invoice {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .invoice-header {
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #303133;
    margin-bottom: 20px;

    .company-name {
      font-size: 32px;
      font-weight: bold;
      color: #303133;
      margin: 0 0 10px 0;
      letter-spacing: 2px;
    }

    .invoice-title {
      font-size: 24px;
      font-weight: bold;
      color: #606266;
      margin: 0;
      letter-spacing: 1px;
    }
  }

  .basic-info {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
    font-size: 14px;

    .info-row {
      display: flex;
      gap: 30px;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      &.full-width {
        .info-item {
          flex: 1;
        }
      }

      .info-item {
        flex: 1;
        display: flex;
        align-items: center;

        .label {
          font-weight: 500;
          color: #303133;
          white-space: nowrap;
        }

        .value {
          color: #606266;
          margin-left: 8px;
        }
      }
    }
  }

  .product-table {
    margin-bottom: 20px;
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #303133;
      font-size: 14px;

      thead {
        background: #f5f7fa;

        th {
          padding: 12px 8px;
          text-align: center;
          font-weight: bold;
          color: #303133;
          border: 1px solid #303133;
        }
      }

      tbody {
        tr {
          &:hover {
            background: #fafafa;
          }

          &.total-row {
            background: #f5f7fa;
            font-weight: bold;

            &:hover {
              background: #ebeef5;
            }
          }

          td {
            padding: 10px 8px;
            border: 1px solid #303133;
            color: #606266;

            &.center {
              text-align: center;
            }

            &.right {
              text-align: right;
            }

            &.bold {
              font-weight: bold;
              color: #303133;
            }
          }
        }
      }
    }
  }

  .footer-info {
    padding: 15px;
    background: #f5f7fa;
    border-radius: 4px;
    font-size: 14px;

    .footer-row {
      display: flex;
      gap: 30px;
      margin-bottom: 10px;

      &:last-child {
        margin-bottom: 0;
      }

      &.total-amount {
        justify-content: flex-end;
        margin-top: 10px;
        padding-top: 15px;
        border-top: 2px solid #dcdfe6;
        font-size: 18px;
        font-weight: bold;

        .label {
          color: #303133;
        }

        .value {
          color: #303133;
          font-size: 20px;
          margin-left: 10px;
        }
      }

      .footer-item {
        display: flex;
        align-items: center;

        .label {
          font-weight: 500;
          color: #303133;
          white-space: nowrap;
        }

        .value {
          color: #606266;
          margin-left: 8px;

          &.highlight {
            color: #f56c6c;
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 打印样式
@media print {
  .order-invoice {
    box-shadow: none;
    padding: 20px;
  }
}
</style>

