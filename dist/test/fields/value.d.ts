/**
 * Value 字段验证器
 * 验证 value 和 values 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class ValueValidator {
    /**
     * 验证 value 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 非必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为16以内
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
    /**
     * 验证 values 数组约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 关联性必填：
     *    - data_type 为 BOOL 时：必填，长度为2，包含 value(0/1) 和对应的 name
     *    - data_type 为 ENUM 时：必填，长度2-50，value 和 name 数量一致
     * 2. 数据类型：value 必须为 integer 类型，name 可为空
     * 3. 数据范围：name 转换后字节长度为127以内
     * 4. 数组长度限制50个
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validateValues(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=value.d.ts.map