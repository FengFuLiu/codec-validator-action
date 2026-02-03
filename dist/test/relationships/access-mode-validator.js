"use strict";
/**
 * Access Mode 验证器
 * 验证 access_mode 和 bacnet_type 的组合是否合法
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessModeValidator = void 0;
const validation_rules_1 = require("../validation-rules");
class AccessModeValidator {
    /**
     * 验证 access_mode 和 bacnet_type 的组合
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item) {
        const { id, access_mode, bacnet_type, value_type } = item;
        const validTypes = validation_rules_1.ValidationRules.accessModeRules[access_mode];
        if (!validTypes) {
            return { valid: false, id, message: `无效的 access_mode: ${access_mode}` };
        }
        if (value_type === 'STRUCT') {
            return { valid: true, id: null, message: null };
        }
        if (!validTypes.includes(bacnet_type)) {
            return {
                valid: false,
                id,
                message: `access_mode: ${access_mode} 不允许使用 bacnet_type: ${bacnet_type}`,
            };
        }
        return { valid: true, id: null, message: null };
    }
}
exports.AccessModeValidator = AccessModeValidator;
//# sourceMappingURL=access-mode-validator.js.map