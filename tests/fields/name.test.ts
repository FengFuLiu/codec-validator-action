/**
 * Name 字段验证器测试
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { NameValidator } from '../../src/test/fields/name';
import {
	createTestCodecObject,
	generateStringWithByteLength,
	generateMultiByteString,
} from '../helpers';

describe('NameValidator', () => {
	describe('非必填字段', () => {
		test('name 不存在时应通过验证', () => {
			const item = createTestCodecObject({ name: undefined });
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, true);
			assert.strictEqual(result.id, null);
			assert.strictEqual(result.message, null);
		});

		test('name 为空字符串时应通过验证', () => {
			const item = createTestCodecObject({ name: '' });
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});
	});

	describe('数据类型验证', () => {
		test('name 为字符串时应通过验证', () => {
			const item = createTestCodecObject({
				name: 'Valid Name',
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('name 为数字时应失败', () => {
			const item = createTestCodecObject({
				name: 123 as any,
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.strictEqual(result.id, 'test_id');
			assert.match(result.message!, /name 必须是字符串类型, 得到 number/);
		});

		test('name 为布尔值时应失败', () => {
			const item = createTestCodecObject({
				name: true as any,
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /name 必须是字符串类型, 得到 boolean/);
		});
	});

	describe('字节长度验证', () => {
		test('64 字节的 name 应通过验证', () => {
			const item = createTestCodecObject({
				name: generateStringWithByteLength(64),
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('63 字节的 name 应通过验证', () => {
			const item = createTestCodecObject({
				name: generateStringWithByteLength(63),
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('65 字节的 name 应失败', () => {
			const item = createTestCodecObject({
				name: generateStringWithByteLength(65),
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.strictEqual(result.id, 'test_id');
			assert.match(result.message!, /name 字段长度超过 64 字节: 65 字节/);
		});

		test('128 字节的 name 应失败', () => {
			const item = createTestCodecObject({
				name: generateStringWithByteLength(128),
			});
			const result = NameValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /name 字段长度超过 64 字节/);
		});
	});

	describe('多字节字符处理', () => {
		test('包含中文字符的 name 应正确计算字节长度', () => {
			// "中" 字符是 3 字节
			// 21 个中文字符 = 63 字节（通过）
			const item1 = createTestCodecObject({
				name: '中'.repeat(21),
			});
			const result1 = NameValidator.validate(item1);
			assert.strictEqual(result1.valid, true);

			// 22 个中文字符 = 66 字节（失败）
			const item2 = createTestCodecObject({
				name: '中'.repeat(22),
			});
			const result2 = NameValidator.validate(item2);
			assert.strictEqual(result2.valid, false);
		});

		test('混合 ASCII 和中文应正确计算', () => {
			// 32 个 ASCII + 11 个中文 = 32 + 33 = 65 字节
			const item = createTestCodecObject({
				name: 'a'.repeat(32) + '中'.repeat(11),
			});

			const result = NameValidator.validate(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /name 字段长度超过 64 字节: 65 字节/);
		});
	});

	describe('真实场景测试', () => {
		test('常见英文名称应通过', () => {
			const names = [
				'Temperature Sensor',
				'Humidity',
				'CO2 Level',
				'Device Status',
				'Battery Voltage',
			];

			names.forEach((name) => {
				const item = createTestCodecObject({ name });
				const result = NameValidator.validate(item);
				assert.strictEqual(result.valid, true, `"${name}" should pass`);
			});
		});

		test('带特殊字符的名称应通过', () => {
			const names = [
				'Temp_Sensor_01',
				'Device-A',
				'Status (Active)',
				'Level [%]',
			];

			names.forEach((name) => {
				const item = createTestCodecObject({ name });
				const result = NameValidator.validate(item);
				assert.strictEqual(result.valid, true, `"${name}" should pass`);
			});
		});
	});
});
