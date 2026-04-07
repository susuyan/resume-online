# AI 代理操作指南 (AGENTS.md)

## 概述

本文档为 AI 代理（如 Claude Code、Cursor 等）提供详细的操作指南，帮助智能代理理解和操作简历项目。

## 项目架构理解

### 核心理念
这是一个**内容与样式分离**的简历系统：
- **内容层**: `resume.md` (Markdown 源文件)
- **样式层**: `resume-config.json` (JSON 配置)
- **构建层**: `build/` (React + Bun + Puppeteer + pdf2htmlEX)
- **发布层**: GitHub Actions → GitHub Pages

### 文件依赖关系
```
resume.md (内容)
    ↓
resume-config.json (样式)
    ↓
build/renderer.jsx (React 渲染 + @chenglou/pretext 排版)
    ↓
build/build-pdf.js (Puppeteer PDF 生成)
    ↓
resume.pdf (产物)
    ↓
pdf2htmlEX (PDF 转 HTML)
    ↓
index.html (最终产物)
    ↓
GitHub Pages (在线访问)
```

## AI 代理操作规范

### 任务分类与优先级

#### 1️⃣ 内容更新任务（最常见）
**触发条件**: 用户要求修改简历内容、更新工作经历、调整技能列表等。

**操作步骤**:
1. 阅读 `resume.md` 当前内容
2. 根据用户要求定位修改位置
3. 使用 Edit 工具编辑 `resume.md`
4. **不要修改** `resume-config.json` 或构建代码
5. 提示用户提交到 `main` 分支触发自动构建

**示例**:
```
用户: "添加一个新的项目经历"
代理:
- Read resume.md
- Edit resume.md (添加新内容)
- 提示: "已更新 resume.md，请提交到 main 分支触发构建"
```

#### 2️ 样式调整任务
**触发条件**: 用户要求修改颜色、字体大小、布局间距等。

**操作步骤**:
1. 阅读 `resume-config.json`
2. 根据用户需求修改相应字段
3. 解释修改效果（如："primary 颜色改为蓝色"）
4. 提示提交查看效果

**配置字段说明**:
```json
{
  "colors": {
    "primary": "主色调（标题、重点内容）",
    "secondary": "次要色调（副标题）",
    "accent": "强调色（重点标记）",
    "text": "正文颜色",
    "lightGray": "次要文字颜色",
    "border": "边框颜色",
    "headerBg": "标题背景色"
  },
  "fonts": {
    "primary": "主字体（优先使用 InterVariable）",
    "fallback": "后备字体"
  },
  "layout": {
    "pageWidth": "页面宽度（像素）",
    "pageHeight": "页面高度（像素）",
    "padding": "页面边距",
    "sectionSpacing": "章节间距",
    "itemSpacing": "列表项间距"
  },
  "typography": {
    "fontSizeRange": {
      "min": "最小字号",
      "max": "最大字号",
      "default": "默认字号"
    },
    "lineHeightRange": {
      "min": "最小行高",
      "max": "最大行高",
      "default": "默认行高"
    }
  }
}
```

#### 3️⃣ 构建系统调试任务
**触发条件**: 构建失败、PDF 显示异常、字体问题等。

**操作步骤**:
1. 查看 GitHub Actions 日志（如果用户提供）
2. 检查 `build/build-pdf.js` 和 `build/renderer.jsx`
3. 验证 `resume.md` 和 `resume-config.json` 格式
4. 本地测试（建议用户在本地运行构建）
5. 修复问题后提交

**常见问题诊断**:
- **PDF 未生成**: 检查 Puppeteer 配置、Chrome 安装
- **中文显示异常**: 检查字体安装（fonts-noto-cjk）
- **样式错乱**: 检查 `resume-config.json` JSON 格式是否正确
- **布局溢出**: 调整 `pageWidth` 和 `pageHeight` 参数，或优化内容长度

#### 4️⃣ 新功能开发任务
**触发条件**: 添加新特性（如多语言支持、主题切换等）。

**操作步骤**:
1. **先规划**: 使用 EnterPlanMode 工具进入规划模式
2. 分析现有架构和依赖关系
3. 设计实现方案（避免破坏现有流程）
4. 获得用户确认后实施
5. 测试构建流程
6. 更新文档（README.md、CLAUDE.md、AGENTS.md）

**重要原则**:
- 保持向后兼容（不破坏现有简历格式）
- 配置驱动（新增配置项而非硬编码）
- 文档更新（同步更新使用说明）

## 禁止操作清单

### ❌ 不要执行的操作

