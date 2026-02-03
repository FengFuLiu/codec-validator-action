/**
 * BacnetUnitType 字段验证器
 * 验证 bacnet_unit_type 字段的约束（云端准出表/网关准入表标准）
 */

import { ValidationResult, CodecObject } from '../types';

export class BacnetUnitTypeValidator {
	/**
	 * 验证 bacnet_unit_type 字段约束
	 *
	 * 云端准出表/网关准入表标准：
	 * 1. 非必填
	 * 2. 数据类型：string
	 * 3. 数据范围：转换后字节长度为64以内
	 *
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validate(item: CodecObject): ValidationResult {
		const { id, bacnet_unit_type } = item;

		// 1. 非必填，如果不存在直接通过
		if (!bacnet_unit_type) {
			return { valid: true, id: null, message: null };
		}

		// 2. 数据类型检查
		if (typeof bacnet_unit_type !== 'string') {
			return {
				valid: false,
				id,
				message: `bacnet_unit_type 必须是字符串类型, 得到 ${typeof bacnet_unit_type}`,
			};
		}

		// 3. 字节长度检查（64 以内）
		const byteLength = new TextEncoder().encode(bacnet_unit_type).length;
		if (byteLength > 64) {
			return {
				valid: false,
				id,
				message: `bacnet_unit_type 字段长度超过 64 字节: ${byteLength} 字节`,
			};
		}

		return { valid: true, id: null, message: null };
	}
}
