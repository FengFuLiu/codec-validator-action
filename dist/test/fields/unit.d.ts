/**
 * Unit 字段验证器
 * 验证 unit 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class UnitFieldValidator {
    /**
     * 验证 unit 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 关联性必填：当 data_type 为 NUMBER 时必填
     * 2. 自定义单位：数据类型 string，数据范围：转换后字节长度为16以内
     * 3. 和【bacnet_unit_type_id】对应验证（由 UnitValidator 负责）
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
    /**
     * 验证 unit 与 bacnet_unit_type_id 的一致性
     * 注意：此方法由 UnitValidator 提供更详细的实现
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validateUnitConsistency(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=unit.d.ts.map