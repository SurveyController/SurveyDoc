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

`Parse`、`DefaultConfig`、`Submit`、`Run`、`RunWithEvents` 和 `RunResults` 接受 `context.Context`。取消后不再安排新提交，并等待已开始的平台请求返回。事件回调可能来自工作 goroutine，回调实现必须自行保证并发安全。

`Submit` 使用 `surveycore.SubmissionRequest`，其中 `Config` 是 `*model.RunRequest`，`Survey` 是可选的 `*model.SurveyDefinition`。它固定提交一次并返回 `SubmissionResult`；失败时同时返回可用 `errors.Is` 或 `ClassifySubmissionError` 判断的错误。参数中的目标数、并发数和提交间隔不会触发额外提交。

`RunResults` 返回 `iter.Seq2[SubmissionResult, error]`，按完成顺序产生结果，尝试编号从 1 开始。单次失败保存在结果的 `error` 中，迭代继续；准备失败或调用方取消通过迭代错误返回。提前 `break` 会取消未完成的请求并等待工作线程退出。`Run` 和 `RunWithEvents` 返回汇总，存在失败时在运行结束后返回首个错误；`RunWithEvents` 的 `event.Result` 包含逐次结果。

批量运行以 `target` 为尝试次数，受 `threads` 并发限制，不自动重试。第 2 次起，每次尝试开始前均在并发槽内等待 `submitInterval` 范围内的随机秒数。显式 `failStop`、停止操作或取消可以使运行提前结束。Python v1 配置导入时 `failStop` 为 false。

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
7. 调 `GET /api/v1/tasks/{id}/results` 分页读取逐次提交结果。

## 接口清单

| 方法 | 路径 | 作用 |
|---|---|---|
| `GET` | `/api/v1/health` | 健康检查。 |
| `GET` | `/api/v1/version` | 读取版本。 |
| `POST` | `/api/v1/surveys/parse` | 解析问卷。 |
| `POST` | `/api/v1/configs` | 生成默认运行配置。 |
| `POST` | `/api/v1/submissions` | 同步提交一次并返回结果。 |
| `POST` | `/api/v1/tasks` | 创建任务。 |
| `GET` | `/api/v1/tasks` | 查询任务列表。 |
| `GET` | `/api/v1/tasks/{id}` | 查询任务。 |
| `POST` | `/api/v1/tasks/{id}/stop` | 停止任务。 |
| `GET` | `/api/v1/tasks/{id}/logs` | 读取任务日志。 |
| `GET` | `/api/v1/tasks/{id}/results` | 读取逐次提交结果。 |
| `POST` | `/api/v1/qrcode/decode` | 解析二维码。 |
| `POST` | `/api/v1/proxy/session` | 激活官方代理会话。 |
| `GET` | `/api/v1/proxy/usage` | 查询官方代理余量。 |
| `POST` | `/api/v1/proxy/extract` | 提取官方代理。 |
| `POST` | `/api/v1/proxy/bonus` | 领取代理额度。 |
| `POST` | `/api/v1/proxy/redeem` | 兑换代理卡。 |
