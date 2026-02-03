/**
 * Name 字段验证器
 * 验证 name 字段的约束（云端准出表/网关准入表标准）
 */

import { ValidationResult, CodecObject } from '../types';

export class NameValidator {
	/**
	 * 验证 name 字段约束
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
		const { id, name } = item;

		// 1. 非必填，如果不存在直接通过
		if (!name) {
			return { valid: true, id: null, message: null };
		}

		// 2. 数据类型检查
		if (typeof name !== 'string') {
			return {
				valid: false,
				id,
				message: `name 必须是字符串类型, 得到 ${typeof name}`,
			};
		}

		// 3. 字节长度检查（64 以内）
		const byteLength = new TextEncoder().encode(name).length;
		if (byteLength > 64) {
			return {
				valid: false,
				id,
				message: `name 字段长度超过 64 字节: ${byteLength} 字节`,
			};
		}

		return { valid: true, id: null, message: null };
	}
}
