/**
 * Unit 验证器
 * 验证 unit、bacnet_unit_type_id、bacnet_unit_type 的一致性
 */
import { ValidationResult, CodecObject } from '../types';
export declare class UnitValidator {
    /**
     * 验证单位字段的一致性
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=unit-validator.d.ts.map