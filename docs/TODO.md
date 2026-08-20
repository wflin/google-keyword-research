# Codex 任务清单

> 当前状态：设计已完成，等待执行 Phase 0。Codex 不得等待或验证 Google Ads API，也不得进入业务开发后再自行扩大范围。

## Phase 0 — 工程骨架

- [ ] P0-001 创建 monorepo 目录结构（严格遵守 `docs/PROJECT_STRUCTURE.md`）
- [ ] P0-002 初始化 FastAPI + Python 3.12+
- [ ] P0-003 初始化 Next.js + TypeScript
- [ ] P0-004 创建 Docker Compose
- [ ] P0-005 接入 PostgreSQL
- [ ] P0-006 配置 SQLAlchemy 2.x
- [ ] P0-007 配置 Alembic
- [ ] P0-008 实现 /health API
- [ ] P0-009 创建最小首页
- [ ] P0-010 配置 pytest 基础测试
- [ ] P0-011 配置 frontend lint/typecheck
- [ ] P0-012 配置 GitHub Actions CI
- [ ] P0-013 编写本地启动文档
- [ ] P0-014 完成 Phase 0 验收

## Phase 1 — Research 工作台

- [ ] P1-001 Research 数据模型
- [ ] P1-002 Research CRUD API
- [ ] P1-003 Research 状态机
- [ ] P1-004 Research Job
- [ ] P1-005 Research 创建页面
- [ ] P1-006 Research 详情/进度页面
- [ ] P1-007 Provider 基础接口
- [ ] P1-008 真实免费 Suggestion Provider
- [ ] P1-009 真实免费 Trend Provider
- [ ] P1-010 Research Orchestrator
- [ ] P1-011 Provider 错误与降级
- [ ] P1-012 Research 结果展示
- [ ] P1-013 集成测试
- [ ] P1-014 E2E 测试
- [ ] P1-015 完成 Phase 1 验收

## Phase 2 — GitHub / Public Web / Demand Signals

- [ ] P2-001 GitHub Provider
- [ ] P2-002 Public Web Provider
- [ ] P2-003 Evidence 模型与存储
- [ ] P2-004 DemandSignalProvider
- [ ] P2-005 Demand Score v1
- [ ] P2-006 需求分析页面
- [ ] P2-007 Provider rate-limit / cache
- [ ] P2-008 完成 Phase 2 验收

## Phase 3 — Community / Competition

- [ ] P3-001 Community Provider（可选）
- [ ] P3-002 Competitor 抽取
- [ ] P3-003 Pain Point 抽取
- [ ] P3-004 Competition Score
- [ ] P3-005 完成 Phase 3 验收

## Phase 4 — AI Opportunity Report

- [ ] P4-001 LocalAI Provider
- [ ] P4-002 Evidence Bundle
- [ ] P4-003 AI JSON Schema
- [ ] P4-004 Prompt Versioning
- [ ] P4-005 Opportunity Report
- [ ] P4-006 AI 安全校验
- [ ] P4-007 完成 Phase 4 验收

## Phase 5+ — 批量、每日发现、SaaS

按 DEVELOPMENT_PLAN.md 和 ROADMAP.md 执行，未达到前置 Phase 验收标准不得提前进入。

## Codex 工作规则

1. 先阅读 `docs/CODEX.md`、`CURRENT_STATUS.md`、`TASKS.md`、`CHANGELOG.md`、`ARCHITECTURE_DECISIONS.md`、`PROJECT_STRUCTURE.md`。
2. 开始任务前确认当前 Phase 和唯一 Task ID。
3. 不自行增加产品需求或改变架构。
4. 不提交任何真实 API key、OAuth secret、refresh token。
5. 产品运行不得依赖 Google Ads / Keyword Planner。
6. V1 核心链路不得依赖收费 API。
7. 真实数据必须标注来源；不能用随机数或 Mock 数据冒充真实市场数据。
8. 测试可以使用 fixture/replay 数据。
9. 外部服务必须通过 Provider/gateway/adapter 隔离。
10. 完成任务后运行相关测试、lint/typecheck/build。
11. 更新 TASKS、CURRENT_STATUS、CHANGELOG。
12. 每个 Task 单独提交清晰 Git commit。
13. 遇到架构冲突、付费依赖、安全问题、外部服务不可用或需求不明确时，标记 BLOCKED 并停止，不自行绕过。
