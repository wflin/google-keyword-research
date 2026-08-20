# 数据源设计

## 1. 核心原则

本项目 V1 **不依赖任何收费数据 API、Google Ads、Google Keyword Planner 或需要信用卡才能开通的服务**。

同时，V1 不使用 Mock Provider 作为正常开发数据源。开发环境直接运行真实、免费的数据 Provider；如果某个免费数据源暂时不可用，系统必须明确报错或降级，不允许生成假搜索量。

> 重要限制：公开免费数据通常无法稳定提供 Google 官方的绝对月搜索量。因此 V1 不承诺“精确 Google 搜索量”，而是建立“需求强度 Demand Signals”体系。未来如果用户主动配置收费 Provider，可作为可选增强，但不是系统前置条件。

## 2. V1 免费真实数据源

### 2.1 Google Trends

用途：衡量相对搜索兴趣、趋势、季节性、地区差异和相关/上升查询。

输出：

```text
keyword
country
language
trend_score_0_100
trend_direction
trend_series[]
related_queries[]
rising_queries[]
period
retrieved_at
source
```

注意：Google Trends 是相对兴趣指数，不是绝对搜索量。

### 2.2 搜索建议 / Autocomplete

用途：发现真实用户输入过的长尾需求和关键词组合。

输出：

```text
seed_keyword
suggested_keyword
source
retrieved_at
```

搜索建议只用于需求发现，不得转换成虚假的绝对搜索量。

### 2.3 GitHub REST API

用途：分析开源项目、Issue、Stars、Forks、更新时间和开发者需求信号。

优先使用认证的免费 GitHub API。GitHub 官方文档显示，认证用户通常有更高的 API 配额；系统必须读取响应中的 rate-limit 信息并主动限流。citeturn0search0turn0search7

### 2.4 Reddit 公共内容

V1 只在合法、公开且无需付费商业 API 的情况下使用 Reddit 可访问的公开页面/公开 feed；不绕过登录、验证码、反爬或访问控制。

由于 Reddit 在 2026 年正在调整公共数据和第三方开发者访问政策，Reddit Provider 必须是可关闭的可选模块，不能阻塞核心 Research 流程。citeturn0reddit48

### 2.5 普通公开网页

竞品信息优先来自竞品官网公开页面，包括产品名称、功能、定价页面、FAQ 和公开文档。

必须遵守目标网站 robots.txt、服务条款和访问限制；不实现验证码绕过、代理池绕过、指纹伪装等反爬措施。

## 3. V1 不使用的数据源

以下服务**不作为 V1 前置依赖**：

- Google Ads / Keyword Planner
- DataForSEO
- Ahrefs
- Semrush
- 任何需要购买额度的 Keyword API
- 任何需要购买额度的 SERP API
- 任何需要付费商业许可才能使用的社区数据 API

未来可以增加这些 Provider，但必须是“可选增强”，不能导致基础系统无法运行。

## 4. 搜索需求指标重新定义

由于免费数据无法可靠获得 Google 官方绝对月搜索量，V1 使用：

```text
Demand Signals
├── Trend Strength
├── Trend Growth
├── Autocomplete Breadth
├── Long-tail Depth
├── Related Query Count
├── Community Evidence
└── SERP/Competition Evidence
```

系统输出：

```text
Demand Score: 0-100
```

必须明确标记为模型计算指标，不得称为 Google Search Volume。

## 5. 数据可信度

每条数据必须保存：

- source
- provider
- retrieved_at
- country
- language
- raw/normalized 标识
- evidence URL（如适用）
- confidence（仅用于模型推断）

Provider 失败时：

- 不返回随机值
- 不由 AI 猜测搜索量
- 标记该证据缺失
- 允许研究继续处理其它 Provider

## 6. 成本原则

V1 数据成本目标：**US$0**。

系统必须：

- 不要求绑定信用卡
- 不要求购买 API credits
- 不依赖付费 SERP API
- 不依赖付费关键词数据库
- 对免费 API 严格限流
- 对重复数据进行本地缓存

## 7. 数据源优先级

第一阶段：

1. Google Trends
2. Search Suggestions
3. GitHub
4. 公开网页竞品信息
5. Reddit（可选）
6. 本地 AI 分析

后续如确有必要，再通过独立 Provider 增加收费数据源，但绝不能改变 V1 的可运行性。
