<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="考勤日期" prop="date">
        <el-date-picker clearable
          v-model="queryParams.date"
          type="date"
          value-format="YYYY-MM-DD"
          placeholder="请选择考勤日期">
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
          v-hasPermi="['attendance:main:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="Edit"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['attendance:main:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['attendance:main:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="Download"
          @click="handleExport"
          v-hasPermi="['attendance:main:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
        row-key="date"
        border
        default-expand-all
        :tree-props="{children: 'attendanceDetailList', hasChildren: 'hasChildren'}"
        v-loading="loading" :data="mainList" @selection-change="handleSelectionChange"
        style="flex: 1; min-height: 0;">
      <el-table-column type="selection" width="55" align="center" />
<!--      <el-table-column label="考勤主记录ID" align="center" prop="mainId" />-->
      <el-table-column label="考勤日期" align="center" prop="date" width="120" fixed>
        <template #default="scope">
          <span>{{ parseTime(scope.row.date, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="班组名称" align="center" prop="groupName" width="120" fixed>
        <template #default="scope">
          <span>{{ scope.row.groupName || scope.row.groupId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班长姓名" align="center" prop="leaderName" width="100">
        <template #default="scope">
          <span>{{ scope.row.leaderName || '' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产线编制" align="center" prop="quota" width="80" />
      <el-table-column label="应出勤人数" align="center" prop="actualCount" width="90" />
      <el-table-column label="请假人数" align="center" prop="leaveCount" width="90" />
      <el-table-column label="工伤人数" align="center" prop="injuryCount" width="90" />
      <el-table-column label="实出勤人数" align="center" prop="actualAttendCount" width="90" />
      <el-table-column label="出勤率" align="center" prop="attendanceRate" width="100" />
      <el-table-column label="人员缺口" align="center" prop="lackQuotaCount" width="80" />
      <el-table-column label="紧急程度" align="center" prop="urgencyLevel" fixed="right">
        <template #default="scope">
          <el-rate
            v-if="scope.row.urgencyLevel !== undefined && scope.row.urgencyLevel !== null && scope.row.urgencyLevel !== ''"
            v-model="scope.row.urgencyLevel"
            disabled
            :max="5"
            :colors="['#FF9900', '#FF9900', '#FF9900']"
          />
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="班次" align="center" prop="attendanceShift" fixed="right">
        <template #default="scope">
          <span>{{ getShiftLabel(scope.row.attendanceShift) }}</span>
        </template>
      </el-table-column>
      
      
<!--      <el-table-column label="备注" align="center" prop="remark" />-->
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['attendance:main:edit']">修改</el-button>
          <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['attendance:main:remove']">删除</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改每日考勤主抽屉 -->
    <el-drawer :title="title" v-model="open" size="80%" direction="rtl">
       <el-form ref="mainRef" :model="form" :rules="rules" label-width="120px"  style="display: flex; height: 100%; flex-direction: column;">
         <el-form-item label="考勤日期" prop="date">
           <el-date-picker clearable
                           v-model="form.date"
                           type="date"
                           value-format="YYYY-MM-DD"
                           placeholder="请选择考勤日期">
           </el-date-picker>
         </el-form-item>
                 <el-form-item label="备注" prop="remark">
                   <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
                 </el-form-item>
         <el-divider content-position="center">每日考勤详情信息</el-divider>
         <el-row :gutter="10" class="mb8">
           <el-col :span="1.5">
             <el-button type="primary" icon="Plus" @click="handleAddAttendanceDetail">添加</el-button>
           </el-col>
           <el-col :span="1.5">
             <el-button type="danger" icon="Delete" @click="handleDeleteAttendanceDetail">删除</el-button>
           </el-col>
         </el-row>
         <el-table :data="attendanceDetailList" :row-class-name="rowAttendanceDetailIndex" @selection-change="handleAttendanceDetailSelectionChange" ref="attendanceDetail" style="flex: 1; min-height: 0;">
           <el-table-column fixed type="selection" width="50" align="center" />
           <el-table-column fixed label="序号" align="center" prop="index" width="50"/>
           <!--          <el-table-column label="关联班组ID" prop="groupId" width="150">
                       <template #default="scope">
                         <el-input v-model="scope.row.groupId" placeholder="请输入关联班组ID" />
                       </template>
                     </el-table-column>-->
           <el-table-column fixed label="班组名称" prop="groupId" width="200" align="center">
             <template #default="scope">
               <el-select
                 v-model="scope.row.groupId"
                 placeholder="请选择班组"
                 @change="handleGroupChange(scope.row)"
                 filterable
               >
                 <el-option
                   v-for="group in groupList"
                   :key="group.groupId"
                   :label="group.groupName"
                   :value="group.groupId"
                 />
               </el-select>
             </template>
           </el-table-column>
           <el-table-column fixed label="班长姓名" prop="leaderName" width="100" align="center">
             <template #default="scope">
               {{ scope.row.leaderName || ''}}
             </template>
           </el-table-column>
           <el-table-column label="产线编制" prop="quota" width="80" align="center">
             <template #default="scope">
               {{scope.row.quota}}
             </template>
           </el-table-column>
           <el-table-column label="应出勤人数" prop="actualCount" width="90" align="center">
             <template #default="scope">
               <el-input v-model="scope.row.actualCount" placeholder="请输入应出勤人数" @input="handleAttendanceCalculate(scope.row)" />
             </template>
           </el-table-column>
           <el-table-column label="请假人数" prop="leaveCount" width="90" align="center">
             <template #default="scope">
               <el-input v-model="scope.row.leaveCount" placeholder="请输入请假人数" @input="handleAttendanceCalculate(scope.row)" />
             </template>
           </el-table-column>
           <el-table-column label="工伤人数" prop="injuryCount" width="90" align="center">
             <template #default="scope">
               <el-input v-model="scope.row.injuryCount" placeholder="请输入工伤人数" @input="handleAttendanceCalculate(scope.row)" />
             </template>
           </el-table-column>
           <el-table-column label="实出勤人数" prop="actualAttendCount" width="90" align="center">
             <template #default="scope">
               {{scope.row.actualAttendCount}}
             </template>
           </el-table-column>
           <el-table-column label="出勤率" prop="attendanceRate" width="100" align="center">
             <template #default="scope">
               {{scope.row.attendanceRate}}%
             </template>
           </el-table-column>
           <el-table-column label="人员缺口" prop="lackQuotaCount" width="80" align="center">
             <template #default="scope">
               {{scope.row.lackQuotaCount}}
             </template>
           </el-table-column>
           <el-table-column label="紧急程度" prop="urgencyLevel" width="150" align="center">
             <template #default="scope">
               <el-rate
                 v-model="scope.row.urgencyLevel"
                 :max="5"
                 :colors="['#FF9900', '#FF9900', '#FF9900']"
               />
             </template>
           </el-table-column>
           <el-table-column label="班次" prop="attendanceShift" align="center">
             <template #default="scope">
               <el-select v-model="scope.row.attendanceShift" placeholder="请选择班次">
                 <el-option
                     v-for="dict in shift_type"
                     :key="dict.value"
                     :label="dict.label"
                     :value="dict.value"
                 ></el-option>
               </el-select>
             </template>
           </el-table-column>
         </el-table>
       </el-form>
      <template #footer>
        <div style="display: flex; justify-content: flex-end; gap: 10px; padding: 20px;">
          <el-button @click="cancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup name="Main">
import { listMain, getMain, delMain, addMain, updateMain } from "@/api/attendance/main"
import { listGroup } from "@/api/attendance/group"

const { proxy } = getCurrentInstance()
const { shift_type } = proxy.useDict('shift_type')

const mainList = ref([])
const attendanceDetailList = ref([])
const groupList = ref([]) // 班组列表数据源
const open = ref(false)
const loading = ref(true)
const showSearch = ref(true)
const ids = ref([])
const checkedAttendanceDetail = ref([])
const single = ref(true)
const multiple = ref(true)
const total = ref(0)
const title = ref("")

const data = reactive({
  form: {},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    date: null,
  },
  rules: {
    date: [
      { required: true, message: "考勤日期不能为空", trigger: "blur" }
    ],
  }
})

const { queryParams, form, rules } = toRefs(data)

/** 查询每日考勤主列表 */
async function getList() {
  loading.value = true

  // 如果班组列表为空，先加载班组列表
  if (groupList.value.length === 0) {
    await loadGroupList()
  }

  listMain(queryParams.value).then(response => {
    // 补充班组名称和班长姓名
    mainList.value = response.rows.map(item => {
      if (item.attendanceDetailList && item.attendanceDetailList.length > 0) {
        item.attendanceDetailList = item.attendanceDetailList.map(detail => {
          const group = groupList.value.find(g => g.groupId === detail.groupId)
          return {
            ...detail,
            groupName: group ? group.groupName : detail.groupId,
            leaderName: detail.leaderName || (group ? group.leaderName : ''),
            quota: detail.quota || (group ? group.quota : '')
          }
        })
      }
      return item
    })
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
    mainId: null,
    date: null,
    createBy: null,
    createTime: null,
    updateBy: null,
    updateTime: null,
    remark: null
  }
  attendanceDetailList.value = []
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
  ids.value = selection.map(item => item.mainId)
  single.value = selection.length != 1
  multiple.value = !selection.length
}

/** 新增按钮操作 */
async function handleAdd() {
  reset()
  open.value = true
  title.value = "添加每日考勤主"

  // 加载班组列表
  await loadGroupList()

  // 自动关联所有班组信息到考勤详情列表
  autoFillAllGroups()
}

/** 加载班组列表供下拉框选择 */
async function loadGroupList() {
  try {
    // 调用班组列表接口，获取所有班组数据
    const response = await listGroup({pageNum: 1, pageSize: 999999})

    if (response && response.rows) {
      groupList.value = response.rows
    } else {
      groupList.value = []
      proxy.$modal.msgWarning("暂无班组配置数据，请先配置班组信息")
    }
  } catch (error) {
    console.error("加载班组列表失败:", error)
    proxy.$modal.msgError("加载班组列表失败，请稍后重试")
    groupList.value = []
  }
}

/** 自动填充所有班组到考勤详情列表 */
function autoFillAllGroups() {
  if (groupList.value && groupList.value.length > 0) {
    // 将所有班组数据映射为考勤详情对象
    attendanceDetailList.value = groupList.value.map(group => ({
      groupId: group.groupId,
      groupName: group.groupName,
      leaderName: group.leaderName,
      quota: group.quota,
      actualCount: "",
      leaveCount: "",
      injuryCount: "",
      actualAttendCount: "",
      attendanceRate: "",
      lackQuotaCount: "",
      urgencyLevel: 0,
      attendanceShift: "",
      remark: ""
    }))

    proxy.$modal.msgSuccess(`已自动关联 ${groupList.value.length} 个班组`)
  } else {
    proxy.$modal.msgWarning("暂无班组配置数据，请先配置班组信息")
  }
}

/** 修改按钮操作 */
async function handleUpdate(row) {
  reset()

  // 先加载班组列表
  await loadGroupList()

  const _mainId = row.mainId || ids.value
  getMain(_mainId).then(response => {
    form.value = response.data
    // 处理考勤详情列表数据，确保数值类型字段正确，并补充班组信息
    attendanceDetailList.value = response.data.attendanceDetailList.map(item => {
      // 根据 groupId 从班组列表中找到对应的班组信息
      const group = groupList.value.find(g => g.groupId === item.groupId)

      return {
        ...item,
        // 如果后端没有返回这些字段，从班组列表中补充
        groupName: item.groupName || (group ? group.groupName : ""),
        leaderName: item.leaderName || (group ? group.leaderName : ""),
        quota: item.quota || (group ? group.quota : ""),
        urgencyLevel: Number(item.urgencyLevel) || 0,
        actualCount: item.actualCount || "",
        leaveCount: item.leaveCount || "",
        injuryCount: item.injuryCount || "",
        actualAttendCount: item.actualAttendCount || "",
        attendanceRate: item.attendanceRate || "",
        lackQuotaCount: item.lackQuotaCount || ""
      }
    })
    open.value = true
    title.value = "修改每日考勤主"
  })
}

/** 提交按钮 */
function submitForm() {
  proxy.$refs["mainRef"].validate(valid => {
    if (valid) {
      form.value.attendanceDetailList = attendanceDetailList.value
      if (form.value.mainId != null) {
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
  const _mainIds = row.mainId || ids.value
  proxy.$modal.confirm('是否确认删除每日考勤主编号为"' + _mainIds + '"的数据项？').then(function() {
    return delMain(_mainIds)
  }).then(() => {
    getList()
    proxy.$modal.msgSuccess("删除成功")
  }).catch(() => {})
}

/** 每日考勤详情序号 */
function rowAttendanceDetailIndex({ row, rowIndex }) {
  row.index = rowIndex + 1
}

/** 班组选择变更处理 */
function handleGroupChange(row) {
  // 根据选择的班组ID，从班组列表中找到对应的班组信息
  const selectedGroup = groupList.value.find(group => group.groupId === row.groupId)

  if (selectedGroup) {
    // 自动填充班组相关信息
    row.groupName = selectedGroup.groupName
    row.leaderName = selectedGroup.leaderName
    row.quota = selectedGroup.quota

    // 触发自动计算（如果已经有应出勤人数等数据）
    if (row.actualCount || row.leaveCount || row.injuryCount) {
      handleAttendanceCalculate(row)
    }
  }
}

/** 每日考勤详情添加按钮操作 */
function handleAddAttendanceDetail() {
  let obj = {
    groupId: null,
    groupName: "",
    leaderName: "",
    quota: "",
    actualCount: "",
    leaveCount: "",
    injuryCount: "",
    actualAttendCount: "",
    attendanceRate: "",
    lackQuotaCount: "",
    urgencyLevel: 0,
    attendanceShift: "",
    remark: ""
  }
  attendanceDetailList.value.push(obj)
}

/** 每日考勤详情删除按钮操作 */
function handleDeleteAttendanceDetail() {
  if (checkedAttendanceDetail.value.length == 0) {
    proxy.$modal.msgError("请先选择要删除的每日考勤详情数据")
  } else {
    const attendanceDetails = attendanceDetailList.value
    const checkedAttendanceDetails = checkedAttendanceDetail.value
    attendanceDetailList.value = attendanceDetails.filter(function(item) {
      return checkedAttendanceDetails.indexOf(item.index) == -1
    })
  }
}

/** 复选框选中数据 */
function handleAttendanceDetailSelectionChange(selection) {
  checkedAttendanceDetail.value = selection.map(item => item.index)
}

/** 考勤数据自动计算 */
function handleAttendanceCalculate(row) {
  // 将输入值转换为数字，如果为空或非数字则默认为0
  const actualCount = Number(row.actualCount) || 0
  const leaveCount = Number(row.leaveCount) || 0
  const injuryCount = Number(row.injuryCount) || 0
  const quota = Number(row.quota) || 0

  // 计算实出勤人数 = 应出勤人数 - 请假人数 - 工伤人数
  row.actualAttendCount = actualCount - leaveCount - injuryCount

  // 计算出勤率 = (实出勤人数 / 应出勤人数) × 100，保留2位小数
  if (actualCount > 0) {
    row.attendanceRate = ((row.actualAttendCount / actualCount) * 100).toFixed(2)
  } else {
    row.attendanceRate = '0.00'
  }

  // 计算人员缺口 = 产线编制 - 应出勤人数
  row.lackQuotaCount = quota - actualCount
}

/** 获取班次标签 */
function getShiftLabel(value) {
  if (!value && value !== 0) return '-'
  const dict = shift_type.value.find(item => item.value === value)
  return dict ? dict.label : value
}

/** 单元格样式设置 - 实现反显效果 */
function getCellStyle({ row, column, rowIndex, columnIndex }) {
  // 只对详情行（子行）应用样式，父行（日期行）不应用
  if (!row.groupId) {
    return {}
  }

  const property = column.property
  const urgencyLevel = Number(row.urgencyLevel) || 0
  const lackQuotaCount = Number(row.lackQuotaCount) || 0

  // 需要反显的列
  const highlightColumns = ['groupName', 'leaderName', 'urgencyLevel', 'attendanceShift']

  // 判断是否需要反显
  if (highlightColumns.includes(property)) {
    // 紧急程度 > 0 时，使用红色背景
    if (urgencyLevel > 0) {
      return {
        backgroundColor: '#fef0f0',
        color: '#f56c6c'
      }
    }
    // 人员缺口 > 0 时，使用黄色背景
    if (lackQuotaCount > 0) {
      return {
        backgroundColor: '#fdf6ec',
        color: '#e6a23c'
      }
    }
  }

  return {}
}

/** 导出按钮操作 */
function handleExport() {
  proxy.download('attendance/main/export', {
    ...queryParams.value
  }, `main_${new Date().getTime()}.xlsx`)
}

getList()
</script>
