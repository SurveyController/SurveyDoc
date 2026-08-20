---
outline: deep
---

# SDK 接口说明

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
  "version": "1.0.0"
}
```

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

## 创建任务

```http
POST /api/v1/tasks
Content-Type: application/json
```

请求体必须使用 `RunRequest` 的嵌套结构。建议先获取默认配置，再修改目标数和并发数：

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

`202` 只代表任务已经创建。

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
