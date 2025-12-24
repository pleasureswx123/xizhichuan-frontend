<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="出勤日期" prop="attendanceDate">
        <el-date-picker clearable
          v-model="queryParams.attendanceDate"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择出勤日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="组长姓名" prop="teamLeader">
        <el-input
          v-model="queryParams.teamLeader"
          placeholder="请输入组长姓名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产线编制" prop="plannedStaffCount">
        <el-input
          v-model="queryParams.plannedStaffCount"
          placeholder="请输入产线编制"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="应出勤" prop="expectedAttendanceCount">
        <el-input
          v-model="queryParams.expectedAttendanceCount"
          placeholder="请输入应出勤"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请假" prop="leaveCount">
        <el-input
          v-model="queryParams.leaveCount"
          placeholder="请输入请假"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工伤" prop="injuryCount">
        <el-input
          v-model="queryParams.injuryCount"
          placeholder="请输入工伤"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="实出勤" prop="actualAttendanceCount">
        <el-input
          v-model="queryParams.actualAttendanceCount"
          placeholder="请输入实出勤"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出勤率" prop="attendanceRate">
        <el-input
          v-model="queryParams.attendanceRate"
          placeholder="请输入出勤率"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="出勤排名" prop="attendanceRank">
        <el-input
          v-model="queryParams.attendanceRank"
          placeholder="请输入出勤排名"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="人员缺口" prop="staffShortageCount">
        <el-input
          v-model="queryParams.staffShortageCount"
          placeholder="请输入人员缺口"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="紧急程度" prop="urgencyLevel">
        <el-input
          v-model="queryParams.urgencyLevel"
          placeholder="请输入紧急程度"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="班次" prop="shiftType">
        <el-select v-model="queryParams.shiftType" placeholder="请选择班次" clearable>
          <el-option
            v-for="dict in shift_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="班组" prop="teamId">
        <el-input
          v-model="queryParams.teamId"
          placeholder="请输入班组"
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
          v-hasPermi="['attendance:attendance:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['attendance:attendance:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['attendance:attendance:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['attendance:attendance:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="attendanceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="主键ID" align="center" prop="id" />-->
      <el-table-column fixed label="序号" align="center" prop="id" />
      <el-table-column fixed label="出勤日期" align="center" prop="attendanceDate" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.attendanceDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班组" align="center" prop="teamId" />
      <el-table-column label="组长姓名" align="center" prop="teamLeader" />
      <el-table-column label="产线编制" align="center" prop="plannedStaffCount" />
      <el-table-column label="应出勤" align="center" prop="expectedAttendanceCount" />
      <el-table-column label="请假" align="center" prop="leaveCount" />
      <el-table-column label="工伤" align="center" prop="injuryCount" />
      <el-table-column label="实出勤" align="center" prop="actualAttendanceCount" />
      <el-table-column label="出勤率" align="center" prop="attendanceRate" />
      <el-table-column label="出勤排名" align="center" prop="attendanceRank" />
      <el-table-column label="人员缺口" align="center" prop="staffShortageCount" />
      <el-table-column label="紧急程度" align="center" prop="urgencyLevel" />
      <el-table-column label="班次" align="center" prop="shiftType">
        <template #default="scope">
          <dict-tag :options="shift_type" :value="scope.row.shiftType"/>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="180" />
      <el-table-column fixed="right" label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" @click="handleUpdate(scope.row)" v-hasPermi="['attendance:attendance:edit']">修改</el-button>
          <el-button link type="primary" @click="handleDelete(scope.row)" v-hasPermi="['attendance:attendance:remove']">删除</el-button>
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

    <!-- 添加或修改考勤管理对话框 -->
    <el-dialog :title="title" v-model="open" width="500px" append-to-body>
      <el-form ref="attendanceRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="出勤日期" prop="attendanceDate">
          <el-date-picker clearable
            v-model="form.attendanceDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择出勤日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="组长姓名" prop="teamLeader">
          <el-input v-model="form.teamLeader" placeholder="请输入组长姓名" />
        </el-form-item>
        <el-form-item label="产线编制" prop="plannedStaffCount">
          <el-input v-model="form.plannedStaffCount" placeholder="请输入产线编制" />
        </el-form-item>
        <el-form-item label="应出勤" prop="expectedAttendanceCount">
          <el-input v-model="form.expectedAttendanceCount" placeholder="请输入应出勤" />
        </el-form-item>
        <el-form-item label="请假" prop="leaveCount">
          <el-input v-model="form.leaveCount" placeholder="请输入请假" />
        </el-form-item>
        <el-form-item label="工伤" prop="injuryCount">
          <el-input v-model="form.injuryCount" placeholder="请输入工伤" />
        </el-form-item>
        <el-form-item label="实出勤" prop="actualAttendanceCount">
          <el-input v-model="form.actualAttendanceCount" placeholder="请输入实出勤" />
        </el-form-item>
        <el-form-item label="出勤率" prop="attendanceRate">
          <el-input v-model="form.attendanceRate" placeholder="请输入出勤率" />
        </el-form-item>
        <el-form-item label="出勤排名" prop="attendanceRank">
          <el-input v-model="form.attendanceRank" placeholder="请输入出勤排名" />
        </el-form-item>
        <el-form-item label="人员缺口" prop="staffShortageCount">
          <el-input v-model="form.staffShortageCount" placeholder="请输入人员缺口" />
        </el-form-item>
        <el-form-item label="紧急程度" prop="urgencyLevel">
          <el-input v-model="form.urgencyLevel" placeholder="请输入紧急程度" />
        </el-form-item>
        <el-form-item label="班次" prop="shiftType">
          <el-select v-model="form.shiftType" placeholder="请选择班次">
            <el-option
              v-for="dict in shift_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="班组" prop="teamId">
          <el-input v-model="form.teamId" placeholder="请输入班组" />
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

