# Current Development Status

> 本文件是 Codex 每次开始工作时必须首先读取的项目状态。
> 不依赖聊天记忆。完成任务后必须更新本文件。

## 当前阶段

Phase 1 — Research

## 状态

P1-007 已完成，等待执行 P1-008。

## 已完成

- 产品定位与 PRD
- Python + FastAPI 技术路线
- Next.js 前端路线
- PostgreSQL / SQLAlchemy / Alembic 设计
- Provider 架构
- 免费真实数据源策略
- Opportunity Score 设计
- AI 分析设计
- 安全与合规设计
- 测试设计
- 部署设计
- Codex 开发规范
- MVP 验收标准
- 商业化与 Roadmap
- P0-001 monorepo 目录结构（按 PROJECT_STRUCTURE.md 契约）
- P0-002 FastAPI 后端初始化（apps/api，含 GET /health）
- Phase 0 Task 定义清理（P0-008 / P0-010 调整）
- P0-003 Next.js + TypeScript 前端初始化（apps/web，含最小首页）
- P0-004 Docker Compose 基础设施（根级 docker-compose.yml，app-network 网络）
- P0-005 PostgreSQL 接入（Docker Compose postgres:16 service，postgres_data volume，healthcheck）
- P0-006 SQLAlchemy 2.x 数据库层（Engine / Session / get_db dependency，真实 PostgreSQL 连接验证）
- P0-007 Alembic 迁移基础设施（alembic.ini / alembic/env.py，DATABASE_URL 环境变量，空初始 migration 0001）
- P0-008 Health / Readiness 检查（/health liveness + /ready readiness，真实 PostgreSQL 验证）
- P0-009 创建最小首页（Next.js App Router 最小 SaaS 首页：Header / Hero / 关键词研究入口 / Features / Footer，Responsive，无后端连接，无外部 API，无真实关键词数据）
- P0-010 完善统一测试基础设施（统一 pytest 入口、真实 PostgreSQL 测试、Alembic 验证、Health/Readiness 验证、前端 typecheck/lint/build 验证；connect_timeout 保障 readiness 快速失败；更新 TESTING.md）
- P1-001 Research 数据模型（research_project / keyword / research_keyword / keyword_metric_snapshot，UUID 主键 + timezone-aware UTC 时间戳 + 唯一约束 + 外键 ON DELETE CASCADE；Alembic migration 0002；真实 PostgreSQL 验证）
- P1-002 Research CRUD API（ResearchCreate / ResearchUpdate / ResearchResponse schema；POST /api/researches、GET /api/researches、GET /api/researches/{research_id}、PATCH /api/researches/{research_id}、DELETE /api/researches/{research_id}；真实 PostgreSQL CRUD 测试 10 个；Model 增加 Python 侧默认值，无 migration；无外部/收费 API、无 Mock 数据库）
- P1-003 Research 状态机（正式状态：draft / running / completed / failed / cancelled；合法转换：draft→running、draft→cancelled、running→completed、running→failed、running→cancelled；终态：completed / failed / cancelled；PATCH status 经状态机校验，非法转换 409、非法值 422、同状态 no-op；状态机集中在 app/services/research.py，可被后续 Service / Job 复用；无 migration）
- P1-004 Research Job（ResearchJob 模型 research_job：research_id FK ON DELETE CASCADE + 索引 + timezone-aware UTC 时间；ResearchJobStatus：pending / running / completed / failed / cancelled，转换 pending→running、pending→cancelled、running→completed、running→failed、running→cancelled，终态 completed / failed / cancelled；同步 Run API POST /api/researches/{research_id}/run（draft→completed，重复/非 draft 409，不存在 404）；Job 查询 GET /api/researches/{research_id}/jobs 与 GET /api/research-jobs/{job_id}；Alembic 0003；无关键词/搜索量/CPC 数据；无外部 API、无 Celery/Redis/队列）
- P1-005 Research 创建页面（apps/web/app/researches/new/page.tsx 路由 /researches/new + apps/web/components/CreateResearchForm.tsx 客户端表单 + apps/web/lib/api.ts 最小 API client（NEXT_PUBLIC_API_BASE_URL 默认 http://localhost:8000，原生 fetch，无新依赖）；字段 Research Name（必填 ≤200）/ Seed Keyword（必填）/ Description（可选多行）/ Country（默认 US）/ Language（默认 en），status 不允许用户选择（后端默认 draft）；提交中按钮 Creating... + disabled 禁止重复提交；错误处理 422/409/500/网络失败均为安全提示；成功真实调用 POST /api/researches（201）后跳转 /researches/{research_id}；后端最小 CORS 仅允许 http://localhost:3000（apps/api/app/main.py + 新增 tests/test_cors.py 2 个测试）；首页导航新增 New Research 入口；pytest 112 passed；前端 typecheck / lint / build 通过；真实浏览器 E2E（Chrome headless + CDP）：打开 /researches/new → 填写表单 → Create Research → 真实 POST 201 → 跳转 /researches/{id}，数据库行验证后已清理；未修改数据库 schema、无新增 migration；未使用外部 API / 收费 API / Mock / 假数据；未提前实现 P1-006 / P1-007）
- P1-006 Research 详情/进度页面（apps/web/app/researches/[researchId]/page.tsx 动态路由 + apps/web/components/ResearchDetail.tsx 客户端组件；真实调用 GET /api/researches/{id}、GET /api/researches/{id}/jobs；展示 Research Name / Seed Keyword / Description / Country / Language / Status / Created At / Updated At；Research 状态徽章 draft / running / completed / failed / cancelled；Jobs 列表展示 Job ID / Status（pending / running / completed / failed / cancelled）/ Started At / Finished At / Created At / 安全 error_message，与 Research 状态严格区分；Run Research 按钮仅 draft 显示，真实调用 POST /api/researches/{id}/run，成功后重新拉取 Research + Jobs（不猜测状态）；409 安全展示后端业务错误；loading / 404（Research not found + Back to Home / Create Research）/ 网络与 500 错误处理；lib/api.ts 扩展 getResearch / getResearchJobs / runResearch（原生 fetch）；pytest 112 passed；前端 typecheck / lint / build 通过；真实浏览器 E2E（Chrome headless + CDP）：创建 → 跳转详情 → 详情真实加载 → Run → 状态变为 completed + Job completed → 未知 UUID 404；测试数据已清理；未修改后端 / 数据库 schema / 无 migration；未使用 Mock / 假数据）
- P1-007 Provider 基础接口（新增 apps/api/app/providers/：base.py / models.py / exceptions.py / __init__.py；KeywordProvider ABC（name / version + discover_keywords / get_keyword_metrics）；KeywordProviderRequest（seed_keyword 非空，country_code / language_code 沿用 US / en）；KeywordCandidate（keyword_text / normalized_keyword / source_type / provider）；KeywordMetric（estimated_monthly_searches / cpc / currency / competition / competition_level / source / retrieved_at / provider_version / raw_payload 全部默认 None，不伪造搜索量 / CPC / 竞争度）；ProviderError 异常体系（ProviderNotConfiguredError / ProviderAuthenticationError / ProviderRateLimitError / ProviderRequestError / ProviderResponseError，message 不泄露密钥 / 连接信息）；ProviderRegistry 轻量注册与获取；StubKeywordProvider 仅返回空列表，不产生任何数据；Provider 层不依赖 FastAPI / SQLAlchemy / 数据库，不新增 HTTP endpoint；pytest 128 passed（新增 tests/test_providers.py 16 个纯单元测试，无网络 / 无 Google API / 无 PostgreSQL）；前端 typecheck / lint / build 回归通过（未修改前端）；业务表 count=0；未调用 Google API / 外部 / 收费 API；当前没有真实 Provider；未接入 Run API，P1-004 行为不变）

