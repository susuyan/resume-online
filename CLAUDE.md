# Resume Project - Claude Code 指南

## 项目概述

这是一个基于 GitHub Actions 的自动化简历构建系统，支持 Markdown 编写，自动生成 PDF 和 HTML 版本，并部署到 GitHub Pages。

## 核心功能

### 1. Markdown 简历编写
- **源文件**: `resume.md` - 简历内容使用 Markdown 格式
- **配置文件**: `resume-config.json` - 样式配置（颜色、字体、布局）
- **实时预览**: 本地可运行构建系统预览效果

### 2. 自动化构建发布
- **触发条件**: 推送到 `main` 分支自动触发
- **构建流程**:
  1. Vite 打包 React 组件
  2. Puppeteer 生成 PDF
  3. pdf2htmlEX 转换为 HTML
  4. 部署到 GitHub Pages

## 重要文件说明

### 简历内容
```
resume.md              # 简历主文件（Markdown 格式）
resume-config.json     # 样式配置
resume.pdf            # 生成的 PDF（自动生成，勿手动编辑）
```

### 构建系统
```
build/
├── build-pdf.js      # PDF 生成脚本
├── renderer.jsx      # React 渲染组件
├── index.html        # HTML 模板
├── index.css         # 样式文件
├── vite.config.js    # Vite 配置
└── package.json      # 依赖管理
```

### CI/CD
```
.github/workflows/deploy.yml  # GitHub Actions 工作流
```

## 工作流程

### 更新简历内容
1. 直接编辑 `resume.md`
2. 提交到 `main` 分支
3. GitHub Actions 自动构建和部署
4. 访问 GitHub Pages 查看结果

### 调整样式配置
1. 编辑 `resume-config.json`
2. 修改颜色、字体、布局参数
3. 本地测试或直接提交查看效果

### 本地构建测试
```bash
cd build
bun install           # 安装依赖
bun run build:vite    # 构建 React 应用
bun run build-pdf.js  # 生成 PDF
```

## 技术栈

- **内容格式**: Markdown
- **前端框架**: React 19 + Vite 6
- **运行时**: Bun (替代 npm)
- **样式**: Tailwind CSS
- **PDF 生成**: Puppeteer (Chrome 无头浏览器)
- **PDF 转 HTML**: pdf2htmlEX
- **CI/CD**: GitHub Actions
- **部署**: GitHub Pages

## 注意事项

### 字体支持
- GitHub Actions 中已安装中文字体（fonts-noto-cjk, fonts-wqy-zenhei）
- 本地开发需要安装相应字体才能正确显示中文

### PDF 配置
- 页面尺寸: A4 (620x877 px, 基于 resume-config.json)
- 输出路径: `resume.pdf` 和 `index.html`（根目录）

### Git 忽略规则
- 构建产物（`build/dist/`, `build/node_modules/`）已忽略
- 系统文件（`.DS_Store` 等）已忽略
- PDF 和 HTML 产物会提交到仓库用于部署

## 常见任务

### 修改简历内容
编辑 `resume.md`，保持 Markdown 格式规范即可。

### 调整颜色主题
编辑 `resume-config.json` 中的 `colors` 字段：
```json
{
  "colors": {
    "primary": "#1A365D",
    "secondary": "#2C5282",
    "accent": "#C05621"
  }
}
```

### 修改布局
调整 `resume-config.json` 中的 `layout` 和 `typography` 配置。

### 更新部署流程
编辑 `.github/workflows/deploy.yml` 修改构建步骤。

## 项目约束

1. **保持简单**: 简历内容只需编辑 `resume.md`，无需修改构建代码
2. **自动构建**: 不要手动修改 `resume.pdf` 或 `index.html`
3. **配置驱动**: 样式调整通过 `resume-config.json`，避免硬编码
4. **单一职责**: `build/` 目录独立管理构建逻辑

## 联系方式

- **维护者**: 余胜民 (susuyan@163.com)
- **GitHub**: github.com/susuyan