<script setup name="Attendance">
import { listAttendance, getAttendance, delAttendance, addAttendance, updateAttendance } from "@/api/attendance/attendance"

const { proxy } = getCurrentInstance()
const { shift_type } = proxy.useDict('shift_type')

const attendanceList = ref([])
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
    attendanceDate: null,
    teamLeader: null,
    plannedStaffCount: null,
    expectedAttendanceCount: null,
    leaveCount: null,
    injuryCount: null,
    actualAttendanceCount: null,
    attendanceRate: null,
    attendanceRank: null,
    staffShortageCount: null,
    urgencyLevel: null,
    shiftType: null,
    teamId: null,
  },
  rules: {
    attendanceDate: [
      { required: true, message: "出勤日期不能为空", trigger: "blur" }
    ],
    teamLeader: [
      { required: true, message: "组长姓名不能为空", trigger: "blur" }
    ],
    plannedStaffCount: [
      { required: true, message: "产线编制不能为空", trigger: "blur" }
    ],
    expectedAttendanceCount: [
      { required: true, message: "应出勤不能为空", trigger: "blur" }
    ],
    leaveCount: [
      { required: true, message: "请假不能为空", trigger: "blur" }
    ],
    injuryCount: [
      { required: true, message: "工伤不能为空", trigger: "blur" }
    ],
    actualAttendanceCount: [
      { required: true, message: "实出勤不能为空", trigger: "blur" }
    ],
    attendanceRate: [
      { required: true, message: "出勤率不能为空", trigger: "blur" }
    ],
    attendanceRank: [
      { required: true, message: "出勤排名不能为空", trigger: "blur" }
    ],
    staffShortageCount: [
      { required: true, message: "人员缺口不能为空", trigger: "blur" }
    ],
    urgencyLevel: [
      { required: true, message: "紧急程度不能为空", trigger: "blur" }
    ],
    shiftType: [
      { required: true, message: "班次不能为空", trigger: "change" }
    ],
    teamId: [
      { required: true, message: "班组不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询考勤管理列表 */
function getList() {
  loading.value = true
  listAttendance(queryParams.value).then(response => {
    attendanceList.value = response.rows
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
    attendanceDate: null,
    teamLeader: null,
    plannedStaffCount: null,
    expectedAttendanceCount: null,
    leaveCount: null,
    injuryCount: null,
    actualAttendanceCount: null,
    attendanceRate: null,
    attendanceRank: null,
    staffShortageCount: null,
    urgencyLevel: null,
    shiftType: null,
    teamId: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  proxy.resetForm("attendanceRef")
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
  title.value = "添加考勤管理"
}

/** 修改按钮操作 */
function handleUpdate(row) {
  reset()
  const _id = row.id || ids.value
  getAttendance(_id).then(response => {
    form.value = response.data
    open.value = true
    title.value = "修改考勤管理"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["attendanceRef"].validate(valid => {
    if (valid) {
      if (form.value.id != null) {
        updateAttendance(form.value).then(response => {
          proxy.$modal.msgSuccess("修改成功")
          open.value = false
          getList()
        })
      } else {
        addAttendance(form.value).then(response => {
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
  proxy.$modal.confirm('是否确认删除考勤管理编号为"' + _ids + '"的数据项？').then(function() {
    return delAttendance(_ids)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('attendance/attendance/export', {
    ...queryParams.value
  }, `attendance_${new Date().getTime()}.xlsx`)
}

getList()
</script>
