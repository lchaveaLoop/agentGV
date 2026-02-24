---
name: python-development
description: Python 开发技能，支持 Web 开发、数据分析、自动化脚本等
category: software
version: 1.0.0
author: AgentGV Team
keywords:
  - Python
  - Django
  - Flask
  - 数据分析
  - 自动化
  - 脚本
model: bailian-coding-plan/qwen3.5-plus
temperature: 0.3
---

# Python Development Skill (Python 开发)

## 能力

此技能提供专业的 Python 开发能力，包括：

- 🌐 **Web 开发**: Django, Flask, FastAPI
- 📊 **数据分析**: pandas, numpy, matplotlib
- 🤖 **自动化脚本**: 文件处理、API 调用、定时任务
- 🧪 **测试**: pytest, unittest
- 📦 **打包发布**: pip, setuptools, poetry

## 使用示例

### 示例 1: Web 应用
```
用户：用 Flask 写一个 REST API

Skill 执行:
1. 设计 API 端点和数据结构
2. 实现路由和请求处理
3. 添加错误处理和验证
4. 提供测试和使用文档
```

### 示例 2: 数据处理
```
用户：分析这个 CSV 文件并生成报告

Skill 执行:
1. 读取和清洗数据
2. 执行统计分析
3. 生成可视化图表
4. 输出分析报告
```

### 示例 3: 自动化脚本
```
用户：写一个批量重命名文件的脚本

Skill 执行:
1. 解析文件命名规则
2. 实现批量处理逻辑
3. 添加错误处理
4. 提供使用说明
```

## 编码规范

### 1. 代码风格
- 遵循 PEP 8
- 使用类型注解
- 编写文档字符串

### 2. 错误处理
```python
try:
    # 可能出错的代码
except SpecificError as e:
    # 具体错误处理
except Exception as e:
    # 兜底错误处理
    logger.error(f"Unexpected error: {e}")
    raise
```

### 3. 测试
```python
def test_function():
    # Arrange
    input_data = {...}
    expected = {...}
    
    # Act
    result = function_under_test(input_data)
    
    # Assert
    assert result == expected
```

## 参数配置

| 参数 | 默认值 | 说明 |
|------|--------|------|
| temperature | 0.3 | 代码确定性（0.2-0.4） |
| max_tokens | 4000 | 输出长度 |
| style | clean | 代码风格 |

## 相关技能

- [web-development](../web/SKILL.md) - Web 开发
- [data-analysis](../data/SKILL.md) - 数据分析

## 版本历史

- v1.0.0 (2026-02-24): 初始版本
