"use strict";
/**
 * Unit 字段验证器
 * 验证 unit 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitFieldValidator = void 0;
class UnitFieldValidator {
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
    static validate(item) {
        const { id, data_type, unit } = item;
        // 1. 关联性必填检查：data_type 为 NUMBER 时必填
        if (data_type === 'NUMBER') {
            if (unit === undefined || unit === null) {
                return {
                    valid: false,
                    id,
                    message: `data_type 为 NUMBER 时，unit 为必填项`,
                };
            }
        }
        // 2. 如果存在 unit，检查其约束
        if (unit !== undefined && unit !== null && unit !== '') {
            // 数据类型检查
            if (typeof unit !== 'string') {
                return {
                    valid: false,
                    id,
                    message: `unit 必须是字符串类型, 得到 ${typeof unit}`,
                };
            }
            // 自定义单位的字节长度检查（16 以内）
            // 注意：标准单位由 UnitValidator 验证，这里只检查字节长度
            const byteLength = new TextEncoder().encode(unit).length;
            if (byteLength > 16) {
                return {
                    valid: false,
                    id,
                    message: `unit 字段长度超过 16 字节: ${byteLength} 字节`,
                };
            }
        }
        return { valid: true, id: null, message: null };
    }
    /**
     * 验证 unit 与 bacnet_unit_type_id 的一致性
     * 注意：此方法由 UnitValidator 提供更详细的实现
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validateUnitConsistency(item) {
        const { id, unit, bacnet_unit_type_id, bacnet_unit_type } = item;
        // 如果没有 unit，跳过验证
        if (!unit) {
            return { valid: true, id: null, message: null };
        }
        // 如果有 unit，应该有对应的 bacnet_unit_type_id 和 bacnet_unit_type
        if (bacnet_unit_type_id === undefined || bacnet_unit_type_id === null) {
            return {
                valid: false,
                id,
                message: `存在 unit 但缺少 bacnet_unit_type_id`,
            };
        }
        if (!bacnet_unit_type) {
            return {
                valid: false,
                id,
                message: `存在 unit 但缺少 bacnet_unit_type`,
            };
        }
        return { valid: true, id: null, message: null };
    }
}
exports.UnitFieldValidator = UnitFieldValidator;
//# sourceMappingURL=unit.js.map