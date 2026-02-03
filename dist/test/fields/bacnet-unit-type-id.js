"use strict";
/**
 * BacnetUnitTypeId 字段验证器
 * 验证 bacnet_unit_type_id 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BacnetUnitTypeIdValidator = void 0;
class BacnetUnitTypeIdValidator {
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
    static validate(item) {
        const { id, data_type, bacnet_unit_type_id } = item;
        // 1. 关联性必填检查：data_type 为 NUMBER 时必填
        if (data_type === 'NUMBER') {
            if (bacnet_unit_type_id === undefined || bacnet_unit_type_id === null) {
                return {
                    valid: false,
                    id,
                    message: `data_type 为 NUMBER 时，bacnet_unit_type_id 为必填项`,
                };
            }
            // 2. 数据类型检查（必须是整数）
            if (!Number.isInteger(bacnet_unit_type_id)) {
                return {
                    valid: false,
                    id,
                    message: `bacnet_unit_type_id 必须是整数类型, 得到 ${typeof bacnet_unit_type_id}: ${bacnet_unit_type_id}`,
                };
            }
            // 3. 数据范围检查（必须 >= 0）
            if (bacnet_unit_type_id < 0) {
                return {
                    valid: false,
                    id,
                    message: `bacnet_unit_type_id 必须 >= 0, 得到: ${bacnet_unit_type_id}`,
                };
            }
        }
        return { valid: true, id: null, message: null };
    }
}
exports.BacnetUnitTypeIdValidator = BacnetUnitTypeIdValidator;
//# sourceMappingURL=bacnet-unit-type-id.js.map