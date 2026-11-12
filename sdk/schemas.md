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
| `execution.target` | `integer` | 目标尝试次数，失败占一次，不自动重试。 |
| `execution.threads` | `integer` | 并发数。 |
| `execution.submitInterval` | `[integer, integer]` | 第 2 次起，每次尝试开始前在并发槽内随机等待的秒数范围，包括新工作线程的首次提交。 |
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
| `url` | `string` | 解析后的规范化链接；Go 字段名为 `SurveyURL`，手动构造旧快照时可省略。 |
| `questions` | `QuestionMeta[]` | 题目元数据。 |

`QuestionMeta` 包含题号、题型、选项、分页、必填状态、显示逻辑、跳题逻辑、媒体和平台原始 ID。字段名以 `POST /api/v1/surveys/parse` 返回值为准。

| 字段 | 类型 | 说明 |
|---|---|---|
| `num` / `display_num` | `integer` / `integer` 或 null | 原始题号及显示题号。腾讯说明题占用原始编号，说明题的显示编号为空。绑定答案时使用原始题号或平台 ID。 |
| `provider_type` | `string` | 平台原始题型。问卷星为 `"3"`、`"4"` 等代码，多级下拉为 `"multilevel_dropdown"`。运行层也继续接受旧快照中的 `single`、`multiple` 等名称。默认配置的 `answers.questions[].question_type` 仍使用统一题型。 |
| `provider_page_raw` | JSON 值 | 腾讯原始 `page`，或问卷星多级下拉的 `cid`、`submit_values`、`level_labels`；没有时为 null。Go 字段为 `any`，复制快照时会深拷贝嵌套元数据。 |
| `slider_min` / `slider_max` / `slider_step` | `number`、`string` 或 null | 解析时返回数字或 null，也接受旧 Go 快照中的字符串。Go 字段为 `any`。 |

Python `dataclasses.asdict(SurveyDefinition)` 可用于 HTTP 单次提交的 `survey`，或反序列化为 Go 的 `model.SurveyDefinition`。Go 额外保留每题的 `provider`；可选空集合可能省略。问卷星多级下拉按父子关系展开选项，显示文字与提交值分别保存；空的隐藏填空占位不会出现在题目列表中，提交时仍保留空位置。外部数据源及超过六级的层级数据会返回解析错误。

腾讯问卷未解析出明确逻辑时保留 `logic_parse_status: "unknown"`。支持 NPS（`nps`）、星级评分（`star`）和矩阵评分（`matrix_star`）。分数由 `star_begin_num` 与 `star_num` 生成，省略起点时 NPS 从 0 开始、星级及矩阵评分从 1 开始。默认策略中前两种使用 `score`，矩阵评分使用 `matrix`；提交时保留真实分值，0 分有效。空的显示条件及 `hidden: false` 不会阻止提交。

问卷星显示条件保留 `raw_relation`，并将 `题号,选项号` 转为从 0 开始的 `condition_option_indices`，同时为来源题目填充 `controls_display_targets`。空条件或 `-1` 不会生成显示约束。

## SubmissionRequest

单次提交使用 `{ "config": ..., "survey": ... }`。Go SDK 类型为 `surveycore.SubmissionRequest`。

| 字段 | 类型 | 说明 |
|---|---|---|
| `config` | `RunRequest` 或 Python v1 配置 | 必填。Go SDK 中为 `*model.RunRequest`，Python 配置可先用 `config.DeserializeRunRequest()` 导入。 |
| `survey` | `SurveyDefinition` 或 null | 可选问卷快照，覆盖 `config.definition`。省略时使用配置快照或平台解析结果。 |

`surveycore.SubmissionRequest` 是高层 SDK 输入。`model.SubmissionRequest` 仍是实验性的底层平台输入，使用 `Source`、`Definition` 和 `Context`。

## SubmissionResult

字段与 Python `SubmissionResult` 对齐。Go SDK 使用 `surveycore.SubmissionResult`，共享模型位于 `model.SubmissionResult`。

| 字段 | 类型 | 说明 |
|---|---|---|
| `attempt` | `integer` | 独立 `Submit` 调用固定为 0；批量运行从 1 开始编号，结果按完成顺序返回。 |
| `provider` | `string` | `wjx`、`qq` 或 `credamo`。 |
| `success` | `boolean` | 平台是否确认本次提交成功。 |
| `elapsed_seconds` | `number` | 单位秒。独立 `Submit` 包含解析与准备；批量结果仅计本次执行耗时，不含公共准备及提交间隔。 |
| `error` | `string` 或 null | 成功时显式返回 null，失败时返回详情。 |

Go 的 `Submit` 返回 `(result, error)`：缺少配置、链接或平台不兼容时 `result` 为 nil；执行失败时同时返回失败结果和带分类的错误。取消保留 `context.Canceled` 或 `context.DeadlineExceeded`。原始配置及问卷快照不会被修改。

`RunResults` 在单次失败时返回失败结果和 nil 迭代错误，继续后续尝试；准备失败或调用方取消返回迭代错误。取消中的请求及尚未开始的尝试不计入成功数、失败数或逐次结果。

## Event 与 TaskResultPage

`Event` 保留 `worker`、`message`、`success`、`fail`、`current`、`total` 和 `time`。每次尝试完成时，事件额外包含 `result: SubmissionResult`。普通进度事件省略 `result`；获取逐次结果时应筛选该字段。

`GET /api/v1/tasks/{id}/results` 返回：

| 字段 | 类型 | 说明 |
|---|---|---|
| `results` | `SubmissionResult[]` | 按完成记录顺序返回，空页为 `[]`。 |
| `next_cursor` | `integer` | 下次请求的 `after`，空页保留原游标。游标使用底层日志 ID，可能不连续。 |
| `has_more` | `boolean` | 当前是否还有未返回的已存储结果。任务结束状态由 `Task.status` 判断。 |

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

`POST /api/v1/tasks`、`POST /api/v1/submissions` 的 `config` 字段、`config.DeserializeRunRequest()` 和 `config.Load()` 接受 `surveycore-py` 的 `serialize_config()` 输出（`schema_version: 1`）。`config.DeserializePythonConfig()` 可先转换为本地 `ConfigDocument`。保存时仍写入 Go 的 v2 格式。

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

批量运行已对齐 Python 的尝试次数、并发限制、失败后继续、无自动重试、尝试前间隔和按完成顺序返回结果的规则。Go SDK 使用 `RunResults` 迭代，HTTP 使用任务结果分页。
