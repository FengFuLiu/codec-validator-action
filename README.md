# Codec JSON Validator Action

GitHub Action 和 npm 包，用于验证 codec.json 文件是否符合 BACnet 规范和数据类型规则。支持 18 种验证规则，包括基础字段验证和关联性验证。

## 📦 快速开始

### 作为 GitHub Action 使用

#### 基础用法

在项目根目录创建 `.github/workflows/validate-codec.yml`：

```yaml
name: Validate Codec

on:
  push:
    paths:
      - '**/*codec.json'  # 仅在 codec.json 变更时运行
  pull_request:
    paths:
      - '**/*codec.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate codec.json
        uses: FengFuLiu/codec-validator-action@main
```

#### 自定义配置

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate codec.json
        uses: FengFuLiu/codec-validator-action@main
        with:
          # 指定 codec.json 文件路径（可选，默认自动检测）
          codec-path: './config/device-codec.json'

          # 警告时是否失败（可选，默认 false）
          fail-on-warning: 'true'
```

#### 使用输出结果

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate codec.json
        id: validate
        uses: FengFuLiu/codec-validator-action@main
        continue-on-error: true

      - name: 处理验证结果
        run: |
          echo "验证结果: ${{ steps.validate.outputs.result }}"
          echo "错误数: ${{ steps.validate.outputs.errors-count }}"
          echo "警告数: ${{ steps.validate.outputs.warnings-count }}"

      - name: 验证失败时发送通知
        if: steps.validate.outputs.result == 'failed'
        run: echo "验证失败，请检查 codec.json 文件"
```

### 作为 npm 包使用

#### 安装

```bash
npm install codec-validator-action
# 或
pnpm add codec-validator-action
```

#### 使用

```typescript
import { CodecValidator } from 'codec-validator-action';

const validator = new CodecValidator();
const result = validator.validateCodecJson('./codec.json');

if (result.valid) {
  console.log('✅ 验证通过');
} else {
  console.error('❌ 验证失败:');
  result.errors.forEach(err => console.error(`  - ${err}`));
}

if (result.warnings.length > 0) {
  console.warn('⚠️  警告:');
  result.warnings.forEach(warn => console.warn(`  - ${warn}`));
}
```

## ⚙️ 参数说明

### 输入参数

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `codec-path` | string | ❌ | 自动检测 | codec.json 文件路径。未指定时自动在当前目录查找包含 "codec.json" 的文件 |
| `fail-on-warning` | boolean | ❌ | `false` | 是否将警告视为失败。设为 `true` 时，有警告也会导致 Action 失败 |

### 输出参数

| 参数 | 类型 | 说明 | 可能值 |
|------|------|------|--------|
| `result` | string | 验证结果状态 | `success` / `failed` |
| `errors-count` | string | 错误数量 | `0`, `1`, `2`, ... |
| `warnings-count` | string | 警告数量 | `0`, `1`, `2`, ... |

**使用示例：**

```yaml
- name: Validate
  id: validate
  uses: FengFuLiu/codec-validator-action@main

- name: 使用输出
  run: |
    if [[ "${{ steps.validate.outputs.result }}" == "success" ]]; then
      echo "✅ 验证通过"
    else
      echo "❌ 发现 ${{ steps.validate.outputs.errors-count }} 个错误"
    fi
```

## 🛠️ 本地开发

### 环境要求

- Node.js 20+
- npm 或 pnpm

### 开发步骤

```bash
# 1. 克隆仓库
git clone https://github.com/FengFuLiu/codec-validator-action.git
cd codec-validator-action

# 2. 安装依赖
npm install

# 3. 运行测试
npm test

# 4. 编译 TypeScript 并打包
npm run build

# 5. 提交 dist/ 目录（GitHub Actions 需要）
git add dist/
git commit -m "chore: update dist"
```

### 构建说明

项目使用 `@vercel/ncc` 打包 GitHub Action，使用 TypeScript 编译器生成 npm 包类型定义：

- `npm run build:action` - 编译 GitHub Action 到 `dist/action/`
- `npm run build:lib` - 编译 npm 包到 `dist/`
- `npm run build` - 同时编译两者
- `npm test` - 运行测试（126 个测试用例）

