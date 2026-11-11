---
outline: deep
---

# REST API 接口说明

基础地址为 `http://127.0.0.1:19178`。服务只注册 `/api/v1/*` 路由。

## 健康检查

```http
GET /api/v1/health
```

```json
{
  "status": "ok"
}
```

## 读取版本

```http
GET /api/v1/version
```

```json
{
  "version": "dev"
}
```

版本值由构建参数注入；未注入时为 `dev`。

## 解析问卷

```http
POST /api/v1/surveys/parse
Content-Type: application/json
```

只解析问卷结构，不创建任务，也不提交答案。

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx"
}
```

成功时返回 `SurveyDefinition`：

```json
{
  "provider": "wjx",
  "title": "用户满意度调查",
  "questions": []
}
```

## 生成默认配置

```http
POST /api/v1/configs
Content-Type: application/json
```

传入链接时先解析问卷，再生成题目策略。`url` 为空时返回空模板。

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx"
}
```

返回值是可直接提交给任务接口的 `RunRequest`：

```json
{
  "source": {
    "url": "https://www.wjx.cn/vm/example.aspx",
    "provider": "wjx"
  },
  "definition": {
    "provider": "wjx",
    "title": "用户满意度调查",
    "questions": []
  },
  "execution": {
    "target": 1,
    "threads": 1,
    "submitInterval": [0, 0],
    "answerDuration": [60, 120],
    "failStop": true,
    "pauseOnAliyunCaptcha": true
  },
  "answers": {
    "rules": [],
    "dimensions": [],
    "questions": []
  },
  "reverseFill": {
    "enabled": false,
    "format": "auto",
    "startRow": 1,
    "threads": 1
  },
  "psychometrics": {
    "enabled": true,
    "targetAlpha": 0.85
  }
}
```

