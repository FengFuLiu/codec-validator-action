/**
 * DataTypeValidator 关系验证器测试
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { DataTypeValidator } from '../../src/test/relationships/data-type-validator';
import { createTestCodecObject } from '../helpers';

describe('DataTypeValidator', () => {
	describe('data_type 和 bacnet_type 组合验证', () => {
		describe('data_type = BOOL', () => {
			test('允许使用 binary_input_object', () => {
				const item = createTestCodecObject({
					data_type: 'BOOL',
					bacnet_type: 'binary_input_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('允许使用 binary_output_object', () => {
				const item = createTestCodecObject({
					data_type: 'BOOL',
					bacnet_type: 'binary_output_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('允许使用 binary_value_object', () => {
				const item = createTestCodecObject({
					data_type: 'BOOL',
					bacnet_type: 'binary_value_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 analog_input_object', () => {
				const item = createTestCodecObject({
					data_type: 'BOOL',
					bacnet_type: 'analog_input_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, false);
				assert.match(
					result.message!,
					/data_type: BOOL 不允许使用 bacnet_type: analog_input_object/
				);
			});
		});

		describe('data_type = NUMBER', () => {
			test('允许使用 analog_input_object', () => {
				const item = createTestCodecObject({
					data_type: 'NUMBER',
					bacnet_type: 'analog_input_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('允许使用 analog_output_object', () => {
				const item = createTestCodecObject({
					data_type: 'NUMBER',
					bacnet_type: 'analog_output_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('允许使用 analog_value_object', () => {
				const item = createTestCodecObject({
					data_type: 'NUMBER',
					bacnet_type: 'analog_value_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 binary_input_object', () => {
				const item = createTestCodecObject({
					data_type: 'NUMBER',
					bacnet_type: 'binary_input_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, false);
			});
		});

		describe('data_type = ENUM', () => {
			test('允许使用 multistate_value_object', () => {
				const item = createTestCodecObject({
					data_type: 'ENUM',
					bacnet_type: 'multistate_value_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 analog_input_object', () => {
				const item = createTestCodecObject({
					data_type: 'ENUM',
					bacnet_type: 'analog_input_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, false);
			});
		});

		describe('data_type = STRING', () => {
			test('允许使用 character_string_value_object', () => {
				const item = createTestCodecObject({
					data_type: 'STRING',
					bacnet_type: 'character_string_value_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 analog_input_object', () => {
				const item = createTestCodecObject({
					data_type: 'STRING',
					bacnet_type: 'analog_input_object',
				});
				const result = DataTypeValidator.validateBacnetType(item);
				assert.strictEqual(result.valid, false);
			});
		});
	});

	describe('data_type 和 value_type 组合验证', () => {
		describe('data_type = BOOL', () => {
			test('允许使用 UINT8', () => {
				const item = createTestCodecObject({
					data_type: 'BOOL',
					value_type: 'UINT8',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 FLOAT', () => {
				const item = createTestCodecObject({
					data_type: 'BOOL',
					value_type: 'FLOAT',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, false);
				assert.match(
					result.message!,
					/data_type: BOOL 不允许使用 value_type: FLOAT/
				);
			});
		});

		describe('data_type = NUMBER', () => {
			const validValueTypes = [
				'INT8',
				'UINT8',
				'INT16',
				'UINT16',
				'INT32',
				'UINT32',
				'FLOAT',
			];

			validValueTypes.forEach((valueType) => {
				test(`允许使用 ${valueType}`, () => {
					const item = createTestCodecObject({
						data_type: 'NUMBER',
						value_type: valueType as any,
					});
					const result = DataTypeValidator.validateValueType(item);
					assert.strictEqual(result.valid, true);
				});
			});

			test('不允许使用 STRING', () => {
				const item = createTestCodecObject({
					data_type: 'NUMBER',
					value_type: 'STRING',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, false);
			});
		});

		describe('data_type = TEXT', () => {
			test('允许使用 STRING', () => {
				const item = createTestCodecObject({
					data_type: 'TEXT',
					value_type: 'STRING',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 UINT8', () => {
				const item = createTestCodecObject({
					data_type: 'TEXT',
					value_type: 'UINT8',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, false);
			});
		});

		describe('data_type = ENUM', () => {
			test('允许使用 UINT8', () => {
				const item = createTestCodecObject({
					data_type: 'ENUM',
					value_type: 'UINT8',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, true);
			});

			test('允许使用 UINT16', () => {
				const item = createTestCodecObject({
					data_type: 'ENUM',
					value_type: 'UINT16',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, true);
			});

			test('允许使用 INT16', () => {
				const item = createTestCodecObject({
					data_type: 'ENUM',
					value_type: 'INT16',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, true);
			});

			test('不允许使用 FLOAT', () => {
				const item = createTestCodecObject({
					data_type: 'ENUM',
					value_type: 'FLOAT',
				});
				const result = DataTypeValidator.validateValueType(item);
				assert.strictEqual(result.valid, false);
			});
		});
	});

	describe('真实场景测试', () => {
		test('温度传感器配置（NUMBER + FLOAT）', () => {
			const item = createTestCodecObject({
				id: 'temperature',
				data_type: 'NUMBER',
				value_type: 'FLOAT',
				bacnet_type: 'analog_input_object',
			});

			const result1 = DataTypeValidator.validateBacnetType(item);
			assert.strictEqual(result1.valid, true);

			const result2 = DataTypeValidator.validateValueType(item);
			assert.strictEqual(result2.valid, true);
		});

		test('开关状态配置（BOOL + UINT8）', () => {
			const item = createTestCodecObject({
				id: 'switch',
				data_type: 'BOOL',
				value_type: 'UINT8',
				bacnet_type: 'binary_input_object',
			});

			const result1 = DataTypeValidator.validateBacnetType(item);
			assert.strictEqual(result1.valid, true);

			const result2 = DataTypeValidator.validateValueType(item);
			assert.strictEqual(result2.valid, true);
		});

		test('运行模式配置（ENUM + UINT8）', () => {
			const item = createTestCodecObject({
				id: 'mode',
				data_type: 'ENUM',
				value_type: 'UINT8',
				bacnet_type: 'multistate_value_object',
			});

			const result1 = DataTypeValidator.validateBacnetType(item);
			assert.strictEqual(result1.valid, true);

			const result2 = DataTypeValidator.validateValueType(item);
			assert.strictEqual(result2.valid, true);
		});

		test('错误配置：BOOL 使用 analog_input_object', () => {
			const item = createTestCodecObject({
				data_type: 'BOOL',
				bacnet_type: 'analog_input_object',
			});

			const result = DataTypeValidator.validateBacnetType(item);
			assert.strictEqual(result.valid, false);
		});
	});
});
