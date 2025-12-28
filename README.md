<h1 align="center" style="margin: 30px 0 30px; font-weight: bold;">西之川智能管理系统</h1>
<h4 align="center">基于 RuoYi-Vue3 的企业级智能管理平台</h4>

<p align="center">
  <img src="https://img.shields.io/badge/Vue-3.4.0-brightgreen.svg" alt="Vue">
  <img src="https://img.shields.io/badge/Element%20Plus-2.4.3-blue.svg" alt="Element Plus">
  <img src="https://img.shields.io/badge/Vite-5.0.4-purple.svg" alt="Vite">
  <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License">
</p>

## 📋 项目简介

西之川智能管理系统是基于 RuoYi-Vue3 框架开发的企业级管理平台，专注于考勤管理、需求分析和智能决策支持。系统采用前后端分离架构，提供现代化的用户界面和强大的业务功能。

### 技术栈

- **前端框架**: Vue 3.4.0 + Composition API
- **UI 组件库**: Element Plus 2.4.3
- **构建工具**: Vite 5.0.4
- **状态管理**: Pinia 2.1.7
- **路由管理**: Vue Router 4.2.5
- **HTTP 客户端**: Axios 0.27.2
- **图表库**: ECharts 5.4.3
- **包管理器**: pnpm

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### 安装依赖

```bash
# 使用 pnpm 安装依赖（推荐）
pnpm install

# 或使用 npm
npm install --registry=https://registry.npmmirror.com
```

### 开发运行

```bash
# 启动开发服务器
pnpm dev

# 访问地址
http://localhost:80
```

### 生产构建

```bash
# 构建生产环境
pnpm build:prod

# 构建预发布环境
pnpm build:stage

# 预览构建结果
pnpm preview
```

## ✨ 核心功能

### 📊 考勤管理模块

#### 班组配置
- **班组管理**: 配置和管理生产班组信息
  - 班组名称、班长姓名
  - 班组固定编制（产线编制）
  - 班组状态管理
  - 支持批量操作和数据导出

#### 每日考勤
- **考勤记录**: 树形结构展示每日考勤数据
  - 按日期分组，展开显示各班组详情
  - 支持多班组同时管理

- **智能计算**: 自动计算考勤指标
  - 实出勤人数 = 应出勤人数 - 请假人数 - 工伤人数
  - 出勤率 = (实出勤人数 / 应出勤人数) × 100%
  - 人员缺口 = 产线编制 - 应出勤人数

- **可视化反显**: 异常数据智能高亮
  - 🔴 紧急程度 > 0：红色背景提醒
  - 🟡 人员缺口 > 0：黄色背景警告
  - 星级评分显示紧急程度（1-5星）
  - 班次字典化显示

- **便捷操作**
  - 新增考勤时自动关联所有班组
  - 选择班组自动填充班长和编制信息
  - 支持批量编辑和导出

### 📝 需求管理模块

#### 需求订单
- **订单管理**: 客户需求订单的全生命周期管理
  - 需求日期、需求编号
  - 客户信息（名称、联系人、联系电话）
  - 交付地址、计划交付日期

#### 商品管理
- **产品配置**: 订单商品明细管理
  - 商品名称、规格、单位
  - 数量、单价、金额
  - 自动计算金额

### 🤖 智能分析模块

- **需求分析**: AI 驱动的智能需求分析
  - 自然语言处理客户需求
  - 自动生成初步销售订单
  - 订单数据可视化展示

### 🔧 系统管理模块

#### 用户权限
- 用户管理：系统用户配置和权限分配
- 部门管理：组织机构树形结构管理
- 岗位管理：用户岗位职务配置
- 菜单管理：系统菜单和按钮权限配置
- 角色管理：角色权限和数据范围划分

#### 系统配置
- 字典管理：系统固定数据维护（如班次类型）
- 参数管理：系统动态参数配置
- 通知公告：系统公告信息发布

#### 系统监控
- 操作日志：系统操作记录和异常日志
- 登录日志：用户登录记录和异常监控
- 在线用户：活跃用户状态监控
- 定时任务：任务调度和执行日志
- 服务监控：CPU、内存、磁盘等系统资源监控
- 缓存监控：缓存信息查询和命令统计

