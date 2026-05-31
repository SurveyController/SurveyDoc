---
outline: deep
---

# SDK 数据结构

## RuntimeConfig

`RuntimeConfig` 是创建任务的请求体。

最推荐的做法：先调用 `POST /api/configs`，拿到默认配置，再改需要的字段。

| 字段 | 类型 | 说明 |
|---|---|---|
| `url` | `string` | 问卷链接。 |
| `survey_title` | `string` | 问卷标题。通常由 `/api/configs` 自动填入。 |
| `survey_provider` | `string` | 问卷平台。可选值：`wjx`、`qq`、`credamo`。 |
| `target` | `number` | 目标提交份数。小于等于 0 时会按默认值处理。 |
| `threads` | `number` | 并发数。小于等于 0 时会按默认值处理。 |
| `submit_interval` | `[number, number]` | 两次提交之间的随机等待范围，单位秒。 |
| `answer_duration` | `[number, number]` | 单份问卷显示作答时长范围，单位秒。 |
| `answer_datetime_window` | `[string, string]` | 作答时间窗口，格式建议为 `YYYY-MM-DD HH:mm:ss`。 |
| `random_ua_enabled` | `boolean` | 是否启用随机 User-Agent。 |
| `random_ua_keys` | `string[]` | User-Agent 类型。默认 `wechat`、`mobile`、`pc`。 |
| `random_ua_ratios` | `object` | User-Agent 类型权重。 |
| `reliability_mode_enabled` | `boolean` | 是否启用信度优化。 |
| `psycho_target_alpha` | `number` | 预期 Cronbach's α。默认 `0.85`。 |
| `reverse_fill_enabled` | `boolean` | 是否启用反向填充。 |
| `reverse_fill_source_path` | `string` | 反向填充数据源路径。 |
| `reverse_fill_format` | `string` | 反向填充格式。默认 `auto`。 |
| `reverse_fill_start_row` | `number` | 反向填充起始行。默认 `1`。 |
| `reverse_fill_threads` | `number` | 反向填充线程数。默认 `1`。 |
| `answer_rules` | `object[]` | 答案规则。 |
| `dimension_groups` | `string[]` | 维度分组。 |
| `question_entries` | `QuestionEntry[]` | 每道题的作答配置。 |
| `questions_info` | `SurveyQuestionMeta[]` | 问卷题目信息。通常由 `/api/configs` 自动填入。 |

## QuestionEntry

`QuestionEntry` 表示一道题怎么作答。

| 字段 | 类型 | 说明 |
|---|---|---|
| `question_type` | `string` | 题型。常见值：`single`、`multiple`、`dropdown`、`scale`、`score`、`matrix`、`slider`、`text`、`multi_text`、`order`。 |
| `probabilities` | `number \| number[] \| number[][] \| null` | 作答概率或目标值。`-1` 表示随机。 |
| `texts` | `string[]` | 填空题候选文本。 |
| `rows` | `number` | 矩阵题行数。 |
| `option_count` | `number` | 选项数。 |
| `distribution_mode` | `string` | 分布模式。常见值：`random`、`custom`。 |
| `custom_weights` | `number[] \| number[][] \| null` | 自定义权重。存在时优先于 `probabilities`。 |
| `question_num` | `number` | 题号。 |
| `question_title` | `string` | 题目标题。 |
| `survey_provider` | `string` | 问卷平台。 |
| `provider_question_id` | `string` | 平台原始题目 ID。 |
| `provider_page_id` | `string` | 平台原始分页 ID。 |
| `ai_enabled` | `boolean` | 是否让服务端用本地 AI 配置生成填空答案。 |
| `multi_text_blank_modes` | `string[]` | 多项填空每个空的生成模式。 |
| `multi_text_blank_ai_flags` | `boolean[]` | 多项填空每个空是否启用服务端 AI。 |
| `multi_text_blank_int_ranges` | `number[][]` | 多项填空随机整数范围。 |
| `text_random_mode` | `string` | 填空随机模式。可选值：`none`、`name`、`mobile`、`id_card`、`integer`。 |
| `text_random_int_range` | `[number, number]` | 随机整数范围。 |
| `option_fill_texts` | `(string \| null)[]` | 选项后填空文本。 |
| `fillable_option_indices` | `number[]` | 可填空的选项下标，从 `0` 开始。 |
| `attached_option_selects` | `object[]` | 单选题附加下拉选择配置。 |
| `is_location` | `boolean` | 是否是地址题。 |
| `location_parts` | `string[]` | 地址字段。 |
| `dimension` | `string` | 题目所属维度。 |
| `psycho_bias` | `string` | 心理量表方向。 |

