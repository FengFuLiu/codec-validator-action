/**
 * Data Type 验证器
 * 验证 data_type 和 bacnet_type、value_type 的组合是否合法
 */

import { ValidationRules } from '../validation-rules';
import { ValidationResult, CodecObject } from '../types';

export class DataTypeValidator {
	/**
	 * 验证 data_type 和 bacnet_type 的组合
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validateBacnetType(item: CodecObject): ValidationResult {
		const { id, data_type, bacnet_type } = item;
		const validTypes = (ValidationRules.dataTypeBacnetRules as any)[data_type];

		if (validTypes && !validTypes.includes(bacnet_type)) {
			return {
				valid: false,
				id,
				message: `data_type: ${data_type} 不允许使用 bacnet_type: ${bacnet_type}, 允许的类型: ${validTypes.join(', ')}`,
			};
		}

		return { valid: true, id: null, message: null };
	}

	/**
	 * 验证 data_type 和 value_type 的组合
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validateValueType(item: CodecObject): ValidationResult {
		const { id, data_type, value_type } = item;
		const validTypes = (ValidationRules.dataTypeValueRules as any)[data_type];

		if (validTypes && !validTypes.includes(value_type)) {
			return {
				valid: false,
				id,
				message: `data_type: ${data_type} 不允许使用 value_type: ${value_type}, 允许的类型: ${validTypes.join(', ')}`,
			};
		}

		return { valid: true, id: null, message: null };
	}
}
