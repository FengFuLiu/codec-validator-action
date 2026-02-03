"use strict";
/**
 * ID 字段验证器
 * 验证 id 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdValidator = void 0;
class IdValidator {
    /**
     * 验证 id 字段的基本约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为127以内
     * 4. 数据格式：小写，单层级/多层级，目前不支持数组
     * 5. 不可重复
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item) {
        const { id } = item;
        // 1. 必填检查
        if (!id) {
            return {
                valid: false,
                id: id || 'unknown',
                message: 'id 字段为必填项',
            };
        }
        // 2. 数据类型检查
        if (typeof id !== 'string') {
            return {
                valid: false,
                id,
                message: `id 必须是字符串类型, 得到 ${typeof id}`,
            };
        }
        // 3. 字节长度检查（127 以内）
        const byteLength = new TextEncoder().encode(id).length;
        if (byteLength > 127) {
            return {
                valid: false,
                id,
                message: `id 字段长度超过 127 字节: ${byteLength} 字节`,
            };
        }
        // 4. 数据格式检查：小写
        if (id !== id.toLowerCase()) {
            return {
                valid: false,
                id,
                message: `id 必须是小写格式: ${id}`,
            };
        }
        // 4. 数据格式检查：不支持数组索引
        if (/\.\d+\.|\.\d+$/.test(id)) {
            return {
                valid: false,
                id,
                message: `id 不支持数组格式（不能包含数字索引）: ${id}`,
            };
        }
        return { valid: true, id: null, message: null };
    }
    /**
     * 验证 id 字段不可重复
     * @param item codec 对象
     * @param allItems 所有 codec 对象
     * @returns 验证结果
     */
    static validateUnique(item, allItems) {
        const { id } = item;
        if (!id) {
            return { valid: true, id: null, message: null };
        }
        const duplicates = allItems.filter(obj => obj.id === id);
        if (duplicates.length > 1) {
            return {
                valid: false,
                id,
                message: `id 重复出现 ${duplicates.length} 次`,
            };
        }
        return { valid: true, id: null, message: null };
    }
}
exports.IdValidator = IdValidator;
//# sourceMappingURL=id.js.map