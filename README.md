# Farm2Future Frontend V4.1

# Farm2Future 前端项目 V4.1

Farm2Future Frontend V4.1 is a Vue 3 + TypeScript + Vite frontend application for an agricultural ESG and blockchain-based traceability platform.

Farm2Future 前端项目 V4.1 是一个基于 Vue 3、TypeScript 和 Vite 开发的前端应用，主要用于农业 ESG 管理和区块链溯源平台。

---

## 1. Project Overview

## 1. 项目简介

Farm2Future is designed to support sustainable agriculture through digital farm data collection, ESG monitoring, token management, and blockchain transaction tracking.

Farm2Future 旨在通过数字化农场数据采集、ESG 监控、代币管理和区块链交易追踪来支持可持续农业发展。

The frontend system provides different functions for farmers, regulators, and other users.

该前端系统为农户、监管人员和其他用户提供不同的功能。

Main functions include:

主要功能包括：

* User login and role-based access
  用户登录和基于角色的访问控制

* Farm data collection and submission
  农场数据采集与提交

* ESG dashboard visualization
  ESG 仪表盘可视化

* Token issuance and transfer
  代币发行与转移

* Blockchain transaction monitoring
  区块链交易监控

* Regulator monitoring interface
  监管人员监控界面

* ESG report generation and export
  ESG 报告生成与导出

* Mock mode and real backend API mode switching
  Mock 模拟数据模式与真实后端 API 模式切换

---

## 2. Technology Stack

## 2. 技术栈

This project is built with:

本项目使用以下技术开发：

* Vue 3
* TypeScript
* Vite
* Tailwind CSS
* Chart.js
* Vue Chart.js
* Lucide Vue Next

---

## 3. Project Structure

## 3. 项目结构

```text
Farm2Future-Frontend-V4.1
├── public
├── src
│   ├── api
│   │   ├── __mocks__
│   │   ├── auth.ts
│   │   ├── client.ts
│   │   ├── dashboard.ts
│   │   ├── farms.ts
│   │   ├── reports.ts
│   │   ├── tokens.ts
│   │   └── transactions.ts
│   ├── assets
│   ├── components
│   ├── types
│   ├── App.vue
│   └── main.ts
├── .env.example
├── API_CONTRACT.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 4. Prerequisites

## 4. 运行前准备

Before running this project, make sure you have installed:

在运行本项目之前，请确保已经安装以下软件：

* Node.js
* npm
* Git

Check Node.js version:

检查 Node.js 版本：

```bash
node -v
```

It is recommended to use Node.js 20 or above.

建议使用 Node.js 20 或更高版本。

---

## 5. Clone the Repository

## 5. 克隆项目代码

Clone the project from GitHub:

从 GitHub 克隆项目代码：

```bash
git clone https://github.com/Joseph9807/Farm2Future-Frontend-V4.1.git
```

Enter the project folder:

进入项目文件夹：

```bash
cd Farm2Future-Frontend-V4.1
```

Switch to the `backend-support` branch:

切换到 `backend-support` 分支：

```bash
git checkout backend-support
```

If the branch does not exist locally, use:

如果本地没有该分支，可以使用：

```bash
git checkout -b backend-support origin/backend-support
```

---

## 6. Install Dependencies

## 6. 安装依赖

Install all frontend dependencies:

安装前端项目依赖：

```bash
npm install
```

If npm has cache problems, clean the cache first:

如果 npm 出现缓存问题，可以先清理缓存：

```bash
npm cache clean --force
npm install
```

---

## 7. Environment Variables

## 7. 环境变量配置

Create a `.env` file in the project root directory.

在项目根目录创建 `.env` 文件。

You can copy from the example file:

可以从示例文件复制：

```bash
copy .env.example .env
```

For macOS or Linux:

如果是 macOS 或 Linux：

```bash
cp .env.example .env
```

Example `.env` file:

`.env` 示例：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

### Environment Variable Explanation

### 环境变量说明

| Variable / 变量       | Description / 说明                                                                       |
| ------------------- | -------------------------------------------------------------------------------------- |
| `VITE_USE_MOCK`     | Controls whether the frontend uses mock data or real backend API. 控制前端是否使用模拟数据或真实后端接口。 |
| `VITE_API_BASE_URL` | Backend API base URL when mock mode is disabled. 当关闭 mock 模式时使用的后端 API 地址。             |

---

## 8. Mock Mode and Real Backend Mode

## 8. Mock 模式与真实后端模式

### Mock Mode

### Mock 模式

If you want to run the frontend without a backend server, set:

如果想在没有后端服务器的情况下运行前端，可以设置：

```env
VITE_USE_MOCK=true
```

In mock mode, the frontend uses local in-memory mock data from:

在 Mock 模式下，前端会使用本地模拟数据，数据位置为：

```text
src/api/__mocks__
```

This mode is useful for frontend development and UI testing.

该模式适合前端页面开发和 UI 测试。

---

### Real Backend Mode

### 真实后端模式

If you want the frontend to send real HTTP requests to the backend, set:

如果希望前端向真实后端发送 HTTP 请求，可以设置：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

If your backend runs on port `8000`, use:

如果你的后端运行在 `8000` 端口，可以使用：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000
```

