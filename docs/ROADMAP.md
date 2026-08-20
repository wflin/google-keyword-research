# 产品路线图

## Phase 0 — 工程骨架

目标：本地一键启动 Web、API、PostgreSQL。

验收：Docker Compose 启动成功；健康检查通过；前后端可访问；数据库 migration 成功。

## Phase 1 — Research 工作台

目标：输入 seed keyword，创建 Research，并展示任务状态。

验收：Mock Provider 下可以完整创建、运行、完成 Research。

## Phase 2 — 关键词与需求

目标：关键词扩展、搜索量估算模型、关键词列表。

验收：输入 invoice 可以生成结构化关键词及 estimated metrics。

## Phase 3 — 趋势、SERP、社区

目标：接入 Trend/SERP/Community Provider。

验收：研究结果能显示趋势、SERP 结果和社区证据，并保留来源。

## Phase 4 — 竞品与机会评分

目标：结构化竞品、痛点和可解释 Opportunity Score。

验收：评分由固定版本公式计算，所有关键维度有 evidence。

## Phase 5 — AI 产品机会报告

目标：基于事实数据生成结构化报告。

验收：AI 输出通过 Pydantic schema 校验；事实与推测分离；引用 evidence。

## Phase 6 — 批量研究与每日发现

目标：支持批量关键词、定时任务、每日机会列表。

验收：可控制并发、成本和失败重试。

## Phase 7 — 真实 Provider 与成本优化

目标：逐步接入真实搜索量、SERP、趋势和社区 Provider。

原则：一个 Provider 一个适配器；Mock Provider 永远保留；任何付费数据源都必须可关闭。

## Phase 8 — SaaS 产品化

目标：认证、配额、计费、团队、导出和运营后台。

只有在核心研究价值经过验证后才进入本阶段。
