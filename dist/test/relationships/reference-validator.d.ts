/**
 * Reference 验证器
 * 验证 reference 字段引用的 ID 是否存在
 */
import { ValidationResult, CodecObject } from '../types';
export declare class ReferenceValidator {
    /**
     * 验证 reference 引用的 ID 是否存在
     * @param item codec 对象
     * @param allItems 所有 codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject, allItems: CodecObject[]): ValidationResult;
}
//# sourceMappingURL=reference-validator.d.ts.map