After changing `.env`, restart the Vite development server.

修改 `.env` 后，需要重新启动 Vite 开发服务器。

---

## 9. Run the Project

## 9. 运行项目

Start the development server:

启动开发服务器：

```bash
npm run dev
```

The project will usually run at:

项目通常会运行在：

```text
http://localhost:5173
```

Open this address in your browser.

在浏览器中打开该地址即可访问项目。

---

## 10. Build for Production

## 10. 生产环境打包

To build the project:

执行以下命令进行打包：

```bash
npm run build
```

The production files will be generated in the `dist` folder.

打包后的生产环境文件会生成在 `dist` 文件夹中。

---

## 11. Preview Production Build

## 11. 预览生产环境构建结果

After building the project, preview it locally:

项目打包完成后，可以本地预览：

```bash
npm run preview
```

---

## 12. Available Scripts

## 12. 可用命令

| Command / 命令      | Description / 说明                                |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Start local development server. 启动本地开发服务器。      |
| `npm run build`   | Type-check and build the project. 类型检查并打包项目。    |
| `npm run preview` | Preview production build locally. 本地预览生产环境构建结果。 |

---

## 13. Backend API Contract

## 13. 后端 API 接口说明

The frontend communicates with the backend through REST API endpoints.

前端通过 REST API 接口与后端进行通信。

The detailed API contract is documented in:

详细接口说明文档位于：

```text
API_CONTRACT.md
```

Main API modules include:

主要 API 模块包括：

* Authentication
  用户认证

* Farm data submission
  农场数据提交

* Token issuance
  代币发行

* Token transfer
  代币转移

* Regulator token monitoring
  监管人员代币监控

* Blockchain transactions
  区块链交易记录

* ESG report generation
  ESG 报告生成

* ESG report export
  ESG 报告导出

* Dashboard overview
  仪表盘总览

---

## 14. Main API Endpoints

## 14. 主要 API 接口

### Authentication

### 用户认证

```http
POST /api/auth/login
```

Used for user login and authentication.

用于用户登录和身份认证。

---

### Farm Data Submission

### 农场数据提交

```http
POST /api/farms/{farmId}/data
```

Used by farmers to submit crop, yield, water usage, fertilizer usage, sales, cost, and IoT data.

用于农户提交作物、产量、用水量、肥料使用量、销售、成本和 IoT 数据。

---

### Token Issuance

### 代币发行

```http
POST /api/tokens
```

Used to issue a blockchain token for a farm batch.

用于为某个农场批次发行区块链代币。

---

### Token Transfer

### 代币转移

```http
POST /api/tokens/{tokenId}/transfer
```

Used to transfer token ownership to another blockchain address.

用于将代币所有权转移到另一个区块链地址。

---

### Token Monitoring

### 代币监控

```http
GET /api/tokens
```

Used by regulators to view and monitor all agricultural tokens.

用于监管人员查看和监控所有农业代币。

---

### Transactions

### 交易记录

```http
GET /api/transactions
```

Used to view blockchain transaction history.

用于查看区块链交易历史记录。

---

### ESG Report Generation

### ESG 报告生成

```http
POST /api/reports/esg/generate
```

Used to generate an ESG report based on selected period and entity.

用于根据所选时间段和对象生成 ESG 报告。

---

### ESG Report Export

### ESG 报告导出

```http
GET /api/reports/esg/export?format=csv
GET /api/reports/esg/export?format=pdf
```

Used to export ESG reports as CSV or PDF.

用于将 ESG 报告导出为 CSV 或 PDF 格式。

---

### Dashboard Overview

### 仪表盘总览

```http
GET /api/dashboard/overview
```

Used to load the main ESG dashboard data.

用于加载 ESG 仪表盘主要数据。

---

## 15. CORS Requirement

## 15. 跨域配置要求

During local development, the frontend usually runs at:

在本地开发时，前端通常运行在：

