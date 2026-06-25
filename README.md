# Farm2Future Frontend V4.1

# Farm2Future 前端项目 V4.1

Farm2Future Frontend V4.1 is a Vue 3 + TypeScript + Vite frontend application for an agricultural ESG data collection and blockchain traceability platform.

Farm2Future 前端项目 V4.1 是一个基于 Vue 3、TypeScript 和 Vite 开发的农业 ESG 数据采集与区块链溯源前端应用。

This version focuses on farm data collection, ESG-related data submission, sales and cost field support, token management, transaction tracking, and dashboard/report features.

该版本主要支持农场数据采集、ESG 相关数据提交、销售与成本字段、代币管理、交易记录追踪以及仪表盘/报告功能。

---

## 1. Project Overview

## 1. 项目简介

Farm2Future is designed to help farms digitize production data and support ESG monitoring through frontend forms, dashboards, API integration, and blockchain-related workflows.

Farm2Future 旨在帮助农场数字化生产数据，并通过前端表单、仪表盘、API 集成和区块链相关流程支持 ESG 监控。

Main features include:

主要功能包括：

* User login and role-based frontend access
  用户登录与基于角色的前端访问

* Farm data collection and submission
  农场数据采集与提交

* Sales and cost fields in farm data forms
  农场数据表单中的销售与成本字段

* ESG dashboard visualization
  ESG 仪表盘可视化

* ESG report generation and export
  ESG 报告生成与导出

* Token issuance and ownership transfer
  代币发行与所有权转移

* Blockchain transaction record display
  区块链交易记录展示

* Mock data mode and real backend API mode
  Mock 模拟数据模式与真实后端 API 模式

---

## 2. Technology Stack

## 2. 技术栈

This project uses the following technologies:

本项目使用以下技术：

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
├── .vscode
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
│   ├── pages
│   ├── types
│   ├── App.vue
│   └── main.ts
├── .env.example
├── .gitignore
├── API_CONTRACT.md
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## 4. Prerequisites

## 4. 运行前准备

Before running this project, make sure the following tools are installed:

在运行本项目之前，请确保已经安装以下工具：

* Node.js
* npm
* Git

Check your Node.js and npm versions:

检查 Node.js 和 npm 版本：

```bash
node -v
npm -v
```

Recommended Node.js version:

推荐 Node.js 版本：

```text
Node.js 20 or above
```

---

## 5. Clone the Repository

## 5. 克隆项目代码

Clone the repository from GitHub:

从 GitHub 克隆项目：

```bash
git clone https://github.com/Joseph9807/Farm2Future-Frontend-V4.1.git
```

Enter the project folder:

进入项目目录：

```bash
cd Farm2Future-Frontend-V4.1
```

Make sure you are on the main branch:

确认当前在 main 主分支：

```bash
git checkout main
```

Pull the latest code:

拉取最新代码：

```bash
git pull origin main
```

---

## 6. Install Dependencies

## 6. 安装依赖

Install project dependencies:

安装项目依赖：

```bash
npm install
```

If npm cache causes installation problems, run:

如果 npm 缓存导致安装失败，可以执行：

```bash
npm cache clean --force
npm install
```

---

## 7. Environment Variables

## 7. 环境变量配置

Create a `.env` file in the project root directory.

在项目根目录创建 `.env` 文件。

You can copy the example file:

可以复制示例文件：

```bash
copy .env.example .env
```

For macOS or Linux:

如果使用 macOS 或 Linux：

```bash
cp .env.example .env
```

Example `.env` configuration:

`.env` 配置示例：

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8000
```

---

## 8. Environment Variable Explanation

## 8. 环境变量说明

| Variable / 变量       | Description / 说明                                                                                     |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `VITE_USE_MOCK`     | Controls whether the frontend uses local mock data or real backend API. 控制前端是否使用本地 Mock 数据或真实后端 API。 |
| `VITE_API_BASE_URL` | Backend API base URL used when `VITE_USE_MOCK=false`. 当 `VITE_USE_MOCK=false` 时使用的后端 API 基础地址。       |

---

## 9. Mock Mode

## 9. Mock 模式

If you only want to run the frontend without a backend server, use mock mode:

如果只想在没有后端服务器的情况下运行前端，可以使用 Mock 模式：

```env
VITE_USE_MOCK=true
VITE_API_BASE_URL=http://localhost:8000
```

In mock mode, the frontend uses the local in-memory mock data layer located in:

在 Mock 模式下，前端会使用本地模拟数据，位置为：

```text
src/api/__mocks__
```

This mode is suitable for UI testing, frontend development, and demonstrations.

该模式适合 UI 测试、前端开发和项目演示。

---

## 10. Real Backend Mode

## 10. 真实后端模式

If you want the frontend to send real HTTP requests to the backend, set:

如果希望前端向真实后端发送 HTTP 请求，请设置：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8080
```