#### 开发工具
- 代码生成：前后端代码自动生成（支持 CRUD）
- 系统接口：API 接口文档自动生成
- 在线构建器：拖拽式表单生成器

## 📁 项目结构

```
xizhichuan-frontend/
├── public/                 # 静态资源
├── src/
│   ├── api/               # API 接口
│   │   ├── attendance/    # 考勤模块接口
│   │   │   ├── group.js   # 班组管理
│   │   │   └── main.js    # 考勤记录
│   │   ├── demand/        # 需求模块接口
│   │   │   ├── demand.js  # 需求订单
│   │   │   └── product.js # 商品管理
│   │   ├── system/        # 系统模块接口
│   │   └── monitor/       # 监控模块接口
│   ├── assets/            # 资源文件
│   ├── components/        # 公共组件
│   ├── directive/         # 自定义指令
│   ├── layout/            # 布局组件
│   ├── plugins/           # 插件
│   ├── router/            # 路由配置
│   ├── store/             # Pinia 状态管理
│   ├── utils/             # 工具函数
│   ├── views/             # 页面视图
│   │   ├── attendance/    # 考勤管理
│   │   │   ├── group/     # 班组配置
│   │   │   └── main/      # 每日考勤
│   │   ├── demand/        # 需求管理
│   │   │   ├── demand/    # 需求订单
│   │   │   └── product/   # 商品管理
│   │   ├── analysis/      # 智能分析
│   │   ├── system/        # 系统管理
│   │   └── monitor/       # 系统监控
│   ├── App.vue            # 根组件
│   ├── main.js            # 入口文件
│   └── permission.js      # 权限控制
├── vite/                  # Vite 配置
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── vite.config.js         # Vite 配置文件
├── package.json           # 项目依赖
└── README.md              # 项目说明
```

## 🔑 核心特性

### 1. 智能反显系统
考勤管理模块实现了智能数据反显功能，通过颜色编码快速识别异常情况：
- 紧急情况（红色）：需要立即处理的班组
- 人员不足（黄色）：需要关注的人员缺口

### 2. 自动计算引擎
考勤数据自动计算，减少人工错误：
- 实时计算出勤率
- 自动统计人员缺口
- 动态更新考勤指标

### 3. 树形数据展示
采用树形结构展示考勤数据，层次清晰：
- 父节点：考勤日期
- 子节点：各班组详细数据
- 支持展开/折叠操作

### 4. 智能关联填充
新增考勤时自动关联所有班组，提高录入效率：
- 自动加载班组列表
- 自动填充班组信息
- 智能补充缺失数据

## 🛠️ 开发指南

### 代码规范

- 使用 Vue 3 Composition API
- 遵循 ESLint 代码规范
- 组件命名采用 PascalCase
- 文件命名采用 kebab-case

### API 调用示例

```javascript
// 查询考勤列表
import { listMain } from '@/api/attendance/main'

async function getList() {
  const response = await listMain(queryParams.value)
  mainList.value = response.rows
  total.value = response.total
}
```

### 组件开发示例

```vue
<script setup name="ComponentName">
import { ref, reactive } from 'vue'

const loading = ref(false)
const data = reactive({
  list: [],
  total: 0
})

// 业务逻辑
</script>
```

## 📝 配置说明

### 环境变量

开发环境 (`.env.development`):
```env
VITE_APP_ENV = 'development'
VITE_APP_BASE_API = '/dev-api'
```

生产环境 (`.env.production`):
```env
VITE_APP_ENV = 'production'
VITE_APP_BASE_API = '/prod-api'
```

### 代理配置

在 `vite.config.js` 中配置开发服务器代理：

```javascript
server: {
  port: 80,
  proxy: {
    '/dev-api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (p) => p.replace(/^\/dev-api/, '')
    }
  }
}
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 📄 开源协议

本项目基于 [MIT](LICENSE) 协议开源

## 🙏 致谢

本项目基于 [RuoYi-Vue3](https://gitee.com/y_project/RuoYi-Vue) 框架开发，感谢若依团队的开源贡献！

---

<p align="center">Made with ❤️ by 西之川团队</p>
