/**
 * Access Mode 验证器
 * 验证 access_mode 和 bacnet_type 的组合是否合法
 */
import { ValidationResult, CodecObject } from '../types';
export declare class AccessModeValidator {
    /**
     * 验证 access_mode 和 bacnet_type 的组合
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=access-mode-validator.d.ts.map