# Google Ads API 接入方案

## 1. 数据源

第一版使用 Google Ads API 的 Keyword Planning 能力获取关键词数据。

核心能力包括：

- Keyword ideas：根据种子关键词获取相关关键词建议
- Historical metrics：获取关键词历史指标

核心 RPC/API 能力以当前 Google Ads API 官方版本为准，开发时必须以官方最新文档和客户端库为准，不在代码中假定过时版本号。

## 2. 需要的 Google 账号与凭证

正式接入前需要准备并配置：

- Google Ads 账号
- Google Ads Manager Account（如当前权限流程要求）
- Developer Token
- Google Cloud Project
- OAuth 2.0 Client ID / Client Secret
- OAuth refresh token
- 用于调用 API 的 customer ID

这些信息只保存在本地 `.env` 或部署环境 Secret 中。

## 3. 权限原则

Keyword Planning 属于 Google Ads API 的受控能力。项目开发时必须根据 Google 当前官方 access level 和 policy 要求申请对应访问权限。

不要通过购买广告、虚构投放数据或其他方式绕过 Google Ads API 的访问控制。

## 4. 第一阶段需要的 API 能力

### Historical Metrics

用于查询：

- average monthly searches
- monthly search volumes（如 API 返回）
- competition
- competition index
- low top of page bid
- high top of page bid

### Keyword Ideas

用于从 seed keyword 扩展相关关键词。

## 5. 地理与语言

Google Ads API 使用 Google Ads 的 geo target 和 language resource 配置。

应用层不要把“美国”“英语”等中文展示名称直接传给 Google API，而应该维护内部配置：

```text
Country/Region display name
    -> Google geo target resource

Language display name
    -> Google language constant resource
```

第一版至少配置：

- United States
- English

同时保留可扩展结构。

## 6. 请求控制

必须实现：

- 单请求关键词数量校验
- 后端限流
- 重试策略
- exponential backoff（只针对适合重试的错误）
- quota/rate limit 错误识别
- 缓存

禁止无限重试。

## 7. 数据缓存

历史指标适合缓存。默认使用数据库保存查询结果。

缓存记录必须包含：

- keyword
- customer context
- geo
- language
- query period
- retrieved_at
- raw/normalized metric data

后续可根据数据刷新周期增加 TTL。

## 8. API 适配层

Google SDK 不应该散落在业务代码中。

建议：

```text
KeywordPlanningGateway
        |
        v
GoogleAdsKeywordPlanningGateway
        |
        v
Google Ads Java Client
```

业务 service 只依赖 `KeywordPlanningGateway`。

## 9. 本地开发模式

为了让 Codex 可以在没有 Google credentials 的环境运行测试，必须提供 mock/fixture provider：

```text
APP_GOOGLE_ADS_MODE=mock
```

真实环境：

```text
APP_GOOGLE_ADS_MODE=real
```

Mock 数据必须明显标记为测试数据，不能在生产模式下误用。

## 10. 凭证配置示例

仓库中只提交 `.env.example`，不得提交真实值：

```text
GOOGLE_ADS_DEVELOPER_TOKEN=
GOOGLE_ADS_CLIENT_ID=
GOOGLE_ADS_CLIENT_SECRET=
GOOGLE_ADS_REFRESH_TOKEN=
GOOGLE_ADS_CUSTOMER_ID=
GOOGLE_ADS_LOGIN_CUSTOMER_ID=
```

实际字段以 Google Ads Java Client 当前版本的认证方式为准。

## 11. 合规要求

- 遵守 Google Ads API Terms、Developer Token 使用政策及 quota 要求。
- 不抓取或绕过 Google Ads 页面来获取 Keyword Planner 数据。
- 不向用户虚假宣称搜索量的精确程度。
- Google 返回的数据必须保留必要的上下文。
- 对 API 的变更保持可升级性。

## 12. 开发前验证

在开始正式业务开发前，先完成一个最小 API smoke test：

1. 成功加载 OAuth credentials
2. 成功连接 Google Ads API
3. 对一个测试关键词请求 historical metrics
4. 打印结构化结果
5. 验证 quota / permission 错误能被识别
6. 将调用封装进 gateway

只有 smoke test 成功后，才进入完整 Web 功能开发。
