---
outline: deep
---

# API Key 配置

本程序提供了接入自备第三方 AI 模型（OpenAI 兼容）的功能，以应对填空/多项填空题，具体以程序内的选项为准。

:::tip 💡提示
虽然你平时在网页端、APP 内与各种 AI 对话通常是免费的，但如果要通过 API 接入到非官方平台的外部程序里是需要付费的

请务必先了解清楚所选服务商的费用和使用限制，避免不必要的损失！
:::

此处以 [DeepSeek 开放平台](https://platform.deepseek.com/) 为例，说明获取 API key 的流程。

## 创建 API Key

- 以登录态访问 https://platform.deepseek.com/api_keys

![启动程序](assets/apikey_1.png)

在DeepSeek 文档里找到申请 API key 的入口.

随后创建 key 时先给它起个名字，这个名字只是备注。

![启动程序](assets/apikey_2.png)

真正要复制保存的是下面这串 sk- 开头的 Key。

![启动程序](assets/apikey_3.png)

提示：如果账户余额是 0，测试连接再怎么点也不会凭空起死回生。

![启动程序](assets/apikey_4.png)

但也别被“API 要付费”这句话吓到……像 DeepSeek 这类普通聊天模型，处理简短填空题时通常是很便宜的，新手完全没必要上来就往里猛充 20 块钱。
> DeepSeek 作答 1 万道填空题大约只需要￥0.36元。