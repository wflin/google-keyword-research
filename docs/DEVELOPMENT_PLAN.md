# 开发计划

## 总原则

本项目采用 Python 3.12+ + FastAPI + Next.js + PostgreSQL 的模块化单体架构。

Google Ads / Keyword Planner 不属于本项目依赖，不进入任何 Phase 的验收条件。

Codex 必须严格按照 Phase 顺序开发，每个 Phase 完成后运行测试并更新文档，不得擅自扩大范围。

## Phase 0：工程骨架

目标：前后端、数据库、Docker、CI 均能启动。

任务：

1. 创建 `backend/` FastAPI 项目
2. 创建 `frontend/` Next.js 项目
3. Python 依赖与 lint/test 配置
4. PostgreSQL + Alembic
5. Docker Compose
6. `.env.example` 与 Secret 管理规则
7. `/health`、基础日志、request id
8. GitHub Actions：lint + unit test + build

验收：一条命令可以启动开发环境，前后端健康检查通过。

## Phase 1：研究工作台 MVP

目标：用户可以创建研究项目并查看完整的基础 UI。

任务：

- Research CRUD
- Seed keyword 输入
- 国家/语言选择
- 研究状态
- 关键词列表
- 基础筛选/排序
- Mock Provider
- 基础 API
- 数据库迁移

验收：不依赖任何第三方 API，也可以创建研究并展示 Mock 数据。

## Phase 2：关键词扩展 + 搜索需求

目标：形成第一条真实数据闭环。

任务：

- Keyword Expansion Provider
- Search Volume Provider
- 关键词标准化、去重
- estimated monthly searches
- CPC / competition（Provider 支持时）
- 历史数据
- Provider 缓存
- 数据来源标识

验收：输入 `invoice` 可以得到真实关键词数据，并明确标注 estimated/source。

## Phase 3：趋势 + SERP + 社区

目标：从“关键词工具”升级为“需求研究工具”。

任务：

- Trend Provider
- SERP Provider
- Community Provider
- 弱竞争 SERP 分析
- 用户痛点提取
- 统一数据模型
- 任务进度 UI

验收：一次 Research 可以生成多源研究数据。

## Phase 4：竞品 + Opportunity Score

目标：判断一个需求是否值得做。

任务：

- Competitor Provider
- 产品/网站信息
- 定价信息
- Search Demand Score
- Trend Score
- Commercial Intent Score
- Competition Score
- Pain Point Score
- Monetization Score
- MVP Difficulty Score
- Opportunity Score

验收：每个候选机会可以解释分数来源。

## Phase 5：AI 产品机会报告

目标：从数据自动形成可执行的创业判断。

任务：

- AI Provider
- 结构化 Prompt
- Pydantic output schema
- 用户画像
- 痛点总结
- 产品定位
- MVP 功能
- 定价建议
- 风险
- AI confidence / evidence
- 报告页面

验收：输入一个种子词，可以生成完整产品机会报告；报告中的事实与推断明确区分。

## Phase 6：批量研究与每日发现

目标：从手动研究升级为自动发现。

任务：

- 批量种子词
- 批量 Research
- 每日定时任务
- Opportunity Ranking
- Top N 推荐
- 收藏/标签/备注
- CSV 导出

验收：系统可以自动运行一批种子词并生成每日机会列表。

## Phase 7：稳定性与部署

目标：可以长期运行。

任务：

- retry / timeout / rate limit
- 失败任务恢复
- 数据清理
- provider 成本统计
- API usage metrics
- 日志与监控
- Docker production profile
- 云服务器部署
- 数据库备份/恢复

验收：连续运行 7 天，无未处理任务堆积；关键任务失败可恢复。

## Phase 8：产品化（非 MVP）

仅在个人版本验证有效后考虑：

- 用户系统
- 多租户
- RBAC
- 配额
- 订阅计费
- 团队协作
- 更丰富的数据源

## 每个 Phase 的 Definition of Done

1. 功能完成
2. Unit tests 通过
3. 必要 Integration/E2E tests 通过
4. Lint/type checks 通过
5. Docker 环境验证
6. 文档同步
7. TODO 更新
8. Git commit 清晰

禁止：

- 把第三方真实数据用随机数伪造
- 将 Secret 提交 Git
- 在 Controller 直接调用 Provider
- 未测试就进入下一阶段
