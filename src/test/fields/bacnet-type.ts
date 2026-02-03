/**
 * BacnetType 字段验证器
 * 验证 bacnet_type 字段的约束（云端准出表/网关准入表标准）
 */

import { ValidationResult, CodecObject } from '../types';

export class BacnetTypeFieldValidator {
	private static readonly VALID_BACNET_TYPES = [
		'analog_value_object',
		'analog_input_object',
		'analog_output_object',
		'binary_value_object',
		'binary_input_object',
		'binary_output_object',
		'multistate_value_object',
		'multistate_input_object',
		'multistate_output_object',
		'character_string_value_object',
	];

	/**
	 * 验证 bacnet_type 字段约束
	 *
	 * 云端准出表/网关准入表标准：
	 * 1. 必填
	 * 2. 数据类型：string
	 * 3. 数据范围：转换后字节长度为64以内
	 * 4. 配置项仅指定的 BACnet 对象类型
	 *
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validate(item: CodecObject): ValidationResult {
		const { id, bacnet_type } = item;

		// 1. 必填检查
		if (!bacnet_type) {
			return {
				valid: false,
				id,
				message: `bacnet_type 字段为必填项`,
			};
		}

		// 2. 数据类型检查
		if (typeof bacnet_type !== 'string') {
			return {
				valid: false,
				id,
				message: `bacnet_type 必须是字符串类型, 得到 ${typeof bacnet_type}`,
			};
		}

		// 3. 字节长度检查（64 以内）
		const byteLength = new TextEncoder().encode(bacnet_type).length;
		if (byteLength > 64) {
			return {
				valid: false,
				id,
				message: `bacnet_type 字段长度超过 64 字节: ${byteLength} 字节`,
			};
		}

		// 4. 配置项检查
		if (!this.VALID_BACNET_TYPES.includes(bacnet_type)) {
			return {
				valid: false,
				id,
				message: `bacnet_type 不是有效的 BACnet 对象类型: ${bacnet_type}`,
			};
		}

		return { valid: true, id: null, message: null };
	}
}
