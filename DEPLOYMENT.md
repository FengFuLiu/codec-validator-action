# 部署步骤

## 1. 创建新的 GitHub 仓库

```bash
# 在 GitHub 上创建新仓库: codec-validator-action
# 然后执行以下命令
cd codec-validator-action
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-org/codec-validator-action.git
git push -u origin main
```

## 2. 安装依赖并构建

```bash
npm install
npm run build
```

⚠️ **重要**: GitHub Actions 需要 `dist/` 目录，所以必须提交它！

```bash
git add dist/
git commit -m "chore: add compiled dist"
git push
```

## 3. 创建第一个版本

```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 创建主版本标签（方便用户使用 @v1）
git tag -a v1 -m "Release v1"
git push origin v1
```

## 4. 在其他项目中使用

在任何 GitHub 仓库中创建 `.github/workflows/validate-codec.yml`:

```yaml
name: Validate Codec

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: your-org/codec-validator-action@v1
```

## 5. 更新 Action

每次更新代码后：

```bash
# 1. 重新构建
npm run build

# 2. 提交更改
git add .
git commit -m "feat: add new feature"
git push

# 3. 创建新版本
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0

# 4. 更新主版本标签
git tag -fa v1 -m "Update v1 to v1.1.0"
git push origin v1 --force
```

## 6. 发布到 GitHub Marketplace（可选）

1. 在 GitHub 仓库页面，点击 "Releases"
2. 创建新的 Release，选择刚才创建的 tag
3. 勾选 "Publish this Action to the GitHub Marketplace"
4. 填写类别和描述
5. 发布

## 7. 测试

在一个测试仓库中创建 codec.json 文件并测试 workflow 是否正常运行。
