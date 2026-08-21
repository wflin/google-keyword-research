# Development Tasks

> Codex 不得自行扩大任务范围。一次只执行一个明确 Task，完成后更新状态并提交代码。

## Phase 0 — 工程骨架

- [x] P0-001 创建 monorepo 目录结构
- [x] P0-002 初始化 FastAPI + Python 3.12+
- [x] P0-003 初始化 Next.js + TypeScript
- [x] P0-004 创建 Docker Compose
- [ ] P0-005 接入 PostgreSQL
- [ ] P0-006 配置 SQLAlchemy 2.x
- [ ] P0-007 配置 Alembic
- [ ] P0-008 完善 Health / Readiness 检查
- [ ] P0-009 创建最小首页
- [ ] P0-010 完善统一测试基础设施
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
- [ ] P1-008 真实 Suggestion Provider
- [ ] P1-009 真实 Trend Provider
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

## Task 执行规则

每个 Task 必须：

1. 先阅读相关文档
2. 检查当前代码和测试
3. 只实现该 Task 必需内容
4. 添加/更新测试
5. 运行规定检查
6. 更新 CURRENT_STATUS.md
7. 更新 CHANGELOG.md
8. 提交一个清晰的 Git commit
9. 不在同一个 Task 顺手重构无关代码