If your backend runs on port `8000`, use:

如果后端运行在 `8000` 端口，可以使用：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=http://localhost:8000
```

After changing `.env`, restart the frontend development server.

修改 `.env` 后，需要重新启动前端开发服务器。

---

## 11. Run the Project

## 11. 运行项目

Start the development server:

启动开发服务器：

```bash
npm run dev
```

The project usually runs at:

项目通常运行在：

```text
http://localhost:5173
```

Open this address in your browser.

在浏览器中打开该地址即可访问项目。

---

## 12. Build the Project

## 12. 打包项目

Build the project for production:

执行生产环境打包：

```bash
npm run build
```

The production build files will be generated in:

打包后的生产环境文件会生成在：

```text
dist
```

---

## 13. Preview Production Build

## 13. 预览生产环境版本

After building the project, preview it locally:

打包完成后，可以本地预览：

```bash
npm run preview
```

The preview server usually runs at:

预览服务通常运行在：

```text
http://localhost:4173
```

---

## 14. Available Scripts

## 14. 可用命令

| Command / 命令      | Description / 说明                                                      |
| ----------------- | --------------------------------------------------------------------- |
| `npm run dev`     | Start the local development server. 启动本地开发服务器。                        |
| `npm run build`   | Run TypeScript checking and build the project. 执行 TypeScript 检查并打包项目。 |
| `npm run preview` | Preview the production build locally. 本地预览生产环境构建结果。                   |

---

## 15. Backend API Contract

## 15. 后端 API 接口约定

The frontend communicates with the backend through REST API endpoints.

前端通过 REST API 接口与后端进行通信。

The detailed API contract is documented in:

详细 API 接口约定位于：

```text
API_CONTRACT.md
```

Main API modules include:

主要 API 模块包括：

* Authentication
  用户认证

* Farm Data
  农场数据

* Tokens
  代币

* Token Transfer
  代币转移

* Regulator Token Monitoring
  监管人员代币监控

* Blockchain Transactions
  区块链交易记录

* ESG Report Generation
  ESG 报告生成

* ESG Report Export
  ESG 报告导出

* Dashboard Overview
  仪表盘总览

---

## 16. Main API Endpoints

## 16. 主要 API 接口

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

Used to submit farm batch data, including crop data, water usage, fertiliser usage, sales data, cost data, and IoT sensor snapshot.

用于提交农场批次数据，包括作物数据、用水量、肥料使用量、销售数据、成本数据和 IoT 传感器快照。

---

### Token Issuance

### 代币发行

```http
POST /api/tokens
```

Used to issue an on-chain token representing a farm produce batch.

用于为农产品批次发行链上代币。

---

### Token Transfer

### 代币转移

```http
POST /api/tokens/{tokenId}/transfer
```

Used to transfer token ownership to a new blockchain address.

用于将代币所有权转移到新的区块链地址。

---

### Token Monitoring

### 代币监控

```http
GET /api/tokens
```

Used by regulators to monitor agricultural tokens.

用于监管人员监控农业代币。

---

### Transactions

### 交易记录

```http
GET /api/transactions
```

Used to display blockchain transaction records.

用于展示区块链交易记录。

---

### ESG Report Generation

### ESG 报告生成

```http
POST /api/reports/esg/generate
```

Used to generate an ESG report based on a selected period and entity.

用于根据所选时间范围和对象生成 ESG 报告。

---

### ESG Report Export

### ESG 报告导出

```http
GET /api/reports/esg/export?format=csv
GET /api/reports/esg/export?format=pdf
```

Used to export ESG reports as CSV or PDF.

用于将 ESG 报告导出为 CSV 或 PDF。

---

### Dashboard Overview

### 仪表盘总览

```http
GET /api/dashboard/overview
```

Used to load ESG dashboard overview data.

用于加载 ESG 仪表盘总览数据。

---

## 17. CORS Requirement

## 17. 跨域配置要求

During local development, the frontend usually runs at:

本地开发时，前端通常运行在：

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

Because the frontend and backend use different ports, the backend must allow CORS requests from the frontend origin.

由于前端和后端使用不同端口，后端需要允许来自前端地址的跨域请求。

Example allowed origin:

允许的前端地址示例：

```text
http://localhost:5173
```

---

## 18. Deployment

## 18. 部署说明

To generate deployable static files, run:

生成可部署的静态文件：

```bash
npm run build
```

The generated `dist` folder can be deployed to:

生成的 `dist` 文件夹可以部署到：

* Vercel
* Netlify
* GitHub Pages
* Nginx static server
* Any static hosting platform

For real backend deployment, make sure the production environment variable points to a deployed backend API:

如果部署真实后端版本，请确保生产环境变量指向已经部署的后端 API：

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://your-backend-domain.com
```

