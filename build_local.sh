#!/bin/bash

# 检查是否安装了 pandoc
if ! command -v pandoc &> /dev/null; then
    echo "❌ 错误: 未找到 pandoc。请先安装: brew install pandoc"
    exit 1
fi

# 检查是否安装了 MacTeX (xelatex)
if ! command -v xelatex &> /dev/null; then
    echo "❌ 错误: 未找到 xelatex。请安装 MacTeX 或 BasicTeX。"
    echo "推荐: brew install --cask basictex"
    exit 1
fi

echo "🚀 开始构建本地简历预览..."

# 创建临时副本进行变量替换
cp resume.md resume_preview.md

# 替换占位符（使用本地测试数据，避免污染真实数据）
sed -i '' 's/{{PHONE}}/176xxxx2027/g' resume_preview.md
sed -i '' 's/{{EMAIL}}/susuyan@example.com/g' resume_preview.md
sed -i '' 's/{{WECHAT}}/susuyan_local/g' resume_preview.md

# 执行构建命令（参数与 GitHub Actions 保持一致）
pandoc resume_preview.md \
    --pdf-engine=xelatex \
    --include-in-header=style.tex \
    -V mainfont="PingFang SC" \
    -V fontsize=11pt \
    -V papersize=a4 \
    -o resume_preview.pdf

# 清理临时文件
rm resume_preview.md

if [ -f resume_preview.pdf ]; then
    echo "✅ 构建成功: resume_preview.pdf"
    open resume_preview.pdf
else
    echo "❌ 构建失败"
    exit 1
fi
