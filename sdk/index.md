---
outline: deep
---

# SDK

这里说明如何用 [SurveyCore](https://github.com/SurveyController/SurveyCore) 来创建和管理问卷提交任务。

## 文档结构

| 页面 | 内容 |
|---|---|
| [接口说明](./api) | 每个接口的请求体、请求头、返回示例。 |
| [数据结构](./schemas) | 任务配置、题目配置、题目信息、任务状态。 |
| [错误处理](./errors) | HTTP 状态码、错误返回、排查方式。 |
| [调用示例](./examples) | JavaScript、Python 接入示例。 |

## 调用约定

### 通用请求头

读取接口：

```http
Accept: application/json
```

提交 JSON：

```http
Content-Type: application/json
Accept: application/json
```

上传二维码：

```http
Content-Type: multipart/form-data
Accept: application/json
```

`multipart/form-data` 的 `boundary` 通常由 HTTP 客户端自动生成，不建议手写。

当前接口没有鉴权逻辑。不要传 `Authorization`、`X-API-Key` 之类字段来猜。

### 返回格式

成功时返回 JSON。

失败时统一返回：

```json
{
  "error": "错误原因",
  "code": "validation_error",
  "message": "错误原因",
  "detail": "调试详情"
}
```

客户端应优先看 HTTP 状态码和 `code`。

## 推荐接入流程

1. 调 `GET /api/health` 检查服务是否启动。
2. 调 `POST /api/configs` 生成默认配置。
3. 修改返回配置里的目标份数、并发数、题目答案比例等字段。
4. 调 `POST /api/tasks` 创建任务。
5. 调 `GET /api/tasks/{id}` 查询任务状态。
6. 调 `GET /api/tasks/{id}/logs` 分页读取日志。
7. 需要停止时调 `POST /api/tasks/{id}/stop`。

## 接口清单

| 方法 | 路径 | 作用 |
|---|---|---|
| `GET` | `/api/health` | 健康检查。 |
| `GET` | `/api/version` | 读取服务版本号。 |
| `POST` | `/api/surveys/parse` | 解析问卷链接。 |
| `POST` | `/api/configs` | 生成默认运行配置。 |
| `POST` | `/api/tasks` | 创建提交任务。 |
| `GET` | `/api/tasks` | 查询任务列表。 |
| `GET` | `/api/tasks/{id}` | 查询单个任务。 |
| `POST` | `/api/tasks/{id}/stop` | 停止任务。 |
| `GET` | `/api/tasks/{id}/logs` | 分页读取任务日志。 |
| `POST` | `/api/qrcode/decode` | 解析二维码图片里的问卷链接。 |
