# AI 产品机会分析设计

## 1. AI 定位

AI 是分析层，不是数据源。

AI 只能基于已采集的数据进行解释、分类、聚类和建议。模型不得伪造搜索量、CPC、趋势或竞品数据。

## 2. 输入

AI Analysis Context：

```text
seed_keyword
country
language
keyword_metrics[]
trend_data
serp_results[]
competitors[]
community_posts[]
pricing_data[]
```

## 3. 分析步骤

### Step 1：Keyword Intent

判断：

- INFORMATIONAL
- COMMERCIAL
- TRANSACTIONAL
- NAVIGATIONAL
- TOOL

并给出理由。

### Step 2：Need Cluster

把相关关键词聚类成用户需求，而不是简单按词形聚类。

例如：

```text
invoice generator
free invoice generator
invoice maker for freelancer
```

聚类为：

> Freelancer 快速生成 Invoice

### Step 3：Pain Point Extraction

从社区内容中提取：

- 用户是谁
- 遇到什么问题
- 当前怎么解决
- 为什么不满意
- 是否愿意付费

### Step 4：Product Opportunity

生成一个或多个具体产品机会：

```text
product_name
one_sentence_value
 target_user
problem
solution
core_features
pricing_model
competitive_risk
mvp_scope
```

### Step 5：Score

根据 OPPORTUNITY_SCORING.md 计算各维度得分和总分。

### Step 6：Recommendation

只能输出：

- STRONGLY_VALIDATE
- VALIDATE
- WATCH
- DROP

并解释原因。

## 4. AI 输出 JSON

后端要求模型返回结构化 JSON，示例：

```json
{
  "summary": "...",
  "searchIntent": "TOOL",
  "targetUsers": ["freelancers"],
  "painPoints": ["..."],
  "productIdeas": [
    {
      "name": "...",
      "valueProposition": "...",
      "mvpFeatures": ["..."],
      "pricing": "..."
    }
  ],
  "scores": {
    "searchDemand": 18,
    "trend": 13,
    "commercialIntent": 18,
    "competition": 11,
    "painPoint": 13,
    "monetization": 9,
    "mvpDifficulty": 5,
    "total": 87
  },
  "recommendation": "STRONGLY_VALIDATE",
  "risks": ["..."],
  "evidence": ["..."],
  "uncertainties": ["..."]
}
```

## 5. Prompt 原则

系统 Prompt 必须要求：

1. 不编造事实；
2. 没有数据时明确写 unknown；
3. 区分事实和推断；
4. 引用输入数据的 source；
5. 不把搜索量估算说成 Google 官方数据；
6. 不保证商业成功；
7. 优先提出可以由一个人开发的 MVP。

## 6. AI 成本控制

AI 分析只对经过第一轮过滤的 Top N 关键词执行，默认 N=20。

关键词扩展阶段优先使用便宜模型；最终产品机会报告再使用能力更强的模型。

所有 AI 结果缓存，输入数据变化后才重新分析。
