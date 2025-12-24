<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="单据日期" prop="documentDate">
        <el-date-picker clearable
          v-model="queryParams.documentDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择单据日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单编号" prop="orderNumber">
        <el-input
          v-model="queryParams.orderNumber"
          placeholder="请输入订单编号"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人姓名" prop="contactPerson">
        <el-input
          v-model="queryParams.contactPerson"
          placeholder="请输入联系人姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系人电话" prop="contactPhone">
        <el-input
          v-model="queryParams.contactPhone"
          placeholder="请输入联系人电话"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划发货日期" prop="plannedShipDate">
        <el-date-picker clearable
          v-model="queryParams.plannedShipDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划发货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="其他费用" prop="otherFees">
        <el-input
          v-model="queryParams.otherFees"
          placeholder="请输入其他费用"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="折扣金额" prop="discountAmount">
        <el-input
          v-model="queryParams.discountAmount"
          placeholder="请输入折扣金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单总金额" prop="orderAmount">
        <el-input
          v-model="queryParams.orderAmount"
          placeholder="请输入订单总金额"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
        <el-button icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="Plus"
          @click="handleAdd"
          v-hasPermi="['order:main:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['order:main:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['order:main:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['order:main:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="mainList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="购物车订单主键ID" align="center" prop="id" />
      <el-table-column label="单据日期" align="center" prop="documentDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.documentDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单编号" align="center" prop="orderNumber" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="联系人姓名" align="center" prop="contactPerson" />
      <el-table-column label="联系人电话" align="center" prop="contactPhone" />
      <el-table-column label="收货地址" align="center" prop="shippingAddress" />
      <el-table-column label="计划发货日期" align="center" prop="plannedShipDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.plannedShipDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="其他费用" align="center" prop="otherFees" />
      <el-table-column label="折扣金额" align="center" prop="discountAmount" />
      <el-table-column label="订单总金额" align="center" prop="orderAmount" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['order:main:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['order:main:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改购物车订单主对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="mainRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="单据日期" prop="documentDate">
          <el-date-picker clearable
            v-model="form.documentDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择单据日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNumber">
          <el-input v-model="form.orderNumber" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactPerson">
          <el-input v-model="form.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="收货地址" prop="shippingAddress">
          <el-input v-model="form.shippingAddress" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="计划发货日期" prop="plannedShipDate">
          <el-date-picker clearable
            v-model="form.plannedShipDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择计划发货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="其他费用" prop="otherFees">
          <el-input v-model="form.otherFees" placeholder="请输入其他费用" />
        </el-form-item>
        <el-form-item label="折扣金额" prop="discountAmount">
          <el-input v-model="form.discountAmount" placeholder="请输入折扣金额" />
        </el-form-item>
        <el-form-item label="订单总金额" prop="orderAmount">
          <el-input v-model="form.orderAmount" placeholder="请输入订单总金额" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Main">
import { listMain, getMain, delMain, addMain, updateMain } from "@/api/order/main"

const { proxy } = getCurrentInstance()

const mainList = ref([])
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    documentDate: null,
    orderNumber: null,
    customerName: null,
    contactPerson: null,
    contactPhone: null,
    shippingAddress: null,
    plannedShipDate: null,
    otherFees: null,
    discountAmount: null,
    orderAmount: null,
  },
  rules: {
    documentDate: [
      { required: true, message: "单据日期不能为空", trigger: "blur" }
    ],
    orderNumber: [
      { required: true, message: "订单编号不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    orderAmount: [
      { required: true, message: "订单总金额不能为空", trigger: "blur" }
    ],
    createBy: [
      { required: true, message: "创建者不能为空", trigger: "blur" }
    ],
    createTime: [
      { required: true, message: "创建时间不能为空", trigger: "blur" }
    ],
    updateBy: [
      { required: true, message: "更新者不能为空", trigger: "blur" }
    ],
    updateTime: [
      { required: true, message: "更新时间不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询购物车订单主列表 */
function getList() {
  loading.value = true
  listMain(queryParams.value).then(response => {
    mainList.value = response.rows
    total.value = response.total
    loading.value = false
  })
}

// 取消按钮
function cancel() {
  open.value = false
  reset()
}

// 表单重置
function reset() {
  form.value = {
    id: null,
    documentDate: null,
    orderNumber: null,
    customerName: null,
    contactPerson: null,
    contactPhone: null,
    shippingAddress: null,
    plannedShipDate: null,
    otherFees: null,
    discountAmount: null,
    orderAmount: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("mainRef")
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef")
  handleQuery()
}

// 多选框选中数据
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
function handleAdd() {
  reset()
  open.value = true
  title.value = "添加购物车订单主"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getMain(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改购物车订单主"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["mainRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateMain(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addMain(form.value).then(response => {
          proxy.$modal.msgSuccess("新增成功")
          open.value = false
          getList()
        })
      }
    }
  })
}

/** 删除按钮操作 */
function handleDelete(row) {
  const _ids = row.id || ids.value
  proxy.$modal.confirm('是否确认删除购物车订单主编号为"' + _ids + '"的数据项？').then(function() {
    return delMain(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('order/main/export', {
    ...queryParams.value
  }, `main_${new Date().getTime()}.xlsx`)
}

getList()
</script>
