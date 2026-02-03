/**
 * Value 字段验证器测试
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { ValueValidator } from '../../src/test/fields/value';
import { createTestCodecObject, generateStringWithByteLength } from '../helpers';

describe('ValueValidator', () => {
	describe('value 字段验证', () => {
		describe('非必填字段', () => {
			test('value 不存在时应通过', () => {
				const item = createTestCodecObject({ value: undefined });
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, true);
			});

			test('value 为 null 时应通过', () => {
				const item = createTestCodecObject({ value: null as any });
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, true);
			});

			test('value 为空字符串时应通过', () => {
				const item = createTestCodecObject({ value: '' });
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, true);
			});
		});

		describe('数据类型验证', () => {
			test('value 为字符串时应通过', () => {
				const item = createTestCodecObject({ value: 'test' });
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, true);
			});

			test('value 为数字时应失败', () => {
				const item = createTestCodecObject({ value: 123 as any });
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, false);
				assert.match(result.message!, /value 必须是字符串类型, 得到 number/);
			});

			test('value 为对象时应失败', () => {
				const item = createTestCodecObject({ value: {} as any });
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, false);
			});
		});

		describe('字节长度验证', () => {
			test('16 字节的 value 应通过', () => {
				const item = createTestCodecObject({
					value: generateStringWithByteLength(16),
				});
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, true);
			});

			test('17 字节的 value 应失败', () => {
				const item = createTestCodecObject({
					value: generateStringWithByteLength(17),
				});
				const result = ValueValidator.validate(item);
				assert.strictEqual(result.valid, false);
				assert.match(result.message!, /value 字段长度超过 16 字节: 17 字节/);
			});

			test('中文字符应正确计算字节长度', () => {
				// "中国" = 6 字节，通过
				const item1 = createTestCodecObject({ value: '中国' });
				const result1 = ValueValidator.validate(item1);
				assert.strictEqual(result1.valid, true);

				// "中国中国中国" = 18 字节，失败
				const item2 = createTestCodecObject({ value: '中国中国中国' });
				const result2 = ValueValidator.validate(item2);
				assert.strictEqual(result2.valid, false);
			});
		});
	});

	describe('values 数组验证 - BOOL 类型', () => {
		test('BOOL 类型缺少 values 应失败', () => {
			const item = createTestCodecObject({
				data_type: 'BOOL',
				values: undefined,
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /data_type 为 BOOL 时，values 为必填项/);
		});

		test('BOOL 类型 values 长度不为 2 应失败', () => {
			const item = createTestCodecObject({
				data_type: 'BOOL',
				values: [{ value: 0, name: 'Off' }],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /values 长度必须为 2, 当前长度: 1/);
		});

		test('BOOL 类型 values 必须包含 0 和 1', () => {
			const item = createTestCodecObject({
				data_type: 'BOOL',
				values: [
					{ value: 0, name: 'Off' },
					{ value: 2, name: 'Invalid' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /values 必须包含 value 为 0 和 1 的元素/);
		});

		test('BOOL 类型有效的 values 应通过', () => {
			const item = createTestCodecObject({
				data_type: 'BOOL',
				values: [
					{ value: 0, name: 'Off' },
					{ value: 1, name: 'On' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});
	});

	describe('values 数组验证 - ENUM 类型', () => {
		test('ENUM 类型缺少 values 应失败', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: undefined,
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /data_type 为 ENUM 时，values 为必填项/);
		});

		test('ENUM 类型 values 长度小于 2 应失败', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [{ value: 0, name: 'Option1' }],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(
				result.message!,
				/values 长度必须在 2-50 之间, 当前长度: 1/
			);
		});

		test('ENUM 类型 values 长度大于 50 应失败', () => {
			const values = Array.from({ length: 51 }, (_, i) => ({
				value: i,
				name: `Option${i}`,
			}));
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values,
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /values 长度必须在 2-50 之间/);
		});

		test('ENUM 类型有效的 values 应通过', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [
					{ value: 0, name: 'Low' },
					{ value: 1, name: 'Medium' },
					{ value: 2, name: 'High' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});
	});

	describe('values 数组通用验证', () => {
		test('values 元素缺少 value 字段应失败', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [
					{ value: 0, name: 'Option1' },
					{ name: 'Option2' } as any,
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /values\[1\] 缺少 value 字段/);
		});

		test('values 元素的 value 不是整数应失败', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [
					{ value: 0, name: 'Option1' },
					{ value: 1.5, name: 'Option2' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /values\[1\].value 必须是整数类型/);
		});

		test('values 元素的 value 为字符串应失败', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [
					{ value: 0, name: 'Option1' },
					{ value: '1' as any, name: 'Option2' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
		});

		test('values 元素的 name 超过 127 字节应失败', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [
					{ value: 0, name: 'Option1' },
					{ value: 1, name: 'a'.repeat(128) },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /values\[1\].name 长度超过 127 字节/);
		});

		test('values 元素的 name 可以为空', () => {
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values: [
					{ value: 0, name: '' },
					{ value: 1, name: null as any },
					{ value: 2, name: undefined as any },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});

		test('values 数组最多 50 个元素', () => {
			const values = Array.from({ length: 50 }, (_, i) => ({
				value: i,
				name: `Option${i}`,
			}));
			const item = createTestCodecObject({
				data_type: 'ENUM',
				values,
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});
	});

	describe('真实场景测试', () => {
		test('开关状态（BOOL）配置', () => {
			const item = createTestCodecObject({
				id: 'switch_status',
				data_type: 'BOOL',
				values: [
					{ value: 0, name: '关闭' },
					{ value: 1, name: '开启' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});

		test('运行模式（ENUM）配置', () => {
			const item = createTestCodecObject({
				id: 'run_mode',
				data_type: 'ENUM',
				values: [
					{ value: 0, name: 'Auto' },
					{ value: 1, name: 'Manual' },
					{ value: 2, name: 'Schedule' },
					{ value: 3, name: 'Emergency' },
				],
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});

		test('NUMBER 类型不需要 values', () => {
			const item = createTestCodecObject({
				data_type: 'NUMBER',
				values: undefined,
			});
			const result = ValueValidator.validateValues(item);
			assert.strictEqual(result.valid, true);
		});
	});
});
