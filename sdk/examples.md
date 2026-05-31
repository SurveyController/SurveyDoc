---
outline: deep
---

# SDK 调用示例

## JavaScript

```js
const baseURL = "http://localhost:19178";

async function requestJSON(path, options = {}) {
  const response = await fetch(`${baseURL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }

  return data;
}

async function createTaskFromURL(url) {
  const config = await requestJSON("/api/configs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });

  config.target = 10;
  config.threads = 2;

  const task = await requestJSON("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config)
  });

  return task.task_id;
}

async function getTask(taskID) {
  return requestJSON(`/api/tasks/${taskID}`);
}
```

## Python

```python
import requests

base_url = "http://localhost:19178"


def request_json(method, path, **kwargs):
    response = requests.request(method, f"{base_url}{path}", timeout=30, **kwargs)
    data = response.json()

    if not response.ok:
        raise RuntimeError(data.get("error") or f"HTTP {response.status_code}")

    return data


config = request_json(
    "POST",
    "/api/configs",
    json={"url": "https://www.wjx.cn/vm/example.aspx"},
)

config["target"] = 10
config["threads"] = 2

task = request_json("POST", "/api/tasks", json=config)
task_id = task["task_id"]

print(task_id)
```

## 上传二维码

JavaScript 浏览器环境：

```js
async function decodeQRCode(file) {
  const form = new FormData();
  form.append("image", file);

  const response = await fetch("http://localhost:19178/api/qrcode/decode", {
    method: "POST",
    body: form
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "二维码解析失败");
  }

  return data.url;
}
```

Python：

```python
import requests

with open("D:/Downloads/survey-qrcode.png", "rb") as image:
    response = requests.post(
        "http://localhost:19178/api/qrcode/decode",
        files={"image": image},
        timeout=30,
    )

data = response.json()
if not response.ok:
    raise RuntimeError(data.get("error") or "二维码解析失败")

print(data["url"])
```
