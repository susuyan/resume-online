# Resume Builder Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 集成 always-fit-resume 的自动缩放到一页PDF能力，完全替换 Pandoc/LaTeX 构建流程。

**Architecture:** 创建 build/ 目录存放 React + Puppeteer 构建代码，提取 pretext 自动缩放算法，保留专业配色方案，通过 GitHub Actions 自动化部署。

**Tech Stack:** React 19, Puppeteer, Vite, Tailwind CSS, @chenglou/pretext, Node.js 20

---

## Task 1: 创建构建环境和基础配置

**Files:**
- Create: `build/package.json`
- Create: `build/vite.config.js`

**Step 1: 创建 package.json 配置构建依赖**

```json
{
  "name": "resume-builder",
  "version": "1.0.0",
  "description": "Resume PDF builder using React + Puppeteer + pretext",
  "scripts": {
    "build:vite": "vite build",
    "build:pdf": "node build-pdf.js"
  },
  "dependencies": {
    "@chenglou/pretext": "^0.0.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "puppeteer": "^23.0.0",
    "tailwindcss": "^3.4.16",
    "vite": "^6.0.0"
  }
}
```

**Step 2: 创建 vite.config.js 配置打包**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '.',
    entry: 'renderer.jsx',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'renderer.jsx')
      },
      output: {
        entryFileNames: 'renderer.bundle.js',
        assetFileNames: 'index.css'
      }
    }
  }
});
```

**Step 3: 提交基础配置**

```bash
git add build/package.json build/vite.config.js
git commit -m "feat: 添加构建环境配置文件"
```

---

## Task 2: 创建样式配置文件

**Files:**
- Create: `resume-config.json`（项目根目录）
- Create: `build/index.css`

**Step 1: 创建 resume-config.json 配色方案**

```json
{
  "colors": {
    "primary": "#1A365D",
    "secondary": "#2C5282",
    "accent": "#C05621",
    "text": "#2D3748",
    "lightGray": "#718096",
    "border": "#E2E8F0",
    "headerBg": "#EDF2F7"
  },
  "fonts": {
    "primary": "InterVariable, 'Latin Modern Sans', sans-serif",
    "fallback": "system-ui, -apple-system, sans-serif"
  },
  "layout": {
    "pageWidth": 620,
    "pageHeight": 877,
    "padding": 40,
    "sectionSpacing": 12,
    "itemSpacing": 6
  },
  "typography": {
    "fontSizeRange": {
      "min": 8,
      "max": 14,
      "default": 10
    },
    "lineHeightRange": {
      "min": 1.15,
      "max": 1.8,
      "default": 1.5
    }
  }
}
```

**Step 2: 创建 index.css 样式文件**

```css
/* Resume Styles - Professional Color Scheme */

:root {
  --color-primary: #1A365D;
  --color-secondary: #2C5282;
  --color-accent: #C05621;
  --color-text: #2D3748;
  --color-light-gray: #718096;
  --color-border: #E2E8F0;
  --color-header-bg: #EDF2F7;
  --font-primary: InterVariable, 'Latin Modern Sans', sans-serif;
}

.resume-container {
  width: 620px;
  height: 877px;
  padding: 40px;
  font-family: var(--font-primary);
  color: var(--color-text);
  background: white;
  box-sizing: border-box;
}

h1 {
  color: var(--color-primary);
  font-weight: 700;
  margin-bottom: 4px;
  font-size: 1.8em;
}

h2 {
  color: var(--color-primary);
  font-weight: 700;
  font-size: 1.1em;
  margin-top: 12px;
  margin-bottom: 4px;
  border-bottom: 0.8px solid var(--color-border);
  padding-bottom: 3px;
}

h3 {
  color: var(--color-secondary);
  font-weight: 600;
  font-size: 1em;
  margin-top: 8px;
  margin-bottom: 2px;
}

hr {
  border: none;
  border-top: 0.8px solid var(--color-border);
  margin: 6px 0;
}