1. **不要手动修改产物文件**
   - `resume.pdf`（自动生成）
   - `index.html`（自动生成）

2. **不要删除必要配置**
   - `resume-config.json` 必须存在
   - `resume.md` 必须存在

3. **不要绕过构建流程**
   - 不要直接编辑 PDF 或 HTML
   - 不要修改 GitHub Actions 后手动部署

4. **不要破坏构建依赖**
   - 不要删除 `build/` 目录核心文件
   - 不要修改 `package.json` 核心依赖版本（除非必要）

5. **不要提交临时文件**
   - `build/dist/`（构建临时产物）
   - `build/node_modules/`（依赖目录）
   - `.DS_Store`（系统文件）
   - `build/package-lock.json`（已迁移到 Bun，应删除）

## 工作流程最佳实践

### 内容更新流程（推荐）
```bash
# AI 代理执行
1. Read resume.md
2. Edit resume.md (修改内容)
3. 提示用户：建议提交查看效果

# 用户执行
git add resume.md
git commit -m "更新简历内容"
git push
# GitHub Actions 自动构建部署
```

### 样式调整流程（推荐）
```bash
# AI 代理执行
1. Read resume-config.json
2. Edit resume-config.json (修改配置)
3. 提示用户：建议提交查看效果

# 用户执行
git add resume-config.json
git commit -m "调整简历样式"
git push
```

### 本地测试流程（可选）
```bash
# AI 代理提示用户执行
cd build
bun install           # 使用 Bun 安装依赖
bun run build:vite    # 构建 React 应用
bun run build-pdf.js  # 生成 PDF
# 查看生成的 resume.pdf
```

## 错误处理指南

### GitHub Actions 构建失败

#### 诊断步骤
1. 检查 workflow 日志（`.github/workflows/deploy.yml`）
2. 定位失败步骤（依赖安装/PDF 生成/转换）
3. 分析错误信息

#### 常见错误修复

**错误 1: bun install 失败**
```
原因: bun.lockb 不一致或 Bun 版本过旧
修复: cd build && bun install && 生成新的 bun.lockb
更新 Bun: bun upgrade
```

**错误 2: Puppeteer 启动失败**
```
原因: Chrome 未正确安装
修复: 检查 GitHub Actions 中的 Puppeteer 安装步骤
本地: bunx puppeteer browsers install chrome
```

**错误 3: pdf2htmlEX 转换失败**
```
原因: Docker 镜像问题或字体缺失
修复: 检查 deploy.yml 中的 Dockerfile.pdf2html 配置
```

**错误 4: PDF 中文显示异常**
```
原因: 字体未安装
修复: 确保 GitHub Actions 中安装了 fonts-noto-cjk
```

### JSON 配置错误

#### 诊断
```bash
# 验证 JSON 格式
bun -e "console.log(JSON.parse(require('fs').readFileSync('resume-config.json', 'utf8')))"
```

#### 修复
- 使用 JSON 格式化工具
- 检查字段类型（字符串、数字、对象）
- 验证颜色格式（十六进制：#RRGGBB）

### Markdown 格式错误

#### 诊断
- 检查标题层级（使用 `#`、`##`、`###`）
- 检查列表格式（使用 `-`）
- 检查分隔线格式（使用 `---`）

#### 修复
- 保持一致的标题层级
- 使用标准 Markdown 语法
- 参考 `resume.md` 现有格式

## 扩展开发指南

### 添加新功能前的思考清单

1. **是否需要修改构建流程？**
   - 是 → 需要更新 `.github/workflows/deploy.yml`
   - 否 → 仅修改配置或内容

2. **是否需要新增依赖？**
   - 是 → 更新 `build/package.json`，使用 Bun 安装
   - 否 → 使用现有技术栈

3. **是否影响现有格式？**
   - 是 → 需要向后兼容或迁移方案
   - 否 → 直接添加

4. **是否需要文档更新？**
   - 是 → 同步更新 README.md、CLAUDE.md、AGENTS.md
   - 否 → 内部实现即可

### 示例：添加多语言支持

#### 规划阶段
1. 分析现有结构（单文件 `resume.md`）
2. 设计方案（多文件或单文件配置驱动）
3. 评估影响（构建流程、配置文件）
4. 用户确认方案

#### 实施阶段
```bash
# 方案 A: 多文件模式
resume-zh.md  # 中文简历
resume-en.md  # 英文简历
resume-config.json  # 共用配置

# 方案 B: 配置驱动模式（推荐）
resume.md  # 单文件（标记语言片段）
resume-config.json  # 语言选择配置
```

#### 测试阶段
1. 本地测试构建（使用 Bun）
2. GitHub Actions 测试
3. 验证两种语言输出

