/**
 * Reference 验证器
 * 验证 reference 字段引用的 ID 是否存在
 */

import { ValidationResult, CodecObject } from '../types';

export class ReferenceValidator {
	/**
	 * 验证 reference 引用的 ID 是否存在
	 * @param item codec 对象
	 * @param allItems 所有 codec 对象
	 * @returns 验证结果
	 */
	static validate(item: CodecObject, allItems: CodecObject[]): ValidationResult {
		const { id, reference } = item;

		if (reference) {
			for (const ref of reference) {
				const hasReference = allItems.some(item => item.id === ref);
				if (!hasReference) {
					return {
						valid: false,
						id,
						message: `引用的字段不存在: ${ref}`,
					};
				}
			}
		}

		return { valid: true, id: null, message: null };
	}
}
