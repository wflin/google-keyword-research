# 数据库设计

## 1. 设计目标

数据库服务于个人研究记录和 Google 数据缓存。第一版保持简单，避免为了未来需求过度建模。

## 2. research_project

保存一次研究主题。

建议字段：

- id BIGINT PK
- name VARCHAR(200) NOT NULL
- description TEXT
- country_code VARCHAR(20)
- language_code VARCHAR(50)
- created_at DATETIME NOT NULL
- updated_at DATETIME NOT NULL

## 3. keyword

保存规范化后的关键词实体。

建议字段：

- id BIGINT PK
- keyword_text VARCHAR(500) NOT NULL
- normalized_keyword VARCHAR(500) NOT NULL
- created_at DATETIME NOT NULL

建议对 `normalized_keyword` 建索引。

## 4. keyword_metric_snapshot

保存某次 Google 查询返回的指标快照。

建议字段：

- id BIGINT PK
- keyword_id BIGINT NOT NULL
- country_code VARCHAR(20) NOT NULL
- language_code VARCHAR(50) NOT NULL
- average_monthly_searches BIGINT
- competition VARCHAR(50)
- competition_index DECIMAL(10,4)
- low_top_of_page_bid_micros BIGINT
- high_top_of_page_bid_micros BIGINT
- retrieved_at DATETIME NOT NULL
- source VARCHAR(50) NOT NULL
- raw_payload JSON NULL

金额/出价优先保存 Google API 的 micros 整数值，展示层再转换货币单位。

## 5. keyword_monthly_volume

保存 Google 返回的历史月度搜索量。

建议字段：

- id BIGINT PK
- metric_snapshot_id BIGINT NOT NULL
- year SMALLINT NOT NULL
- month TINYINT NOT NULL
- search_volume BIGINT

索引：

- metric_snapshot_id
- year + month

## 6. research_keyword

研究项目与关键词的关联。

建议字段：

- id BIGINT PK
- research_project_id BIGINT NOT NULL
- keyword_id BIGINT NOT NULL
- source_type VARCHAR(30) NOT NULL（seed / idea / imported / manual）
- note TEXT
- created_at DATETIME NOT NULL

## 7. 后续 AI 分析表

第二阶段再增加：

`keyword_opportunity_analysis`

包含：

- intent analysis
- commercial intent
- product direction
- competition risk
- development difficulty
- opportunity score
- AI reasoning
- model/version
- analyzed_at

第一版不要创建，避免需求未稳定时过度设计。

## 8. 数据保留策略

研究记录长期保存。

Google metric snapshot 默认保留历史版本，以便以后比较趋势和重新分析。

如果数据库增长过快，再增加归档策略。
