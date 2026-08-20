# 数据源设计

## 1. 目标

系统不能依赖单一 Google Ads 账户。数据层采用 Provider 架构：每种数据源独立实现、统一输出，任何一个 Provider 不可用时不阻塞整个研究流程。

## 2. Provider 类型

### Search Volume Provider

职责：提供关键词搜索量估算、CPC、竞争度和历史月度指标。

第一阶段优先预留 DataForSEO；后续可接入 Ahrefs、Semrush、Google Ads Keyword Planner。

统一字段：

```text
keyword
country
language
estimated_monthly_searches
cpc
competition
competition_index
monthly_searches[]
provider
queried_at
```

重要：第三方估算数据必须显示为 Estimated，不得冒充 Google 官方数据。

### Trend Provider

职责：判断需求增长、下降、稳定和季节性。

输出：

```text
trend_score
trend_direction
trend_period
trend_series[]
rising_queries[]
```

### SERP Provider

职责：分析关键词搜索结果和竞争强度。

输出：

```text
keyword
rank
url
domain
title
snippet
page_type
competitor_type
```

### Community Provider

第一阶段优先 Reddit。职责是寻找真实用户问题，而不是统计搜索量。

输出：

```text
source
post_id
url
title
content_excerpt
created_at
engagement
pain_points[]
```

### Competitor Provider

从 SERP 和公开网站信息中识别竞品，并记录：

- 名称
- URL
- 产品类型
- 目标用户
- 核心功能
- 免费/付费
- 价格
- 差异化

### AI Provider

职责：解释数据、聚类、识别搜索意图、提取痛点、生成产品机会报告。

AI 不得生成或覆盖真实数据字段；模型推断必须与 Provider 数据分离。

## 3. Provider 接口原则

后端业务层只依赖接口，例如：

```text
KeywordMetricsProvider
TrendProvider
SerpProvider
CommunityProvider
CompetitorProvider
AiAnalysisProvider
```

Provider 实现放在 infrastructure 层。

## 4. 缓存

付费 API 必须缓存。缓存键至少包含：

```text
provider + keyword + country + language + metric_type
```

保存原始响应摘要和标准化结果，避免重复付费查询。

## 5. 数据可信度

每条数据必须保留：

- source/provider
- queried_at
- country
- language
- raw/normalized 标识
- confidence（仅适用于模型推断）

不得在 Provider 失败时返回随机值或模型生成的搜索量。

## 6. V1 数据优先级

第一阶段按以下顺序实现：

1. Search Volume
2. Trend
3. SERP
4. Reddit
5. AI Analysis

Product Hunt、GitHub、App Store、Chrome Web Store、Ahrefs、Semrush、Google Ads 均作为后续 Provider。
