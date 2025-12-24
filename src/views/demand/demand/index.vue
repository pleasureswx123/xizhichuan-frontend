<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="需求日期" prop="demandDate">
        <el-date-picker clearable
          v-model="queryParams.demandDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择需求日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="需求编号" prop="demandNo">
        <el-input
          v-model="queryParams.demandNo"
          placeholder="请输入需求编号"
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
      <el-form-item label="联系人姓名" prop="contactName">
        <el-input
          v-model="queryParams.contactName"
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
      <el-form-item label="收货地址" prop="deliveryAddress">
        <el-input
          v-model="queryParams.deliveryAddress"
          placeholder="请输入收货地址"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="计划发货日期" prop="planDeliveryDate">
        <el-date-picker clearable
          v-model="queryParams.planDeliveryDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择计划发货日期">
        </el-date-picker>
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
          v-hasPermi="['demand:demand:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['demand:demand:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['demand:demand:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['demand:demand:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="demandList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键ID" align="center" prop="id" />
      <el-table-column label="需求日期" align="center" prop="demandDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.demandDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="需求编号" align="center" prop="demandNo" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="联系人姓名" align="center" prop="contactName" />
      <el-table-column label="联系人电话" align="center" prop="contactPhone" />
      <el-table-column label="收货地址" align="center" prop="deliveryAddress" />
      <el-table-column label="计划发货日期" align="center" prop="planDeliveryDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.planDeliveryDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['demand:demand:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['demand:demand:remove']">删除</el-button>
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

    <!-- 添加或修改需求表对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="demandRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="需求日期" prop="demandDate">
          <el-date-picker clearable
            v-model="form.demandDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择需求日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="需求编号" prop="demandNo">
          <el-input v-model="form.demandNo" placeholder="请输入需求编号" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input v-model="form.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系人电话" prop="contactPhone">
          <el-input v-model="form.contactPhone" placeholder="请输入联系人电话" />
        </el-form-item>
        <el-form-item label="收货地址" prop="deliveryAddress">
          <el-input v-model="form.deliveryAddress" placeholder="请输入收货地址" />
        </el-form-item>
        <el-form-item label="计划发货日期" prop="planDeliveryDate">
          <el-date-picker clearable
            v-model="form.planDeliveryDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择计划发货日期">
          </el-date-picker>
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

<script setup name="Demand">
import { listDemand, getDemand, delDemand, addDemand, updateDemand } from "@/api/demand/demand"

const { proxy } = getCurrentInstance()

const demandList = ref([])
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
    demandDate: null,
    demandNo: null,
    customerName: null,
    contactName: null,
    contactPhone: null,
    deliveryAddress: null,
    planDeliveryDate: null,
  },
  rules: {
    demandDate: [
      { required: true, message: "需求日期不能为空", trigger: "blur" }
    ],
    demandNo: [
      { required: true, message: "需求编号不能为空", trigger: "blur" }
    ],
    customerName: [
      { required: true, message: "客户名称不能为空", trigger: "blur" }
    ],
    contactName: [
      { required: true, message: "联系人姓名不能为空", trigger: "blur" }
    ],
    contactPhone: [
      { required: true, message: "联系人电话不能为空", trigger: "blur" }
    ],
    deliveryAddress: [
      { required: true, message: "收货地址不能为空", trigger: "blur" }
    ],
    planDeliveryDate: [
      { required: true, message: "计划发货日期不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询需求表列表 */
function getList() {
  loading.value = true
  listDemand(queryParams.value).then(response => {
    demandList.value = response.rows
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
    demandDate: null,
    demandNo: null,
    customerName: null,
    contactName: null,
    contactPhone: null,
    deliveryAddress: null,
    planDeliveryDate: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("demandRef")
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
  title.value = "添加需求表"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getDemand(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改需求表"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["demandRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateDemand(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addDemand(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除需求表编号为"' + _ids + '"的数据项？').then(function() {
    return delDemand(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('demand/demand/export', {
    ...queryParams.value
  }, `demand_${new Date().getTime()}.xlsx`)
}

getList()
</script>
