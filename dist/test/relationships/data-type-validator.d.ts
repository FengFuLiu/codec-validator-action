/**
 * Data Type 验证器
 * 验证 data_type 和 bacnet_type、value_type 的组合是否合法
 */
import { ValidationResult, CodecObject } from '../types';
export declare class DataTypeValidator {
    /**
     * 验证 data_type 和 bacnet_type 的组合
     * @param item codec 对象
     * @returns 验证结果
     */
    static validateBacnetType(item: CodecObject): ValidationResult;
    /**
     * 验证 data_type 和 value_type 的组合
     * @param item codec 对象
     * @returns 验证结果
     */
    static validateValueType(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=data-type-validator.d.ts.map