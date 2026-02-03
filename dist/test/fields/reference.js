"use strict";
/**
 * Reference 字段验证器（基础字段验证）
 * 验证 reference 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReferenceFieldValidator = void 0;
class ReferenceFieldValidator {
    /**
     * 验证 reference 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 非必填
     * 2. 数据类型：[]string
     * 3. 数据范围：转换后字节长度为1024以内
     * 4. 关联对象的id必须存在，可关联自己（由 ReferenceValidator 负责）
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item) {
        const { id, reference } = item;
        // 1. 非必填，如果不存在直接通过
        if (!reference) {
            return { valid: true, id: null, message: null };
        }
        // 2. 数据类型检查（必须是数组）
        if (!Array.isArray(reference)) {
            return {
                valid: false,
                id,
                message: `reference 必须是数组类型, 得到 ${typeof reference}`,
            };
        }
        // 检查数组元素类型（必须是字符串）
        for (let i = 0; i < reference.length; i++) {
            if (typeof reference[i] !== 'string') {
                return {
                    valid: false,
                    id,
                    message: `reference[${i}] 必须是字符串类型, 得到 ${typeof reference[i]}`,
                };
            }
        }
        // 3. 字节长度检查（整个数组序列化后 1024 以内）
        const jsonString = JSON.stringify(reference);
        const byteLength = new TextEncoder().encode(jsonString).length;
        if (byteLength > 1024) {
            return {
                valid: false,
                id,
                message: `reference 字段序列化后长度超过 1024 字节: ${byteLength} 字节`,
            };
        }
        return { valid: true, id: null, message: null };
    }
}
exports.ReferenceFieldValidator = ReferenceFieldValidator;
//# sourceMappingURL=reference.js.map