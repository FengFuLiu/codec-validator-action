"use strict";
/**
 * DataType 字段验证器
 * 验证 data_type 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTypeFieldValidator = void 0;
class DataTypeFieldValidator {
    static VALID_DATA_TYPES = ['TEXT', 'NUMBER', 'BOOL', 'ENUM'];
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
    static validate(item) {
        const { id, data_type } = item;
        // 1. 必填检查
        if (!data_type) {
            return {
                valid: false,
                id,
                message: `data_type 字段为必填项`,
            };
        }
        // 2. 数据类型检查
        if (typeof data_type !== 'string') {
            return {
                valid: false,
                id,
                message: `data_type 必须是字符串类型, 得到 ${typeof data_type}`,
            };
        }
        // 3. 字节长度检查（32 以内）
        const byteLength = new TextEncoder().encode(data_type).length;
        if (byteLength > 32) {
            return {
                valid: false,
                id,
                message: `data_type 字段长度超过 32 字节: ${byteLength} 字节`,
            };
        }
        // 4. 配置项检查
        if (!this.VALID_DATA_TYPES.includes(data_type)) {
            return {
                valid: false,
                id,
                message: `data_type 只能是 TEXT、NUMBER、BOOL 或 ENUM, 得到: ${data_type}`,
            };
        }
        return { valid: true, id: null, message: null };
    }
}
exports.DataTypeFieldValidator = DataTypeFieldValidator;
//# sourceMappingURL=data-type.js.map