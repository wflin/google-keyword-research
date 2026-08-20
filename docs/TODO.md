# Codex 任务清单

> 当前状态：需求/设计已建立，等待 Google Ads API 环境验证。Codex 在没有明确授权开始 Phase 1 前，不应直接进入完整业务开发。

## Phase 0 - Google Ads API Smoke Test

- [ ] 检查本地开发环境（Java 21 / Maven / Git）
- [ ] 创建 Google Ads API 配置模板
- [ ] 创建 `.env.example`
- [ ] 实现 credentials 配置读取，但不提交真实 secret
- [ ] 实现最小 Google Ads client/gateway
- [ ] 支持 mock 模式
- [ ] 编写 historical metrics smoke test
- [ ] 编写 keyword ideas smoke test
- [ ] 记录真实 API 调用结果结构
- [ ] 更新 GOOGLE_ADS_API.md，记录实际 SDK/API 版本及必要配置

## Phase 1 - MVP Backend

- [ ] 初始化 Spring Boot + Java 21
- [ ] 初始化 MySQL schema / migration
- [ ] 实现 KeywordPlanningGateway
- [ ] 实现 historical metrics service
- [ ] 实现 keyword ideas service
- [ ] 实现查询缓存
- [ ] 实现 research project CRUD
- [ ] 实现 keyword query REST API
- [ ] 实现统一异常处理
- [ ] 编写单元测试
- [ ] 编写 API integration tests（mock Google provider）

## Phase 1 - MVP Frontend

- [ ] 初始化 Vue 3 + TypeScript + Vite
- [ ] 创建关键词查询页
- [ ] 国家/语言选择
- [ ] 关键词批量输入
- [ ] 结果表格
- [ ] 搜索量/竞争度/CPC展示
- [ ] 趋势折线图
- [ ] 相关关键词展示
- [ ] 筛选与排序
- [ ] 研究记录页面

## Phase 1 - Deployment

- [ ] Dockerfile
- [ ] docker-compose
- [ ] 本地一键启动
- [ ] `.env.example`
- [ ] 健康检查
- [ ] README 启动说明

## Phase 2 - Research Efficiency

- [ ] CSV 导入
- [ ] CSV 导出
- [ ] 收藏/标签/备注
- [ ] 批量研究项目
- [ ] 趋势对比

## Phase 3 - AI Opportunity Analysis

- [ ] AI intent analysis
- [ ] AI commercial intent
- [ ] AI product direction
- [ ] AI monetization suggestions
- [ ] AI opportunity score
- [ ] AI research report

## Codex 工作规则

1. 先阅读 README 和 docs 下全部设计文档。
2. 开始任务前确认当前 Phase 和 TODO 范围。
3. 不自行增加产品需求。
4. 不提交任何真实 API key、OAuth secret、refresh token。
5. 优先写测试，再实现核心逻辑。
6. Google API 必须通过 gateway/adapter 隔离。
7. 没有真实 Google credentials 时使用 mock/fixture 测试。
8. 完成任务后运行测试并报告结果。
9. 更新 TODO 和相关技术文档。
10. 遇到产品需求不明确时停止并请求确认，不自行猜测。
