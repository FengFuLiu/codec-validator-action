# 测试文档

## 测试概述

本项目使用 Node.js 内置的 test runner 进行测试，通过 `tsx` 支持 TypeScript。

## 运行测试

```bash
# 运行所有测试
npm test

# 监听模式（文件变化时自动重新运行）
npm run test:watch
```

## 测试覆盖范围

### 已完成测试的验证器

#### 字段验证器 (4/13)

1. **DescriptionValidator** - 17 个测试
   - 非必填字段验证
   - 数据类型验证
   - 字节长度验证（1024 字节限制）
   - 多字节字符处理（中文、emoji）
   - 边界情况测试

2. **IdValidator** - 18 个测试
   - 必填字段验证
   - 数据类型验证
   - 字节长度验证（127 字节限制）
   - 格式验证（小写、不支持数组索引）
   - 唯一性验证
   - 真实场景测试

3. **NameValidator** - 12 个测试
   - 非必填字段验证
   - 数据类型验证
   - 字节长度验证（64 字节限制）
   - 多字节字符处理
   - 真实场景测试

4. **ValueValidator** - 37 个测试
   - value 字段验证（字符串、16 字节限制）
   - values 数组验证（BOOL 类型）
   - values 数组验证（ENUM 类型）
   - 通用验证（整数类型、name 长度）
   - 真实场景测试

#### 关系验证器 (2/4)

1. **AccessModeValidator** - 21 个测试
   - access_mode = R（只读）规则验证
   - access_mode = W（只写）规则验证
   - access_mode = RW（读写）规则验证
   - STRUCT 类型特殊处理
   - 无效 access_mode 处理
   - 真实场景测试

2. **DataTypeValidator** - 21 个测试
   - data_type 和 bacnet_type 组合验证
   - data_type 和 value_type 组合验证
   - 所有数据类型组合测试（BOOL、NUMBER、ENUM、STRING/TEXT）
   - 真实场景测试

### 待完成测试的验证器

#### 字段验证器 (9个)
- AccessModeValidator (字段)
- BacnetTypeValidator
- BacnetUnitTypeIdValidator
- BacnetUnitTypeValidator
- DataTypeValidator (字段)
- MaxLengthValidator
- ReferenceValidator (字段)
- UnitValidator (字段)
- ValueTypeValidator

#### 关系验证器 (2个)
- ReferenceValidator (关系)
- UnitValidator (关系)

## 测试统计

- **总测试数**: 126
- **通过**: 126
- **失败**: 0
- **测试套件**: 48

## 测试辅助工具

项目提供了以下测试辅助函数（位于 `tests/helpers.ts`）：

- `createTestCodecObject()` - 创建基础测试对象
- `generateStringWithByteLength()` - 生成指定字节长度的字符串
- `generateMultiByteString()` - 生成包含多字节字符的字符串

## 添加新测试

1. 在 `tests/fields/` 或 `tests/relationships/` 目录下创建新的测试文件
2. 文件命名格式：`<validator-name>.test.ts`
3. 使用 Node.js test runner 的 `describe` 和 `test` 函数
4. 参考现有测试文件的结构和风格

### 测试文件示例

```typescript
import { describe, test } from 'node:test';
import assert from 'node:assert';
import { YourValidator } from '../../src/test/fields/your-validator';
import { createTestCodecObject } from '../helpers';

describe('YourValidator', () => {
  describe('测试分组', () => {
    test('测试用例描述', () => {
      const item = createTestCodecObject({ /* 测试数据 */ });
      const result = YourValidator.validate(item);

      assert.strictEqual(result.valid, true);
    });
  });
});
```

## 持续集成

测试可以集成到 CI/CD 流程中：

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm test
```

## 最佳实践

1. **全面覆盖**: 每个验证器应测试所有验证规则
2. **边界情况**: 测试临界值（如长度限制的 ±1）
3. **真实场景**: 包含实际使用中的典型案例
4. **清晰命名**: 测试描述应清楚说明测试内容
5. **独立性**: 每个测试应该独立运行，不依赖其他测试
