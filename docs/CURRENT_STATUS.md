# Current Development Status

> 本文件是 Codex 每次开始工作时必须首先读取的项目状态。
> 不依赖聊天记忆。完成任务后必须更新本文件。

## 当前阶段

Phase 0 — 工程骨架

## 状态

设计阶段已完成，尚未开始业务代码开发。

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

## 当前任务

等待执行 Phase 0。

## 下一步

1. 创建项目目录结构
2. 初始化 FastAPI
3. 初始化 Next.js
4. 创建 Docker Compose
5. 接入 PostgreSQL
6. 配置 SQLAlchemy 2.x
7. 配置 Alembic
8. 创建健康检查 API
9. 创建最小首页
10. 添加 pytest 基础配置
11. 添加 CI 基础检查

## 当前已知问题

- 真实 Provider 尚未开始实现
- 尚未建立生产部署环境
- 尚未产生真实 Research 数据

## 最后验证

尚未开始代码开发。

## 重要约束

- 不使用 Mock Provider 作为正常运行数据源
- V1 不依赖收费 API
- V1 不依赖 Google Ads / Keyword Planner
- 不伪造 Google Search Volume
- Provider 失败必须显式记录并允许其它 Provider 继续
- 不擅自改变技术栈或核心架构
