# 数据库设计

## 1. 设计目标

PostgreSQL 是 V1 主数据库。数据库必须支持：

- 研究项目
- 关键词与指标快照
- 趋势
- SERP
- 社区痛点
- 竞品
- Opportunity Score
- AI 报告
- Provider 运行记录
- 异步任务状态

原则：事实数据与 AI 推断分离；每个外部数据都记录来源和获取时间。

## 2. research_project

一次完整的需求研究。

字段：

- id UUID PK
- name VARCHAR(200) NOT NULL
- seed_keyword TEXT NOT NULL
- description TEXT
- country_code VARCHAR(10) NOT NULL
- language_code VARCHAR(20) NOT NULL
- status VARCHAR(30) NOT NULL
- created_at TIMESTAMPTZ NOT NULL
- updated_at TIMESTAMPTZ NOT NULL

status：draft / queued / running / completed / failed / cancelled

## 3. keyword

全局规范化关键词实体。

- id UUID PK
- keyword_text TEXT NOT NULL
- normalized_keyword TEXT NOT NULL
- language_code VARCHAR(20)
- created_at TIMESTAMPTZ NOT NULL

索引：normalized_keyword + language_code。

## 4. research_keyword

研究与关键词关系。

- id UUID PK
- research_id UUID FK
- keyword_id UUID FK
- source_type VARCHAR(30) NOT NULL
- intent VARCHAR(30)
- created_at TIMESTAMPTZ NOT NULL

source_type：seed / ai_generated / provider / imported / manual

## 5. keyword_metric_snapshot

搜索需求估算快照。

- id UUID PK
- keyword_id UUID FK
- research_id UUID FK
- country_code VARCHAR(10) NOT NULL
- language_code VARCHAR(20) NOT NULL
- estimated_monthly_searches BIGINT
- cpc NUMERIC(14,4)
- currency VARCHAR(10)
- competition NUMERIC(8,4)
- competition_level VARCHAR(30)
- source VARCHAR(100) NOT NULL
- retrieved_at TIMESTAMPTZ NOT NULL
- provider_version VARCHAR(100)
- raw_payload JSONB

必须使用 estimated_* 命名，避免误解为官方精确搜索量。

## 6. keyword_monthly_volume

如果 Provider 提供月度历史数据，则保存：

- id UUID PK
- metric_snapshot_id UUID FK
- year SMALLINT
- month SMALLINT
- search_volume BIGINT

唯一约束：metric_snapshot_id + year + month。

## 7. trend_snapshot

趋势数据。

- id UUID PK
- keyword_id UUID FK
- research_id UUID FK
- period VARCHAR(30)
- trend_score NUMERIC(8,4)
- growth_rate NUMERIC(12,4)
- seasonality_score NUMERIC(8,4)
- source VARCHAR(100)
- retrieved_at TIMESTAMPTZ
- raw_payload JSONB

## 8. serp_result

保存关键词搜索结果快照。

- id UUID PK
- keyword_id UUID FK
- research_id UUID FK
- position INTEGER
- url TEXT
- domain TEXT
- title TEXT
- snippet TEXT
- page_type VARCHAR(50)
- competitor_type VARCHAR(50)
- is_large_brand BOOLEAN
- source VARCHAR(100)
- retrieved_at TIMESTAMPTZ

索引：research_id + keyword_id + position。

## 9. community_post

保存 Reddit 等社区公开内容的必要元数据和许可允许的内容摘要。

- id UUID PK
- research_id UUID FK
- keyword_id UUID FK NULL
- platform VARCHAR(50)
- external_id VARCHAR(200)
- url TEXT
- title TEXT
- content_excerpt TEXT
- score INTEGER
- published_at TIMESTAMPTZ
- retrieved_at TIMESTAMPTZ
- source VARCHAR(100)

避免不必要地复制受版权保护的完整正文。

## 10. pain_point

从社区/评论/竞品数据中提取的结构化痛点。

- id UUID PK
- research_id UUID FK
- statement TEXT
- frequency_score NUMERIC(8,4)
- severity_score NUMERIC(8,4)
- willingness_to_pay_score NUMERIC(8,4)
- evidence_count INTEGER
- evidence_refs JSONB
- source_type VARCHAR(30)

## 11. competitor

- id UUID PK
- research_id UUID FK
- name VARCHAR(300)
- url TEXT
- description TEXT
- target_users TEXT
- pricing_summary TEXT
- free_plan BOOLEAN
- paid_plan BOOLEAN
- positioning TEXT
- source VARCHAR(100)
- retrieved_at TIMESTAMPTZ

## 12. product_opportunity

产品机会候选。

- id UUID PK
- research_id UUID FK
- title VARCHAR(300)
- summary TEXT
- target_user TEXT
- problem TEXT
- proposed_solution TEXT
- opportunity_score NUMERIC(6,2)
- status VARCHAR(30)
- created_at TIMESTAMPTZ

## 13. opportunity_score

保存可解释评分的各维度。

- id UUID PK
- opportunity_id UUID FK UNIQUE
- search_demand_score NUMERIC(6,2)
- trend_score NUMERIC(6,2)
- commercial_intent_score NUMERIC(6,2)
- competition_score NUMERIC(6,2)
- pain_point_score NUMERIC(6,2)
- monetization_score NUMERIC(6,2)
- mvp_difficulty_score NUMERIC(6,2)
- formula_version VARCHAR(50)
- evidence JSONB
- calculated_at TIMESTAMPTZ

## 14. ai_report

结构化 AI 报告。

- id UUID PK
- opportunity_id UUID FK
- model VARCHAR(100)
- prompt_version VARCHAR(50)
- report_json JSONB NOT NULL
- confidence NUMERIC(6,2)
- generated_at TIMESTAMPTZ

AI 报告不能替代原始事实数据。

## 15. research_job

异步任务。

- id UUID PK
- research_id UUID FK
- job_type VARCHAR(50)
- status VARCHAR(30)
- progress INTEGER
- error_code VARCHAR(100)
- error_message TEXT
- started_at TIMESTAMPTZ
- finished_at TIMESTAMPTZ

## 16. provider_run

记录 Provider 成本、性能和失败。

- id UUID PK
- research_id UUID FK
- provider VARCHAR(100)
- operation VARCHAR(100)
- status VARCHAR(30)
- request_count INTEGER
- duration_ms BIGINT
- estimated_cost NUMERIC(14,6)
- error_code VARCHAR(100)
- created_at TIMESTAMPTZ

## 17. 数据治理

所有外部事实至少保存 source + retrieved_at + country/language（适用时）。

AI 生成内容必须有 model + prompt_version + generated_at。

禁止保存 API Key、Authorization header 等 Secret。

## 18. Migration

使用 Alembic 管理数据库迁移。

所有 schema 修改必须提交 migration；禁止 Codex 直接修改生产数据库结构。
