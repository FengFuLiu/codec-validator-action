"use strict";
/**
 * MaxLength 字段验证器
 * 验证 max_length 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaxLengthValidator = void 0;
class MaxLengthValidator {
    /**
     * 验证 max_length 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 关联性必填：当 data_type 为 TEXT 时必填
     * 2. 数据类型：integer
     * 3. 数据范围：1-242
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item) {
        const { id, data_type, max_length } = item;
        // 1. 关联性必填检查：data_type 为 TEXT 时必填
        if (data_type === 'TEXT' || data_type === 'STRING') {
            if (max_length === undefined || max_length === null) {
                return {
                    valid: false,
                    id,
                    message: `data_type 为 TEXT 时，max_length 为必填项`,
                };
            }
            // 2. 数据类型检查（必须是整数）
            if (!Number.isInteger(max_length)) {
                return {
                    valid: false,
                    id,
                    message: `max_length 必须是整数类型, 得到 ${typeof max_length}: ${max_length}`,
                };
            }
            // 3. 数据范围检查（1-242）
            if (max_length < 1 || max_length > 242) {
                return {
                    valid: false,
                    id,
                    message: `max_length 必须在 1-242 之间, 得到: ${max_length}`,
                };
            }
        }
        return { valid: true, id: null, message: null };
    }
}
exports.MaxLengthValidator = MaxLengthValidator;
//# sourceMappingURL=max-length.js.map