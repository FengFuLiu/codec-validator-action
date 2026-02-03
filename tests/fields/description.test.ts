/**
 * Description 字段验证器测试
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { DescriptionValidator } from '../../src/test/fields/description';
import {
	createTestCodecObject,
	generateStringWithByteLength,
	generateMultiByteString,
} from '../helpers';

describe('DescriptionValidator', () => {
	describe('非必填字段', () => {
		test('description 不存在时应通过验证', () => {
			const item = createTestCodecObject({ description: undefined });
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, true);
			assert.strictEqual(result.id, null);
			assert.strictEqual(result.message, null);
		});

		test('description 为空字符串时应通过验证', () => {
			const item = createTestCodecObject({ description: '' });
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});
	});

	describe('数据类型验证', () => {
		test('description 为字符串时应通过验证', () => {
			const item = createTestCodecObject({
				description: 'Valid description',
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('description 为数字时应失败', () => {
			const item = createTestCodecObject({
				description: 123 as any,
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.strictEqual(result.id, 'test_id');
			assert.match(
				result.message!,
				/description 必须是字符串类型, 得到 number/
			);
		});

		test('description 为对象时应失败', () => {
			const item = createTestCodecObject({
				description: {} as any,
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(
				result.message!,
				/description 必须是字符串类型, 得到 object/
			);
		});

		test('description 为数组时应失败', () => {
			const item = createTestCodecObject({
				description: [] as any,
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(
				result.message!,
				/description 必须是字符串类型, 得到 object/
			);
		});
	});

	describe('字节长度验证', () => {
		test('1024 字节的 description 应通过验证', () => {
			const item = createTestCodecObject({
				description: generateStringWithByteLength(1024),
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('1023 字节的 description 应通过验证', () => {
			const item = createTestCodecObject({
				description: generateStringWithByteLength(1023),
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('1025 字节的 description 应失败', () => {
			const item = createTestCodecObject({
				description: generateStringWithByteLength(1025),
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.strictEqual(result.id, 'test_id');
			assert.match(
				result.message!,
				/description 字段长度超过 1024 字节: 1025 字节/
			);
		});

		test('2000 字节的 description 应失败', () => {
			const item = createTestCodecObject({
				description: generateStringWithByteLength(2000),
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /description 字段长度超过 1024 字节/);
		});
	});

	describe('多字节字符处理', () => {
		test('包含中文字符的 description 应正确计算字节长度', () => {
			// "中" 字符通常是 3 字节（UTF-8）
			const chineseChar = '中';
			const byteLength = new TextEncoder().encode(chineseChar).length;

			// 创建一个恰好超过 1024 字节的字符串
			const charCount = Math.floor(1024 / byteLength) + 1;
			const item = createTestCodecObject({
				description: generateMultiByteString(charCount, chineseChar),
			});

			const result = DescriptionValidator.validate(item);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /description 字段长度超过 1024 字节/);
		});

		test('包含 emoji 的 description 应正确计算字节长度', () => {
			// emoji 通常是 4 字节
			const emoji = '😀';
			const byteLength = new TextEncoder().encode(emoji).length;

			// 创建一个恰好超过 1024 字节的字符串
			const charCount = Math.floor(1024 / byteLength) + 1;
			const item = createTestCodecObject({
				description: emoji.repeat(charCount),
			});

			const result = DescriptionValidator.validate(item);
			assert.strictEqual(result.valid, false);
		});

		test('混合 ASCII 和多字节字符应正确计算', () => {
			// 创建一个混合字符串：512 个 ASCII + 171 个中文字符（171 * 3 = 513）
			// 总共 512 + 513 = 1025 字节
			const item = createTestCodecObject({
				description: 'a'.repeat(512) + '中'.repeat(171),
			});

			const result = DescriptionValidator.validate(item);
			assert.strictEqual(result.valid, false);
		});
	});

	describe('边界情况', () => {
		test('空格字符应被计入长度', () => {
			const item = createTestCodecObject({
				description: ' '.repeat(1025),
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
		});

		test('换行符应被计入长度', () => {
			const item = createTestCodecObject({
				description: '\n'.repeat(1025),
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
		});

		test('特殊字符应被正确处理', () => {
			const item = createTestCodecObject({
				description: '!@#$%^&*()_+-=[]{}|;:,.<>?'.repeat(50), // 远超 1024 字节
			});
			const result = DescriptionValidator.validate(item);

			assert.strictEqual(result.valid, false);
		});
	});
});
