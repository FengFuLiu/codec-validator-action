"use strict";
/**
 * Codec 验证器
 * 验证 codec.json 文件的完整性和正确性
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodecValidator = void 0;
const fs_1 = __importDefault(require("fs"));
// 关联性验证器
const access_mode_validator_1 = require("./relationships/access-mode-validator");
const data_type_validator_1 = require("./relationships/data-type-validator");
const unit_validator_1 = require("./relationships/unit-validator");
const reference_validator_1 = require("./relationships/reference-validator");
// 基础字段验证器
const id_1 = require("./fields/id");
const description_1 = require("./fields/description");
const name_1 = require("./fields/name");
const access_mode_1 = require("./fields/access-mode");
const data_type_1 = require("./fields/data-type");
const value_type_1 = require("./fields/value-type");
const value_1 = require("./fields/value");
const max_length_1 = require("./fields/max-length");
const unit_1 = require("./fields/unit");
const bacnet_type_1 = require("./fields/bacnet-type");
const bacnet_unit_type_id_1 = require("./fields/bacnet-unit-type-id");
const bacnet_unit_type_1 = require("./fields/bacnet-unit-type");
const reference_1 = require("./fields/reference");
class CodecValidator {
    /**
     * 验证 codec.json 文件
     * @param codecJsonPath codec.json 文件路径
     * @returns 验证结果
     */
    validateCodecJson(codecJsonPath) {
        const errors = [];
        const warnings = [];
        try {
            // 检查文件是否存在
            if (!fs_1.default.existsSync(codecJsonPath)) {
                return {
                    valid: false,
                    errors: [`codec.json 文件不存在: ${codecJsonPath}`],
                    warnings: [],
                };
            }
            // 读取并解析JSON
            const content = fs_1.default.readFileSync(codecJsonPath, 'utf8');
            const json = JSON.parse(content);
            // 检查基本结构
            if (!json.object || !Array.isArray(json.object)) {
                errors.push('JSON 格式错误, 缺少 object 数组');
                return { valid: false, errors, warnings };
            }
            // 验证每个对象
            for (const item of json.object) {
                const results = this.validateItem(item, json.object);
                for (const result of results) {
                    if (result.message) {
                        const msg = `${result.id}: ${result.message}`;
                        if (result.severity === 'error') {
                            errors.push(msg);
                        }
                        else {
                            warnings.push(msg);
                        }
                    }
                }
            }
            return {
                valid: errors.length === 0,
                errors,
                warnings,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                valid: false,
                errors: [`codec.json 验证失败: ${errorMessage}`],
                warnings: [],
            };
        }
    }
    /**
     * 验证单个 codec 对象
     * @param item codec 对象
     * @param allItems 所有 codec 对象
     * @returns 验证结果列表
     */
    validateItem(item, allItems) {
        const validations = [
            // 云端准出表/网关准入表 - 基础字段验证
            { ...id_1.IdValidator.validate(item), severity: 'error' },
            { ...id_1.IdValidator.validateUnique(item, allItems), severity: 'error' },
            { ...description_1.DescriptionValidator.validate(item), severity: 'error' },
            { ...name_1.NameValidator.validate(item), severity: 'error' },
            { ...access_mode_1.AccessModeFieldValidator.validate(item), severity: 'error' },
            { ...data_type_1.DataTypeFieldValidator.validate(item), severity: 'error' },
            { ...value_type_1.ValueTypeFieldValidator.validate(item), severity: 'error' },
            { ...value_1.ValueValidator.validate(item), severity: 'error' },
            { ...value_1.ValueValidator.validateValues(item), severity: 'error' },
            { ...max_length_1.MaxLengthValidator.validate(item), severity: 'error' },
            { ...unit_1.UnitFieldValidator.validate(item), severity: 'error' },
            { ...unit_1.UnitFieldValidator.validateUnitConsistency(item), severity: 'error' },
            { ...bacnet_type_1.BacnetTypeFieldValidator.validate(item), severity: 'error' },
            { ...bacnet_unit_type_id_1.BacnetUnitTypeIdValidator.validate(item), severity: 'error' },
            { ...bacnet_unit_type_1.BacnetUnitTypeValidator.validate(item), severity: 'error' },
            { ...reference_1.ReferenceFieldValidator.validate(item), severity: 'error' },
            // 关联性验证（字段组合关系）
            { ...access_mode_validator_1.AccessModeValidator.validate(item), severity: 'error' },
            { ...data_type_validator_1.DataTypeValidator.validateBacnetType(item), severity: 'error' },
            { ...data_type_validator_1.DataTypeValidator.validateValueType(item), severity: 'error' },
            { ...unit_validator_1.UnitValidator.validate(item), severity: 'error' },
            { ...reference_validator_1.ReferenceValidator.validate(item, allItems), severity: 'error' },
        ];
        return validations.filter(result => !result.valid);
    }
    /**
     * 验证测试数据中的字段ID是否在codec.json中定义
     * @param testJsonData 测试数据
     * @param codecJsonPath codec.json 文件路径
     * @returns 验证结果
     */
    validateTestDataAgainstCodec(testJsonData, codecJsonPath) {
        const errors = [];
        try {
            // 读取codec.json
            if (!fs_1.default.existsSync(codecJsonPath)) {
                return {
                    valid: false,
                    errors: [`codec.json 文件不存在: ${codecJsonPath}`],
                };
            }
            const content = fs_1.default.readFileSync(codecJsonPath, 'utf8');
            const json = JSON.parse(content);
            if (!json.object || !Array.isArray(json.object)) {
                return {
                    valid: false,
                    errors: ['codec.json 格式错误'],
                };
            }
            // 创建ID集合用于快速查找
            const definedIds = new Set(json.object.map(item => item.id));
            // 展平测试数据并检查每个字段
            const flatData = this.flattenObject(testJsonData);
            const checkedKeys = new Set();
            for (const key in flatData) {
                if (key === 'frame')
                    continue; // 跳过frame字段
                if (checkedKeys.has(key))
                    continue;
                checkedKeys.add(key);
                // 跳过数组元素字段（如 history.0.timestamp）
                // 因为 skipArrayNode=true 时，codec.json 中不会定义数组节点
                if (/\.\d+(\.| $)/.test(key)) {
                    continue;
                }
                // 跳过 .reserve 结尾的字段（如 button_lock.reserve）
                // 这些是保留字段，不需要在 codec.json 中定义
                if (key.endsWith('.reserve')) {
                    continue;
                }
                // 检查直接匹配
                let isValid = definedIds.has(key);
                if (!isValid) {
                    // 如果不存在，尝试通配符匹配（数组索引转换）
                    const wildcardKey = this.convertArrayIndexToWildcard(key);
                    isValid = definedIds.has(wildcardKey);
                }
                if (!isValid) {
                    errors.push(`字段 "${key}" 在 codec.json 中未定义`);
                }
            }
            return {
                valid: errors.length === 0,
                errors,
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            return {
                valid: false,
                errors: [`验证测试数据失败: ${errorMessage}`],
            };
        }
    }
    /**
     * 展平嵌套对象
     * 例如: {a: {b: 1}} => {"a.b": 1}
     */
    flattenObject(obj, prefix = '') {
        const result = {};
        for (const key in obj) {
            if (!obj.hasOwnProperty(key))
                continue;
            const newKey = prefix ? `${prefix}.${key}` : key;
            const value = obj[key];
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                // 递归展平嵌套对象
                Object.assign(result, this.flattenObject(value, newKey));
            }
            else if (Array.isArray(value)) {
                // 处理数组
                value.forEach((item, index) => {
                    if (item !== null && typeof item === 'object') {
                        Object.assign(result, this.flattenObject(item, `${newKey}.${index}`));
                    }
                    else {
                        result[`${newKey}.${index}`] = item;
                    }
                });
            }
            else {
                result[newKey] = value;
            }
        }
        return result;
    }
    /**
     * 将数组索引转换为通配符
     * 例如: "settings.0.value" => "settings._item.value"
     */
    convertArrayIndexToWildcard(key) {
        return key.replace(/\.\d+\./g, '._item.').replace(/\.\d+$/g, '._item');
    }
}
exports.CodecValidator = CodecValidator;
//# sourceMappingURL=index.js.map