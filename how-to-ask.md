---
outline: deep
---

# 如何提问

我们鼓励用户在遇到问题时积极提问，这被视为是一种社区的贡献，有助于我们更好地改进程序和文档。

但是绝大多数人的提问完全没有任何价值，提问的结果永远都是浪费大家的时间。

## 无效提问的常见反例

绝大多数无效提问都有以下特征：

1. **❌ 问题太空泛**  
   - “这个东西怎么弄？”  
   - “我的电脑坏了，怎么办？”  
2. **❌ 没有上下文**  
   - “连续提交失败，怎么办？”  
   - “随机 ip 根本用不了啊”  
   - “请问提示这样是什么原因呀？”
4. **❌ 情绪化或催促**  
   - “急急急！哪位友友能帮帮我？” 
   - “我真没招了呀！😭”

## 错误示范 vs 正确示范

### 场景一：AI 填空问题

**❌ 错误**  
> “一直报 AI 请求失败啊，请问是什么原因呢？”

**✅ 正确**  
> “我在配置 AI 填空的时候选择了 DeepSeek 服务商，并且已经创建过 API Key、充值了足够的余额，但是测试连通性时提示失败。请问还有哪些步骤需要检查？我当前处于校园网 WiFi 网络环境。”
>
> （上传了1个完整的日志文件）

### 场景二：日志报错

**❌ 错误**  
> “日志有报错啊，一直失败。”  
> （然后只发了一行报错截图）

**✅ 正确**  
> “我在开始运行后遇到了报错内容，问卷链接是 https://v.wjx.cn/xxxxxx.aspx ，启用了随机 ip 功能。请问是不是有不支持的题型？我使用的是 `v3.1.4` 版本。完整代码和报错信息如下：”
> ```log
> ......
> 2026-05-18 23:29:14 [ERROR] 未处理的异常
> TypeError: _SocketProvider.extra_attributes.<locals>.<lambda>() takes 0 positional arguments but 1 were given
> 2026-05-18 23:29:14 [ERROR] TypeError: _SocketProvider.extra_attributes.<locals>.<lambda>() takes 0 positional arguments but 1 were given
> 2026-05-18 23:29:14 [ERROR] 未处理的异常
> TypeError: _SocketProvider.extra_attributes.<locals>.<lambda>() takes 0 positional arguments but 1 were given
> 2026-05-18 23:29:14 [ERROR] TypeError: _SocketProvider.extra_attributes.<locals>.<lambda>() takes 0 positional arguments but 1 were given
> ```  
> （保存并上传了配置文件与日志文件）

## 高效提问方法

1. **说清楚你要做什么**（背景 + 目标）  
2. **提供关键信息**（网络环境、设置项、版本号、已尝试的方法）  
3. **给出具体错误或异常现象**（上传日志/配置文件或**完整全屏截图**）  
4. **给出错误复现方法** （如果可以的话，提供一个最小可复现的示例）
5. **提出明确的问题**（不要只说“是什么原因呀”，要说“我想达成 A，遇到了 B，请问如何解决 C”）
