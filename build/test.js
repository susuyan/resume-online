#!/usr/bin/env node

/**
 * 测试脚本包装器（在 build 目录运行）
 * 加载 tests/test-build.js 并执行
 */

// 设置 NODE_PATH 为 build/node_modules
process.env.NODE_PATH = __dirname + '/node_modules';
require('module').Module._initPaths();

// 加载测试脚本
require('../tests/test-build.js-runner');