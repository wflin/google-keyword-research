# 系统架构设计

## 1. 总体架构

第一版采用单体 Web 应用，避免过早微服务化。

```text
Browser
  |
  v
Frontend (Vue 3 + TypeScript)
  |
  | REST/JSON
  v
Backend (Spring Boot + Java)
  |
  +---- Google Ads API
  |       |
  |       +-- Keyword ideas
  |       +-- Historical metrics
  |
  +---- MySQL
  |
  +---- AI Provider（第二阶段）
```

## 2. 技术选型

### Frontend

- Vue 3
- TypeScript
- Vite
- Element Plus 或同等级轻量 UI 组件库
- ECharts（趋势图）

### Backend

- Java 21 LTS
- Spring Boot 3.x
- Spring Web
- Spring Validation
- Spring Data JPA 或 MyBatis（优先选择团队/项目中更容易维护的一种）
- Google Ads API Java Client

### Database

- MySQL 8.x

### Deployment

- Docker
- Docker Compose
- 第一版支持本地运行；稳定后可部署到个人云服务器。

## 3. 模块划分

```text
backend
├── keyword
│   ├── controller
│   ├── service
│   ├── domain
│   └── repository
├── googleads
│   ├── client
│   ├── service
│   └── config
├── research
├── ai                 # 第二阶段
├── common
└── config
```

## 4. API 设计原则

前端不能直接调用 Google Ads API。

原因：

- OAuth credential 不应暴露给浏览器。
- Developer Token 不应暴露给浏览器。
- Google API 调用需要统一限流、错误处理和缓存。

所有 Google Ads API 调用由后端完成。

## 5. 核心后端接口

第一版建议提供：

```text
POST /api/keywords/historical-metrics
POST /api/keywords/ideas
GET  /api/researches
POST /api/researches
GET  /api/researches/{id}
PUT  /api/researches/{id}
DELETE /api/researches/{id}
```

具体 request/response schema 在 API 文档中定义。

## 6. 查询流程

```text
用户输入关键词
      |
      v
Backend 参数校验
      |
      v
标准化关键词（trim / 去重）
      |
      v
检查缓存
   /       \
命中       未命中
 |           |
返回       Google Ads API
             |
             v
          保存/缓存
             |
             v
          返回前端
```

## 7. 缓存策略

Google Keyword Planner 历史指标不是实时股票行情，因此不需要每次重复请求。

建议第一版按以下维度建立缓存键：

```text
keyword + geo + language + date_range + metric_type
```

默认允许重复查询命中缓存。

用户主动刷新时可以提供“强制刷新”能力，但必须受到 API quota 控制。

## 8. 安全

Google Ads OAuth credentials、Developer Token、refresh token 等全部通过环境变量或 Secret 管理。

禁止：

- 提交到 GitHub
- 写入前端源码
- 写入 README 示例中的真实 secret
- 打印完整 token 到日志

`.env` 必须加入 `.gitignore`。

## 9. 错误处理

必须区分：

- 参数错误
- Google OAuth 错误
- Google Ads API 权限错误
- quota/rate limit
- Google API 临时错误
- 网络错误
- 数据不存在
- 系统内部错误

用户界面应展示可理解的错误信息；日志中保留技术错误详情。

## 10. 可测试性

核心业务逻辑不得强依赖真实 Google API 才能测试。

Google Ads client 应通过接口/adapter 隔离，以便：

- 单元测试使用 mock
- 集成测试可使用测试账号
- 本地开发可使用 fixture/mock 数据

## 11. 第一阶段不做的架构

不做：

- 微服务
- Kubernetes
- Redis 集群
- 消息队列
- 多租户
- 复杂权限系统
- 独立搜索引擎

这些技术只有在真实需求出现后再引入。
