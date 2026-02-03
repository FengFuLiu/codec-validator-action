/**
 * Reference 字段验证器（基础字段验证）
 * 验证 reference 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class ReferenceFieldValidator {
    /**
     * 验证 reference 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 非必填
     * 2. 数据类型：[]string
     * 3. 数据范围：转换后字节长度为1024以内
     * 4. 关联对象的id必须存在，可关联自己（由 ReferenceValidator 负责）
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=reference.d.ts.map