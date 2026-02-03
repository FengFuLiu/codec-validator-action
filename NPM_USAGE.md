# Codec Validator - 双用途使用指南

这个包既可以作为 **GitHub Action** 使用，也可以作为 **npm 包**在其他 Node.js 项目中使用。

---

## 📦 作为 npm 包使用

### 安装

#### 从 GitHub 安装（推荐）

```bash
npm install github:FengFuLiu/codec-validator-action
```

#### 从 npm 安装（需要先发布）

```bash
npm install codec-validator-action
```

### 使用示例

#### 基础用法

```typescript
import { CodecValidator } from 'codec-validator-action';

const validator = new CodecValidator();
const result = validator.validateCodecJson('./path/to/codec.json');

if (result.valid) {
  console.log('✅ 验证通过');
} else {
  console.log('❌ 验证失败');
  result.errors.forEach(error => console.error(error));
}

if (result.warnings.length > 0) {
  console.log('⚠️  发现警告');
  result.warnings.forEach(warning => console.warn(warning));
}
```

#### 在 sensor-codec-gen 中使用

```typescript
// src/test/index.ts
import { CodecValidator } from 'codec-validator-action';

function validateCodecJsonFile(codecJsonPath: string, showHeader: boolean = true) {
  if (showHeader) {
    console.log('\n========== Codec.json 验证 ==========');
  }

  if (!fs.existsSync(codecJsonPath)) {
    if (showHeader) {
      console.log('⚠️  未找到 codec.json 文件，跳过验证');
      console.log('====================================\n');
    }
    return { found: false, valid: false };
  }

  const validator = new CodecValidator();
  const result = validator.validateCodecJson(codecJsonPath);

  // ... 输出结果

  return { found: true, valid: result.valid };
}
```

#### 验证测试数据

```typescript
import { CodecValidator } from 'codec-validator-action';

const validator = new CodecValidator();
const testData = {
  temperature: 25.5,
  humidity: 60
};

const result = validator.validateTestDataAgainstCodec(
  testData,
  './codec.json'
);

if (!result.valid) {
  result.errors.forEach(error => console.error(error));
}
```

### API 文档

#### CodecValidator

##### `validateCodecJson(codecJsonPath: string)`

验证 codec.json 文件的完整性和正确性。

**参数:**
- `codecJsonPath` - codec.json 文件的绝对路径

**返回值:**
```typescript
{
  valid: boolean;      // 是否验证通过（无错误）
  errors: string[];    // 错误列表
  warnings: string[];  // 警告列表
}
```

##### `validateTestDataAgainstCodec(testData: object, codecJsonPath: string)`

验证测试数据中的字段是否在 codec.json 中定义。

**参数:**
- `testData` - 测试数据对象
- `codecJsonPath` - codec.json 文件路径

**返回值:**
```typescript
{
  valid: boolean;    // 是否所有字段都已定义
  errors: string[];  // 未定义的字段列表
}
```

### TypeScript 类型

```typescript
import type {
  CodecJson,
  CodecObject,
  ValidationResult,
  BacnetUnitDef
} from 'codec-validator-action';
```

### BACnet 单位定义

```typescript
import { bacnet_units_def } from 'codec-validator-action';

// 查找单位
const tempUnit = bacnet_units_def.find(u => u.unit === '°C');
console.log(tempUnit);
// { unit_type_id: 62, unit: '°C', unit_type: 'UNITS_DEGREES_CELSIUS' }
```

---

## 🎬 作为 GitHub Action 使用

请参考主 [README.md](./README.md)

---

## 🔧 开发

### 构建

```bash
# 同时构建 Action 和 npm 包
npm run build

# 只构建 Action
npm run build:action

# 只构建 npm 包
npm run build:lib
```

### 目录结构

```
dist/
├── action/              # GitHub Action 编译产物
│   └── index.js         # 使用 @vercel/ncc 打包，包含所有依赖
└── lib.js               # npm 包入口
    lib.d.ts             # TypeScript 类型定义
    test/                # 验证器模块
    utils/               # 工具模块
```

---

## 📄 License

MIT
