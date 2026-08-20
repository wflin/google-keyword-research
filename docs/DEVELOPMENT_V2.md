# V2 开发任务清单

## Phase 1：可运行研究工作台

### Backend

- [ ] 初始化 Spring Boot 3 + Java 21
- [ ] MySQL schema
- [ ] Research CRUD
- [ ] Keyword normalization
- [ ] Provider interface
- [ ] Search Volume Provider adapter
- [ ] Trend Provider adapter
- [ ] SERP Provider adapter
- [ ] Community Provider adapter
- [ ] REST API
- [ ] Provider cache
- [ ] error model
- [ ] unit tests

### Frontend

- [ ] Vue 3 + TypeScript + Vite
- [ ] Research list
- [ ] New research form
- [ ] Keyword table
- [ ] filters and sorting
- [ ] trend chart
- [ ] keyword detail
- [ ] opportunity report

### Infrastructure

- [ ] Dockerfile
- [ ] docker-compose
- [ ] MySQL volume
- [ ] .env.example
- [ ] health endpoint
- [ ] CI build/test

## Phase 2：机会发现

- [ ] AI keyword expansion
- [ ] intent classification
- [ ] keyword clustering
- [ ] opportunity score
- [ ] Reddit pain-point extraction
- [ ] competitor extraction
- [ ] opportunity report JSON
- [ ] report persistence

## Phase 3：批量自动发现

- [ ] seed keyword batch import
- [ ] scheduled research jobs
- [ ] Top N filtering
- [ ] provider quota protection
- [ ] daily opportunity ranking
- [ ] export CSV/Markdown

## Phase 4：Provider 扩展

- [ ] Google Ads Provider
- [ ] Ahrefs Provider
- [ ] Semrush Provider
- [ ] Product Hunt Provider
- [ ] GitHub Provider
- [ ] App Store Provider
- [ ] Chrome Web Store Provider

## Codex 开发规则

1. 先读取 docs/PRD.md、docs/ARCHITECTURE.md、docs/DATA_SOURCES.md、docs/OPPORTUNITY_SCORING.md、docs/AI_ANALYSIS.md。
2. 一次只完成一个 Phase 或一个明确任务。
3. 不擅自引入微服务、Kubernetes、消息队列等复杂基础设施。
4. 所有 Provider 都必须接口隔离并可 Mock。
5. 不把真实 API key 提交到 Git。
6. 每完成一个任务必须运行测试。
7. 代码完成后同步更新文档和 TODO。
8. 不因为某个 Provider 暂不可用而伪造数据。
9. 前端不得直接调用第三方敏感 API。
10. 优先让本地 Mock 数据跑通完整 UI，再接真实 Provider。

## 第一条开发任务

先完成项目骨架和 Mock Provider，不接付费 API。

验收标准：

```text
输入 invoice
  -> Mock keyword expansion
  -> Mock metrics
  -> Mock trend
  -> Mock SERP
  -> 页面显示研究结果
```

完整链路跑通后，再接真实数据 Provider。