ul {
  list-style-type: disc;
  color: var(--color-accent);
  padding-left: 1.2em;
  margin-top: 2px;
  margin-bottom: 4px;
}

ul li {
  color: var(--color-text);
  margin-bottom: 1px;
  line-height: inherit;
}

.contact-info {
  color: var(--color-light-gray);
  font-size: 0.9em;
  margin-bottom: 8px;
}

.summary {
  margin-bottom: 12px;
  line-height: inherit;
}
```

**Step 3: 提交样式配置**

```bash
git add resume-config.json build/index.css
git commit -m "feat: 添加样式配置文件（融合 style.tex 配色）"
```

---

## Task 3: 创建 Tailwind 配置

**Files:**
- Create: `build/tailwind.config.js`
- Create: `build/postcss.config.js`

**Step 1: 创建 tailwind.config.js**

```javascript
module.exports = {
  content: [
    './renderer.jsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        resume: {
          primary: '#1A365D',
          secondary: '#2C5282',
          accent: '#C05621',
          text: '#2D3748',
          lightGray: '#718096',
          border: '#E2E8F0',
          headerBg: '#EDF2F7',
        }
      },
      fontFamily: {
        resume: ['InterVariable', 'Latin Modern Sans', 'sans-serif'],
      }
    }
  },
  plugins: []
}
```

**Step 2: 创建 postcss.config.js**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

**Step 3: 提交 Tailwind 配置**

```bash
git add build/tailwind.config.js build/postcss.config.js
git commit -m "feat: 添加 Tailwind CSS 配置"
```

---

## Task 4: 创建 HTML 模板

**Files:**
- Create: `build/index.html`

**Step 1: 创建 HTML 模板供 Puppeteer 加载**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Resume</title>
  <link href="index.css" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    #root {
      display: flex;
      justify-content: center;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="renderer.bundle.js"></script>
</body>
</html>
```

**Step 2: 提交 HTML 模板**

```bash
git add build/index.html
git commit -m "feat: 添加 HTML 模板"
```

---

## Task 5: 提取并简化 React 渲染组件（renderer.jsx）

**Files:**
- Create: `build/renderer.jsx`

**Step 1: 从 always-fit-resume 提取核心代码**

从 `/Users/susuyan/Desktop/always-fit-resume/src/App.jsx` 读取源文件，提取以下核心部分：

1. pretext 测量和自动缩放算法
2. Markdown 解析逻辑
3. 简历渲染组件

**Step 2: 创建简化版 renderer.jsx（移除编辑器和控制面板）**

创建文件 `build/renderer.jsx`，内容见下一步详细代码。

**注意：** 由于 renderer.jsx 文件较大（约 200-300 行），将在实际执行时完整编写。核心结构包括：

```jsx
// 核心导入
import { prepareWithSegments, layout, layoutWithLines } from "@chenglou/pretext";

// Markdown 解析函数
function parseResumeMarkdown(markdown) {
  // 解析逻辑
}

// 自动缩放算法（pretext）
function calculateOptimalFontSize(parsedData, config) {
  // 二分搜索算法
}

// 简历渲染组件
function Resume({ markdown, config }) {
  // 渲染逻辑
}

// 入口点
window.renderResume = (markdown, config) => {
  // 挂载到 #root
};
```

**Step 3: 提交 renderer.jsx**

```bash
git add build/renderer.jsx
git commit -m "feat: 提取并简化 React 渲染组件"
```

---

## Task 6: 创建 Puppeteer 构建脚本

**Files:**
- Create: `build/build-pdf.js`

**Step 1: 创建 build-pdf.js**

