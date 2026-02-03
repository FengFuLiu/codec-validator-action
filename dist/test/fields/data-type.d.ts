/**
 * DataType 字段验证器
 * 验证 data_type 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class DataTypeFieldValidator {
    private static readonly VALID_DATA_TYPES;
    /**
     * 验证 data_type 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为32以内
     * 4. 配置项仅【TEXT】【NUMBER】【BOOL】【ENUM】
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=data-type.d.ts.map