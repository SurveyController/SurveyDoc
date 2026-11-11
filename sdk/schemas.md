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
| `userAgent` | `object` | 可选随机 User-Agent 配置，包含 `enabled` 和 `ratios`（`wechat`、`mobile`、`pc` 权重）。 |

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

## Python 配置导入

`POST /api/v1/tasks`、`config.DeserializeRunRequest()` 和 `config.Load()` 接受 `surveycore-py` 的 `serialize_config()` 输出（`schema_version: 1`）。`config.DeserializePythonConfig()` 可先转换为本地 `ConfigDocument`。保存时仍写入 Go 的 v2 格式。

| Python 字段 | Go 字段 |
|---|---|
| `url` / `provider` | `source.url` / `source.provider`；省略或为 null 的 provider 由运行层识别。 |
| `target` / `concurrency` | `execution.target` / `execution.threads`。 |
| `answer_duration` / `submit_interval` / `answer_datetime_window` | 对应 `execution` 中的三个时间范围；保留原始范围，包括 `[0, 0]`。 |
| `questions` / `answer_rules` | `answers.questions` / `answers.rules`；省略或为 null 的题号按配置顺序从 1 编号。 |
| `random_user_agent` / `user_agent_ratios` | `userAgent.enabled` / `userAgent.ratios`，本地 v2 文件保存在 `network`。 |
| `reliability_mode` / `target_alpha` | `psychometrics.enabled` / `psychometrics.targetAlpha`。 |

题目中的 `probabilities` 和 `custom_weights` 接受 Python 的数字、数组、矩阵数组或 null，转换为 Go 的 `WeightTable`。选择题的 null 或 `-1` 表示随机；多选权重保留 0–100 数值。支持其余 Go 已有的题目策略字段，并拒绝未知字段。

默认目标数和并发数都是 1，作答时长为 `[60, 120]`，间隔为 `[0, 0]`，信效度开关为 true、目标 alpha 为 0.85，随机 User-Agent 默认关闭。Python 序列化格式不包含 `answer_generator` 或题目 `ai_enabled`，导入会拒绝这些字段。

这一兼容入口用于配置导入。任务仍使用 Go 的重试、间隔和结果返回规则；Python 的逐次提交结果接口另行对齐。
