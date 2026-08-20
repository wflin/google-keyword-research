# 数据源成本与配额策略

## 1. 原则

MVP 不以购买任何付费数据源为前置条件。
所有 Provider 必须支持 Mock 实现。
所有真实 Provider 必须记录 request_count、duration_ms、estimated_cost、status。

## 2. Provider 成本模型

统一记录：

- provider
- operation
- request_count
- unit_cost（如可获得）
- estimated_cost
- cache_hit
- retrieved_at

## 3. 搜索量 Provider

搜索量属于估算数据。优先采用可按需调用、可批量请求的供应商。
系统不得把供应商估算值标记为 Google 官方精确值。

## 4. SERP Provider

优先缓存相同 keyword + country + language 的结果，在合理 TTL 内避免重复查询。
控制并发，遇到 429 必须退避。

## 5. Trend Provider

趋势结果可按较长 TTL 缓存；相同条件不重复抓取。

## 6. Community Provider

限制查询频率和抓取范围，只保存完成研究所需的最小公开信息和摘要。

## 7. AI Provider

记录模型、输入/输出 token（若供应商提供）、estimated_cost、prompt_version。
对相同事实集可缓存结构化分析结果；修改 prompt_version 后重新生成。

## 8. 成本保护

- 单次 Research 设置最大预算
- 单次 Research 设置最大关键词数量
- 单个 Provider 设置超时和重试上限
- 429 使用指数退避
- 达到预算时停止非核心 Provider
- UI 显示数据来源和成本状态

## 9. 后续商业化

进入 SaaS 后根据真实用户行为重新计算：每次 Research 成本、每个付费用户月成本、毛利率和合理配额。
