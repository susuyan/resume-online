# Resume

基于 GitHub Actions 的自动化简历构建系统。

## 流程
`resume.md` → React + @chenglou/pretext排版 → Puppeteer → PDF → pdf2htmlEX → HTML → GitHub Pages

## 核心技术
- **@chenglou/pretext**: 核心排版引擎，保证简历内容在一页 A4 纸内完美布局
- **React + Vite**: 现代化前端构建工具
- **Bun**: 高性能 JavaScript 运行时和包管理器
- **Puppeteer**: 无头浏览器生成 PDF
- **pdf2htmlEX**: PDF 转 HTML，保持完美排版
- **GitHub Actions**: 自动化 CI/CD
- **GitHub Pages**: 在线访问

## 如何更新
直接修改 `resume.md` 并提交即可，GitHub Actions 自动构建和部署。

## 本地开发

### 安装 Bun
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# 或使用 Homebrew
brew install bun
```

### 安装依赖
```bash
cd build
bun install
```

## 本地测试流程

### 方式一：实时预览（推荐）⚡

**完全浏览器端渲染，无需服务器！**

```bash
# macOS
open preview/index.html

# Windows
start preview/index.html

# Linux
xdg-open preview/index.html

# 或直接在文件管理器中双击 preview/index.html
```

**功能**:
- 📝 左侧: Markdown 编辑器
- 👁️ 中间: 实时预览（@chenglou/pretext 浏览器端渲染）
- ⚙️ 右侧: 参数调整面板
- 📄 导出 PDF（浏览器打印）

**特性**:
- ⚡ 极速响应（浏览器端渲染）
- 🎨 深色主题
- 📊 实时性能指标
- 🎲 示例简历切换

详细说明见 `preview/README.md`。

### 方式二：命令行测试

#### 快速测试（仅生成 PDF）
```bash
node build/test.js
```

#### 完整测试（PDF + HTML）
```bash
node build/test.js --full
```

#### 本地预览
```bash
node tests/preview-server.js
# 访问 http://localhost:3000
```

### 使用 Bun 直接运行
```bash
cd build
bun run build:vite  # 构建 React 应用
bun run build-pdf.js  # 生成 PDF
```

详细测试文档见 `tests/README.md`。

## 为什么使用 Bun？

- **更快**: 比 npm 快 20-30 倍
- **原生支持**: TypeScript/JSX 无需配置
- **一体化**: 运行时 + 包管理器 + 打包器 + 测试运行器
- **兼容性**: 完全兼容 npm 包
