# Development Changelog

> 记录每次开发会话完成了什么。不得删除历史记录。

## 2026-08-21

### P0-001 — 创建 monorepo 目录结构

- 按 docs/PROJECT_STRUCTURE.md 契约创建 apps/api、apps/web、packages/shared、infra 目录骨架
- 空目录添加 .gitkeep 占位文件
- 添加根级 .gitignore（Python / Node / env / IDE / 日志）
- 更新 CURRENT_STATUS.md 与 TASKS.md

### Next

执行 Phase 0 / P0-002。

### Verification

- 目录结构与 PROJECT_STRUCTURE.md 对照校验通过
- 尚未开始代码开发，无测试可运行

### P0-002 — 初始化 FastAPI

- 创建 apps/api Python 项目（pyproject.toml，含 build-system 与 dev 依赖）
- 创建 FastAPI 入口 app/main.py 与健康检查路由 app/api/health.py
- 创建 tests/test_health.py（3 个用例）
- 更新 CURRENT_STATUS.md 与 TASKS.md

### Next

执行 Phase 0 / P0-003。

### Verification

- Python 3.13.3（满足 3.12+）
- pytest：3 passed
- Uvicorn 启动后 GET /health 返回 HTTP 200 与 {"status": "ok"}

### 文档清理 — Phase 0 Task 定义

- P0-008 从“实现 /health API”调整为“完善 Health / Readiness 检查”
- P0-010 从“配置 pytest”调整为“完善统一测试基础设施”
- 避免与 P0-002 已完成工作重复
- 无代码修改，仅修正 Task 定义
- 更新 CURRENT_STATUS.md 与 TASKS.md

### Next

执行 Phase 0 / P0-003。

### Verification

- git diff 确认仅 docs/TASKS.md、docs/CURRENT_STATUS.md、docs/CHANGELOG.md 变化

### P0-003 — 初始化 Next.js + TypeScript

- 使用 create-next-app 初始化 apps/web（Next.js 16.3.1 / React 19.2.8 / TypeScript 5）
- 采用 App Router：app/layout.tsx 与 app/page.tsx 最小首页
- 使用 npm 作为包管理器，提交 package-lock.json
- 保留 strict TypeScript，新增 typecheck 脚本（tsc --noEmit）
- ESLint 使用 Next.js 官方 flat config
- 根 README 补充前端启动说明
- 更新 CURRENT_STATUS.md 与 TASKS.md

### Next

执行 Phase 0 / P0-004。

### Verification

- Node.js 22.14.0 / npm 10.9.2 / Next.js 16.3.1 / TypeScript 5
- npm run typecheck：通过
- npm run lint：通过
- npm run build：通过
- npm run dev：启动成功，首页 HTTP 200

### P0-004 — 创建 Docker Compose

- 按 docs/PROJECT_STRUCTURE.md 契约创建根级 docker-compose.yml（唯一项目级 Compose 文件）
- 使用当前 Compose Specification，不含已废弃的 version 字段
- 创建项目专用 app-network（bridge）作为统一基础设施网络
- 未创建任何 service / volume / 端口映射 / 环境变量
- 未创建 Dockerfile（项目文档未要求 P0-004 创建）
- 未接入 PostgreSQL（由 P0-005 处理）
- 更新 CURRENT_STATUS.md 与 TASKS.md

### Next

执行 Phase 0 / P0-005。

### Verification

- Docker 29.7.2 / Docker Compose v5.4.0 / Docker context desktop-linux
- docker compose -f docker-compose.yml config：通过
- 无 service 可运行，未执行 docker compose up

### P0-005 — 接入 PostgreSQL

- 在根级 docker-compose.yml 增加 postgres service（image: postgres:16）
- 使用命名 volume postgres_data 持久化数据（/var/lib/postgresql/data）
- 加入 P0-004 创建的 app-network
- 配置 pg_isready 健康检查（容器状态 healthy）
- 开放 5432:5432 供本机访问
- 新增 .env.example（POSTGRES_DB / POSTGRES_USER / POSTGRES_PASSWORD / DATABASE_URL，仅本地开发）
- 未修改 FastAPI / Next.js；未引入 SQLAlchemy / Alembic / 业务表 / migration
- 更新 CURRENT_STATUS.md、TASKS.md、DEPLOYMENT.md

### Next

执行 Phase 0 / P0-006。

### Verification

- PostgreSQL 16.15（postgres:16）
- docker compose config：通过
- pg_isready：accepting connections；SELECT 1 成功
- 持久化验证：临时表数据在容器重启后仍存在（临时表已删除）
- PostgreSQL 容器保持运行

## 2026-08-20

### Design

- 确定 Python 3.12+ + FastAPI + Next.js + PostgreSQL 技术栈
- 移除 Google Ads / Keyword Planner 依赖
- V1 改为真实免费数据 Provider
- 移除 Mock Provider 作为正常运行数据源
- 采用 Demand Signals / Demand Score 替代虚假的 Google Search Volume
- 增加 Provider 限流、缓存、失败降级和成本保护
- 增加 Codex 持久化开发状态机制

### Added

- CURRENT_STATUS.md
- TASKS.md
- CHANGELOG.md

### Next

执行 Phase 0 / P0-001。

### Verification

代码尚未开始开发。
