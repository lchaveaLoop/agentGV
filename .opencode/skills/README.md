# AgentGV Skills

Skills are folders of instructions and resources that agents load dynamically to improve performance on specialized tasks.

## 📁 Skill Categories

| Category | Description | Skills |
|----------|-------------|--------|
| 🎨 **Creative** | Creative writing, content creation, design | fiction, technical, content |
| 💻 **Software** | Programming, development, debugging | python, web, cpp, mobile |
| 🔧 **Hardware** | Electronics, embedded systems, PCB | pcb, fpga, embedded |
| 📊 **Research** | Market research, academic, data analysis | market, academic, data |
| 🔬 **Simulation** | Mathematical modeling, simulation | matlab, fea, cfd |

## 📚 Available Skills

### Creative (创意)
- **[fiction](creative/fiction/SKILL.md)** - 小说创作，支持科幻、都市等体裁
- **technical** - 技术文档写作
- **content** - 内容创作，博客文章

### Software (软件)
- **[python](software/python/SKILL.md)** - Python 开发，Web/数据分析/自动化
- **web** - Web 开发，前端/后端
- **cpp** - C++ 开发
- **mobile** - 移动应用开发

### Research (研究)
- **[market](research/market/SKILL.md)** - 市场调研和行业分析
- **academic** - 学术研究
- **data** - 数据分析

## 🔧 Using Skills

### Method 1: Mention in Task
```
用户：用 Python 开发技能写一个爬虫
```

### Method 2: Specify in Router
```
Router 分析:
- Skill: python-development
- Category: software
- Department: Operations
```

## 📝 Creating Skills

See [template](template/SKILL.md) for skill creation guide.

## 📊 Skill Statistics

- **Total Categories**: 5
- **Total Skills**: 3 (V4.2 initial)
- **Last Updated**: 2026-02-24

---

**Version**: 4.2.0 | **Format**: Anthropic-compatible (YAML + Markdown)
