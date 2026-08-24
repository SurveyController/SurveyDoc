---
outline: deep
---

# REST API 错误处理

失败响应统一包含稳定错误码和详情：

```json
{
  "code": "invalid_json",
  "message": "json: unknown field \"target\"",
  "detail": "json: unknown field \"target\""
}
```

客户端先判断 HTTP 状态码，再读取 `code`。`message` 和 `detail` 当前内容相同。

## 状态码

| 状态码 | 错误码 | 含义 |
|---|---|---|
| `200` | - | 请求成功。 |
| `202` | - | 任务已经创建。 |
| `400` | `invalid_json` | JSON 无效、包含未知字段或存在多个 JSON 值。 |
| `400` | `invalid_request` | multipart 请求无效或缺少文件。 |
| `400` | `invalid_query` | 查询参数不是非负整数。 |
| `404` | `not_found` | 任务不存在。 |
| `422` | `validation_error` | 任务保存失败或二维码内容不是有效问卷链接。 |
| `500` | `internal_error` | 停止任务或读取日志时发生内部错误。 |
| `502` | `upstream_error` | 问卷或官方代理上游请求失败。 |

## 接口错误速查

| 接口 | 可能状态码 |
|---|---|
| `POST /api/v1/surveys/parse` | `400`、`502` |
| `POST /api/v1/configs` | `400`、`502` |
| `POST /api/v1/tasks` | `400`、`422` |
| `GET /api/v1/tasks/{id}` | `404` |
| `POST /api/v1/tasks/{id}/stop` | `404`、`500` |
| `GET /api/v1/tasks/{id}/logs` | `400`、`404`、`500` |
| `POST /api/v1/qrcode/decode` | `400`、`422` |
| `/api/v1/proxy/*` | `400`、`502` |

## 注意事项

- JSON 接口会拒绝未知字段。V1 任务请求必须使用 `source`、`definition`、`execution`、`answers`、`reverseFill` 和 `psychometrics` 结构。
- 二维码上传字段名是 `file`。
- `202` 不代表提交成功。继续查询任务状态和日志。
- 任务运行期配置错误会写入任务的 `error` 字段，并把状态改成 `failed`。
