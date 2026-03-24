import { CodecObject, ValidationResult } from './types';

// 关联性验证器
import { AccessModeValidator } from './relationships/access-mode-validator';
import { DataTypeValidator } from './relationships/data-type-validator';
import { UnitValidator } from './relationships/unit-validator';
import { ReferenceValidator } from './relationships/reference-validator';

// 基础字段验证器
import { IdValidator } from './fields/id';
import { DescriptionValidator } from './fields/description';
import { NameValidator } from './fields/name';
import { AccessModeFieldValidator } from './fields/access-mode';
import { DataTypeFieldValidator } from './fields/data-type';
import { ValueTypeFieldValidator } from './fields/value-type';
import { ValueValidator } from './fields/value';
import { MaxLengthValidator } from './fields/max-length';
import { UnitFieldValidator } from './fields/unit';
import { BacnetTypeFieldValidator } from './fields/bacnet-type';
import { BacnetUnitTypeIdValidator } from './fields/bacnet-unit-type-id';
import { BacnetUnitTypeValidator } from './fields/bacnet-unit-type';
import { ReferenceFieldValidator } from './fields/reference';

/**
 * 验证单个 codec 对象（纯函数，不依赖 fs）
 */
export function validateItem(item: CodecObject, allItems: CodecObject[]): ValidationResult[] {
	const validations = [
		// 云端准出表/网关准入表 - 基础字段验证
		{ ...IdValidator.validate(item), severity: 'error' as const },
		{ ...IdValidator.validateUnique(item, allItems), severity: 'error' as const },
		{ ...DescriptionValidator.validate(item), severity: 'error' as const },
		{ ...NameValidator.validate(item), severity: 'error' as const },
		// { ...NameValidator.validateUnique(item, allItems), severity: 'error' as const },
		{ ...AccessModeFieldValidator.validate(item), severity: 'error' as const },
		{ ...DataTypeFieldValidator.validate(item), severity: 'error' as const },
		{ ...ValueTypeFieldValidator.validate(item), severity: 'error' as const },
		{ ...ValueValidator.validate(item), severity: 'error' as const },
		{ ...ValueValidator.validateValues(item), severity: 'error' as const },
		{ ...MaxLengthValidator.validate(item), severity: 'error' as const },
		{ ...UnitFieldValidator.validate(item), severity: 'error' as const },
		{ ...UnitFieldValidator.validateUnitConsistency(item), severity: 'error' as const },
		{ ...BacnetTypeFieldValidator.validate(item), severity: 'error' as const },
		{ ...BacnetUnitTypeIdValidator.validate(item), severity: 'error' as const },
		{ ...BacnetUnitTypeValidator.validate(item), severity: 'error' as const },
		{ ...ReferenceFieldValidator.validate(item), severity: 'error' as const },

		// 关联性验证（字段组合关系）
		{ ...AccessModeValidator.validate(item), severity: 'error' as const },
		{ ...DataTypeValidator.validateBacnetType(item), severity: 'error' as const },
		{ ...DataTypeValidator.validateValueType(item), severity: 'error' as const },
		{ ...UnitValidator.validate(item), severity: 'error' as const },
		{ ...ReferenceValidator.validate(item, allItems), severity: 'error' as const },
	];

	return validations.filter(result => !result.valid);
}
