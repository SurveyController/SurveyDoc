---
outline: deep
---

# SDK 接口说明

各接口的完整错误处理见 [错误处理](./errors)。

## 健康检查

```http
GET /api/health
```

### 请求头

```http
Accept: application/json
```

### 请求示例

```bash
curl http://localhost:19178/api/health
```

### 返回示例

```json
{
  "status": "ok"
}
```

## 读取版本

```http
GET /api/version
```

### 请求头

```http
Accept: application/json
```

### 请求示例

```bash
curl http://localhost:19178/api/version
```

### 返回示例

```json
{
  "version": "0.1.0"
}
```

## 解析问卷

```http
POST /api/surveys/parse
```

只解析问卷结构，不创建任务，也不会提交答案。

### 请求头

```http
Content-Type: application/json
Accept: application/json
```

### 请求体

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `url` | `string` | 是 | 问卷链接。不能为空。 |

### 请求示例

```bash
curl -X POST http://localhost:19178/api/surveys/parse \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://www.wjx.cn/vm/example.aspx\"}"
```

### 返回示例

```json
{
  "provider": "wjx",
  "title": "用户满意度调查",
  "questions": [
    {
      "num": 1,
      "title": "你的性别是？",
      "type_code": "3",
      "options": 2,
      "option_texts": ["男", "女"],
      "provider": "wjx",
      "provider_question_id": "q1",
      "required": true
    }
  ]
}
```

### 错误示例

```json
{
  "error": "url 不能为空"
}
```

## 生成默认配置

```http
POST /api/configs
```

这是最适合 SDK 接入的入口。它会返回可直接修改后提交的运行配置。

传入问卷链接时，服务会先解析问卷，再补齐 `questions_info` 和 `question_entries`。

不想解析问卷，只想拿空模板，也要传 JSON：

```json
{
  "url": ""
}
```

### 请求头

```http
Content-Type: application/json
Accept: application/json
```

### 请求体

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx"
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `url` | `string` | 否 | 问卷链接。为空时返回空模板。 |

### 返回示例

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx",
  "survey_title": "用户满意度调查",
  "survey_provider": "wjx",
  "target": 1,
  "threads": 1,
  "answer_duration": [60, 120],
  "proxy_source": "default",
  "random_ua_keys": ["wechat", "mobile", "pc"],
  "random_ua_ratios": {
    "wechat": 33,
    "mobile": 33,
    "pc": 34
  },
  "fail_stop_enabled": true,
  "pause_on_aliyun_captcha": true,
  "reliability_mode_enabled": true,
  "psycho_target_alpha": 0.85,
  "ai_mode": "free",
  "ai_provider": "deepseek",
  "ai_api_protocol": "auto",
  "reverse_fill_format": "auto",
  "reverse_fill_start_row": 1,
  "reverse_fill_threads": 1,
  "question_entries": [
    {
      "question_type": "single",
      "probabilities": -1,
      "rows": 1,
      "option_count": 2,
      "distribution_mode": "random",
      "question_num": 1,
      "question_title": "你的性别是？",
      "survey_provider": "wjx",
      "provider_question_id": "q1"
    }
  ],
  "questions_info": [
    {
      "num": 1,
      "title": "你的性别是？",
      "type_code": "3",
      "options": 2,
      "option_texts": ["男", "女"],
      "provider": "wjx",
      "provider_question_id": "q1"
    }
  ]
}
```

## 创建任务

```http
POST /api/tasks
```

创建任务后会异步运行。`202` 只表示任务已经进入队列，不表示已经提交完成。

更稳的方式是先调用 `POST /api/configs`，修改返回配置，再整体传给本接口。

### 请求头

```http
Content-Type: application/json
Accept: application/json
```

### 最小请求体

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx",
  "target": 10,
  "threads": 2
}
```

