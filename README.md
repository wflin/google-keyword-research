# AI 海外需求发现与产品机会分析工具

个人使用的海外需求发现与产品机会研究工具。

## 项目定位

本项目不是 Google Keyword Planner 的克隆，也不是广告投放工具。

它的目标是帮助项目所有者在开发海外 AI / SaaS / Web 工具之前，快速回答：

> 用户到底在搜索什么？这个需求是否真实、是否增长、是否有商业价值、竞争是否可进入、我是否值得做一个产品？

系统采用多数据源 + AI 分析，不依赖 Google Ads 账号或 Google Keyword Planner 才能工作。

## 核心闭环

```text
种子想法 / 关键词
        ↓
关键词扩展
        ↓
搜索需求估算
        ↓
趋势分析
        ↓
SERP / 竞品分析
        ↓
Reddit / 社区痛点
        ↓
商业意图
        ↓
AI 综合分析
        ↓
产品机会评分
        ↓
MVP / 定价 / 风险建议
```

## 核心原则

1. **先发现需求，再开发产品**：工具服务于产品发现，而不是为了做一个关键词查询 SaaS。
2. **多数据源**：任何单一数据源都不能代表完整市场需求。
3. **数据与推断分离**：第三方估算值必须标明来源，AI 推断不能伪装成真实统计数据。
4. **趋势优先于静态数字**：关注增长、持续性和季节性。
5. **用户痛点优先**：搜索量高不等于值得创业。
6. **机会验证优先于开发**：系统输出研究建议，不保证商业成功。
7. **个人效率优先**：第一版只服务项目所有者本人，不做账号、支付和复杂权限。
8. **Provider 可替换**：数据源通过统一接口接入，避免绑定单一供应商。

## 第一阶段数据源

第一阶段不依赖 Google Ads / Keyword Planner。

优先采用：

- Google Trends / 趋势数据
- 第三方关键词搜索量估算 Provider
- SERP / 搜索结果数据 Provider
- Reddit / 社区公开讨论
- GitHub 公开项目数据

后续可以增加其他数据源，但不能破坏现有 Provider 接口。

## 文档

- [产品需求 PRD](docs/PRD.md)
- [系统架构](docs/ARCHITECTURE.md)
- [数据源设计](docs/DATA_SOURCES.md)
- [数据模型](docs/DATABASE.md)
- [机会评分](docs/OPPORTUNITY_SCORING.md)
- [AI 分析](docs/AI_ANALYSIS.md)
- [开发计划 V2](docs/DEVELOPMENT_V2.md)
- [Codex 任务清单](docs/TODO.md)

## 当前阶段

需求与技术设计阶段。下一阶段先完成 Mock 数据闭环，再逐步接入真实数据 Provider。

## 重要限制

项目不得声称提供“Google 官方精确搜索量”，除非未来实际接入并获得相应官方数据。所有估算搜索量必须显示数据来源、查询时间、国家/地区和语言。
## 本地开发启动

前端（Next.js）：

```bash
cd apps/web
npm install
npm run dev
```

访问 http://localhost:3000

## 测试

后端（需要 PostgreSQL 运行且 healthy）：

```bash
cd apps/api
python -m pytest -v
```

前端：

```bash
cd apps/web
npm run typecheck
npm run lint
npm run build
```

详细说明见 docs/TESTING.md。