For demo-only deployment, mock mode can be used:

如果只是演示页面，可以使用 Mock 模式：

```env
VITE_USE_MOCK=true
```

---

## 19. Troubleshooting

## 19. 常见问题解决

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
   确保 `.env` 文件在项目根目录。

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

5. Restart the frontend after modifying `.env`.
   修改 `.env` 后重新启动前端。

```bash
npm run dev
```

6. Open browser developer tools and check Fetch/XHR requests.
   打开浏览器开发者工具，检查 Fetch/XHR 请求。

```text
F12 → Network → Fetch/XHR
```

7. Trigger an API action, such as login, dashboard loading, or form submission.
   触发一个 API 操作，例如登录、加载仪表盘或提交表单。

---

### Problem: TypeScript build errors

### 问题：TypeScript 打包错误

The default build command runs TypeScript checking before Vite build.

默认打包命令会在 Vite 打包前执行 TypeScript 检查。

```bash
npm run build
```

If you only need to generate a deployable frontend package for demonstration, you can run:

如果只是为了演示并生成可部署前端包，可以执行：

```bash
npx vite build
```

This skips TypeScript checking and directly generates the `dist` folder.

该命令会跳过 TypeScript 检查，直接生成 `dist` 文件夹。

---

### Problem: CORS Error

### 问题：跨域错误

If the browser blocks API requests, configure the backend to allow requests from:

如果浏览器拦截 API 请求，需要在后端允许以下前端地址：

```text
http://localhost:5173
```

---

## 20. Git Workflow

## 20. Git 使用流程

### Check Current Branch

### 查看当前分支

```bash
git branch
```

### Pull Latest Code

### 拉取最新代码

```bash
git pull origin main
```

### Add Changes

### 添加修改

```bash
git add .
```

### Commit Changes

### 提交修改

```bash
git commit -m "update README documentation"
```

### Push Changes

### 推送到 GitHub

```bash
git push origin main
```

---

## 21. Release Package

## 21. 发布版本包

To publish a deployable release package:

发布可部署版本包的流程：

1. Build the project.
   打包项目。

```bash
npx vite build
```

2. Compress the `dist` folder.
   压缩 `dist` 文件夹。

```text
farm2future-frontend-v1.0.0-dist.zip
```

3. Create a Git tag.
   创建 Git 标签。

```bash
git tag -a v1.0.0 -m "Farm2Future frontend production build"
git push origin v1.0.0
```

4. Create a GitHub Release and upload the ZIP file.
   在 GitHub 创建 Release，并上传 ZIP 文件。

---

## 22. Notes for Backend Developers

## 22. 后端开发说明

Backend developers should follow the data structures and endpoints defined in:

后端开发人员应按照以下文件中定义的数据结构和接口进行开发：

```text
API_CONTRACT.md
```

Important notes:

重要说明：

* All request and response bodies should use JSON.
  所有请求和响应体应使用 JSON。

* Protected endpoints should support the `Authorization: Bearer <token>` header.
  受保护接口应支持 `Authorization: Bearer <token>` 请求头。

* Farm data submission includes crop, water, fertiliser, sales, cost, and IoT snapshot fields.
  农场数据提交包含作物、用水量、肥料、销售、成本和 IoT 快照字段。

* API response structures should match the TypeScript types used by the frontend.
  API 响应结构应与前端 TypeScript 类型保持一致。

* CORS should allow the frontend development origin.
  后端 CORS 应允许前端开发地址访问。

---

## 23. License

## 23. 许可证

This project is for educational and development purposes.

本项目用于学习、教学和开发用途。

---

## 24. Contributors

## 24. 贡献者

Farm2Future Frontend V4.1 was developed as part of the Farm2Future project.

Farm2Future Frontend V4.1 是 Farm2Future 项目的一部分。

Repository:

仓库地址：

```text
https://github.com/Joseph9807/Farm2Future-Frontend-V4.1
```