**重要**：`dist/` 目录必须提交到 Git，因为 GitHub Actions 运行时直接使用编译后的代码。

### 本地验证

项目提供了本地验证脚本，可直接验证指定的 codec.json 文件：

```bash
# 验证默认示例文件 (examples/codec.json)
npx tsx examples/validate.ts

# 验证指定路径的文件
npx tsx examples/validate.ts /path/to/your/codec.json
```

### 测试

项目包含全面的测试套件，覆盖所有验证器：

```bash
# 运行所有测试
npm test

# 监听模式（文件变化时自动运行）
npm run test:watch
```

**测试统计：**
- ✅ 126 个测试用例
- ✅ 48 个测试套件
- ✅ 覆盖 6 个验证器（4 个字段验证器 + 2 个关系验证器）

详见 [tests/README.md](tests/README.md) 获取完整测试文档。

### 发布流程

```bash
# 1. 运行测试
npm test

# 2. 构建项目
npm run build

# 3. 提交更改
git add .
git commit -m "chore: update build"
git push origin main

```

> **提示**：每次修改代码后，必须运行 `npm run build` 并提交 `dist/` 目录，否则 GitHub Actions 无法使用最新代码。

## 🔍 验证规则

本工具实现了 **18 种验证规则**，确保 codec.json 符合 BACnet 云端准出表/网关准入表标准：

### 字段验证（13 种）

| 字段 | 验证内容 |
|------|----------|
| `id` | 必填、唯一性、小写格式、长度≤127字节、不支持数组索引 |
| `name` | 字符串类型、长度≤64字节 |
| `description` | 字符串类型、长度≤1024字节 |
| `access_mode` | 枚举值（R/W/RW） |
| `data_type` | 枚举值（BOOL/NUMBER/ENUM/STRING） |
| `value_type` | 枚举值（UINT8/INT8/.../FLOAT/STRING） |
| `bacnet_type` | 枚举值（各种 BACnet 对象类型） |
| `unit` | 格式正确性 |
| `bacnet_unit_type_id` | 存在于 270+ BACnet 标准单位中 |
| `bacnet_unit_type` | 与 bacnet_unit_type_id 匹配 |
| `value` | 字符串类型、长度≤16字节 |
| `values` | BOOL/ENUM 必填、数组长度 2-50、value 为整数 |
| `max_length` | 合法性 |
| `reference` | 格式正确、引用 ID 存在 |

### 关联性验证（4 种）

| 组合 | 验证规则 |
|------|----------|
| `access_mode` + `bacnet_type` | R 只能用 input_object，W 只能用 output_object，RW 只能用 value_object |
| `data_type` + `bacnet_type` | BOOL 用 binary_*，NUMBER 用 analog_*，ENUM 用 multistate_* |
| `data_type` + `value_type` | 数据类型与值类型兼容（如 BOOL 只能用 UINT8） |
| 单位三元组 | unit、bacnet_unit_type_id、bacnet_unit_type 三者一致 |

## 📚 项目结构

```
codec-validator-action/
├── src/
│   ├── main.ts              # GitHub Action 入口
│   ├── index.ts             # npm 包入口
│   ├── test/                # 验证器模块
│   │   ├── fields/          # 字段验证器（13 个）
│   │   └── relationships/   # 关联验证器（4 个）
│   └── utils/               # 工具函数
├── examples/               # 本地验证示例
│   ├── codec.json          # 示例 codec.json 文件
│   └── validate.ts         # 本地验证脚本
├── tests/                   # 测试文件
│   ├── fields/              # 字段验证器测试
│   ├── relationships/       # 关联验证器测试
│   ├── helpers.ts           # 测试辅助函数
│   └── README.md            # 测试文档
├── dist/                    # 编译输出（需提交）
│   ├── action/              # GitHub Action 打包文件
│   └── *.js, *.d.ts         # npm 包文件
├── .github/
│   └── workflows/
│       └── ci.yml           # CI 工作流
├── package.json             # 项目配置
└── tsconfig.json            # TypeScript 配置
```

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件
