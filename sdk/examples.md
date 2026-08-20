---
outline: deep
---

# SDK 调用示例

## JavaScript

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

## Python

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

## 上传二维码

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
