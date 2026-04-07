# 简历构建测试流程

测试 Markdown → PDF → HTML 的完整构建流程。

## 测试流程

```
resume.md (Markdown 源文件)
    ↓
resume-config.json (样式配置)
    ↓
React + Vite (渲染组件)
    ↓
Puppeteer (PDF 生成)
    ↓
resume.pdf (PDF 文件)
    ↓
pdf2htmlEX (PDF 转 HTML)
    ↓
index.html (HTML 文件)
```

## 快速开始

### 1. 快速测试（仅生成 PDF）

**推荐方式**:
```bash
node build/test.js
```

或使用 Shell 脚本：
```bash
cd tests
chmod +x run-tests.sh
./run-tests.sh
```

### 2. 完整测试（PDF + HTML）

```bash
node build/test.js --full
```

或：
```bash
./run-tests.sh --full
```

**注意**: 完整测试需要安装 Docker，用于运行 pdf2htmlEX。

### 3. 测试 + 预览

```bash
./run-tests.sh --full --preview
```

测试完成后自动启动预览服务器。

## 测试脚本说明

### test-build.js
主测试脚本，包含以下步骤：

1. **验证输入文件**
   - 检查 `resume.md` 是否存在
   - 检查 `resume-config.json` 格式是否正确

2. **构建 React 应用**
   - 运行 `npm run build:vite`
   - 打包渲染组件

3. **生成 PDF**
   - 使用 Puppeteer 启动无头浏览器
   - 加载 React 组件并注入简历内容
   - 生成 PDF 文件

4. **检查 pdf2htmlEX**
   - 检查 Docker 是否安装
   - 检查 pdf2htmlEX 镜像是否可用

5. **PDF 转 HTML**（可选）
   - 构建 Docker 镜像（带中文字体）
   - 使用 pdf2htmlEX 转换 PDF 为 HTML

6. **验证产物**
   - 检查生成的 PDF 和 HTML 文件

### preview-server.js
本地预览服务器，提供以下功能：

- 访问 `http://localhost:3000` 查看预览首页
- 直接访问 PDF、HTML、Markdown、配置文件
- 自动检测文件是否生成
- 美观的预览界面

### run-tests.sh
Shell 脚本，简化测试流程：

- 自动检查环境（Node.js、npm、Docker）
- 自动安装依赖
- 支持参数控制测试范围

**参数说明**:
- `--full`: 运行完整测试（包括 PDF 转 HTML）
- `--preview`: 测试完成后启动预览服务器
- `--help`: 显示帮助信息

## 输出文件

测试完成后，根目录会生成以下文件：

```
resume.pdf      # PDF 文件（必需）
index.html      # HTML 文件（可选，需要 --full 参数）
```

## 本地预览

### 启动预览服务器

```bash
node tests/preview-server.js
```

### 访问预览页面

打开浏览器访问：

- **预览首页**: http://localhost:3000
- **PDF 文件**: http://localhost:3000/resume.pdf
- **HTML 文件**: http://localhost:3000/index.html
- **Markdown**: http://localhost:3000/resume.md
- **配置文件**: http://localhost:3000/resume-config.json

### 停止服务器

按 `Ctrl+C` 停止服务器。

## 环境要求

### 必需
- **Bun**: >= 1.0.0 (替代 Node.js 和 npm)
  - 安装指南: https://bun.sh/

### 可选（完整测试需要）
- **Docker**: 用于运行 pdf2htmlEX
  - 安装指南: https://docs.docker.com/get-docker/

### 字体支持（本地开发）
- **中文字体**: 建议安装以下字体以正确显示中文
  - macOS: 系统自带中文字体
  - Linux: `fonts-noto-cjk`, `fonts-wqy-zenhei`
  - Windows: 系统自带中文字体

## 常见问题

### 1. Bun 未安装

**错误**: `bun: command not found`

**解决**:
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# 或使用 Homebrew
brew install bun

# Windows
powershell -c "irm bun.sh/install.ps1 | iex"
```

### 2. Puppeteer 启动失败

**错误**: `Error: Failed to launch the browser process`

**解决**:
```bash
# macOS
brew install chromium

# Linux
sudo apt-get install chromium-browser

