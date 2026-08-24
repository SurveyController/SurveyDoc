---
outline: deep
---

# SurveyCore SDK

SurveyCore 同时提供实验版 Go SDK 和 `/api/v1/*` REST API。当前只发布 commit pseudo-version，不提供稳定版标签，也暂不承诺 Go 1 兼容。

## Go SDK

```bash
go get github.com/SurveyController/SurveyCore@<commit>
```

`pkg/surveycore` 只负责解析、默认配置和运行。公共结构在 `pkg/surveycore/model`。低层执行、代理和本地配置能力分别在实验性的 `pkg/surveycore/runtime`、`pkg/surveycore/proxy`、`pkg/surveycore/config`。

`Parse`、`DefaultConfig`、`Run` 和 `RunWithEvents` 接受 `context.Context`。取消后不再安排新提交，并等待已开始的平台请求返回。事件回调可能来自工作 goroutine，回调实现必须自行保证并发安全。

错误可用 `errors.Is` 判断 `ErrInvalidConfig`、`ErrParseFailed`、`ErrPrepareConfigFailed`、`ErrRunFailed` 和 `ErrUnsupportedOperation`，也可用 `ClassifyRunError` 获取稳定分类。

## 文档结构

| 页面 | 内容 |
|---|---|
| [接口说明](./api) | REST 路由、请求体和返回值。 |
| [数据结构](./schemas) | `RunRequest`、题目策略和任务结构。 |
| [错误处理](./errors) | 状态码和错误码。 |
| [调用示例](./examples) | Go SDK 与 REST 客户端示例。 |

## REST 调用约定

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
