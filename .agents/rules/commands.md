# Antigravity Workspace Rules & Custom Commands

## 快捷命令响应规则

### 1. `/status` 或 `/context`
当用户在输入框中输入 `/status`、`/context` 或询问当前会话上下文/Token状态时：
1. **自动执行统计**：调用系统工具检查当前会话日志目录 `<appDataDir>\brain\<conversation-id>\.system_generated\logs\`：
   - 获取 `transcript.jsonl` 文件大小与总步数（Steps）；
   - 获取 `transcript_full.jsonl` 完整日志大小；
   - 估算大致 Token 占用与 1M/2M 上下文窗口比例。
2. **结构化呈现**：以清晰的 Markdown 表格形式展示指标卡片：
   - **交互步数（Steps）**
   - **紧凑日志大小（`transcript.jsonl`）**
   - **完整日志大小（`transcript_full.jsonl`）**
   - **估算 Token 占用与窗口占比（基于 1M 上下文）**
   - **会话健康度评估与建议（如：极度充裕 / 建议开启新会话）**
