# 简历优化实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 重构简历内容结构和视觉布局，突出 AI-Native + 端到端交付差异化优势

**Architecture:** 模块化设计，先调整信息骨架，再优化渲染逻辑和样式，渐进式迭代

**Tech Stack:** React, Markdown, CSS, pretext 自动缩放算法

---

## Task 1: 重新组织 resume.md 结构 - 头部和个人简介

**Files:**
- Modify: `resume.md:1-5`

**Step 1: 重写头部信息**

将现有的头部信息：
```markdown
# 余胜民 | 全栈软件交付工程师

> 10年软件工程经验，专注端到端技术交付与 AI 辅助开发。深度使用 Claude Code、Cursor 等 AI 编程工具提升开发效率，具备从需求洞察、架构设计到全栈开发、部署运维的完整闭环能力。擅长独立交付复杂系统，成功交付覆盖 VR、移动应用、企业 ERP 等多领域产品。

**17600512027** · **susuyan@163.com** · **微信: susuyan_dream**
```

替换为：
```markdown
# 余胜民
全栈软件交付工程师
17600512027 · susuyan@163.com · 微信: susuyan_dream · github.com/susuyan

I build end-to-end systems with AI-powered development workflows. Spent the last year making Claude Code and Cursor write 40% of my code, then telling clients it was my plan all along. Most productive when turning ambiguous requirements into shipped products.
```

**Step 2: 验证 Markdown 格式**

确保：
- 姓名是 `# 余胜民`（一级标题）
- 职位单独一行，无 markdown 标记
- 联系方式用 `·` 分隔，紧凑排列
- 个人简介段落清晰

**Step 3: 提交更改**

```bash
git add resume.md
git commit -m "feat: 优化头部和个人简介结构"
```

---

## Task 2: 新增核心优势模块到 resume.md

**Files:**
- Modify: `resume.md:7-10`

**Step 1: 在个人简介后添加核心优势模块**

在个人简介后添加：
```markdown
---

## 核心优势

AI-Native (效率提升40%) · Full-Cycle (交付缩短30%) · High-Performance (10K+/秒) · Business Impact (500+门店)
```

**Step 2: 验证格式**

确保：
- 使用 `##` 二级标题
- 核心优势用 `·` 分隔
- 格式：关键词 (量化数据)

**Step 3: 提交更改**

```bash
git add resume.md
git commit -m "feat: 新增核心优势模块"
```

---

## Task 3: 优化工作经历描述（海伦司）

**Files:**
- Modify: `resume.md:52-57`

**Step 1: 重写海伦司工作经历**

将现有的描述优化为：
```markdown
### 软件交付工程师 — 深圳海伦司企业管理有限公司
2021.04 ~ 2025.09

- Architected ERP and OA systems covering 500+ stores, improving operational efficiency by 40%
- Designed intelligent music playback system, reducing store management costs by 60%
- Implemented CI/CD pipeline with Docker and GitHub Actions, reducing deployment time from weekly to daily
- Established code review and automated testing framework, reducing defect rate by 45%
```

**Step 2: 验证格式**

确保：
- 使用 `###` 三级标题
- 格式：职位 — 公司
- 时间格式：YYYY.MM ~ YYYY.MM 或 Present
- 成就描述用 `-` 列表
- 使用动作动词开头

**Step 3: 提交更改**

```bash
git add resume.md
git commit -m "feat: 优化海伦司工作经历描述"
```

---

## Task 4: 优化精选项目描述（PICO VR）

**Files:**
- Modify: `resume.md:21-32`

**Step 1: 重写 PICO VR 项目描述**

优化为：
```markdown
### PICO VR 数据采集平台
**全栈交付顾问** · 2025.11 ~ Present

- Architected cross-platform VR data collection system (Unity/C#/Node.js/React/Flutter)
- Engineered high-concurrency service processing 10,000+ sensor records per second
- Integrated PICO VR SDK for spatial tracking, improving data accuracy by 35%
- Delivered end-to-end solution, reducing project timeline by 30%
```

**Step 2: 移除技术栈行**

删除原来的 `**技术栈**: ...` 行，因为技能将改为标签云展示。

**Step 3: 提交更改**

```bash
git add resume.md
git commit -m "feat: 优化 PICO VR 项目描述"
```

---

## Task 5: 优化精选项目描述（代驾计价）

**Files:**
- Modify: `resume.md:36-46`

