# 开发计划

## Phase 0：账号与 API 能力验证

目标：先确认 Google Ads API 可以被真实调用。

任务：

1. 准备 Google Ads / Google Cloud 环境
2. 获取所需 OAuth credentials
3. 获取 Developer Token / 对应 access level
4. 配置 customer ID
5. 完成一个 historical metrics smoke test
6. 验证 keyword ideas 能力
7. 将真实 credentials 放入本地环境，不提交 Git

验收：可以对一个关键词返回真实 Google historical metrics。

## Phase 1：MVP

目标：完成个人关键词研究工作台。

### 后端

- Spring Boot 项目初始化
- 配置 MySQL
- Google Ads gateway
- Keyword historical metrics service
- Keyword ideas service
- 缓存
- REST API
- 参数校验
- 错误处理
- 单元测试

### 前端

- Vue 项目初始化
- 关键词输入
- 国家/语言选择
- 查询按钮
- 结果表格
- 趋势图
- 筛选/排序
- 研究记录

### DevOps

- Dockerfile
- docker-compose
- `.env.example`
- README 本地启动说明

## Phase 2：研究效率增强

- CSV 导入
- CSV 导出
- 关键词批量管理
- 研究项目管理
- 标签
- 备注
- 收藏
- 更好的趋势比较

## Phase 3：AI 机会分析

- 搜索意图分析
- 商业意图分析
- 用户画像推断
- 产品方向建议
- 收费模式建议
- 机会评分
- AI 研究报告

## Phase 4：完整海外需求发现

未来再考虑接入：

- 搜索结果/SERP 数据
- 竞品网站信息
- Reddit 等社区需求
- Product Hunt 等产品信息
- 网站流量/SEO 数据
- 产品价格
- AI 自动生成 MVP 需求

这些不属于 MVP，不提前开发。

## 开发规则

每个 Phase 完成后必须：

1. 运行测试
2. 检查日志
3. 更新文档
4. 更新 TODO
5. 验证已有功能没有回归

Codex 不应跨 Phase 擅自扩大范围。
