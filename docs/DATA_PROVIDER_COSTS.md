# 数据源成本与配额策略

## 1. V1 成本目标

V1 的核心 Research 数据成本目标为 **US$0**。

禁止把以下条件作为启动前置：

- 购买 API credits
- 绑定信用卡
- 订阅 Ahrefs/Semrush/DataForSEO 等商业服务
- 购买 SERP API
- 购买关键词数据库
- 购买 AI API

V1 不使用 Mock Provider 作为正常运行依赖。

## 2. 现实约束

“免费”不等于“无限”。所有免费公开数据源都可能存在速率限制、并发限制、服务变更或临时不可用。

因此系统必须做到：

```text
真实免费数据
    ↓
本地缓存
    ↓
持久化
    ↓
限流
    ↓
失败退避
    ↓
Provider 可独立降级
```

单个 Provider 不得阻塞整个 Research。

## 3. V1 Provider 成本审计

| Provider | 数据 | 费用 | 账号/凭证 | 主要限制 | V1 状态 |
|---|---|---|---|---|---|
| Google Trends | 趋势、相关查询 | 0 | 无固定付费账号要求 | 非官方客户端可能受后端变化影响 | 核心 |
| Search Suggestions | 长尾建议词 | 0 | 通常无需付费账号 | 服务行为可能变化 | 核心 |
| GitHub REST | 开源项目、Issue、Stars 等 | 0 | 推荐免费 token | 认证通常 5,000 requests/hour；搜索有独立限制 | 核心 |
| Public Web | 竞品官网公开信息 | 0 | 无 | robots、站点限流、服务条款 | 核心 |
| Reddit | 社区需求 | 0（符合免费访问条件时） | OAuth | 当前免费 Data API 有 QPM 限制；政策持续变化 | 可选 |
| Local AI | 本地模型分析 | 0 API 费用 | 无 | 取决于本机 CPU/GPU/RAM | 核心 |

GitHub 的官方限制和认证方式必须以官方文档为准；未认证通常为 60 requests/hour，认证用户通常为 5,000 requests/hour，且搜索端点存在额外限制。citeturn0search0turn0search3

Reddit 免费 Data API 当前要求 OAuth，并公布 100 QPM 的免费访问限制；未使用 OAuth 的流量可能被阻止。citeturn0search7

## 4. Search Volume 特别说明

V1 **不提供 Google 官方绝对月搜索量**。

原因：我们没有一个满足“真实、稳定、合法、无需付费、无需信用卡、适合产品长期运行”的绝对搜索量数据源。

因此页面显示：

```text
Demand Score: 82
```

而不是伪造：

```text
Google Search Volume: 60,000
```

未来如果用户主动配置商业 Provider，可以增加“Estimated Monthly Searches”，并明确显示 Provider 和估算属性。

## 5. 成本保护

所有 Provider 必须：

- 缓存相同请求
- 限制并发
- 记录 request_count
- 记录 latency
- 记录 cache_hit
- 记录 rate-limit 状态
- 记录失败原因
- 429/403 遵守 Retry-After / reset
- 指数退避
- 设置单次 Research 最大请求数
- 设置每日请求预算
- 不无限重试

## 6. Provider 失败处理

例如 GitHub 暂时限流：

```text
GitHubProvider → RATE_LIMITED
                     ↓
               等待 reset
                     ↓
             不影响 Trends
             不影响 Suggestions
             不影响 Public Web
                     ↓
             Research 继续
```

结果页必须明确告诉用户哪些证据缺失，而不是补一个假的数值。

## 7. AI 成本

V1 使用 LocalAIProvider，例如 Ollama + 本地模型，不调用付费 AI API。

后续如果支持 OpenAI 等商业模型，必须是可选 Provider，并设置每次 Research 的 token/cost 上限。

## 8. 上线前检查

任何新 Provider 在进入 V1 前必须回答：

1. 是否需要付费？
2. 是否需要信用卡？
3. 是否有免费额度？
4. 免费额度是多少？
5. 是否需要 OAuth/API key？
6. 速率限制是什么？
7. 限流后多久恢复？
8. 是否允许商业使用？
9. 是否允许存储返回数据？
10. 如果服务失效，系统能否继续运行？

只要第 10 项答案为“否”，该 Provider 就不能成为 V1 核心依赖。