完整字段见 [数据结构](./schemas#runtimeconfig)。

### 请求示例

```bash
curl -X POST http://localhost:19178/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"url\":\"https://www.wjx.cn/vm/example.aspx\",\"target\":10,\"threads\":2}"
```

### 返回示例

```json
{
  "task_id": "9f4c6b2b1a2d4e9f",
  "status": "pending"
}
```

## 查询任务列表

```http
GET /api/tasks
```

按创建时间倒序返回。

### 请求头

```http
Accept: application/json
```

### 返回示例

```json
{
  "tasks": [
    {
      "id": "9f4c6b2b1a2d4e9f",
      "status": "running",
      "config": {
        "url": "https://www.wjx.cn/vm/example.aspx",
        "target": 10,
        "threads": 2
      },
      "state": {
        "cur_num": 3,
        "cur_fail": 0,
        "thread_progress": {
          "Worker-1": {
            "thread_name": "Worker-1",
            "thread_index": 0,
            "success_count": 2,
            "fail_count": 0,
            "status_text": "提交成功",
            "running": true,
            "last_update_ts": 1760000000
          }
        }
      },
      "created_at": "2026-05-31T10:00:00+08:00",
      "started_at": "2026-05-31T10:00:01+08:00"
    }
  ]
}
```

## 查询单个任务

```http
GET /api/tasks/{id}
```

### 路径参数

| 参数 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 任务 ID。来自 `POST /api/tasks` 的 `task_id`。 |

### 请求示例

```bash
curl http://localhost:19178/api/tasks/9f4c6b2b1a2d4e9f
```

### 返回示例

```json
{
  "id": "9f4c6b2b1a2d4e9f",
  "status": "succeeded",
  "config": {
    "url": "https://www.wjx.cn/vm/example.aspx",
    "target": 10,
    "threads": 2
  },
  "state": {
    "cur_num": 10,
    "cur_fail": 1,
    "terminal_stop_category": "",
    "terminal_failure_reason": "",
    "terminal_stop_message": "",
    "thread_progress": {}
  },
  "created_at": "2026-05-31T10:00:00+08:00",
  "started_at": "2026-05-31T10:00:01+08:00",
  "finished_at": "2026-05-31T10:02:30+08:00"
}
```

## 停止任务

```http
POST /api/tasks/{id}/stop
```

停止不存在的任务会返回 `404`。

任务已经结束时，接口仍会返回任务当前状态。

### 请求示例

```bash
curl -X POST http://localhost:19178/api/tasks/9f4c6b2b1a2d4e9f/stop
```

### 返回示例

```json
{
  "id": "9f4c6b2b1a2d4e9f",
  "status": "stopped",
  "config": {
    "url": "https://www.wjx.cn/vm/example.aspx",
    "target": 10,
    "threads": 2
  },
  "stop_message": "用户请求停止",
  "created_at": "2026-05-31T10:00:00+08:00"
}
```

## 读取任务日志

```http
GET /api/tasks/{id}/logs
```

### 查询参数

| 参数 | 类型 | 默认值 | 说明 |
|---|---|---|---|
| `after` | `number` | `0` | 只返回日志 ID 大于该值的记录。 |
| `limit` | `number` | `200` | 返回条数。范围 `1` 到 `1000`。 |

### 请求示例

```bash
curl "http://localhost:19178/api/tasks/9f4c6b2b1a2d4e9f/logs?after=0&limit=100"
```

下一页请求：

```bash
curl "http://localhost:19178/api/tasks/9f4c6b2b1a2d4e9f/logs?after=12&limit=100"
```

其中 `12` 来自上一页返回的 `next_cursor`。

### 返回示例

```json
{
  "logs": [
    {
      "id": 1,
      "timestamp": "2026-05-31T10:00:00+08:00",
      "level": "INFO",
      "message": "任务已创建",
      "fields": {
        "task_id": "9f4c6b2b1a2d4e9f"
      }
    },
    {
      "id": 2,
      "timestamp": "2026-05-31T10:00:01+08:00",
      "level": "INFO",
      "message": "开始执行",
      "event": {
        "ThreadName": "Worker-1",
        "StatusText": "提交成功",
        "Success": true,
        "Fail": false,
        "Current": 1,
        "Total": 10,
        "Timestamp": "2026-05-31T10:00:01+08:00"
      }
    }
  ],
  "next_cursor": 2,
  "has_more": false
}
```

`event` 字段来自 Go 结构体，目前没有 JSON 标签，所以返回字段是大写驼峰。

## 解析二维码

```http
POST /api/qrcode/decode
```

上传字段名必须是 `image`。

### 请求头

```http
Content-Type: multipart/form-data
Accept: application/json
```

### 请求体

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `image` | `file` | 是 | 二维码图片文件。 |

### 请求示例

```bash
curl -X POST http://localhost:19178/api/qrcode/decode \
  -F "image=@D:/Downloads/survey-qrcode.png"
```

### 返回示例

```json
{
  "url": "https://www.wjx.cn/vm/example.aspx"
}
```

### 错误示例

```json
{
  "error": "缺少 image 文件"
}
```
