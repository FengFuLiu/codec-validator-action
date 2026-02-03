/**
 * BacnetUnitTypeId 字段验证器
 * 验证 bacnet_unit_type_id 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class BacnetUnitTypeIdValidator {
    /**
     * 验证 bacnet_unit_type_id 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 关联性必填：当 data_type 为 NUMBER 时必填
     * 2. 数据类型：integer类型
     * 3. 数据范围：非自定义单位属于标准单位表中的ID，自定义单位id为95
     * 4. 和【unit】对应验证
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=bacnet-unit-type-id.d.ts.map