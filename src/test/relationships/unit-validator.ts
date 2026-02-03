/**
 * Unit 验证器
 * 验证 unit、bacnet_unit_type_id、bacnet_unit_type 的一致性
 */

import { bacnet_units_def } from '../../utils/bacnet-units';
import { ValidationResult, CodecObject } from '../types';

export class UnitValidator {
	/**
	 * 验证单位字段的一致性
	 * @param item codec 对象
	 * @returns 验证结果
	 */
	static validate(item: CodecObject): ValidationResult {
		const { id, unit, bacnet_unit_type_id, bacnet_unit_type } = item;

		if (bacnet_unit_type_id !== undefined) {
			const bacnet_unit_def = bacnet_units_def.find(u => u.unit_type_id === bacnet_unit_type_id);

			if (!bacnet_unit_def) {
				return {
					valid: false,
					id,
					message: `无效的 bacnet_unit_type_id: ${bacnet_unit_type_id}`,
				};
			}

			if (bacnet_unit_def.unit !== unit) {
				return {
					valid: false,
					id,
					message: `无效的 unit: ${unit}`,
				};
			}

			if (bacnet_unit_def.unit_type !== bacnet_unit_type) {
				return {
					valid: false,
					id,
					message: `无效的 unit_type: ${bacnet_unit_type}`,
				};
			}
		}

		return { valid: true, id: null, message: null };
	}
}