```javascript
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function buildResumePDF() {
  let browser;

  try {
    // 验证输入文件
    const resumeMdPath = path.join(__dirname, '..', 'resume.md');
    const configPath = path.join(__dirname, '..', 'resume-config.json');

    if (!fs.existsSync(resumeMdPath)) {
      throw new Error('resume.md 文件不存在');
    }

    if (!fs.existsSync(configPath)) {
      throw new Error('resume-config.json 配置文件不存在');
    }

    // 读取简历内容和配置
    const resumeMarkdown = fs.readFileSync(resumeMdPath, 'utf-8');
    const resumeConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    console.log('启动 Puppeteer...');

    // 启动浏览器
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
      timeout: 30000
    });

    const page = await browser.newPage();

    // 设置页面大小
    await page.setViewport({
      width: 620 + 80,
      height: 877 + 80,
      deviceScaleFactor: 1
    });

    // 加载 HTML 模板
    const htmlPath = path.join(__dirname, 'index.html');
    await page.goto(`file://${htmlPath}`, {
      waitUntil: 'networkidle0',
      timeout: 15000
    });

    console.log('注入简历内容...');

    // 注入简历内容和配置
    await page.evaluate((markdown, config) => {
      window.renderResume(markdown, config);
    }, resumeMarkdown, resumeConfig);

    // 等待渲染完成
    await page.waitForFunction(() => window.resumeRendered === true, {
      timeout: 15000
    });

    console.log('生成 PDF...');

    // 生成 PDF
    const pdfPath = path.join(__dirname, '..', 'resume.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });

    // 验证 PDF 生成
    if (!fs.existsSync(pdfPath)) {
      throw new Error('PDF 文件生成失败');
    }

    const pdfSize = fs.statSync(pdfPath).size;
    console.log(`PDF 生成成功: ${pdfSize} bytes`);

    await browser.close();
    console.log('构建完成!');

  } catch (error) {
    console.error('构建失败:', error.message);

    if (browser) {
      await browser.close();
    }

    process.exit(1);
  }
}

// 执行构建
buildResumePDF();
```

**Step 2: 提交 build-pdf.js**

```bash
git add build/build-pdf.js
git commit -m "feat: 添加 Puppeteer PDF 构建脚本"
```

---

## Task 7: 安装依赖并本地测试

**Step 1: 安装 Node.js 依赖**

```bash
cd build
npm install
```

Expected: 依赖安装成功，生成 package-lock.json 和 node_modules/

**Step 2: 使用 Vite 打包 React 组件**

```bash
npm run build:vite
```

Expected: 生成 `renderer.bundle.js` 和 `index.css`

**Step 3: 运行 Puppeteer 生成 PDF**

```bash
node build-pdf.js
```

Expected:
- 输出: "启动 Puppeteer..." → "注入简历内容..." → "生成 PDF..." → "构建完成!"
- 生成: `../resume.pdf` 文件

**Step 4: 验证生成的 PDF**

```bash
ls -lh ../resume.pdf
# macOS: open ../resume.pdf
# Linux: xdg-open ../resume.pdf
```

Expected:
- PDF 文件大小约 50-200KB
- PDF 内容完整显示在一页 A4 内
- 字体大小、配色、布局合理

**Step 5: 提交测试生成的文件（可选）**

```bash
git add build/package-lock.json build/renderer.bundle.js
git commit -m "chore: 添加构建产物和依赖锁文件"
```

---

## Task 8: 更新 GitHub Actions Workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Step 1: 更新 deploy.yml 构建流程**

```yaml
name: Build & Deploy Resume

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # 1️⃣ 安装 Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: build/package-lock.json

      # 2️⃣ 安装依赖
      - name: Install dependencies
        run: |
          cd build
          npm ci

      # 3️⃣ 安装 Puppeteer（需要 Chrome）
      - name: Install Puppeteer browsers
        run: |
          cd build
          npx puppeteer browsers install chrome
        env:
          PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: false

      # 4️⃣ Vite 打包 React 组件
      - name: Build React app
        run: |
          cd build
          npm run build:vite

      # 5️⃣ Puppeteer 生成 PDF
      - name: Generate PDF
        run: |
          cd build
          node build-pdf.js

      # 6️⃣ PDF → HTML（保留 pdf2htmlEX）
      - name: Convert PDF to HTML
        run: |
          docker run --rm \
            -v "$PWD":/pdf \
            -w /pdf \
            pdf2htmlex/pdf2htmlex:0.18.8.rc2-master-20200820-ubuntu-20.04-x86_64 \
            --zoom 1.5 \
            --process-outline 0 \
            resume.pdf

          mv resume.html index.html

      # 7️⃣ 准备 Pages 产物
      - name: Prepare site
        run: |
          mkdir site
          mv index.html site/
          mv resume.pdf site/
          [ -f CNAME ] && mv CNAME site/ || true

      # 8️⃣ 上传
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