## 当前任务

P1-008 真实 Suggestion Provider（正式定义见 docs/TASKS.md）

## 下一步

1. P1-008 真实 Suggestion Provider
2. P1-009 真实 Trend Provider
3. P1-010 Research Orchestrator
4. P1-011 Provider 错误与降级
5. P1-012 Research 结果展示
6. P1-013 集成测试
7. P1-014 E2E 测试
8. P1-015 完成 Phase 1 验收

## 当前已知问题

- 真实 Provider 尚未开始实现
- 尚未建立生产部署环境
- 尚未产生真实 Research 数据
- 根级 Makefile 由后续 Task（P0-013）创建
- docs/TODO.md 为历史辅助清单，尚未同步 Phase 0 进度（P0-001 ~ P0-005 仍显示未完成）
- P0-011 ~ P0-014 仍列在 docs/TASKS.md 的 Phase 0 未勾选项；按当前任务指令 Phase 0 在 P0-010 后完成并进入 Phase 1（CI、Makefile 等明确推迟到后续任务）

## 最后验证

- P0-001：目录骨架已创建，与 docs/PROJECT_STRUCTURE.md 契约对照校验通过
- P0-002：FastAPI 后端初始化完成，pytest 3 passed，GET /health 返回 HTTP 200 与 {"status": "ok"}
- 文档清理：Phase 0 Task 定义已修正（P0-008 → 完善 Health / Readiness 检查；P0-010 → 完善统一测试基础设施），无代码修改
- P0-003：Next.js 16.3.1 前端初始化完成（Node 22.14.0 / npm 10.9.2）；typecheck / lint / build 通过；dev server 首页 HTTP 200
- P0-004：根级 docker-compose.yml 已创建（Docker 29.7.2 / Compose v5.4.0 / context desktop-linux）；docker compose config 通过；未创建 service / volume；PostgreSQL 未接入
- P0-005：PostgreSQL 16 已接入（postgres service / postgres_data volume / app-network / pg_isready healthcheck）；pg_isready 与 SELECT 1 通过；容器重启后数据持久化验证通过；未引入 SQLAlchemy / Alembic / 业务表
- P0-006：SQLAlchemy 2.0.52 + psycopg 3.3.4 数据库层已建立（app/db session.py + dependencies.py，DATABASE_URL 从环境变量读取）；pytest 8 passed（含真实 PostgreSQL SELECT 1）；uvicorn GET /health 保持 HTTP 200 {"status": "ok"}
- P0-007：Alembic 1.19.1 已初始化（alembic.ini + alembic/env.py + 空 migration 0001，DATABASE_URL 从环境变量读取）；真实 PostgreSQL upgrade → downgrade → upgrade 全流程通过；\dt 仅 alembic_version，无业务表；pytest 11 passed
- P0-008：新增 GET /ready（复用 SQLAlchemy Engine 真实执行 SELECT 1）；数据库正常 /ready=200 {"status": "ready"}，数据库停止 /ready=503 {"status": "not_ready"} 且 /health 保持 200；恢复后 /ready=200；pytest 13 passed
- P0-009：前端最小首页完成（Header / Hero / 关键词研究入口 / Features / Footer，基于现有 Next.js App Router，未新增依赖）；typecheck / lint / build 通过；dev server 首页 HTTP 200；页面包含品牌、产品定位、关键词输入入口（UI only）与 Feature Cards；无后端连接、无外部 API、无真实关键词数据；未修改后端 / Docker / 数据库
- P0-010：统一测试基础设施完成（pytest 14 passed，含真实 PostgreSQL；alembic heads/current=0001，downgrade base → upgrade head 通过；/health 与 /ready 正常路径通过；DB 停止时 /ready=503 且 /health=200，恢复后 /ready=200；前端 typecheck / lint / build 通过；新增 test_alembic_has_single_head；engine 增加 connect_timeout=5 使 readiness 快速失败；未新增测试框架、未 Mock 数据库、未修改业务功能）
- P1-001：Research 数据模型完成（新增 app/db/base.py 统一 Base、app/models/（research.py + keywords.py）；4 张业务表通过 Alembic 0002 在真实 PostgreSQL 创建；upgrade head / downgrade 0001 / 再次 upgrade head 全流程通过；current=0002 (head)；pytest 24 passed（新增 10 个模型测试，事务回滚清理无残留数据）；前端 typecheck/lint/build 回归通过；未新增 API、未接入任何外部数据源）
- P1-002：Research CRUD API 完成（新增 app/schemas/research.py 与 app/api/research.py，以 /api 前缀注册到 main.py；POST 201 / GET 列表 created_at 倒序 / GET 单个 / PATCH（仅业务字段，updated_at 服务端更新）/ DELETE 204，404 返回稳定 JSON，数据库异常 rollback + 通用 500 不泄露细节；ResearchProject Model 增加 Python 侧默认值 country_code=US / language_code=en / status=draft，与 API Schema 一致，未改数据库 schema、无新增 migration；pytest 34 passed（新增 10 个 CRUD 测试，savepoint 事务回滚无残留数据）；uvicorn 实机 POST/GET/PATCH/DELETE 全流程通过；/health=200 {"status":"ok"}、/ready=200 {"status":"ready"}；/openapi.json 包含全部 5 个 endpoint；前端 typecheck/lint/build 回归通过；未使用外部 API / 收费 API / Mock 数据库）
- P1-003：Research 状态机完成（新增 app/services/research.py：ResearchStatus StrEnum + ALLOWED_TRANSITIONS + can_transition / validate_transition / InvalidStatusTransition + TERMINAL_STATES；PATCH /api/researches/{research_id} 的 status 严格经状态机校验：合法转换 200、非法转换 409（如 draft→completed、completed→running、cancelled→draft）、非法 status 值 422、同状态 no-op 200 且 updated_at 不变、非法转换后数据库状态保持不变；ResearchCreate / ResearchUpdate 的 status 改为 ResearchStatus 枚举；pytest 61 passed（新增 test_research_status.py 20 个 + test_research_api.py 7 个状态测试）；uvicorn 实机验证 200 / 409 / 422 / no-op 全通过；/health=200 {"status":"ok"}、/ready=200 {"status":"ready"}；alembic current/heads=0002，无 migration；前端 typecheck/lint/build 回归通过；未使用外部 API / 收费 API / Mock 数据库）
- P1-004：Research Job 完成（新增 ResearchJob 模型 + app/services/research_job.py（ResearchJobStatus + ALLOWED_TRANSITIONS + create/start/complete/fail/cancel/get + run_research 同步执行：draft→Job pending→running→Research running→skeleton→Job completed→Research completed，异常时 Research/Job 均进入 failed 并记录安全 error_message）；新增 POST /api/researches/{research_id}/run（200/404/409）、GET /api/researches/{research_id}/jobs（created_at 倒序，空列表）、GET /api/research-jobs/{job_id}；Alembic 0003_create_research_jobs（upgrade/downgrade 0002/再 upgrade 全流程通过，final current/heads=0003）；pytest 110 passed（新增 test_research_job.py 49 个，含 5 合法 / 15 非法转换、终态、FK、CASCADE、run 成功/失败/404/409、list/detail API、无关键词数据验证；测试 fixtures 移入 conftest.py 共享）；uvicorn 实机 run 200 / 重复 run 409 / cancelled 409 / 不存在 404 / jobs list / job detail 全通过；/health=200 {"status":"ok"}、/ready=200 {"status":"ready"}；前端 typecheck/lint/build 回归通过；未生成任何关键词/搜索量/CPC/竞争度数据；未使用外部 API / 收费 API / Mock 数据库；未引入 Celery/Redis/队列；同步 docs/DATABASE.md research_job 定义与正式实现一致）
- P1-005：Research 创建页面完成（新增 /researches/new 页面 + 创建表单 + lib/api.ts API client；真实调用 POST /api/researches → 201 → 跳转 /researches/{id}；CORS 仅允许 http://localhost:3000；pytest 112 passed（新增 test_cors 2 个）；前端 typecheck / lint / build 通过；Chrome headless 实机 E2E 全流程通过；测试数据已清理；无 migration / 无 schema 修改）
- P1-006：Research 详情/进度页面完成（新增 /researches/[researchId] 动态路由 + ResearchDetail 组件；真实 GET /api/researches/{id} + GET /api/researches/{id}/jobs + POST /api/researches/{id}/run；状态徽章与 Job 列表、404 / loading / error 处理；pytest 112 passed；前端 typecheck / lint / build 通过；Chrome headless 实机 E2E：创建→跳转→加载→Run→completed→未知 UUID 404 全通过；测试数据已清理；无 migration / 无 schema 修改 / 后端未修改）

## 重要约束

- 不使用 Mock Provider 作为正常运行数据源
- V1 不依赖收费 API
- V1 不依赖 Google Ads / Keyword Planner
- 不伪造 Google Search Volume
- Provider 失败必须显式记录并允许其它 Provider 继续
- 不擅自改变技术栈或核心架构
