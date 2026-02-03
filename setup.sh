#!/bin/bash

# 快速启动脚本 - 自动化部署 codec-validator-action

set -e

echo "🚀 Codec Validator Action - 快速启动脚本"
echo "========================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "action.yml" ]; then
    echo "❌ 错误: 请在 codec-validator-action 目录中运行此脚本"
    exit 1
fi

# 1. 安装依赖
echo "📦 步骤 1/4: 安装依赖..."
npm install

# 2. 构建项目
echo "🔨 步骤 2/4: 构建项目..."
npm run build

# 3. 检查 dist 目录
if [ ! -d "dist" ]; then
    echo "❌ 错误: dist 目录未生成"
    exit 1
fi

echo "✅ 构建完成！"
echo ""

# 4. Git 操作（可选）
read -p "是否初始化 Git 仓库并创建首次提交? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 步骤 3/4: 初始化 Git..."

    if [ ! -d ".git" ]; then
        git init
        git branch -M main
    fi

    git add .
    git commit -m "feat: initial commit with codec validator action" || echo "⚠️  没有新的更改需要提交"

    echo ""
    read -p "请输入 GitHub 仓库 URL (例如: https://github.com/your-org/codec-validator-action.git): " REPO_URL

    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
        echo "✅ 远程仓库已设置: $REPO_URL"

        read -p "是否立即推送到 GitHub? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            git push -u origin main
            echo "✅ 代码已推送！"
        fi
    fi
fi

echo ""
echo "🎉 完成！接下来的步骤:"
echo ""
echo "1. 创建版本标签:"
echo "   git tag -a v1.0.0 -m 'Release v1.0.0'"
echo "   git push origin v1.0.0"
echo "   git tag -a v1 -m 'Release v1'"
echo "   git push origin v1"
echo ""
echo "2. 在其他项目中使用:"
echo "   创建 .github/workflows/validate-codec.yml"
echo "   使用: uses: your-org/codec-validator-action@v1"
echo ""
echo "详细文档请查看 README.md 和 DEPLOYMENT.md"
