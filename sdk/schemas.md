---
outline: deep
---

# REST API 数据结构

## RunRequest

`POST /api/v1/configs` 返回 `RunRequest`。`POST /api/v1/tasks` 接收同一结构。

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
    "target": 10,
    "threads": 2,
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

| 字段 | 类型 | 说明 |
|---|---|---|
| `source.url` | `string` | 问卷链接。创建任务时不能为空。 |
| `source.provider` | `string` | `wjx`、`qq` 或 `credamo`。 |
| `definition` | `SurveyDefinition` | 解析得到的问卷快照。 |
| `execution.target` | `integer` | 目标提交份数。 |
| `execution.threads` | `integer` | 并发数。 |
| `execution.submitInterval` | `[integer, integer]` | 每个工作线程两次提交之间的随机等待秒数。 |
| `execution.answerDuration` | `[integer, integer]` | 作答时长范围，单位秒。 |
| `execution.answerDatetimeWindow` | `[string, string]` | 可选作答时间窗口。 |
| `execution.failStop` | `boolean` | 连续失败达到阈值时停止。 |
| `execution.pauseOnAliyunCaptcha` | `boolean` | 遇到阿里云验证码时暂停。 |
| `answers.rules` | `ConsistencyRule[]` | 条件一致性规则。 |
| `answers.dimensions` | `string[]` | 心理测量维度。 |
| `answers.questions` | `QuestionStrategy[]` | 每道题的答案策略。 |
| `reverseFill` | `ReverseFillPlan` | Excel 反填配置。 |
| `psychometrics` | `PsychometricPolicy` | 信效度配置。 |

## QuestionStrategy

| 字段 | 类型 | 说明 |
|---|---|---|
| `question_type` | `string` | `single`、`multiple`、`dropdown`、`scale`、`matrix`、`order`、`slider`、`text` 或 `multi_text`。 |
| `probabilities` | `WeightTable` | 选项或矩阵行权重。 |
| `custom_weights` | `WeightTable` | 自定义分布权重。 |
| `texts` | `string[]` | 填空候选值。 |
| `rows` | `integer` | 矩阵行数。 |
| `option_count` | `integer` | 选项数。 |
| `distribution_mode` | `string` | `random`、`custom` 或 `reverse_fill`。 |
| `question_num` | `integer` | 题号。 |
| `question_title` | `string` | 题目标题。 |
| `survey_provider` | `string` | 平台名。 |
| `provider_question_id` | `string` | 平台题目 ID。 |
| `provider_page_id` | `string` | 平台页面 ID。 |
| `ai_enabled` | `boolean` | 用服务端 AI 配置生成填空答案。 |
| `option_fill_texts` | `(string \| null)[]` | 选项附加填空值。 |
| `fillable_option_indices` | `integer[]` | 可填空选项下标。 |
| `attached_option_selects` | `object[]` | 选项附加下拉配置。 |
| `is_location` | `boolean` | 是否为地址题。 |
| `location_parts` | `string[]` | 地址组成。 |
| `multi_text_blank_modes` | `string[]` | 多项填空生成模式。 |
| `multi_text_blank_ai_flags` | `boolean[]` | 多项填空 AI 开关。 |
| `multi_text_blank_int_ranges` | `integer[][]` | 多项填空整数范围。 |
| `text_random_mode` | `string` | `none`、`name`、`mobile`、`id_card` 或 `integer`。 |
| `text_random_int_range` | `integer[]` | 随机整数范围。 |
| `dimension` | `string` | 心理测量维度。 |
| `psycho_bias` | `string` | 心理量表方向。 |

`WeightTable` 的单选权重写法：

```json
{
  "options": [0.7, 0.3]
}
```

矩阵权重写法：

```json
{
  "rows": [
    [0.2, 0.8],
    [0.6, 0.4]
  ]
}
```

## SurveyDefinition

| 字段 | 类型 | 说明 |
|---|---|---|
| `provider` | `string` | 问卷平台。 |
| `title` | `string` | 问卷标题。 |
| `questions` | `QuestionMeta[]` | 题目元数据。 |

`QuestionMeta` 包含题号、题型、选项、分页、必填状态、显示逻辑、跳题逻辑、媒体和平台原始 ID。字段名以 `POST /api/v1/surveys/parse` 返回值为准。

## Task

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | `string` | 任务 ID。 |
| `status` | `string` | `pending`、`running`、`succeeded`、`failed`、`stopped` 或 `interrupted`。 |
| `config` | `RunRequest` | 任务配置快照。 |
| `result` | `RunResult` | 成功数、失败数、停止状态和线程进度。 |
| `created_at` | `string` | 创建时间。 |
| `started_at` | `string` | 开始时间。 |
| `finished_at` | `string` | 结束时间。 |
| `error` | `string` | 失败详情。 |
| `stop_message` | `string` | 停止原因。 |

## 本地配置文件

`configs/example.json` 使用 `schemaVersion: 2` 的 `ConfigDocument`。它包含 `survey`、`execution`、`network`、`answers`、`reverseFill` 和 `psychometrics` 六个区段。该文件格式与 REST `RunRequest` 不是同一个 JSON 外壳。
