#!/bin/bash

# 简历构建测试脚本
# 测试流程: Markdown → PDF → HTML

set -e  # 遇到错误立即退出

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

function log() {
  echo -e "${1}${2}${NC}"
}

# 显示帮助信息
function show_help() {
  log $BLUE "简历构建测试脚本"
  log $BLUE "用法: $0 [选项]"
  log $BLUE ""
  log $BLUE "选项:"
  log $BLUE "  --full      运行完整测试（包括 PDF 转 HTML）"
  log $BLUE "  --preview   测试完成后启动预览服务器"
  log $BLUE "  --help      显示帮助信息"
  log $BLUE ""
  log $BLUE "示例:"
  log $BLUE "  $0                  # 仅生成 PDF"
  log $BLUE "  $0 --full           # 完整测试（PDF + HTML）"
  log $BLUE "  $0 --full --preview # 完整测试 + 预览"
  exit 0
}

# 解析参数
FULL_TEST=false
START_PREVIEW=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --full)
      FULL_TEST=true
      shift
      ;;
    --preview)
      START_PREVIEW=true
      shift
      ;;
    --help|-h)
      show_help
      ;;
    *)
      log $RED "未知参数: $1"
      show_help
      ;;
  esac
done

# 检查 Bun
log $BLUE "检查环境..."
if ! command -v bun &> /dev/null; then
  log $RED "❌ Bun 未安装"
  log $YELLOW "请安装 Bun: https://bun.sh/"
  exit 1
fi

BUN_VERSION=$(bun -v)
log $GREEN "✓ Bun 已安装: $BUN_VERSION"

# 检查 Docker (仅完整测试需要)
if [ "$FULL_TEST" = true ]; then
  if ! command -v docker &> /dev/null; then
    log $YELLOW "⚠ Docker 未安装，跳过 PDF 转 HTML 测试"
    log $YELLOW "安装 Docker: https://docs.docker.com/get-docker/"
    FULL_TEST=false
  else
    log $GREEN "✓ Docker 已安装"
  fi
fi

# 进入 build 目录
cd build

# 检查依赖
log $BLUE "\n检查依赖..."
if [ ! -d "node_modules" ]; then
  log $YELLOW "依赖未安装，正在安装..."
  bun install
  log $GREEN "✓ 依赖安装完成"
else
  log $GREEN "✓ 依赖已存在"
fi

# 返回根目录
cd ..

# 运行测试脚本
log $BLUE "\n========================================"
log $BLUE "  开始运行测试"
log $BLUE "========================================\n"

# 使用 build/test.js 运行测试
if [ "$FULL_TEST" = true ]; then
  node build/test.js --full 2>&1 | grep -E "^(npm|✓|❌|⚠|=|步骤|启动|注入|生成|输出|下一步)" || node build/test.js --full
else
  node build/test.js 2>&1 | grep -E "^(npm|✓|❌|⚠|=|步骤|启动|注入|生成|输出|下一步)" || node build/test.js
fi

# 启动预览服务器
if [ "$START_PREVIEW" = true ]; then
  log $BLUE "\n========================================"
  log $BLUE "  启动预览服务器"
  log $BLUE "========================================\n"

  node tests/preview-server.js
fi

log $GREEN "\n========================================"
log $GREEN "  所有测试完成"
log $GREEN "========================================\n"

if [ "$START_PREVIEW" = false ]; then
  log $BLUE "下一步:"
  log $BLUE "  - 查看生成的文件: ls -lh resume.pdf index.html"
  log $BLUE "  - 启动预览服务器: node tests/preview-server.js"
  log $BLUE "  - 访问预览页面: http://localhost:3000"
fi