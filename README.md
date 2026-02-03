# Codec JSON Validator Action

GitHub Action 和 npm 包，用于验证 codec.json 文件是否符合 BACnet 规范和数据类型规则。支持 18 种验证规则，包括基础字段验证和关联性验证。

## 📦 安装使用

### GitHub Action

```yaml
# .github/workflows/validate-codec.yml
name: Validate Codec
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: your-org/codec-validator-action@v1
```

### npm 包

```bash
npm install codec-validator-action
```

```typescript
import { validateCodec } from 'codec-validator-action';

const result = await validateCodec('./codec.json');
```

## ⚙️ 配置参数

| 参数 | 默认值 | 说明 |
|------|--------|------|
| `codec-path` | 自动检测 | codec.json 路径 |
| `fail-on-warning` | `false` | 警告时是否失败 |

## 🛠️ 本地开发

### 环境要求

- Node.js 20+
- npm 或 pnpm

### 开发步骤

```bash
# 1. 克隆仓库
git clone https://github.com/your-org/codec-validator-action.git
cd codec-validator-action

# 2. 安装依赖
npm install

# 3. 编译 TypeScript 并打包
npm run build

# 4. 提交 dist/ 目录（GitHub Actions 需要）
git add dist/
git commit -m "chore: update dist"
```

### 构建说明

项目使用 `@vercel/ncc` 打包 GitHub Action，使用 TypeScript 编译器生成 npm 包类型定义：

- `npm run build:action` - 编译 GitHub Action 到 `dist/action/`
- `npm run build:lib` - 编译 npm 包到 `dist/`
- `npm run build` - 同时编译两者

**重要**：`dist/` 目录必须提交到 Git，因为 GitHub Actions 运行时直接使用编译后的代码。

### 发布流程

```bash
# 1. 更新版本号
npm version patch  # 或 minor, major

# 2. 构建并提交
npm run build
git add .
git commit -m "chore: release v1.0.0"

# 3. 创建 tag 并推送
git tag v1.0.0
git push origin main --tags

# 4. 更新主版本 tag（推荐，方便用户使用 @v1）
git tag -fa v1 -m "Update v1 to v1.0.0"
git push origin v1 --force

# 5. 发布到 npm
npm publish
```

## 📚 项目结构

```
codec-validator-action/
├── src/
│   ├── main.ts              # GitHub Action 入口
│   ├── index.ts             # npm 包入口
│   ├── test/                # 验证器模块
│   │   ├── fields/          # 字段验证器
│   │   └── relations/       # 关联验证器
│   └── utils/               # 工具函数
├── dist/                    # 编译输出（需提交）
│   ├── action/              # GitHub Action 打包文件
│   └── *.js, *.d.ts         # npm 包文件
└── tsconfig.json            # TypeScript 配置
```

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件
