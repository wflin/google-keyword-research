# Development Changelog

> 记录每次开发会话完成了什么。不得删除历史记录。

## 2026-08-22

### P1-002 — Research CRUD API

- 新增 Pydantic API Schema（apps/api/app/schemas/research.py）：ResearchCreate / ResearchUpdate / ResearchResponse / ResearchListResponse；区分创建、更新与响应，不直接暴露 SQLAlchemy Model
- 新增 Research CRUD Router（apps/api/app/api/research.py）并在 app/main.py 以 /api 前缀注册：
  - POST /api/researches（201，创建后返回完整 ResearchProject）
  - GET /api/researches（200，items 列表，按 created_at 倒序）
  - GET /api/researches/{research_id}（200 / 404）
  - PATCH /api/researches/{research_id}（200 / 404，仅允许业务字段，updated_at 由服务端更新）
  - DELETE /api/researches/{research_id}（204 / 404，无响应体）
- 404 返回稳定 JSON 错误结构；数据库异常 rollback 并返回通用 500，不泄露 SQL / 连接信息 / 密码
- ResearchProject Model 增加 Python 侧默认值（country_code=US / language_code=en / status=draft），与 API Schema 默认值一致；不修改数据库 schema，无新增 migration，未修改已有 migration
- 新增 tests/test_research_api.py（10 个真实 PostgreSQL CRUD 测试）：最小创建、全字段创建、列表倒序、单个查询、404、PATCH 更新与 updated_at、DELETE 与删除后 404、SQLAlchemy 落库验证；使用 savepoint 事务回滚，测试结束后无残留数据
- 验证：pytest 34 passed（真实 PostgreSQL）；uvicorn 实机启动后 POST/GET/PATCH/DELETE 全流程 CRUD 通过；/health=200 {"status":"ok"}、/ready=200 {"status":"ready"}；/openapi.json 包含全部 5 个 endpoint
- 未使用外部 API；未使用收费 API；未使用 Mock 数据库；未创建 Keyword / ResearchKeyword / KeywordMetricSnapshot；未修改前端、Docker、Alembic migration、数据库 schema
- 更新 CURRENT_STATUS.md、TASKS.md、CHANGELOG.md

### Next

执行 Phase 1 / P1-003（Research 状态机）。

### Verification

- pytest：34 passed（test_health 3 + test_database 5 + test_alembic 4 + test_readiness 2 + test_models 10 + test_research_api 10），真实 PostgreSQL
- Alembic：current=0002 (head)、heads=0002，未新增 migration
- 数据库：4 张业务表存在且验证后各表 count=0（无残留数据）
- 实机验证：POST 201 / GET list 200 / GET single 200 / PATCH 200 / DELETE 204 / 删除后 GET 404；/health 与 /ready 均 200
- 前端回归：npm run typecheck / npm run lint / npm run build 全部通过

### P1-003 — Research 状态机

- 新增状态机服务（apps/api/app/services/research.py）：ResearchStatus StrEnum（draft / running / completed / failed / cancelled）+ ALLOWED_TRANSITIONS + TERMINAL_STATES + can_transition / validate_transition / InvalidStatusTransition；不依赖 FastAPI / Session / HTTP，可供后续 Service / Job 复用
- 合法转换：draft→running、draft→cancelled、running→completed、running→failed、running→cancelled；终态：completed / failed / cancelled（不可再转换）
- PATCH /api/researches/{research_id} 的 status 严格经状态机校验：
  - 合法转换 → 200，updated_at 服务端更新
  - 非法转换 → 409 Conflict（如 draft→completed、completed→running、cancelled→draft），数据库状态保持不变
  - 非法 status 值 → 422
  - 同状态（如 draft→draft）→ 200 no-op，updated_at 不变
- ResearchCreate / ResearchUpdate 的 status 字段改为 ResearchStatus 枚举；正式状态集移除历史 “queued”，Model 注释与 docs/DATABASE.md 状态列表同步更新；数据库 schema 不变，无新增 migration
- P1-002 全字段创建测试中 status 由 “queued” 调整为正式状态 “running”
- 新增 tests/test_research_status.py（20 个状态机测试：5 合法 / 10 非法 / 自转换拒绝 / 终态 / 规则覆盖 / 字符串兼容）+ test_research_api.py 新增 7 个状态 API 测试（200 / 409 / 422 / no-op / updated_at / 终态 / DB 状态保持）
- 验证：pytest 61 passed（真实 PostgreSQL）；uvicorn 实机验证合法转换 200、非法转换 409、非法值 422、no-op 200；/health=200 {"status":"ok"}、/ready=200 {"status":"ready"}；alembic current/heads=0002，无新增 migration
- 未使用外部 API；未使用收费 API；未使用 Mock 数据库；未修改前端、Docker、数据库 schema；未提前实现 P1-004
- 更新 CURRENT_STATUS.md、TASKS.md、CHANGELOG.md

### Next

执行 Phase 1 / P1-004（Research Job）。

### Verification