**Step 2: 提交 workflow 更新**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: 更新 GitHub Actions 使用 React + Puppeteer 构建流程"
```

---

## Task 9: 清理旧构建文件（可选）

**Files:**
- Delete: `style.tex`（可选，保留作为参考）
- Delete: `style-local.tex`（可选）

**Step 1: 删除不再需要的 LaTeX 文件**

```bash
# 可选：删除 style.tex 和 style-local.tex
git rm style.tex style-local.tex
git commit -m "chore: 移除不再使用的 LaTeX 样式文件"
```

**或者保留作为参考：**

```bash
# 可选：创建 docs/archive/ 保留参考文件
mkdir -p docs/archive
git mv style.tex docs/archive/
git mv style-local.tex docs/archive/
git commit -m "chore: 归档 LaTeX 样式文件作为参考"
```

---

## Task 10: 推送并测试 GitHub Actions 构建

**Step 1: 推送所有改动到远程仓库**

```bash
git push origin main
```

Expected: 触发 GitHub Actions workflow

**Step 2: 监控 GitHub Actions 构建状态**

访问: `https://github.com/<username>/resume/actions`

Expected:
- Workflow 运行状态: "Build & Deploy Resume"
- 构建时间: ~25-30秒（相比之前的 ~45秒）
- 所有步骤成功完成

**Step 3: 验证 GitHub Pages 部署结果**

访问: `https://<username>.github.io/resume/`

Expected:
- 简历 HTML 正常显示
- PDF 文件可下载
- 内容完整，布局合理，配色正确

---

## Task 11: 验证自动缩放效果

**Step 1: 测试长简历内容**

临时修改 `resume.md`，添加更多内容：

```markdown
## 新增测试章节

### Additional Project
2020 — Present
- Item 1
- Item 2
- Item 3
...
```

运行构建：
```bash
cd build
node build-pdf.js
```

Expected: pretext 自动缩小字体，仍适配在一页内

**Step 2: 测试短简历内容**

临时删除部分 `resume.md` 内容，运行构建：

Expected: pretext 自动放大字体，充分利用页面空间

**Step 3: 恢复原始简历内容**

恢复 `resume.md` 到正常状态：

```bash
git checkout resume.md
```

---

## 完成！

**实施完成验证清单:**

✅ 所有文件创建成功（7个新文件）
✅ GitHub Actions workflow 更新完成
✅ 本地构建测试通过（PDF 生成成功）
✅ GitHub Actions 自动构建成功
✅ GitHub Pages 部署正常
✅ 自动缩放效果验证通过
✅ 配色方案保持一致（style.tex 配色融合）
✅ 构建时间改善（45秒 → 25秒）

**后续优化建议:**

- 可根据需要调整 `resume-config.json` 参数优化布局
- 可添加多套配色方案支持（创建多个配置文件）
- 可考虑添加 favicon 和 meta 标签优化 SEO

---

## 文件清单总结

**新增文件:**
1. `build/package.json` - Node.js 依赖配置
2. `build/vite.config.js` - Vite 打包配置
3. `build/renderer.jsx` - React 渲染组件（简化版）
4. `build/build-pdf.js` - Puppeteer 构建脚本
5. `build/index.html` - HTML 模板
6. `build/index.css` - 样式文件（融合配色）
7. `build/tailwind.config.js` - Tailwind 配置
8. `build/postcss.config.js` - PostCSS 配置
9. `resume-config.json` - 样式配置文件（项目根目录）

**修改文件:**
1. `.github/workflows/deploy.yml` - 构建流程更新

**可选删除:**
- `style.tex` - 可归档或删除
- `style-local.tex` - 可删除