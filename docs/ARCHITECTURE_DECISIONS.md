# Architecture Decision Records

> 本文件记录影响产品长期方向的关键架构决定。Codex 不得自行推翻 Accepted 决策。

## ADR-001 — 不依赖 Google Ads Keyword Planner

Status: Accepted

决定：V1 不使用 Google Ads / Keyword Planner 作为核心数据源。

原因：用户无法稳定完成结算设置；该依赖会阻塞开发与运行。

影响：系统不把 Google 官方月搜索量作为 V1 核心指标。

## ADR-002 — V1 不依赖收费 API

Status: Accepted

决定：V1 的核心流程不得依赖需要购买 credits 或绑定信用卡的 API。

原因：避免开发中途因费用、额度、账号审核或付款问题阻塞。

影响：真实免费公开数据优先；付费 Provider 只能作为未来可插拔增强。

## ADR-003 — V1 不使用 Mock Provider 作为正常运行数据

Status: Accepted

决定：产品运行使用真实数据。测试可使用 fixtures/replay 数据，但不得把 Mock 数据当成真实市场数据。

原因：用户明确要求直接验证真实数据链路。

## ADR-004 — 使用 Demand Score 替代伪造 Search Volume

Status: Accepted

决定：没有可靠绝对搜索量时，使用由多个真实证据计算出的 Demand Score。

证据包括趋势、搜索建议、相关查询、长尾深度、GitHub/社区证据及公开网页信号。

原因：不能把估算值伪装成 Google 官方搜索量。

## ADR-005 — 外部数据必须经过 Provider

Status: Accepted

决定：所有第三方数据访问必须通过 Provider 接口。

原因：外部服务可能限流、变化或失效；Provider 隔离可以替换数据源而不修改核心业务。

## ADR-006 — Provider 失败不能默认导致整个 Research 失败

Status: Accepted

决定：Research 支持部分结果。Provider 必须返回结构化成功/失败状态；非核心 Provider 失败时允许继续。

原因：免费数据源天然存在限流、网络错误和接口变化。

## ADR-007 — V1 AI 优先本地运行

Status: Accepted

决定：开发与核心验证阶段优先使用本地 Ollama/Local AI，避免付费 AI API 成为前置条件。

影响：AI 模型质量可能低于商业模型；Provider 保持可插拔，以便未来增加商业模型。

## ADR-008 — Evidence First

Status: Accepted

决定：重要结论必须关联 Evidence。AI 事实与推断必须可区分。

原因：产品核心是研究和发现机会，而不是生成无法验证的 AI 文案。

## ADR-009 — Phase Gate

Status: Accepted

决定：未通过上一 Phase 验收标准，不得自行进入下一 Phase。

原因：防止 Codex 范围蔓延和半成品堆积。

## ADR-010 — GitHub 是长期项目状态源

Status: Accepted

决定：开发状态以 GitHub 中的 CURRENT_STATUS.md、TASKS.md、CHANGELOG.md、Git history 和本 ADR 为准，不依赖聊天上下文。

原因：允许跨天、跨会话、跨工具连续开发。
