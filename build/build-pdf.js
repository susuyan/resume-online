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
      timeout: 30000
    });

    console.log('等待字体加载...');

    // 等待 Google Fonts 加载完成
    await page.waitForFunction(() => {
      return document.fonts.check('400px "Noto Sans SC"') &&
             document.fonts.check('700px "Noto Sans SC"');
    }, {
      timeout: 30000
    });

    console.log('注入简历内容...');

    // 等待 renderResume 函数可用
    await page.waitForFunction(() => typeof window.renderResume === 'function', {
      timeout: 15000
    });

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