完整字段见 [数据结构](./schemas#runrequest)。

## 单次提交

```http
POST /api/v1/submissions
Content-Type: application/json
```

`config` 接受 Go 的 `RunRequest` 或 Python 的 `schema_version: 1` 配置。可选的 `survey` 使用 `/api/v1/surveys/parse` 返回的结构，提供时覆盖配置中的问卷快照，平台必须一致。

```json
{
  "config": {
    "schema_version": 1,
    "url": "https://www.wjx.cn/vm/example.aspx",
    "questions": [
      {"question_type": "single", "probabilities": [0, 1]}
    ]
  }
}
```

接口同步执行一次并返回 `SubmissionResult`，不创建持久化任务。目标数和并发数固定为 1，不等待任务提交间隔，不自动重试提交。省略题目策略时自动生成默认策略。耗时包含本次解析、准备和平台请求。

```json
{
  "attempt": 0,
  "provider": "wjx",
  "success": true,
  "elapsed_seconds": 0.125,
  "error": null
}
```

开始执行后的平台、解析或准备失败返回 `200`，结果为 `success: false`，`error` 包含失败详情。JSON 格式或字段错误返回 `400 invalid_json`；缺少链接、不支持的平台或平台不一致返回 `422 validation_error`。客户端需检查 `success` 判断提交结果。

## 创建任务

```http
POST /api/v1/tasks
Content-Type: application/json
```

请求体接受 `RunRequest` 的嵌套结构，或 `surveycore-py` 导出的 `schema_version: 1` 配置。Python 配置会转换为 `RunRequest` 后创建任务，任务响应中的 `config` 使用 Go 的嵌套结构。字段映射见 [Python 配置导入](./schemas#python-配置导入)。

使用嵌套结构时，建议先获取默认配置，再修改目标数和并发数：

```json
{
  "source": {
    "url": "https://www.wjx.cn/vm/example.aspx",
    "provider": "wjx"
  },
  "definition": {
    "provider": "wjx",
    "title": "",
    "questions": []
  },
  "execution": {
    "target": 10,
    "threads": 2,
    "submitInterval": [0, 0],
    "answerDuration": [60, 120],
    "failStop": true,
    "pauseOnAliyunCaptcha": true
  },
  "answers": {},
  "reverseFill": {
    "enabled": false,
    "format": "auto",
    "startRow": 1,
    "threads": 1
  },
  "psychometrics": {
    "enabled": true,
    "targetAlpha": 0.85
  }
}
```

成功时返回 `202` 和完整任务对象：

```json
{
  "id": "9f4c6b2b1a2d4e9f",
  "status": "pending",
  "config": {},
  "created_at": "2026-08-20T10:00:00+08:00"
}
```

`202` 代表任务已经创建。任务独立于创建请求运行，响应结束或客户端断开不会取消已创建的任务。使用停止接口取消任务，服务关闭时也会停止运行中的任务。

目标数表示尝试次数，失败保留结果并继续后续尝试，不自动重试。第 2 次起，每次尝试开始前在并发槽内等待配置中的随机提交间隔。显式启用 `execution.failStop` 时，连续失败达到阈值可提前结束。存在单次失败时最终状态为 `failed`，已完成次数见汇总和逐次结果。

## 查询任务

```http
GET /api/v1/tasks
GET /api/v1/tasks/{id}
```

列表接口返回：

```json
{
  "tasks": []
}
```

单任务接口返回 `Task`。不存在时返回 `404 not_found`。

## 停止任务

```http
POST /api/v1/tasks/{id}/stop
```

返回停止后的 `Task`。已结束的任务保持原状态。

停止操作会取消运行中的平台请求。工作线程退出后更新 `finished_at` 和汇总；取消中的请求不计为失败，也不产生逐次结果。

## 读取任务日志

```http
GET /api/v1/tasks/{id}/logs?after=0&limit=200
```

| 参数 | 默认值 | 说明 |
|---|---|---|
| `after` | `0` | 只返回 ID 大于该值的日志。必须是非负整数。 |
| `limit` | `200` | 返回条数。`0` 使用默认值，大于 `1000` 时按 `1000` 处理。 |

```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2026-08-20T10:00:00+08:00",
      "level": "INFO",
      "message": "任务已创建"
    }
  ],
  "next_cursor": 1,
  "has_more": false
}
```

## 读取逐次提交结果

```http
GET /api/v1/tasks/{id}/results?after=0&limit=200
```

`after` 为非负游标，初次传 0，后续使用上一页的 `next_cursor`。游标使用底层日志 ID，不能用尝试编号推算。`limit` 默认 200，0 使用默认值，超过 1000 按 1000 处理；负数或非法参数返回 `400 invalid_query`，任务不存在返回 `404 not_found`。

```json
{
  "results": [
    {"attempt": 2, "provider": "wjx", "success": true, "elapsed_seconds": 0.8, "error": null},
    {"attempt": 1, "provider": "wjx", "success": false, "elapsed_seconds": 1.2, "error": "提交失败"}
  ],
  "next_cursor": 16,
  "has_more": false
}
```

结果按完成记录顺序返回，`attempt` 从 1 开始，因此并发运行时编号可能乱序。每次失败单独保留 `error`。批量耗时不含公共准备和提交间隔。结果保存在 SQLite 任务日志中，服务重启后仍可读取；升级前未记录的逐次结果不会补生成。

空页返回 `results: []` 并保留请求游标。`has_more` 只表示当前还有已存储结果；任务运行期间为 false 时，可沿用游标继续轮询，并通过任务状态判断是否结束。任务日志接口中的完成事件也包含 `event.result`。

## 解析二维码

```http
POST /api/v1/qrcode/decode
Content-Type: multipart/form-data
```

上传字段名必须是 `file`。

```bash
curl -X POST http://127.0.0.1:19178/api/v1/qrcode/decode \
  -F "file=@D:/Downloads/survey-qrcode.png"
```

成功时返回：

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx"
}
```

## 官方代理接口

| 方法 | 路径 | 请求体 |
|---|---|---|
| `POST` | `/api/v1/proxy/session` | 无。激活试用会话。 |
| `GET` | `/api/v1/proxy/usage` | 无。 |
| `POST` | `/api/v1/proxy/extract` | `minute`、`pool`、`area`、`num`、`upstream`。 |
| `POST` | `/api/v1/proxy/bonus` | `{"code":"兑换码"}`。 |
| `POST` | `/api/v1/proxy/redeem` | `{"code":"卡密"}`。 |

代理上游失败时返回 `502 upstream_error`。
