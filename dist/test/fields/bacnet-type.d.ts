/**
 * BacnetType 字段验证器
 * 验证 bacnet_type 字段的约束（云端准出表/网关准入表标准）
 */
import { ValidationResult, CodecObject } from '../types';
export declare class BacnetTypeFieldValidator {
    private static readonly VALID_BACNET_TYPES;
    /**
     * 验证 bacnet_type 字段约束
     *
     * 云端准出表/网关准入表标准：
     * 1. 必填
     * 2. 数据类型：string
     * 3. 数据范围：转换后字节长度为64以内
     * 4. 配置项仅指定的 BACnet 对象类型
     *
     * @param item codec 对象
     * @returns 验证结果
     */
    static validate(item: CodecObject): ValidationResult;
}
//# sourceMappingURL=bacnet-type.d.ts.map