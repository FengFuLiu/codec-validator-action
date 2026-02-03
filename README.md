# Codec JSON Validator Action

[![GitHub Release](https://img.shields.io/github/v/release/your-org/codec-validator-action)](https://github.com/your-org/codec-validator-action/releases)
[![License](https://img.shields.io/github/license/your-org/codec-validator-action)](LICENSE)

GitHub Action 用于验证 codec.json 文件是否符合 BACnet 规范和数据类型规则。

## ✨ 功能特性

- ✅ 验证 `access_mode`、`data_type`、`bacnet_type` 等字段的组合规则
- ✅ 检查 BACnet 单位定义（270+ 单位类型）
- ✅ 验证字段引用完整性
- ✅ 检查 `name` 字段长度（最大 64 字节）
- ✅ 验证枚举值（`values` 数组）
- ✅ 支持自动查找或指定 codec.json 路径
- ✅ 区分错误和警告，可配置失败策略

## 📦 使用方法

### 基础用法

在你的项目中创建 `.github/workflows/validate-codec.yml`:

```yaml
name: Validate Codec

on:
  push:
    paths:
      - '**/*codec.json'
  pull_request:
    paths:
      - '**/*codec.json'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Validate codec.json
        uses: your-org/codec-validator-action@v1
```

### 高级用法

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate codec.json
        uses: your-org/codec-validator-action@v1
        with:
          # 指定 codec.json 文件路径（可选，默认自动检测）
          codec-path: './config/my-codec.json'

          # 遇到警告时是否失败（可选，默认 false）
          fail-on-warning: 'true'
```

### 使用输出

```yaml
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate codec.json
        id: validate
        uses: your-org/codec-validator-action@v1

      - name: Check validation result
        if: steps.validate.outputs.result == 'success'
        run: echo "验证通过！"

      - name: Report errors
        if: steps.validate.outputs.errors-count != '0'
        run: echo "发现 ${{ steps.validate.outputs.errors-count }} 个错误"

      - name: Report warnings
        if: steps.validate.outputs.warnings-count != '0'
        run: echo "发现 ${{ steps.validate.outputs.warnings-count }} 个警告"
```

## ⚙️ 输入参数

| 参数 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `codec-path` | ❌ | `''` (自动检测) | codec.json 文件路径 |
| `fail-on-warning` | ❌ | `false` | 遇到警告时是否失败 |

## 📤 输出

| 名称 | 说明 | 示例值 |
|------|------|--------|
| `result` | 验证结果 | `success` / `failed` |
| `errors-count` | 错误数量 | `0`, `3` |
| `warnings-count` | 警告数量 | `0`, `5` |

## 📋 验证规则

### 1. Access Mode 规则

| access_mode | 允许的 bacnet_type |
|-------------|-------------------|
| `R` | `binary_input_object`, `analog_input_object`, `multistate_value_object`, `character_string_value_object` |
| `W` | `binary_output_object`, `analog_output_object`, `multistate_value_object`, `character_string_value_object` |
| `RW` | `binary_value_object`, `analog_value_object`, `multistate_value_object`, `character_string_value_object` |

### 2. Data Type 规则

| data_type | 允许的 bacnet_type | 允许的 value_type |
|-----------|-------------------|------------------|
| `BOOL` | `binary_*_object` | `UINT8` |
| `NUMBER` | `analog_*_object` | `INT8`, `UINT8`, `INT16`, `UINT16`, `INT32`, `UINT32`, `FLOAT` |
| `ENUM` | `multistate_value_object` | `UINT8`, `UINT16`, `INT16` |
| `STRING` | `character_string_value_object` | `STRING` |

### 3. 其他规则

- ✅ BACnet 单位必须在标准单位列表中（270+ 单位）
- ✅ `reference` 字段引用的 ID 必须存在
- ✅ `name` 字段长度不超过 64 字节
- ✅ `values` 数组至少包含 2 个元素
- ✅ `value` 字段必须是字符串类型

## 🔍 验证示例

### ✅ 通过的示例

```json
{
  "version": "1.0.0",
  "object": [
    {
      "id": "temperature",
      "name": "Temperature Sensor",
      "access_mode": "R",
      "data_type": "NUMBER",
      "value_type": "FLOAT",
      "bacnet_type": "analog_input_object",
      "unit": "°C",
      "bacnet_unit_type_id": 62,
      "bacnet_unit_type": "UNITS_DEGREES_CELSIUS"
    }
  ]
}
```

### ❌ 错误的示例

```json
{
  "version": "1.0.0",
  "object": [
    {
      "id": "switch",
      "access_mode": "R",
      "data_type": "BOOL",
      "value_type": "UINT8",
      "bacnet_type": "binary_output_object",  // ❌ R 模式不能用 output
      "unit": "invalid",                       // ❌ 无效的单位
      "bacnet_unit_type_id": 999               // ❌ 不存在的单位 ID
    }
  ]
}
```

## 🛠️ 本地开发

### 构建 Action

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
git push
```

### 发布新版本

```bash
# 1. 创建新的 tag
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 2. 更新主版本 tag（推荐）
git tag -fa v1 -m "Update v1 to v1.0.0"
git push origin v1 --force
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 License

MIT License - 详见 [LICENSE](LICENSE) 文件
