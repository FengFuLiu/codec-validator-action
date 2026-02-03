/**
 * ValueType 字段验证器
 * 验证 value_type 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class ValueTypeFieldValidator {
    private static readonly VALID_VALUE_TYPES;
    /**
     * 验证 value_type 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 关联性必填：当 data_type 为 NUMBER 时必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为32以内
     * 4. 配置项仅【UINT8】【INT8】【UINT16】【INT16】【UINT32】【INT32】【FLOAT】
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=value-type.d.ts.map