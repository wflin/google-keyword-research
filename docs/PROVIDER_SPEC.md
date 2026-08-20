# Provider Specification

## 1. 核心原则

外部数据访问必须隔离在强类型 Provider 接口之后。业务服务不得直接调用第三方 HTTP API。

V1 的 Provider 必须满足：

1. 使用真实公开数据，而不是 Mock 数据。
2. 不需要购买 credits。
3. 不要求绑定信用卡作为开发前置条件。
4. 有明确的速率限制、缓存和失败降级策略。
5. 数据失败时必须报告失败，不能伪造结果。

## 2. V1 Provider

```text
KeywordExpansionProvider
TrendProvider
SuggestionProvider
GitHubProvider
PublicWebProvider
CommunityProvider (optional)
LocalAIProvider
```

V1 不实现 SearchVolumeProvider，因为没有可靠、免费的 Google 绝对搜索量 API 可作为基础依赖。

用 DemandSignalProvider 计算需求强度，而不是伪造 Search Volume。

## 3. Common Contract

Every provider returns:

- normalized data
- `source`
- `provider_version`
- `retrieved_at`
- `latency_ms`
- `status`
- structured error information when unsuccessful
- evidence URL where applicable

Provider secrets（如 GitHub token）只能通过环境变量或安全配置注入，不能写入业务表。

## 4. TrendProvider

返回：

- relative interest 0-100
- trend direction
- time series
- geography
- related queries
- rising queries
- source
- retrieved timestamp

Trend 数据必须标记为 relative interest，不得标记为 absolute search volume。

## 5. SuggestionProvider

返回：

- seed keyword
- suggested keyword
- source
- retrieved timestamp

不得根据建议词数量虚构绝对搜索量。

## 6. GitHubProvider

只使用公开 GitHub 数据。

优先使用 GitHub token 认证，以获得更高的免费 API 配额。每次请求必须读取并记录 rate-limit 信息；搜索请求需要单独控制频率。GitHub 官方文档明确说明未认证请求通常为每小时 60 次，而认证用户通常为每小时 5,000 次，且搜索端点存在额外限制。citeturn0search0turn0search3

系统必须：

- 使用缓存
- 避免高并发
- 遇到 403/429 时按 reset/retry-after 等信息退避
- 不持续轮询

## 7. PublicWebProvider

用于读取竞品官网的公开页面。

只访问公开 URL，不绕过：

- 登录
- CAPTCHA
- robots restrictions
- paywall
- anti-bot controls

不实现代理池、指纹伪装或验证码绕过。

## 8. CommunityProvider

Reddit 等社区只作为可选增强数据源。必须使用合法公开访问方式；如果平台政策或访问限制发生变化，关闭该 Provider 不得导致 Research 主流程失败。

Reddit 的公共数据访问政策正在演进，因此不能把 Reddit API 作为 V1 的硬依赖。citeturn0reddit48

## 9. LocalAIProvider

V1 默认使用本地 AI，例如 Ollama + 本地模型，避免 AI API 费用成为开发前置条件。

AI 输入必须是结构化 evidence bundle，输出必须通过 Pydantic schema 校验。

AI 不得生成不存在的搜索量、CPC、趋势或竞品事实。

每个事实必须引用 evidence，模型推测必须明确标记为 hypothesis。

## 10. DemandSignalProvider

负责把免费真实数据转换为可解释的需求强度：

```text
Demand Score 0-100
├── Trend Strength
├── Trend Growth
├── Suggestion Breadth
├── Long-tail Depth
├── Related Query Evidence
├── Community Evidence
└── Other Public Evidence
```

这是模型计算指标，不是 Google 官方搜索量。

## 11. Provider selection

V1 默认启用免费真实 Provider：

```text
TREND_PROVIDER=google_trends
SUGGESTION_PROVIDER=public_suggestions
GITHUB_PROVIDER=github
AI_PROVIDER=local
```

Community Provider 可以单独关闭。

收费 Provider 不得进入默认配置，也不得写入启动必需项。

## 12. Testing without Mock Provider

本项目不采用 Mock Provider 作为正常开发数据源。

自动化测试使用：

- 小规模真实 Provider smoke test
- 固定的脱敏 response fixture/replay 数据进行单元测试
- Provider contract tests
- 网络不可用测试
- rate-limit 测试

Fixture 仅用于测试，不得作为产品运行数据。

## 13. Cost and rate-limit controls

- 缓存重复请求
- 免费 API 批量能力优先
- 控制并发
- 遇到 429/403 自动退避
- 尊重 Retry-After / reset 信息
- 设置单次 Research 最大请求数
- 设置每日免费请求预算
- Provider 失败时显示明确状态
- 不进行无限重试

## 14. Google Search SERP 特别说明

V1 不直接对 Google Search 发送自动化查询或抓取 Google SERP。Google 官方说明，未经明确许可向 Google 自动发送查询属于 machine-generated traffic，并可能违反相关政策和服务条款。citeturn0search4turn0search6

因此 V1 的竞争分析主要依赖公开网页、竞品官网、GitHub 和其它合法公开证据。未来如果要加入 SERP，必须采用合法、可持续、成本明确的独立 Provider，并且不能成为核心系统的启动依赖。
