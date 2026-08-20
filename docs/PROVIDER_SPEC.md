# Provider Specification

## 1. V1 核心原则

V1 只使用真实、公开、无需购买 credits 的数据源；不使用 Mock Provider 作为正常运行或开发流程的依赖。

同时必须接受一个现实：免费公开数据存在速率限制、政策变化和偶发不可用。系统的目标不是“无限免费调用”，而是做到：

- 不因单个 Provider 失败而阻塞 Research
- 不伪造数据
- 本地持久化已获得的数据
- 缓存减少重复请求
- 严格限流、退避和重试
- 收费 Provider 永远不是启动前置条件

## 2. V1 Provider

```text
SuggestionProvider
TrendProvider
GitHubProvider
PublicWebProvider
CommunityProvider (optional)
LocalAIProvider
DemandSignalProvider
```

V1 **不实现 SearchVolumeProvider**。当前没有可靠、稳定、无限且免费的 Google 绝对月搜索量 API 可以作为系统基础依赖。因此系统不输出伪造的 Google Search Volume。

## 3. Common Contract

每个 Provider 返回：

- normalized data
- `source`
- `provider_version`
- `retrieved_at`
- `latency_ms`
- `status`
- structured error
- evidence URL（如适用）

Provider secret 只能通过环境变量或安全配置注入，不能写入业务数据。

## 4. TrendProvider

V1 使用 Google Trends 的公开数据能力。Python 可使用 `pytrends` 等非官方客户端，但该项目明确标记为非官方、可能因 Google 后端变化而失效，因此必须封装在 Provider 内并准备停用/替换路径。citeturn0search8

返回：

- relative interest 0-100
- trend direction
- time series
- geography
- related queries
- rising queries
- source
- retrieved timestamp

Trend 只能表示相对兴趣，不得标记为绝对搜索量。

## 5. SuggestionProvider

通过公开可访问的搜索建议能力获取长尾词。

返回：

- seed keyword
- suggested keyword
- source
- retrieved timestamp

建议词数量不得被转换成虚假的月搜索量。

## 6. GitHubProvider

只使用公开 GitHub 数据，优先使用免费的认证方式。GitHub 官方文档显示，未认证 REST 请求通常为每小时 60 次，认证用户通常为每小时 5,000 次；搜索端点还有独立限制。citeturn0search0turn0search1

实现要求：

- 使用 GitHub token 时只申请最小权限
- 读取响应 rate-limit headers
- 搜索请求单独限速
- 缓存相同查询
- 避免高并发
- 403/429 时遵守 reset/retry-after
- 不无限重试

GitHub 官方也建议认证、避免并发、使用缓存/条件请求，并在触发限流后等待再重试。citeturn0search2turn0search14

## 7. PublicWebProvider

用于读取竞品官网等公开网页。

只访问合法公开 URL，不绕过：

- 登录
- CAPTCHA
- paywall
- robots restrictions
- anti-bot controls

禁止代理池、指纹伪装、验证码绕过等规避措施。

## 8. CommunityProvider

Reddit 等社区只作为可选增强，不作为 V1 核心依赖。Reddit 当前允许符合条件的免费 Data API 使用，但要求 OAuth，并有 QPM 限制；未使用 OAuth 的流量可能被阻止。citeturn0search7

同时 Reddit 的开发者平台和公共数据政策正在演进，因此 Provider 必须可以独立关闭，且不能让 Research 主流程失败。citeturn0search10

## 9. LocalAIProvider

V1 默认使用本地 AI，例如 Ollama + 本地模型，避免 AI API 费用成为开发前置条件。

AI 输入必须是结构化 evidence bundle，输出必须通过 Pydantic schema 校验。

AI 不得生成不存在的搜索量、CPC、趋势或竞品事实；模型推测必须标记为 hypothesis，并关联 evidence。

## 10. DemandSignalProvider

把免费真实数据转换为可解释的需求强度：

```text
Demand Score 0-100
├── Trend Strength
├── Trend Growth
├── Suggestion Breadth
├── Long-tail Depth
├── Related Query Evidence
├── Community Evidence
└── Public Web Evidence
```

这是系统计算指标，不是 Google 官方搜索量。

## 11. 默认 Provider

```text
TREND_PROVIDER=google_trends
SUGGESTION_PROVIDER=public_suggestions
GITHUB_PROVIDER=github
WEB_PROVIDER=public_web
AI_PROVIDER=local
COMMUNITY_PROVIDER=disabled_by_default
```

收费 Provider 不得进入默认配置，也不得写入启动必需项。

## 12. Testing Strategy

本项目不使用 Mock Provider 作为产品运行依赖。

自动化测试使用：

- 小规模真实 Provider smoke test
- 脱敏 response fixture/replay 数据做确定性单元测试
- Provider contract tests
- 网络不可用测试
- rate-limit 测试
- timeout/retry 测试

Fixture 只用于测试，不得作为产品运行数据。

## 13. Cost and Rate-Limit Controls

- 缓存重复请求
- 免费 API 批量能力优先
- 限制并发
- 429/403 自动退避
- 尊重 Retry-After / reset
- 设置单次 Research 最大请求数
- 设置每日请求预算
- Provider 失败时显示明确状态
- 不无限重试

## 14. Google Search SERP

V1 不直接对 Google Search 自动发送查询或抓取 Google SERP。Google 搜索相关政策对自动化查询有明确限制，因此不把这种方式作为核心数据采集方案。

未来如果增加 SERP，必须采用合法、可持续、成本明确的独立 Provider，并且不能成为系统启动依赖。