**Step 1: 重写代驾计价项目描述**

优化为：
```markdown
### 代驾计价平台
**创始人 & 全栈工程师** · 2019.12 ~ 2021.03

- Delivered full-platform product (iOS/Backend/Payment) from concept to App Store launch
- Integrated Gaode Maps SDK, achieving 99.5% location accuracy for 10,000+ drivers
- Implemented iFlytek voice SDK for hands-free operation, improving efficiency by 50%
- Built multi-channel payment system (Alipay/WeChat/UnionPay), processing 5M+ monthly
```

**Step 2: 移除技术栈行**

删除 `**技术栈**: ...` 行。

**Step 3: 提交更改**

```bash
git add resume.md
git commit -m "feat: 优化代驾计价项目描述"
```

---

## Task 6: 调整技能为标签云格式

**Files:**
- Modify: `resume.md:62-73`

**Step 1: 替换技能表格为标签云**

将现有的技能表格替换为：
```markdown
## 技能

TypeScript · React · Python · Node.js · Docker · Claude Code · Cursor · Swift · PostgreSQL · Kubernetes · AWS · Flutter · Unity 3D · C# · CI/CD · 系统设计 · 快速交付 · 全栈思维 · AI 工具链集成
```

**Step 2: 验证标签云格式**

确保：
- 使用 `##` 二级标题
- 标签用 `·` 分隔
- 技术栈 + 软技能混合
- 紧凑排列，无分组

**Step 3: 提交更改**

```bash
git add resume.md
git commit -m "feat: 调整技能为标签云格式"
```

---

## Task 7: 简化教育背景

**Files:**
- Modify: `resume.md:77-80`

**Step 1: 简化教育背景**

将现有内容简化为：
```markdown
## 教育背景

**洛阳理工学院** | 计算机应用技术 | 2012 ~ 2015
```

**Step 2: 提交更改**

```bash
git add resume.md
git commit -m "feat: 简化教育背景"
```

---

## Task 8: 删除"其他"模块

**Files:**
- Modify: `resume.md:83-86`

**Step 1: 删除"其他"模块**

删除：
```markdown
## 其他

- **GitHub**: https://github.com/susuyan
- **语言**: 中文（母语）、英文（读写流畅）
```

（GitHub 链接已在头部联系方式中，语言能力可选保留或删除）

**Step 2: 提交更改**

```bash
git add resume.md
git commit -m "feat: 删除冗余的其他模块"
```

---

## Task 9: 在 renderer.jsx 中新增核心优势渲染逻辑

**Files:**
- Modify: `build/renderer.jsx:75-144`

**Step 1: 在 parseMarkdown 函数中识别核心优势模块**

在 `parseMarkdown` 函数中，新增对 `## 核心优势` 的识别：

```javascript
// 在 parseMarkdown 函数中添加（大约在第 85 行之后）
if (line === "## 核心优势") {
  currentSection = "core-strengths";
  return;
}

if (currentSection === "core-strengths" && line.startsWith("AI-Native")) {
  // 解析核心优势行
  const strengths = line.split("·").map(s => s.trim());

  blocks.push({
    type: "core-strengths",
    strengths: strengths.map(s => {
      const match = s.match(/^(.+?)\s*\((.+?)\)/);
      if (match) {
        return {
          keyword: match[1].trim(),
          metric: match[2].trim()
        };
      }
      return { keyword: s, metric: "" };
    })
  });

  currentSection = "";
  return;
}
```

**Step 2: 在 Resume 组件中渲染核心优势模块**

在 `Resume` 组件的返回部分，添加核心优势模块渲染：

```jsx
// 在个人简介后、工作经历前添加
{blocks.filter(b => b.type === "core-strengths").map((block, i) => (
  <div key={i} className="core-strengths-card" style={{
    marginTop: 12,
    marginBottom: 12,
    padding: "8px 12px",
    backgroundColor: "#EDF2F7",
    borderLeft: "3px solid #1A365D",
    fontSize: "0.95em",
    fontWeight: 600,
    color: "#1A365D"
  }}>
    {block.strengths.map((s, j) => (
      <span key={j}>
        {s.keyword}
        {s.metric && <span style={{ color: "#C05621" }}> ({s.metric})</span>}
        {j < block.strengths.length - 1 && " · "}
      </span>
    ))}
  </div>
))}
```

**Step 3: 提交更改**

```bash
git add build/renderer.jsx
git commit -m "feat: 新增核心优势模块渲染逻辑"
```