# 或手动下载 Chromium
bunx puppeteer browsers install chrome
```

### 3. PDF 中文显示异常

**原因**: 本地缺少中文字体

**解决**:
```bash
# macOS
# 系统自带中文字体，无需安装

# Linux (Ubuntu/Debian)
sudo apt-get install fonts-noto-cjk fonts-wqy-zenhei

# Windows
# 系统自带中文字体，无需安装
```

### 4. Docker 未安装

**影响**: 无法运行 PDF 转 HTML 测试

**解决**:
```bash
# macOS
brew install --cask docker

# Linux (Ubuntu/Debian)
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Windows
# 下载 Docker Desktop: https://www.docker.com/products/docker-desktop
```

### 5. pdf2htmlEX 镜像拉取失败

**错误**: `Error: image 'pdf2htmlex/pdf2htmlex' not found`

**解决**:
```bash
# 手动拉取镜像
docker pull pdf2htmlex/pdf2htmlex:0.18.8.rc2-master-20200820-ubuntu-20.04-x86_64
```

### 6. JSON 配置格式错误

**错误**: `SyntaxError: Unexpected token in JSON`

**解决**:
```bash
# 验证 JSON 格式（使用 Bun）
bun -e "console.log(JSON.parse(require('fs').readFileSync('resume-config.json', 'utf8')))"

# 使用 JSON 格式化工具
# VSCode: Shift+Alt+F
# Online: https://jsonformatter.org/
```

### 7. bun.lockb vs package-lock.json

**问题**: 是否应该保留 package-lock.json？

**解决**:
- Bun 使用 `bun.lockb`（二进制格式）
- 应删除 `package-lock.json`
- `bun.lockb` 应提交到 Git
- `build/.gitignore` 已忽略 `package-lock.json`

## 测试成功标准

### PDF 测试成功
- ✅ `resume.md` 存在
- ✅ `resume-config.json` 格式正确
- ✅ React 应用构建成功
- ✅ `resume.pdf` 文件生成
- ✅ PDF 文件大小 > 0
- ✅ PDF 可正常打开

### HTML 测试成功（可选）
- ✅ Docker 已安装
- ✅ pdf2htmlEX 镜像可用
- ✅ `index.html` 文件生成
- ✅ HTML 文件大小 > 0
- ✅ HTML 可正常显示

## 测试输出示例

```
========================================
  简历构建测试流程
========================================

=== 步骤 1: 验证输入文件 ===
✓ resume.md 文件存在
✓ resume-config.json 文件存在
✓ resume-config.json 格式正确
  页面尺寸: 620x877px

=== 步骤 2: 构建 React 应用 ===
✓ Vite 构建成功

=== 步骤 3: 生成 PDF ===
启动 Puppeteer...
注入简历内容...
生成 PDF 文件...
✓ PDF 生成成功: 45678 bytes (44.61 KB)
  输出路径: /path/to/resume.pdf

=== 步骤 4: 检查 pdf2htmlEX ===
✓ Docker 已安装
✓ pdf2htmlEX 镜像已存在

=== 步骤 5: PDF 转 HTML ===
构建 Docker 镜像（带中文字体支持）...
✓ Docker 镜像构建成功
转换 PDF 为 HTML...
✓ HTML 生成成功: 123456 bytes (120.56 KB)
  输出路径: /path/to/index.html

=== 步骤 6: 验证产物 ===
✓ PDF 文件存在 (44.61 KB)
✓ HTML 文件存在 (120.56 KB)

========================================
  ✓ 测试完成 (15.23s)
========================================

下一步:
  - 运行预览服务器: node tests/preview-server.js
  - 访问: http://localhost:3000
```

## 集成到 CI/CD

这些测试脚本可以集成到 GitHub Actions 中：

```yaml
# .github/workflows/test.yml
name: Test Build

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: |
          cd build
          npm ci

      - name: Run tests
        run: node tests/test-build.js
```

## 相关文档

- [CLAUDE.md](../CLAUDE.md) - 项目整体指南
- [AGENTS.md](../AGENTS.md) - AI 代理操作指南
- [README.md](../README.md) - 项目说明

## 维护说明

测试脚本应该随着项目演进而更新：

1. **新增功能**: 添加相应测试步骤
2. **修改配置**: 更新验证逻辑
3. **错误修复**: 改进错误诊断和提示
4. **文档同步**: 保持本 README 与实际测试流程一致