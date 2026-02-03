/**
 * AccessModeValidator 关系验证器测试
 */

import { describe, test } from 'node:test';
import assert from 'node:assert';
import { AccessModeValidator } from '../../src/test/relationships/access-mode-validator';
import { createTestCodecObject } from '../helpers';

describe('AccessModeValidator', () => {
	describe('access_mode = R (只读)', () => {
		test('允许使用 binary_input_object', () => {
			const item = createTestCodecObject({
				access_mode: 'R',
				bacnet_type: 'binary_input_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 analog_input_object', () => {
			const item = createTestCodecObject({
				access_mode: 'R',
				bacnet_type: 'analog_input_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 multistate_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'R',
				bacnet_type: 'multistate_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 character_string_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'R',
				bacnet_type: 'character_string_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('不允许使用 binary_output_object', () => {
			const item = createTestCodecObject({
				access_mode: 'R',
				bacnet_type: 'binary_output_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, false);
			assert.match(
				result.message!,
				/access_mode: R 不允许使用 bacnet_type: binary_output_object/
			);
		});

		test('不允许使用 analog_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'R',
				bacnet_type: 'analog_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, false);
		});
	});

	describe('access_mode = W (只写)', () => {
		test('允许使用 binary_output_object', () => {
			const item = createTestCodecObject({
				access_mode: 'W',
				bacnet_type: 'binary_output_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 analog_output_object', () => {
			const item = createTestCodecObject({
				access_mode: 'W',
				bacnet_type: 'analog_output_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 multistate_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'W',
				bacnet_type: 'multistate_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('不允许使用 binary_input_object', () => {
			const item = createTestCodecObject({
				access_mode: 'W',
				bacnet_type: 'binary_input_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, false);
			assert.match(
				result.message!,
				/access_mode: W 不允许使用 bacnet_type: binary_input_object/
			);
		});

		test('不允许使用 analog_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'W',
				bacnet_type: 'analog_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, false);
		});
	});

	describe('access_mode = RW (读写)', () => {
		test('允许使用 binary_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'RW',
				bacnet_type: 'binary_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 analog_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'RW',
				bacnet_type: 'analog_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('允许使用 multistate_value_object', () => {
			const item = createTestCodecObject({
				access_mode: 'RW',
				bacnet_type: 'multistate_value_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, true);
		});

		test('不允许使用 binary_input_object', () => {
			const item = createTestCodecObject({
				access_mode: 'RW',
				bacnet_type: 'binary_input_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, false);
		});

		test('不允许使用 analog_output_object', () => {
			const item = createTestCodecObject({
				access_mode: 'RW',
				bacnet_type: 'analog_output_object',
			});
			const result = AccessModeValidator.validate(item);
			assert.strictEqual(result.valid, false);
		});
	});

	describe('STRUCT 类型特殊处理', () => {
		test('value_type 为 STRUCT 时，任何 access_mode 和 bacnet_type 组合都应通过', () => {
			const combinations = [
				{ access_mode: 'R', bacnet_type: 'binary_output_object' }, // 正常情况下不合法
				{ access_mode: 'W', bacnet_type: 'analog_input_object' }, // 正常情况下不合法
				{ access_mode: 'RW', bacnet_type: 'binary_input_object' }, // 正常情况下不合法
			];

			combinations.forEach(({ access_mode, bacnet_type }) => {
				const item = createTestCodecObject({
					access_mode: access_mode as any,
					bacnet_type: bacnet_type as any,
					value_type: 'STRUCT',
				});
				const result = AccessModeValidator.validate(item);
				assert.strictEqual(
					result.valid,
					true,
					`${access_mode} + ${bacnet_type} with STRUCT should pass`
				);
			});
		});
	});

	describe('无效的 access_mode', () => {
		test('无效的 access_mode 应失败', () => {
			const item = createTestCodecObject({
				access_mode: 'INVALID' as any,
				bacnet_type: 'analog_input_object',
			});
			const result = AccessModeValidator.validate(item);

			assert.strictEqual(result.valid, false);
			assert.match(result.message!, /无效的 access_mode: INVALID/);
		});

		test('空 access_mode 应失败', () => {
			const item = createTestCodecObject({
				access_mode: '' as any,
				bacnet_type: 'analog_input_object',
			});
			const result = AccessModeValidator.validate(item);

			assert.strictEqual(result.valid, false);
		});
	});

	describe('真实场景测试', () => {
		test('传感器（只读）配置应使用 input_object', () => {
			const validSensors = [
				{
					id: 'temp_sensor',
					access_mode: 'R',
					bacnet_type: 'analog_input_object',
				},
				{
					id: 'door_sensor',
					access_mode: 'R',
					bacnet_type: 'binary_input_object',
				},
			];

			validSensors.forEach((sensor) => {
				const item = createTestCodecObject(sensor as any);
				const result = AccessModeValidator.validate(item);
				assert.strictEqual(
					result.valid,
					true,
					`Sensor ${sensor.id} should be valid`
				);
			});
		});

		test('执行器（只写）配置应使用 output_object', () => {
			const validActuators = [
				{
					id: 'fan_control',
					access_mode: 'W',
					bacnet_type: 'analog_output_object',
				},
				{
					id: 'relay_switch',
					access_mode: 'W',
					bacnet_type: 'binary_output_object',
				},
			];

			validActuators.forEach((actuator) => {
				const item = createTestCodecObject(actuator as any);
				const result = AccessModeValidator.validate(item);
				assert.strictEqual(
					result.valid,
					true,
					`Actuator ${actuator.id} should be valid`
				);
			});
		});
	});
});