- pytest：61 passed（test_health 3 + test_database 5 + test_alembic 4 + test_readiness 2 + test_models 10 + test_research_api 17 + test_research_status 20），真实 PostgreSQL
- Alembic：current=0002 (head)、heads=0002，未新增 migration
- 数据库：4 张业务表存在且验证后各表 count=0（无残留数据）
- 实机验证：draft→running→completed 200、completed→running 409、draft→completed 409、cancelled→draft 409、bogus 422、draft→draft 200 no-op；/health 与 /ready 均 200
- 前端回归：npm run typecheck / npm run lint / npm run build 全部通过

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

### P0-006 — 初始化 SQLAlchemy

- 新增生产依赖 sqlalchemy==2.0.52 与 psycopg[binary]==3.3.4（Psycopg 3）
- 创建 apps/api/app/db 数据库层：session.py（Engine + SessionLocal，DATABASE_URL 从环境变量读取）与 dependencies.py（get_db FastAPI dependency，yield + close）
- 统一 .env.example 的 DATABASE_URL 为 postgresql+psycopg:// 格式
- 新增 tests/test_database.py：真实连接 Docker PostgreSQL 的 Engine / Session / SELECT 1 / 关闭与连接池回收测试
- 未创建业务 Model；未引入 Alembic / Migration
- 未修改 /health、docker-compose.yml、Next.js
- 更新 CURRENT_STATUS.md、TASKS.md、DEPLOYMENT.md

### Next

执行 Phase 0 / P0-007。

### Verification

- SQLAlchemy 2.0.52 / psycopg 3.3.4（Python 3.13.3）
- pytest：8 passed（test_health 3 + test_database 5，真实 PostgreSQL）
- 真实连接：engine.connect().execute(text("SELECT 1")).scalar() 返回 1
- uvicorn 启动后 GET /health 返回 HTTP 200 {"status": "ok"}

### P0-007 — 初始化 Alembic

- 新增生产依赖 alembic==1.19.1
- 在 apps/api 初始化 Alembic（alembic.ini + alembic/ 目录：env.py / script.py.mako / versions/）
- alembic.ini 不包含数据库 URL；env.py 从 DATABASE_URL 环境变量读取连接，支持 online / offline 模式，target_metadata = None（当前无业务 Model）
- 创建空初始 migration：versions/0001_initial_empty.py（upgrade / downgrade 均为空，不创建任何表）
- 真实 PostgreSQL 验证：upgrade head → current → downgrade base → 再次 upgrade head 全流程通过
- 数据库仅存在 alembic_version 管理表，无业务表
- 未修改 docker-compose.yml、FastAPI API、Next.js
- 更新 CURRENT_STATUS.md、TASKS.md、DEPLOYMENT.md

### Next

执行 Phase 0 / P0-008。

### Verification

- Alembic 1.19.1（Python 3.13.3 / SQLAlchemy 2.0.52 / psycopg 3.3.4）
- alembic heads：0001 (head)
- alembic upgrade head / current / downgrade base / 再次 upgrade head：全部通过
- \dt：仅 alembic_version（version_num=0001），无业务表
- pytest：11 passed（test_health 3 + test_database 5 + test_alembic 3）
- uvicorn GET /health 返回 HTTP 200 {"status": "ok"}

### P0-008 — 完善 Health / Readiness 检查

- 新增 GET /ready：通过现有 SQLAlchemy Engine 真实执行 SELECT 1 检查 PostgreSQL 可达性
- 数据库正常：HTTP 200 {"status": "ready"}
- 数据库不可用：HTTP 503 {"status": "not_ready"}（仅记录异常类型，不泄露连接信息）
- /health 保持 liveness 语义不变：HTTP 200 {"status": "ok"}（数据库挂掉时仍为 200）
- 复用 app/db/session.py 的 engine，未新建数据库连接层
- 新增 tests/test_readiness.py（真实 PostgreSQL，2 个用例）
- 真实故障/恢复验证：docker compose stop postgres 后 /ready=503、/health=200；恢复后 /ready=200
- 未修改数据库 schema、未创建业务表
- 更新 CURRENT_STATUS.md、TASKS.md、DEPLOYMENT.md

### Next

执行 Phase 0 / P0-009。

### Verification

- pytest：13 passed（test_health 3 + test_database 5 + test_alembic 3 + test_readiness 2）
- 手工验证：/health=200、/ready=200；DB 停止后 /ready=503、/health=200；DB 恢复后 /ready=200
- OpenAPI：/health 与 /ready 均出现
- \dt：仅 alembic_version，无业务表

### P0-009 — 创建最小首页

- 将 apps/web/app/page.tsx 改造成产品最小 SaaS 首页（Header / Hero / Keyword Research Entry / Features / Footer）
- 建立品牌与产品定位：Google Keyword Research / Discover better keywords for your business.
- 增加关键词研究入口 UI（apps/web/components/KeywordResearchForm.tsx，UI only：无 API 请求、无数据库请求、无虚假数据）
- 增加三个产品功能方向 Feature Card：Keyword Discovery / Keyword Analysis / Keyword Organization
- 完成响应式布局（桌面三列 / 移动端单列，无横向滚动）
- layout.tsx 更新最小 metadata（title / description）
- 保持系统字体；未引入外部字体、UI 框架或任何新 npm 依赖
- 未连接后端、未接入任何外部 API、未产生虚假关键词数据
- 更新 CURRENT_STATUS.md 与 TASKS.md