---

## Task 10: 在 renderer.jsx 中优化技能标签云渲染

**Files:**
- Modify: `build/renderer.jsx:98-103`

**Step 1: 修改技能模块的解析逻辑**

在 `parseMarkdown` 函数中，修改技能模块的解析：

```javascript
// 修改现有的技能解析逻辑
if (line === "## 技能") {
  currentSection = "skills";
  return;
}

if (currentSection === "skills" && line && !line.startsWith("#")) {
  // 将技能标签云作为一个文本块
  blocks.push({
    type: "skills-cloud",
    text: line
  });
  currentSection = "";
  return;
}
```

**Step 2: 在 Resume 组件中渲染技能标签云**

修改技能的渲染逻辑：

```jsx
{blocks.filter(b => b.type === "skills-cloud").map((block, i) => (
  <div key={i} style={{ marginTop: 12, marginBottom: 12 }}>
    <div style={{ fontSize: "1.1em", fontWeight: 700, color: "#1A365D", marginBottom: 4 }}>
      技能
    </div>
    <div style={{ lineHeight: 1.6, color: "#2D3748" }}>
      {block.text}
    </div>
  </div>
))}
```

**Step 3: 提交更改**

```bash
git add build/renderer.jsx
git commit -m "feat: 优化技能标签云渲染逻辑"
```

---

## Task 11: 在 index.css 中新增核心优势卡片样式

**Files:**
- Modify: `build/index.css`

**Step 1: 添加核心优势卡片样式**

在 `index.css` 文件末尾添加：

```css
/* 核心优势卡片样式 */
.core-strengths-card {
  margin-top: 12px;
  margin-bottom: 12px;
  padding: 8px 12px;
  background-color: #EDF2F7;
  border-left: 3px solid #1A365D;
  font-size: 0.95em;
  font-weight: 600;
  color: #1A365D;
  line-height: 1.6;
}

.core-strengths-card span {
  display: inline;
}
```

**Step 2: 提交更改**

```bash
git add build/index.css
git commit -m "feat: 新增核心优势卡片样式"
```

---

## Task 12: 本地构建测试

**Step 1: 切换到 build 目录**

```bash
cd build
```

**Step 2: 运行 Vite 构建**

```bash
npm run build:vite
```

Expected: 生成 `dist/renderer.bundle.js` 和 `dist/index.css`

**Step 3: 运行 Puppeteer 生成 PDF**

```bash
node build-pdf.js
```

Expected:
- 输出: "启动 Puppeteer..." → "注入简历内容..." → "生成 PDF..." → "构建完成!"
- 生成: `../resume.pdf`

**Step 4: 验证 PDF 效果**

```bash
ls -lh ../resume.pdf
# macOS: open ../resume.pdf
```

验证：
- 核心优势卡片是否显示
- 技能标签云是否正确
- 整体布局是否合理
- 信息密度是否提升

**Step 5: 如果验证失败，调试并修复**

检查：
- `renderer.jsx` 是否正确解析核心优势
- 样式是否正确应用
- PDF 是否正确生成

---

## Task 13: 提交所有更改并推送

**Step 1: 确认所有更改已提交**

```bash
git status
```

Expected: 无未提交的更改

**Step 2: 推送到远程仓库**

```bash
git push origin main
```

Expected: 推送成功，触发 GitHub Actions 构建

---

## Task 14: 验证在线简历效果

**Step 1: 访问 GitHub Pages**

访问: `https://susuyan.github.io/resume-online/`

**Step 2: 验证在线简历**

检查：
- 核心优势卡片显示正确
- 技能标签云格式正确
- 整体视觉效果符合预期
- PDF 可正常下载

**Step 3: 根据效果调整参数**

如果需要微调：
- 调整 `resume-config.json` 中的间距参数
- 调整 `build/index.css` 中的样式
- 重新构建并验证

---

## 完成！

**实施完成验证清单:**

✅ 所有模块已创建并优化
✅ 核心优势卡片渲染正确
✅ 技能标签云显示正确
✅ 本地构建测试通过
✅ GitHub Actions 构建成功
✅ 在线简历部署正常
✅ 信息密度提升
✅ 视觉层次清晰
✅ 核心优势突出

**后续优化建议:**

- 可根据不同岗位类型定制多套简历
- 可调整配色方案适应不同公司风格
- 可新增项目作品集模块展示更多案例