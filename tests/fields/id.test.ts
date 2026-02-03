/**
 * ID 字段验证器测试
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { IdValidator } from '../../src/test/fields/id';
import { createTestCodecObject, generateStringWithByteLength } from '../helpers';

describe('IdValidator', () => {
	describe('必填字段验证', () => {
		test('id 不存在时应失败', () => {
			const item = createTestCodecObject({ id: undefined as any });
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /id 字段为必填项/);
		});

		test('id 为空字符串时应失败', () => {
			const item = createTestCodecObject({ id: '' });
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /id 字段为必填项/);
		});

		test('id 为 null 时应失败', () => {
			const item = createTestCodecObject({ id: null as any });
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, false);
		});
	});

	describe('数据类型验证', () => {
		test('id 为有效字符串时应通过', () => {
			const item = createTestCodecObject({ id: 'valid_id' });
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('id 为数字时应失败', () => {
			const item = createTestCodecObject({ id: 123 as any });
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /id 必须是字符串类型, 得到 number/);
		});

		test('id 为对象时应失败', () => {
			const item = createTestCodecObject({ id: {} as any });
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /id 必须是字符串类型/);
		});
	});

	describe('字节长度验证', () => {
		test('127 字节的 id 应通过', () => {
			const item = createTestCodecObject({
				id: generateStringWithByteLength(127),
			});
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, true);
		});

		test('128 字节的 id 应失败', () => {
			const item = createTestCodecObject({
				id: generateStringWithByteLength(128),
			});
			const result = IdValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /id 字段长度超过 127 字节/);
		});
	});

	describe('格式验证 - 小写', () => {
		test('全小写的 id 应通过', () => {
			const validIds = [
				'temperature',
				'sensor_01',
				'device.status',
				'data.value.current',
			];

			validIds.forEach((id) => {
				const item = createTestCodecObject({ id });
				const result = IdValidator.validate(item);
				assert.strictEqual(result.valid, true, `"${id}" should pass`);
			});
		});

		test('包含大写字母的 id 应失败', () => {
			const invalidIds = [
				'Temperature',
				'SENSOR',
				'deviceStatus',
				'Device_01',
			];

			invalidIds.forEach((id) => {
				const item = createTestCodecObject({ id });
				const result = IdValidator.validate(item);
				assert.strictEqual(result.valid, false, `"${id}" should fail`);
				assert.match(result.message!, /id 必须是小写格式/);
			});
		});
	});

	describe('格式验证 - 不支持数组索引', () => {
		test('包含数字索引的 id 应失败', () => {
			const invalidIds = [
				'data.0.value', // 中间有数字索引
				'data.0', // 末尾有数字索引
				'sensor.1.temp',
				'array.10.value',
			];

			invalidIds.forEach((id) => {
				const item = createTestCodecObject({ id });
				const result = IdValidator.validate(item);
				assert.strictEqual(result.valid, false, `"${id}" should fail`);
				assert.match(result.message!, /id 不支持数组格式/);
			});
		});

		test('包含数字但不是索引格式的 id 应通过', () => {
			const validIds = [
				'sensor01',
				'device_01',
				'temp1',
				'data123',
				'value_2_temp',
			];

			validIds.forEach((id) => {
				const item = createTestCodecObject({ id });
				const result = IdValidator.validate(item);
				assert.strictEqual(result.valid, true, `"${id}" should pass`);
			});
		});
	});

	describe('唯一性验证', () => {
		test('没有重复 id 时应通过', () => {
			const items = [
				createTestCodecObject({ id: 'id1' }),
				createTestCodecObject({ id: 'id2' }),
				createTestCodecObject({ id: 'id3' }),
			];

			items.forEach((item) => {
				const result = IdValidator.validateUnique(item, items);
				assert.strictEqual(result.valid, true);
			});
		});

		test('存在重复 id 时应失败', () => {
			const items = [
				createTestCodecObject({ id: 'duplicate_id' }),
				createTestCodecObject({ id: 'unique_id' }),
				createTestCodecObject({ id: 'duplicate_id' }), // 重复
			];

			const result = IdValidator.validateUnique(items[0], items);
			assert.strictEqual(result.valid, false);
			assert.strictEqual(result.id, 'duplicate_id');
			assert.match(result.message!, /id 重复出现 2 次/);
		});

		test('多次重复的 id 应报告正确的次数', () => {
			const items = [
				createTestCodecObject({ id: 'triple_id' }),
				createTestCodecObject({ id: 'triple_id' }),
				createTestCodecObject({ id: 'triple_id' }),
			];

			const result = IdValidator.validateUnique(items[0], items);
			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /id 重复出现 3 次/);
		});

		test('id 不存在时唯一性检查应通过', () => {
			const item = createTestCodecObject({ id: '' });
			const items = [item];
			const result = IdValidator.validateUnique(item, items);

			assert.strictEqual(result.valid, true);
		});
	});

	describe('真实场景测试', () => {
		test('常见的有效 id 格式', () => {
			const validIds = [
				'temperature',
				'humidity_sensor',
				'device_status',
				'co2_level',
				'battery_voltage',
				'data.sensor.temp',
				'device.config.mode',
			];

			validIds.forEach((id) => {
				const item = createTestCodecObject({ id });
				const result = IdValidator.validate(item);
				assert.strictEqual(result.valid, true, `"${id}" should pass`);
			});
		});

		test('常见的无效 id 格式', () => {
			const testCases = [
				{ id: 'Temperature', reason: '包含大写' },
				{ id: 'data.0.value', reason: '数组索引' },
				{ id: 'sensor.1', reason: '末尾数组索引' },
			];

			testCases.forEach(({ id, reason }) => {
				const item = createTestCodecObject({ id });
				const result = IdValidator.validate(item);
				assert.strictEqual(
					result.valid,
					false,
					`"${id}" should fail (${reason})`
				);
			});
		});
	});
});
