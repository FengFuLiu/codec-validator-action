/**
 * ID 字段验证器
 * 验证 id 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class IdValidator {
    /**
     * 验证 id 字段的基本约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为127以内
     * 4. 数据格式：小写，单层级/多层级，目前不支持数组
     * 5. 不可重复
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
    /**
     * 验证 id 字段不可重复
     * @param item codec 对象
     * @param allItems 所有 codec 对象
     * @returns 验证结果
     */
    static validateUnique(item: CodecObject, allItems: CodecObject[]): ValidationResult;
}
//# sourceMappingURL=id.d.ts.map