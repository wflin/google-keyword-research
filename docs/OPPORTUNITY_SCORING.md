# 产品机会评分模型

## 1. 目标

Opportunity Score 用于帮助个人开发者排序研究对象，不是商业成功概率，也不是投资建议。

## 2. 总分

总分 0-100：

| 维度 | 权重 |
|---|---:|
| Search Demand | 20 |
| Trend | 15 |
| Commercial Intent | 20 |
| Competition | 15 |
| Pain Point | 15 |
| Monetization | 10 |
| MVP Difficulty | 5 |

## 3. Search Demand

输入：estimated monthly searches。

不能简单使用线性映射。第一版使用分段归一化：低于 100、100-1k、1k-10k、10k-100k、100k+ 分层，再根据研究国家和关键词类型调整。

搜索量只是需求强度，不代表产品价值。

## 4. Trend

综合：

- 12 个月趋势方向
- 最近 90 天变化
- 5 年趋势（可用时）
- Rising Queries
- 季节性

增长趋势加分，持续下降扣分；明显季节性不直接扣分，但必须在报告中说明。

## 5. Commercial Intent

搜索意图分为：

- INFORMATIONAL
- COMMERCIAL
- TRANSACTIONAL
- NAVIGATIONAL
- TOOL

优先级通常为：TRANSACTIONAL / TOOL > COMMERCIAL > INFORMATIONAL > NAVIGATIONAL。

CPC 可作为商业意图辅助信号，但不能单独决定评分。

## 6. Competition

综合：

- SERP 前十域名质量
- 大型品牌占比
- 独立站占比
- SaaS 竞品数量
- 页面质量
- 内容同质化程度

特别增加 Weak SERP Signal：如果前十存在大量低质量页面、论坛页面、小型独立站或明显未满足搜索意图的页面，则机会增加。

## 7. Pain Point

从 Reddit 等社区提取：

- 问题出现频率
- 用户抱怨强度
- 现有方案缺陷
- 用户是否主动寻找替代品
- 是否存在明确目标人群

## 8. Monetization

观察：

- 竞品是否收费
- 价格区间
- 用户是否存在明确付费场景
- B2B/B2C
- 一次性收费或订阅
- 是否可以通过 API、模板、广告等变现

## 9. MVP Difficulty

考虑：

- 核心功能数量
- 第三方 API 依赖
- 数据采集难度
- AI 成本
- 合规风险
- 预计个人开发时间

难度越低，分数越高。

## 10. 输出等级

- 80-100：强烈建议验证
- 65-79：值得研究
- 50-64：观察
- <50：暂时放弃

## 11. 解释要求

AI 必须输出每个维度的得分和理由，不能只返回一个总分。

最终报告必须明确区分：

- 数据事实
- 算法计算
- AI 推断
- 人工结论
