# Web UI Specification

## 1. Product form

This is a responsive Web SaaS, not a terminal-only application. Desktop is the primary target; mobile should remain usable.

Frontend: Next.js + TypeScript. UI language for V1: Chinese, with data such as keywords, SERP titles and product names displayed in their original language.

## 2. Navigation

- Dashboard / 首页
- Research / 需求研究
- Keywords / 关键词
- Opportunities / 产品机会
- Daily Discovery / 每日发现
- Favorites / 收藏
- Settings / 设置

## 3. Dashboard

Show:
- recent research projects
- today's opportunities
- highest opportunity scores
- research success/partial/failure counts
- quick action: enter seed keyword

## 4. Research page

Inputs:
- seed keyword
- target country
- language
- research depth: quick / standard / deep

After starting, show a progress timeline:

1. keyword expansion
2. demand metrics
3. trend analysis
4. SERP analysis
5. community analysis
6. competitor analysis
7. AI synthesis

The page must continue to display useful partial results if a provider fails.

## 5. Keyword Explorer

Table columns:
- keyword
- estimated monthly volume
- volume source
- CPC if available
- competition
- trend
- intent
- opportunity score
- freshness

Filters and sorting must be server-side for large result sets.

## 6. Opportunity ranking

Cards/table with:
- opportunity name
- score / 100
- demand
- trend
- commercial intent
- competition
- pain point strength
- monetization
- MVP difficulty
- evidence count

Do not present AI-generated scores without showing their evidence/source summary.

## 7. Opportunity detail

Sections:
- executive summary
- target users
- user pain points
- keyword demand
- trend
- SERP/competition
- competitors and pricing
- evidence links
- proposed MVP
- monetization hypothesis
- risks
- AI recommendation
- confidence level
- analysis timestamp and model/prompt version

## 8. Daily Discovery

Show a ranked list of newly discovered opportunities and why each was selected. Each item must link to evidence.

## 9. States

Every page must define loading, empty, partial, error and retry states. Long research jobs use polling initially; WebSocket/SSE can be added later.

## 10. UX rules

- Never hide provider failures.
- Never call estimates "official Google data" unless the provider explicitly supplies official data.
- Show data freshness.
- Avoid dashboard clutter.
- Use consistent score labels: Strong opportunity, Worth investigating, Watch, Low priority.
- External evidence opens in a new tab.

## 11. Accessibility

Keyboard navigation, visible focus, semantic headings, accessible form labels, sufficient contrast and responsive layout are required.

## 12. UI acceptance criteria

A new user can enter `invoice`, start research, observe progress, open keyword results and reach a complete opportunity report without using the terminal or developer tools.
