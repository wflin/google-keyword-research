# Current Development Status

> 本文件是 Codex 每次开始工作时必须首先读取的项目状态。
> 不依赖聊天记忆。完成任务后必须更新本文件。

## 当前阶段

Phase 0 — 工程骨架

## 状态

P0-003 已完成，等待执行 P0-004。

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

## 当前任务

P0-004 创建 Docker Compose

## 下一步

1. P0-004 创建 Docker Compose
2. P0-005 接入 PostgreSQL
3. P0-006 配置 SQLAlchemy 2.x
4. P0-007 配置 Alembic
5. P0-008 完善 Health / Readiness 检查
6. P0-009 创建最小首页
7. P0-010 完善统一测试基础设施
8. P0-011 配置 frontend lint/typecheck
9. P0-012 配置 GitHub Actions CI
10. P0-013 编写本地启动文档
11. P0-014 完成 Phase 0 验收

## 当前已知问题

- 真实 Provider 尚未开始实现
- 尚未建立生产部署环境
- 尚未产生真实 Research 数据
- 根级 docker-compose.yml / .env.example / Makefile 由后续 Task（P0-004/005/013）创建

## 最后验证

- P0-001：目录骨架已创建，与 docs/PROJECT_STRUCTURE.md 契约对照校验通过
- P0-002：FastAPI 后端初始化完成，pytest 3 passed，GET /health 返回 HTTP 200 与 {"status": "ok"}
- 文档清理：Phase 0 Task 定义已修正（P0-008 → 完善 Health / Readiness 检查；P0-010 → 完善统一测试基础设施），无代码修改
- P0-003：Next.js 16.3.1 前端初始化完成（Node 22.14.0 / npm 10.9.2）；typecheck / lint / build 通过；dev server 首页 HTTP 200

## 重要约束

- 不使用 Mock Provider 作为正常运行数据源
- V1 不依赖收费 API
- V1 不依赖 Google Ads / Keyword Planner
- 不伪造 Google Search Volume
- Provider 失败必须显式记录并允许其它 Provider 继续
- 不擅自改变技术栈或核心架构
