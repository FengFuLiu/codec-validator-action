"use strict";
/**
 * AccessMode 字段验证器
 * 验证 access_mode 字段的约束（云端准出表/网关准入表标准）
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessModeFieldValidator = void 0;
class AccessModeFieldValidator {
    static VALID_ACCESS_MODES = ['R', 'W', 'RW'];
    /**
     * 验证 access_mode 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为32以内
     * 4. 配置项仅【R】【W】【RW】
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item) {
        const { id, access_mode } = item;
        // 1. 必填检查
        if (!access_mode) {
            return {
                valid: false,
                id,
                message: `access_mode 字段为必填项`,
            };
        }
        // 2. 数据类型检查
        if (typeof access_mode !== 'string') {
            return {
                valid: false,
                id,
                message: `access_mode 必须是字符串类型, 得到 ${typeof access_mode}`,
            };
        }
        // 3. 字节长度检查（32 以内）
        const byteLength = new TextEncoder().encode(access_mode).length;
        if (byteLength > 32) {
            return {
                valid: false,
                id,
                message: `access_mode 字段长度超过 32 字节: ${byteLength} 字节`,
            };
        }
        // 4. 配置项检查
        if (!this.VALID_ACCESS_MODES.includes(access_mode)) {
            return {
                valid: false,
                id,
                message: `access_mode 只能是 R、W 或 RW, 得到: ${access_mode}`,
            };
        }
        return { valid: true, id: null, message: null };
    }
}
exports.AccessModeFieldValidator = AccessModeFieldValidator;
//# sourceMappingURL=access-mode.js.map