/**
 * MaxLength 字段验证器
 * 验证 max_length 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class MaxLengthValidator {
    /**
     * 验证 max_length 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 关联性必填：当 data_type 为 TEXT 时必填
     * 2. 数据类型：integer
     * 3. 数据范围：1-242
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=max-length.d.ts.map