```text
http://localhost:5173
```

The backend may run at:

后端可能运行在：

```text
http://localhost:8080
```

or:

或者：

```text
http://localhost:8000
```

Because the frontend and backend use different ports, the backend must allow CORS from the frontend origin.

由于前端和后端使用不同端口，后端需要允许来自前端地址的跨域请求。

Example allowed origin:

允许的前端地址示例：

```text
http://localhost:5173
```

For Spring Boot backend, make sure CORS is configured for `/api/**`.

如果后端使用 Spring Boot，请确保为 `/api/**` 配置 CORS。

---

## 16. Troubleshooting

## 16. 常见问题解决

### Problem: `'vite' is not recognized`

### 问题：`'vite' 不是内部或外部命令`

This usually means dependencies are not installed correctly.

这通常表示依赖没有正确安装。

Try:

可以尝试：

```bash
npm install
npm run dev
```

If it still fails:

如果仍然失败：

```bash
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npm run dev
```

---

### Problem: Network does not show real API requests

### 问题：Network 中没有真实 API 请求

Check the following:

请检查以下内容：

1. Make sure `.env` is in the project root directory.
   确保 `.env` 文件位于项目根目录。

2. Make sure the file name is `.env`, not `.env.txt`.
   确保文件名是 `.env`，不是 `.env.txt`。

3. Make sure mock mode is disabled.
   确保已经关闭 Mock 模式。

```env
VITE_USE_MOCK=false
```

4. Make sure the backend URL is correct.
   确保后端地址正确。

```env
VITE_API_BASE_URL=http://localhost:8080
```

5. Restart the frontend after changing `.env`.
   修改 `.env` 后重新启动前端。

```bash
npm run dev
```

6. Open browser developer tools.
   打开浏览器开发者工具。

```text
F12 → Network → Fetch/XHR
```

7. Trigger an API action, such as login or dashboard loading.
   触发一个会发送请求的功能，例如登录或加载 Dashboard 页面。

---

### Problem: CORS Error

### 问题：跨域错误

If the browser blocks requests, configure the backend to allow requests from:

如果浏览器拦截请求，需要在后端允许以下前端地址：

```text
http://localhost:5173
```

---

### Problem: Backend Connection Failed

### 问题：无法连接后端

Check whether the backend is running.

检查后端是否已经启动。

For example, if the `.env` file uses:

例如，如果 `.env` 文件中配置的是：

```env
VITE_API_BASE_URL=http://localhost:8080
```

Then the backend must be available at:

那么后端必须运行在：

```text
http://localhost:8080
```

---

## 17. Git Workflow

## 17. Git 使用流程

### Pull Latest Code

### 拉取最新代码

```bash
git pull
```

### Check Current Branch

### 查看当前分支

```bash
git branch
```

### Switch Branch

### 切换分支

```bash
git checkout backend-support
```

### Add Changes

### 添加修改

```bash
git add .
```

### Commit Changes

### 提交修改

```bash
git commit -m "update README"
```

### Push Changes

### 推送到 GitHub

```bash
git push origin backend-support
```

---

## 18. Notes for Backend Developers

## 18. 后端开发说明

Backend developers should follow the API shapes defined in:

后端开发人员应按照以下文件中定义的 API 格式进行开发：

```text
API_CONTRACT.md
```

Important points:

重要注意事项：

* All request and response bodies should use JSON.
  所有请求和响应数据都应使用 JSON 格式。

* Authentication should return a token and user profile.
  用户认证接口应返回 token 和用户信息。

* Protected endpoints should accept the `Authorization: Bearer <token>` header.
  受保护的接口应支持 `Authorization: Bearer <token>` 请求头。

* Error responses should follow the shared error format.
  错误响应应遵循统一的错误格式。

* Farm batch fields such as sales quantity, unit price, buyer name, seed cost, and fertilizer cost are required by the frontend.
  前端需要农场批次字段，例如销售数量、单价、买家名称、种子成本和肥料成本。

* Dashboard, token, transaction, and ESG report responses should match the TypeScript types used by the frontend.
  Dashboard、Token、Transaction 和 ESG Report 的响应格式应与前端 TypeScript 类型保持一致。

---

## 19. License

## 19. 许可证

This project is for educational and development purposes.

本项目用于学习、教学和开发用途。

---

## 20. Contributors

## 20. 贡献者

Farm2Future Frontend V4.1 was developed as part of the Farm2Future project.

Farm2Future Frontend V4.1 是 Farm2Future 项目的一部分。

Main frontend branch:

主要前端分支：

```text
backend-support
```
