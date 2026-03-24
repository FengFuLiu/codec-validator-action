/**
 * Name 字段验证器
 * 验证 name 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class NameValidator {
    /**
     * 验证 name 字段不可重复
     * @param item codec 对象
     * @param allItems 所有 codec 对象
     * @returns 验证结果
     */
    static validateUnique(item: CodecObject, allItems: CodecObject[]): ValidationResult;
    /**
     * 验证 name 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 非必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为128以内
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=name.d.ts.map