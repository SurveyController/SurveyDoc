---
outline: deep
---

# 调用示例

## Go SDK

```go
package main

import (
	"context"
	"errors"
	"log"

	"github.com/SurveyController/SurveyCore/pkg/surveycore"
	"github.com/SurveyController/SurveyCore/pkg/surveycore/model"
)

func main() {
	ctx := context.Background()
	client := surveycore.New()
	cfg, err := client.DefaultConfig(ctx, "https://www.wjx.cn/vm/example.aspx")
	if err != nil {
		log.Fatal(err)
	}
	cfg.ExecutionPlan.Target = 1
	cfg.ExecutionPlan.Threads = 1
	result, err := client.RunWithEvents(ctx, cfg, func(event model.Event) {
		log.Print(event.Message)
	})
	if err != nil {
		if errors.Is(err, surveycore.ErrInvalidConfig) {
			log.Fatal("配置无效: ", err)
		}
		log.Fatal(err)
	}
	log.Printf("成功=%d 失败=%d", result.Success, result.Fail)
}
```

仓库中的 `pkg/surveycore/example_test.go` 会编译这些公开调用。

### Go 单次提交

```go
client := surveycore.New()
result, err := client.Submit(ctx, &surveycore.SubmissionRequest{Config: cfg})
if err != nil {
    log.Printf("提交错误类别=%s: %v", surveycore.ClassifySubmissionError(err), err)
}
if result != nil {
    log.Printf("成功=%t 耗时=%.3f秒", result.Success, result.ElapsedSeconds)
}
```

该调用固定执行一次。已有问卷快照可通过 `Survey` 传入。原始 `cfg` 中的目标数和并发数保持原值。

## REST API

### JavaScript

```js
const baseURL = "http://127.0.0.1:19178/api/v1";

async function requestJSON(path, options = {}) {
  const response = await fetch(`${baseURL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `HTTP ${response.status}`);
  }

  return data;
}

async function createTaskFromURL(url) {
  const config = await requestJSON("/configs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  config.execution.target = 10;
  config.execution.threads = 2;

  const task = await requestJSON("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config)
  });

  return task.id;
}

async function getTask(taskID) {
  return requestJSON(`/tasks/${taskID}`);
}
```

### Python

```python
import requests

base_url = "http://127.0.0.1:19178/api/v1"


def request_json(method, path, **kwargs):
    response = requests.request(method, f"{base_url}{path}", timeout=30, **kwargs)
    data = response.json()

    if not response.ok:
        raise RuntimeError(data.get("message") or f"HTTP {response.status_code}")

    return data


config = request_json(
    "POST",
    "/configs",
    json={"url": "https://www.wjx.cn/vm/example.aspx"},
)

config["execution"]["target"] = 10
config["execution"]["threads"] = 2

task = request_json("POST", "/tasks", json=config)
print(task["id"])
```

### 使用 surveycore-py 配置创建任务

```python
import httpx
from surveycore import QuestionConfig, RunConfig, serialize_config

config = RunConfig(
    url="https://www.wjx.cn/vm/example.aspx",
    target=3,
    concurrency=2,
    questions=[QuestionConfig(question_type="single", probabilities=[0, 1])],
)
response = httpx.post(
    "http://127.0.0.1:19178/api/v1/tasks",
    json=serialize_config(config),
    timeout=30,
)
response.raise_for_status()
print(response.json()["id"])
```

### 使用 surveycore-py 配置单次提交

```python
import httpx
from surveycore import RunConfig, serialize_config

config = RunConfig(url="https://www.wjx.cn/vm/example.aspx")
response = httpx.post(
    "http://127.0.0.1:19178/api/v1/submissions",
    json={"config": serialize_config(config)},
    timeout=120,
)
response.raise_for_status()
result = response.json()
print(result["success"], result["elapsed_seconds"], result["error"])
```

### 上传二维码

JavaScript：

```js
async function decodeQRCode(file) {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch("http://127.0.0.1:19178/api/v1/qrcode/decode", {
    method: "POST",
    body: form
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "二维码解析失败");
  }

  return data.url;
}
```

Python：

```python
import requests

with open("D:/Downloads/survey-qrcode.png", "rb") as image:
    response = requests.post(
        "http://127.0.0.1:19178/api/v1/qrcode/decode",
        files={"file": image},
        timeout=30,
    )

data = response.json()
if not response.ok:
    raise RuntimeError(data.get("message") or "二维码解析失败")

print(data["url"])
```
