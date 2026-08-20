# 系统架构设计

## 1. 产品定位

本系统是一个 Web 应用，核心目标是通过多数据源和 AI 帮助个人发现海外产品机会。系统不依赖 Google Ads / Keyword Planner，不是广告投放系统，也不承诺提供 Google 官方精确搜索量。

## 2. 总体架构

第一版采用模块化单体（Modular Monolith），避免过早微服务化。

```text
Browser
  |
  v
Next.js + TypeScript
  |
  | REST/JSON
  v
FastAPI + Python 3.12+
  |
  +-- Research Orchestrator
  |      +-- Keyword Expansion Provider
  |      +-- Search Volume Provider
  |      +-- Trend Provider
  |      +-- SERP Provider
  |      +-- Community Provider
  |      +-- Competitor Provider
  |      +-- AI Analysis Provider
  |
  +-- Opportunity Scoring
  |
  +-- PostgreSQL
  |
  +-- Redis（V1 可选；缓存需求出现后启用）
  |
  +-- Background Jobs / APScheduler
```

## 3. 技术选型

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- ECharts 或同等级图表库
- TanStack Query
- React Hook Form / Zod（按实际需要）

### Backend

- Python 3.12+
- FastAPI
- Pydantic v2
- SQLAlchemy 2.x
- Alembic
- httpx
- pytest
- Ruff
- mypy（逐步启用）

### Data / Analysis

- pandas：数据处理场景使用，不强制所有业务逻辑依赖 pandas
- Playwright：仅用于合规允许的网页自动化场景
- Provider/Adapter 模式隔离第三方数据源

### Database

- PostgreSQL 16+
- Redis：V1 可选，用于缓存和后续任务队列扩展

### Deployment

- Docker
- Docker Compose
- GitHub Actions
- 第一版支持本地开发，稳定后部署到个人云服务器

## 4. 后端模块

```text
backend/app
├── api
│   └── routes
├── core
│   ├── config
│   ├── logging
│   └── security
├── research
│   ├── domain
│   ├── service
│   └── repository
├── keywords
│   ├── domain
│   ├── service
│   └── repository
├── providers
│   ├── keyword_expansion
│   ├── search_volume
│   ├── trends
│   ├── serp
│   ├── community
│   ├── competitors
│   └── ai
├── scoring
├── reports
├── jobs
└── common
```

第三方服务只能通过 provider 接口进入业务层，禁止在 controller 中直接调用外部 API。

## 5. Provider 接口原则

每类外部数据定义稳定的内部接口。例如：

```python
class SearchVolumeProvider(Protocol):
    async def get_metrics(
        self,
        keywords: list[str],
        country: str,
        language: str,
    ) -> list[KeywordMetrics]: ...
```

第一版允许：

- MockProvider：本地开发和测试必须提供
- 一个真实 Search Volume Provider
- 一个真实 Trend Provider
- 一个真实 SERP Provider
- 一个真实 Community Provider
- 一个 AI Provider

具体供应商可以替换，不把供应商名称写死在核心业务模型中。

## 6. 研究任务流程

```text
用户创建 Research
        |
        v
生成 Seed Keywords
        |
        v
扩展关键词
        |
        v
标准化 / 去重 / 分类
        |
        +-------> Search Volume
        |
        +-------> Trends
        |
        +-------> SERP
        |
        +-------> Community
        |
        +-------> Competitors
        |
        v
统一数据模型
        |
        v
Opportunity Scoring
        |
        v
AI 深度分析
        |
        v
Opportunity Report
```

长任务必须异步执行。前端通过 Research 状态查询或轮询获取进度；后续可升级为 SSE/WebSocket。

## 7. API 原则

前端只调用本系统 FastAPI。

核心接口第一版：

```text
POST /api/v1/researches
GET  /api/v1/researches
GET  /api/v1/researches/{id}
POST /api/v1/researches/{id}/run
GET  /api/v1/researches/{id}/progress
GET  /api/v1/researches/{id}/keywords
GET  /api/v1/researches/{id}/opportunities
GET  /api/v1/opportunities/{id}
```

API 必须统一：

- request validation
- response schema
- pagination
- error code
- request id
- authentication hook（即使 V1 为单用户，也预留）

## 8. 数据与缓存

所有外部数据至少保存：

- source
- retrieved_at
- country
- language
- provider_version（如可用）
- raw/reference metadata（遵守供应商许可）

缓存键应包含：

```text
provider + query + country + language + parameters
```

搜索量、趋势等数据不应每次重复请求。V1 可以先使用 PostgreSQL 缓存表；当并发或任务量增加时启用 Redis。

## 9. 数据质量

必须区分：

- observed：外部数据源直接返回
- estimated：第三方估算
- inferred：AI/规则推断

禁止把 estimated 或 inferred 数据显示为官方精确数据。

Provider 返回空数据时必须记录状态，不得用随机数或假数据填充。

## 10. AI 边界

AI 只基于已经采集的数据进行分析；AI 生成的关键词、痛点、竞品判断和产品建议必须带有来源或推断标记。

AI 输出必须结构化为 Pydantic schema，禁止直接把自由文本作为核心数据库字段。

## 11. 安全

所有 API Key、数据库密码和第三方凭证通过环境变量或 Secret 管理。

禁止：

- 提交 `.env`
- 提交真实 API Key
- 将 Secret 写入前端
- 将完整 Secret 写入日志
- 将用户数据发送到未经配置的第三方 Provider

## 12. 合规与采集原则

- 优先使用官方 API、公开数据或获得授权的数据服务。
- 遵守目标网站 robots、Terms、API rate limit 和数据许可。
- 不绕过验证码、登录墙、访问控制或技术限制。
- 不把需要授权的数据源作为 V1 强依赖。
- 每个 Provider 必须有 rate limit、timeout、retry 和失败熔断策略。

## 13. 可测试性

核心业务逻辑不得依赖真实外部 API 才能测试。

必须具备：

- Unit tests：评分、关键词标准化、意图分类、报告生成
- Provider tests：mock responses
- Integration tests：FastAPI + PostgreSQL
- E2E smoke test：创建研究 → 执行 → 查看结果

## 14. 可观测性

第一版至少记录：

- request id
- research id
- provider
- duration
- status
- error category
- external request count

禁止记录 API Key、Authorization header 和敏感用户数据。

## 15. V1 明确不做

- Google Ads / Keyword Planner
- 广告投放
- 微服务
- Kubernetes
- Redis 集群
- Kafka 等复杂消息队列
- 多租户 SaaS
- 复杂 RBAC
- 自建搜索引擎
- 大规模爬虫平台

只有真实需求出现后再升级。
