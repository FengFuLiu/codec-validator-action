"use strict";
/**
 * ValueType 字段验证器
 * 验证 value_type 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueTypeFieldValidator = void 0;
class ValueTypeFieldValidator {
    static VALID_VALUE_TYPES = ['UINT8', 'INT8', 'UINT16', 'INT16', 'UINT32', 'INT32', 'FLOAT', 'STRING'];
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
    static validate(item) {
        const { id, data_type, value_type } = item;
        // 1. 关联性必填检查：data_type 为 NUMBER 时必填
        if (data_type === 'NUMBER') {
            if (!value_type) {
                return {
                    valid: false,
                    id,
                    message: `data_type 为 NUMBER 时，value_type 为必填项`,
                };
            }
        }
        // 如果有 value_type，进行后续验证
        if (value_type) {
            // 2. 数据类型检查
            if (typeof value_type !== 'string') {
                return {
                    valid: false,
                    id,
                    message: `value_type 必须是字符串类型, 得到 ${typeof value_type}`,
                };
            }
            // 3. 字节长度检查（32 以内）
            const byteLength = new TextEncoder().encode(value_type).length;
            if (byteLength > 32) {
                return {
                    valid: false,
                    id,
                    message: `value_type 字段长度超过 32 字节: ${byteLength} 字节`,
                };
            }
            // 4. 配置项检查
            if (!this.VALID_VALUE_TYPES.includes(value_type)) {
                return {
                    valid: false,
                    id,
                    message: `value_type 只能是 UINT8、INT8、UINT16、INT16、UINT32、INT32、FLOAT 或 STRING, 得到: ${value_type}`,
                };
            }
        }
        return { valid: true, id: null, message: null };
    }
}
exports.ValueTypeFieldValidator = ValueTypeFieldValidator;
//# sourceMappingURL=value-type.js.map