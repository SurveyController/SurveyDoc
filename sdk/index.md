---
outline: deep
---

# SDK

SurveyCore 只提供 `/api/v1/*` 接口。JSON 请求会拒绝未知字段。

## 文档结构

| 页面 | 内容 |
|---|---|
| [接口说明](./api) | 路由、请求体和返回值。 |
| [数据结构](./schemas) | `RunRequest`、题目策略和任务结构。 |
| [错误处理](./errors) | 状态码和错误码。 |
| [调用示例](./examples) | JavaScript、Python 示例。 |

## 调用约定

JSON 接口使用：

```http
Content-Type: application/json
Accept: application/json
```

二维码接口使用 `multipart/form-data`，文件字段名为 `file`。

失败响应统一包含：

```json
{
  "code": "validation_error",
  "message": "错误详情",
  "detail": "错误详情"
}
```

客户端先判断 HTTP 状态码，再读取 `code`。

## 推荐流程

1. 调 `GET /api/v1/health` 检查服务。
2. 调 `POST /api/v1/configs` 生成 `RunRequest`。
3. 修改 `execution`、`answers` 等配置。
4. 调 `POST /api/v1/tasks` 创建任务。
5. 调 `GET /api/v1/tasks/{id}` 查询状态。
6. 调 `GET /api/v1/tasks/{id}/logs` 读取日志。

## 接口清单

| 方法 | 路径 | 作用 |
|---|---|---|
| `GET` | `/api/v1/health` | 健康检查。 |
| `GET` | `/api/v1/version` | 读取版本。 |
| `POST` | `/api/v1/surveys/parse` | 解析问卷。 |
| `POST` | `/api/v1/configs` | 生成默认运行配置。 |
| `POST` | `/api/v1/tasks` | 创建任务。 |
| `GET` | `/api/v1/tasks` | 查询任务列表。 |
| `GET` | `/api/v1/tasks/{id}` | 查询任务。 |
| `POST` | `/api/v1/tasks/{id}/stop` | 停止任务。 |
| `GET` | `/api/v1/tasks/{id}/logs` | 读取任务日志。 |
| `POST` | `/api/v1/qrcode/decode` | 解析二维码。 |
| `POST` | `/api/v1/proxy/session` | 激活官方代理会话。 |
| `GET` | `/api/v1/proxy/usage` | 查询官方代理余量。 |
| `POST` | `/api/v1/proxy/extract` | 提取官方代理。 |
| `POST` | `/api/v1/proxy/bonus` | 领取代理额度。 |
| `POST` | `/api/v1/proxy/redeem` | 兑换代理卡。 |