#### 文档阶段
1. 更新 README.md（使用说明）
2. 更新 CLAUDE.md（架构说明）
3. 更新 AGENTS.md（代理操作指南）

## AI 代理行为准则

### 优先级排序
1. **内容更新** > 样式调整 > 构建调试 > 新功能开发
2. **配置驱动** > 硬编码实现
3. **简单方案** > 复杂方案

### 沟通原则
1. **先理解**: 阅读相关文件再操作
2. **先解释**: 说明修改内容和原因
3. **先确认**: 大改动前询问用户
4. **后执行**: 获得理解后实施

### 代码质量
1. **保持简洁**: 不过度设计
2. **保持一致**: 使用现有代码风格
3. **保持文档**: 同步更新说明文档

### 错误处理
1. **诊断优先**: 先分析问题再修复
2. **最小修改**: 只修改必要部分
3. **验证修复**: 确保问题真正解决

## 特殊场景处理

### 场景 1: 用户要求"优化简历"
**处理方式**:
1. 询问具体优化方向（内容、样式、布局）
2. 提供优化建议（不要直接修改）
3. 确认后实施
4. 提示提交查看效果

### 场景 2: 用户要求"重新设计简历"
**处理方式**:
1. 理解需求（颜色主题、布局风格）
2. 使用 EnterPlanMode 规划
3. 展示设计方案（配色方案、布局示例）
4. 确认后修改 `resume-config.json`
5. 提示提交查看效果

### 场景 3: 用户要求"添加新板块"
**处理方式**:
1. 分析现有板块结构（参考 `resume.md`）
2. 确认新板块位置和标题层级
3. 编辑 `resume.md` 添加新板块
4. 提示提交查看效果

### 场景 4: 用户报告"简历显示异常"
**处理方式**:
1. 询问具体异常现象（样式错乱、内容缺失、字体问题）
2. 定位可能原因（配置错误、Markdown 格式、构建失败）
3. 提供诊断步骤或直接修复
4. 建议本地测试或提交触发构建

## 代理能力边界

### 可以执行的操作
- ✅ 编辑 `resume.md`（内容更新）
- ✅ 编辑 `resume-config.json`（样式调整）
- ✅ 编辑构建代码（`build/` 目录，必要时）
- ✅ 编辑 GitHub Actions 配置（必要时）
- ✅ 更新文档文件（README.md、CLAUDE.md、AGENTS.md）

### 需要用户确认的操作
- ⚠️ 大规模重构（架构调整）
- ⚠️ 新增功能开发（影响构建流程）
- ⚠️ 修改核心依赖版本（package.json）
- ⚠️ 删除文件或目录

### 不能执行的操作
- ❌ 直接编辑产物文件（PDF/HTML）
- ❌ 绕过构建流程
- ❌ 破坏向后兼容性
- ❌ 提交未测试的大改动

## Bun vs npm 关键差异

### 代理应了解的差异
1. **包管理器**: Bun 替代 npm
   - `bun install` 替代 `npm install`
   - `bun add` 替代 `npm install <package>`
   - `bun run` 替代 `npm run`
   - `bunx` 替代 `npx`

2. **锁文件**: `bun.lockb` 替代 `package-lock.json`
   - `bun.lockb` 是二进制格式（不可读）
   - 应提交到 Git（跟踪依赖版本）
   - `package-lock.json` 应删除

3. **性能优势**: Bun 更快
   - 安装速度：20-30x npm
   - 运行速度：3-4x Node.js

4. **兼容性**: Bun 兼容 npm 包
   - 可以使用所有 npm 包
   - package.json 格式相同
   - 脚本命令相同

### 迁移检查清单
- ✅ 使用 `bun install` 安装依赖
- ✅ 使用 `bun run` 运行脚本
- ✅ 使用 `bunx` 运行 CLI 工具
- ✅ 提交 `bun.lockb` 到 Git
- ✅ 删除 `package-lock.json`
- ✅ 更新 CI/CD 使用 Bun
- ✅ 更新文档说明

## 总结

AI 代理应遵循以下核心原则：
1. **理解优先**: 先阅读相关文件，理解项目结构
2. **最小修改**: 只修改必要部分，避免过度设计
3. **配置驱动**: 优先修改配置文件，而非硬编码
4. **文档同步**: 修改架构时同步更新文档
5. **用户沟通**: 大改动前解释并获得确认
6. **Bun 优先**: 使用 Bun 替代 npm，享受更快速度

遵循本指南，AI 代理可以高效、准确地协助用户管理简历项目。