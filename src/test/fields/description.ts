/**
 * Description 字段验证器
 * 验证 description 字段的约束（云端准出表/网关准入表标准）
 */

import { ValidationResult, CodecObject } from '../types';

export class DescriptionValidator {
	/**
	 * 验证 description 字段约束
	 *
	 * 云端准出表/网关准入表标准：
	 * 1. 非必填
	 * 2. 数据类型：string
	 * 3. 数据范围：转换后字节长度为1024以内
	 *
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validate(item: CodecObject): ValidationResult {
		const { id, description } = item;

		// 1. 非必填，如果不存在直接通过
		if (!description) {
			return { valid: true, id: null, message: null };
		}

		// 2. 数据类型检查
		if (typeof description !== 'string') {
			return {
				valid: false,
				id,
				message: `description 必须是字符串类型, 得到 ${typeof description}`,
			};
		}

		// 3. 字节长度检查（1024 以内）
		const byteLength = new TextEncoder().encode(description).length;
		if (byteLength > 1024) {
			return {
				valid: false,
				id,
				message: `description 字段长度超过 1024 字节: ${byteLength} 字节`,
			};
		}

		return { valid: true, id: null, message: null };
	}
}
