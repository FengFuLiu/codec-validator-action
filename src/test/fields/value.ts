/**
 * Value 字段验证器
 * 验证 value 和 values 字段的约束（云端准出表/网关准入表标准）
 */

import { ValidationResult, CodecObject } from '../types';

export class ValueValidator {
	/**
	 * 验证 value 字段约束
	 *
	 * 云端准出表/网关准入表标准：
	 * 1. 非必填
	 * 2. 数据类型：string
	 * 3. 数据范围：转换后字节长度为16以内
	 *
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validate(item: CodecObject): ValidationResult {
		const { id, value } = item;

		// 1. 非必填，如果不存在直接通过
		if (value === undefined || value === null || value === '') {
			return { valid: true, id: null, message: null };
		}

		// 2. 数据类型检查
		if (typeof value !== 'string') {
			return {
				valid: false,
				id,
				message: `value 必须是字符串类型, 得到 ${typeof value}`,
			};
		}

		// 3. 字节长度检查（16 以内）
		const byteLength = new TextEncoder().encode(value).length;
		if (byteLength > 16) {
			return {
				valid: false,
				id,
				message: `value 字段长度超过 16 字节: ${byteLength} 字节`,
			};
		}

		return { valid: true, id: null, message: null };
	}

	/**
	 * 验证 values 数组约束
	 *
	 * 云端准出表/网关准入表标准：
	 * 1. 关联性必填：
	 *    - data_type 为 BOOL 时：必填，长度为2，包含 value(0/1) 和对应的 name
	 *    - data_type 为 ENUM 时：必填，长度2-50，value 和 name 数量一致
	 * 2. 数据类型：value 必须为 integer 类型，name 可为空
	 * 3. 数据范围：name 转换后字节长度为127以内
	 * 4. 数组长度限制50个
	 *
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validateValues(item: CodecObject): ValidationResult {
		const { id, data_type, values } = item;

		// 检查关联性必填
		if (data_type === 'BOOL') {
			// BOOL 类型必须有 values
			if (!values || !Array.isArray(values)) {
				return {
					valid: false,
					id,
					message: `data_type 为 BOOL 时，values 为必填项`,
				};
			}

			// BOOL 必须恰好有 2 个元素
			if (values.length !== 2) {
				return {
					valid: false,
					id,
					message: `data_type 为 BOOL 时，values 长度必须为 2, 当前长度: ${values.length}`,
				};
			}

			// 检查 value 必须为 0 和 1
			const valueSet = new Set(values.map(v => v.value));
			if (!valueSet.has(0) || !valueSet.has(1)) {
				return {
					valid: false,
					id,
					message: `data_type 为 BOOL 时，values 必须包含 value 为 0 和 1 的元素`,
				};
			}
		} else if (data_type === 'ENUM') {
			// ENUM 类型必须有 values
			if (!values || !Array.isArray(values)) {
				return {
					valid: false,
					id,
					message: `data_type 为 ENUM 时，values 为必填项`,
				};
			}

			// ENUM 长度必须在 2-50 之间
			if (values.length < 2 || values.length > 50) {
				return {
					valid: false,
					id,
					message: `data_type 为 ENUM 时，values 长度必须在 2-50 之间, 当前长度: ${values.length}`,
				};
			}
		}

		// 如果有 values，进行通用验证
		if (values && Array.isArray(values)) {
			// 检查数组长度限制
			if (values.length > 50) {
				return {
					valid: false,
					id,
					message: `values 数组长度超过限制 50, 当前长度: ${values.length}`,
				};
			}

			// 验证每个元素
			for (let i = 0; i < values.length; i++) {
				const item = values[i];

				// 检查 value 字段类型（必须是 integer）
				if (item.value === undefined || item.value === null) {
					return {
						valid: false,
						id,
						message: `values[${i}] 缺少 value 字段`,
					};
				}

				if (!Number.isInteger(item.value)) {
					return {
						valid: false,
						id,
						message: `values[${i}].value 必须是整数类型, 得到 ${typeof item.value}: ${item.value}`,
					};
				}

				// 检查 name 字段（如果存在）
				if (item.name !== undefined && item.name !== null && item.name !== '') {
					const nameBytes = new TextEncoder().encode(String(item.name)).length;
					if (nameBytes > 127) {
						return {
							valid: false,
							id,
							message: `values[${i}].name 长度超过 127 字节: ${nameBytes} 字节`,
						};
					}
				}
			}
		}

		return { valid: true, id: null, message: null };
	}
}
