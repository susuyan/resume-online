#!/usr/bin/env node

/**
 * 本地预览服务器
 * 提供 PDF 和 HTML 文件预览
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const ROOT_DIR = path.join(__dirname, '..');

// MIME 类型映射
const MIME_TYPES = {
  '.html': 'text/html',
  '.pdf': 'application/pdf',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

// 颜色输出
const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 处理请求
function handleRequest(req, res) {
  let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);

  // 安全检查：防止目录遍历
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // 检查文件是否存在
  if (!fs.existsSync(filePath)) {
    // 尞找替代文件
    if (req.url === '/') {
      // 如果根路径没有 index.html，返回预览页面
      returnPreviewPage(res);
      return;
    }

    res.writeHead(404);
    res.end('File not found');
    return;
  }

  // 获取 MIME 类型
  const ext = path.extname(filePath);
  const mimeType = MIME_TYPES[ext] || 'text/plain';

  // 读取文件
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end('Internal server error');
      return;
    }

    res.writeHead(200, { 'Content-Type': mimeType });
    res.end(data);
  });
}

// 返回预览页面
function returnPreviewPage(res) {
  const hasPdf = fs.existsSync(path.join(ROOT_DIR, 'resume.pdf'));
  const hasHtml = fs.existsSync(path.join(ROOT_DIR, 'index.html'));

  const html = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>简历预览 - Resume Preview</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    }
    h1 {
      color: #1A365D;
      margin-bottom: 10px;
    }
    .subtitle {
      color: #718096;
      margin-bottom: 30px;
    }
    .preview-options {
      display: grid;
      gap: 20px;
      margin-top: 30px;
    }
    .preview-card {
      border: 2px solid #E2E8F0;
      padding: 20px;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .preview-card:hover {
      border-color: #C05621;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .preview-card.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .preview-card h2 {
      color: #1A365D;
      margin-bottom: 10px;
    }
    .preview-card p {
      color: #718096;
    }
    .status {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      margin-top: 10px;
    }
    .status.available {
      background: #C6F6D5;
      color: #22543D;
    }
    .status.not-available {
      background: #FED7D7;
      color: #742A2A;
    }
    .info {
      background: #EDF2F7;
      padding: 20px;
      border-radius: 8px;
      margin-top: 30px;
    }
    .info h3 {
      color: #2D3748;
      margin-bottom: 10px;
    }
    .info ul {
      color: #4A5568;
      margin-left: 20px;
    }
    .info code {
      background: #E2E8F0;
      padding: 2px 6px;
      border-radius: 3px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>简历预览 - Resume Preview</h1>
    <p class="subtitle">本地预览服务器运行中</p>

    <div class="preview-options">
      <a href="/resume.pdf" class="preview-card ${hasPdf ? '' : 'disabled'}" ${hasPdf ? '' : 'onclick="return false;"'}>
        <h2>📄 PDF 版本</h2>
        <p>在浏览器中查看 PDF 文件</p>
        <span class="status ${hasPdf ? 'available' : 'not-available'}">
          ${hasPdf ? '可用 - Available' : '未生成 - Not Generated'}
        </span>
      </a>

      <a href="/index.html" class="preview-card ${hasHtml ? '' : 'disabled'}" ${hasHtml ? '' : 'onclick="return false;"'}>
        <h2>🌐 HTML 版本</h2>
        <p>在浏览器中查看 HTML 文件（pdf2htmlEX 转换）</p>
        <span class="status ${hasHtml ? 'available' : 'not-available'}">
          ${hasHtml ? '可用 - Available' : '未生成 - Not Generated'}
        </span>
      </a>

      <a href="/resume.md" class="preview-card">
        <h2>📝 Markdown 源文件</h2>
        <p>查看简历原始内容</p>
        <span class="status available">可用 - Available</span>
      </a>

      <a href="/resume-config.json" class="preview-card">
        <h2>⚙️ 配置文件</h2>
        <p>查看样式配置</p>
        <span class="status available">可用 - Available</span>
      </a>
    </div>

    <div class="info">
      <h3>使用说明</h3>
      <ul>
        <li>如果文件未生成，运行测试脚本：<code>node tests/test-build.js</code></li>
        <li>完整测试（包括 PDF 转 HTML）：<code>node tests/test-build.js --full</code></li>
        <li>停止服务器：按 <code>Ctrl+C</code></li>
        <li>重新构建：修改 resume.md 后重新运行测试脚本</li>
      </ul>
    </div>
  </div>
</body>
</html>
  `;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}

// 创建服务器
const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  log('green', '\n========================================');
  log('green', '  本地预览服务器已启动');
  log('green', '========================================\n');

  log('cyan', `服务器地址: http://localhost:${PORT}`);
  log('cyan', `根目录: ${ROOT_DIR}\n`);

  log('blue', '可访问文件:');
  log('blue', '  - http://localhost:3000/               (预览首页)');
  log('blue', '  - http://localhost:3000/resume.pdf     (PDF 文件)');
  log('blue', '  - http://localhost:3000/index.html     (HTML 文件)');
  log('blue', '  - http://localhost:3000/resume.md      (Markdown 源文件)');
  log('blue', '  - http://localhost:3000/resume-config.json (配置文件)\n');

  log('blue', '停止服务器: Ctrl+C\n');
});

// 处理进程退出
process.on('SIGINT', () => {
  log('green', '\n服务器已停止\n');
  server.close();
  process.exit(0);
});