## 作答配置示例

单选题固定比例：

```json
{
  "question_type": "single",
  "probabilities": [70, 30],
  "custom_weights": [70, 30],
  "distribution_mode": "custom",
  "question_num": 1,
  "option_count": 2
}
```

多选题独立概率：

```json
{
  "question_type": "multiple",
  "probabilities": [80, 50, 20],
  "question_num": 2,
  "option_count": 3
}
```

填空题随机选择文本：

```json
{
  "question_type": "text",
  "probabilities": [1],
  "texts": ["无", "暂时没有", "满意"],
  "text_random_mode": "none",
  "question_num": 3
}
```

填空题随机整数：

```json
{
  "question_type": "text",
  "probabilities": [1],
  "text_random_mode": "integer",
  "text_random_int_range": [18, 60],
  "question_num": 4
}
```

## SurveyQuestionMeta

`/api/surveys/parse` 和 `/api/configs` 会返回 `SurveyQuestionMeta`。

| 字段 | 类型 | 说明 |
|---|---|---|
| `num` | `number` | 题号。 |
| `title` | `string` | 题目标题。 |
| `display_num` | `number` | 显示题号。 |
| `description` | `string` | 题目说明。 |
| `type_code` | `string` | 平台原始题型编码。 |
| `options` | `number` | 选项数。 |
| `rows` | `number` | 矩阵行数。 |
| `row_texts` | `string[]` | 矩阵行标题。 |
| `page` | `number` | 页码。 |
| `option_texts` | `string[]` | 选项文本。 |
| `forced_option_index` | `number` | 强制选项下标。 |
| `forced_option_text` | `string` | 强制选项文本。 |
| `forced_texts` | `string[]` | 强制填空文本。 |
| `fillable_options` | `number[]` | 可填空选项下标。 |
| `attached_option_selects` | `object[]` | 附加选项下拉配置。 |
| `has_attached_option_select` | `boolean` | 是否有附加下拉。 |
| `is_location` | `boolean` | 是否是地址题。 |
| `is_rating` | `boolean` | 是否是评价题。 |
| `is_description` | `boolean` | 是否是说明文本。 |
| `rating_max` | `number` | 评价题最大分值。 |
| `text_inputs` | `number` | 填空数量。 |
| `text_input_labels` | `string[]` | 填空标签。 |
| `is_multi_text` | `boolean` | 是否是多项填空。 |
| `is_text_like` | `boolean` | 是否按填空题处理。 |
| `is_slider_matrix` | `boolean` | 是否是滑块矩阵。 |
| `has_jump` | `boolean` | 是否有跳题逻辑。 |
| `jump_rules` | `object[]` | 跳题规则。 |
| `has_display_condition` | `boolean` | 是否有显示条件。 |
| `display_conditions` | `object[]` | 显示条件。 |
| `has_dependent_display_logic` | `boolean` | 是否被其他题控制显示。 |
| `controls_display_targets` | `object[]` | 控制显示的目标题。 |
| `logic_parse_status` | `string` | 逻辑解析状态。可见值：`complete`、`none`、`unknown`。 |
| `question_media` | `object[]` | 题目媒体信息。 |
| `slider_min` | `number` | 滑块最小值。 |
| `slider_max` | `number` | 滑块最大值。 |
| `slider_step` | `number` | 滑块步长。 |
| `multi_min_limit` | `number` | 多选最少选择数。 |
| `multi_max_limit` | `number` | 多选最多选择数。 |
| `provider` | `string` | 平台。 |
| `provider_question_id` | `string` | 平台原始题目 ID。 |
| `provider_page_id` | `string` | 平台原始分页 ID。 |
| `provider_type` | `string` | 平台原始题型。 |
| `provider_page_raw` | `any` | 平台原始分页数据。 |
| `unsupported` | `boolean` | 是否暂不支持。 |
| `unsupported_reason` | `string` | 不支持原因。 |
| `required` | `boolean` | 是否必填。 |

## 任务状态

| 状态 | 含义 |
|---|---|
| `pending` | 已创建，等待运行。 |
| `running` | 正在运行。 |
| `succeeded` | 已完成。 |
| `failed` | 执行失败。 |
| `stopped` | 已停止。 |
| `interrupted` | 服务重启导致中断。 |
