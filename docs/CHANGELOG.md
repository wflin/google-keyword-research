# Development Changelog

> 记录每次开发会话完成了什么。不得删除历史记录。

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