### Next

执行 Phase 0 / P0-010。

### Verification

- npm run typecheck：通过
- npm run lint：通过
- npm run build：通过
- npm run dev：首页 HTTP 200，Header / Hero / 关键词输入 / Feature Cards / Footer 均正常渲染

### P0-010 — 完善统一测试基础设施

- 统一 pytest 执行方式：cd apps/api && python -m pytest -v（testpaths / pythonpath 已在 pyproject.toml 配置）
- 保留并运行真实 PostgreSQL 测试（docker compose postgres:16，无 Mock 数据库 / Engine / Session / Alembic / /health / /ready）
- 完善 Health / Readiness 验证：DB 正常时 /health=200、/ready=200；DB 停止时 /ready=503 且 /health 保持 200；恢复后 /ready=200（真实 docker compose stop/start 生命周期验证）
- SQLAlchemy Engine 增加 connect_timeout=5，数据库不可达时 readiness 快速失败而非长时间挂起
- 完善 Alembic 基础设施测试：新增 test_alembic_has_single_head 确认唯一 head=0001；downgrade base → upgrade head 全流程通过；数据库仅 alembic_version
- 建立前端 typecheck/lint/build 统一验证（npm run typecheck / npm run lint / npm run build 全部通过）
- 更新 docs/TESTING.md：统一本地验证命令、Readiness 数据库停止验证流程、Codex 验收标准
- 根 README 增加最小测试说明
- 未引入收费 API；未引入 Mock 数据库；未引入额外测试框架（Playwright / Jest / Vitest 等）；未修改业务功能、数据库 schema、Docker 架构、Alembic migration、前端 UI
- 更新 CURRENT_STATUS.md、TASKS.md、CHANGELOG.md

### Next

执行 Phase 1 / P1-001（Research 数据模型）。

### Verification

- pytest：14 passed（test_health 3 + test_database 5 + test_alembic 4 + test_readiness 2），真实 PostgreSQL
- /health 与 /ready：DB 正常 /health=200、/ready=200；DB 停止 /ready=503、/health=200；DB 恢复 /ready=200
- Alembic：heads=0001、current=0001、downgrade base → upgrade head 通过
- 前端：npm run typecheck / npm run lint / npm run build 全部通过
- 仅已知 warning：StarletteDeprecationWarning（httpx/starlette.testclient，记录不升级依赖）

### P1-001 — Research 数据模型

- 建立统一 Declarative Base（apps/api/app/db/base.py）：单一 Base + UUID 主键 Mixin + 命名约定 + timezone-aware UTC 时间
- 建立业务模型 apps/api/app/models/（research.py + keywords.py）：ResearchProject / Keyword / ResearchKeyword / KeywordMetricSnapshot
- 遵循 docs/DATABASE.md：research_project（name/seed_keyword/country_code/language_code/status 等）、keyword（keyword_text/normalized_keyword + 唯一约束）、research_keyword（research_id + keyword_id 唯一）、keyword_metric_snapshot（estimated_* 指标全部可 NULL，绝不伪造搜索量）
- Keyword 数据源无关：source_type（seed/provider/imported/manual 等）放在关联结果而非关键词本身；指标按 source + retrieved_at 作为观测快照
- 规范化策略 normalize_keyword：trim + lowercase + 连续空白折叠，确定且可测试，支持中文/英文/数字/特殊字符
- PostgreSQL 外键全部 ON DELETE CASCADE（关联/快照子记录随父记录删除），已记录理由
- Alembic migration 0002_create_research_tables：创建 4 张业务表；downgrade 按依赖顺序删除；未修改 0001
- 真实 PostgreSQL 验证：upgrade head / downgrade 0001 / 再次 upgrade head 全流程通过；current=0002 (head)；业务表仅 4 张 + alembic_version
- 新增 tests/test_models.py（10 个真实 PostgreSQL 测试）：Research/Keyword 创建与读取、关联导航、唯一约束、规范化、NULL 指标、FK 违规、级联删除；事务回滚清理，无测试残留数据
- 更新 test_alembic.py 期望 revision：0001 → 0002（保持精确断言风格）
- 未接入 Google API / Google Ads / Keyword Planner；未使用收费 API；未实现数据采集、Search Volume、CPC、Competition、Trend
- 未新增 Research API；未修改 FastAPI route；未修改前端；未修改 Docker
- 更新 CURRENT_STATUS.md、TASKS.md、CHANGELOG.md

### Next

执行 Phase 1 / P1-002（Research CRUD API）。

### Verification

- pytest：24 passed（test_health 3 + test_database 5 + test_alembic 4 + test_readiness 2 + test_models 10），真实 PostgreSQL
- Alembic：upgrade 0001 → 0002；downgrade 0002 → 0001（业务表删除）；再次 upgrade head 恢复；current=0002 (head)、heads=0002
- 数据库：4 张业务表存在且无测试残留数据（各表 count=0）
- 前端回归：npm run typecheck / npm run lint / npm run build 全部通过

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
