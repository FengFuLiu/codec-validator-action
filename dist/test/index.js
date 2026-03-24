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
const validate_1 = require("./validate");
class CodecValidator {
    lastTestDataValidationStats = this.createEmptyTestDataValidationStats();
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
    validateItem(item, allItems) {
        return (0, validate_1.validateItem)(item, allItems);
    }
    /**
     * 验证测试数据中的字段ID是否在codec.json中定义
     * @param testJsonData 测试数据
     * @param codecJsonPath codec.json 文件路径
     * @returns 验证结果
     */
    validateTestDataAgainstCodec(testJsonData, codecJsonPath) {
        const errors = [];
        const stats = this.createEmptyTestDataValidationStats();
        this.lastTestDataValidationStats = stats;
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
            const definedIdList = Array.from(definedIds);
            for (const key in flatData) {
                if (key === 'frame') {
                    stats.skippedFrame++;
                    continue; // 跳过frame字段
                }
                if (checkedKeys.has(key))
                    continue;
                checkedKeys.add(key);
                stats.checkedFields++;
                // 跳过数组元素字段（如 history.0.timestamp）
                // 因为 skipArrayNode=true 时，codec.json 中不会定义数组节点
                if (/\.\d+(\.|$)/.test(key)) {
                    stats.skippedArrayIndex++;
                    continue;
                }
                // 跳过 .reserve 结尾的字段（如 button_lock.reserve）
                // 这些是保留字段，不需要在 codec.json 中定义
                if (key.endsWith('.reserve')) {
                    stats.skippedReserve++;
                    continue;
                }
                // 检查直接匹配
                let isValid = definedIds.has(key);
                const wildcardKey = this.convertArrayIndexToWildcard(key);
                if (!isValid) {
                    // 如果不存在，尝试通配符匹配（数组索引转换）
                    isValid = definedIds.has(wildcardKey);
                }
                if (isValid) {
                    continue;
                }
                if (this.isRelatedTypeAliasField(key, definedIds)) {
                    stats.skippedRelatedTypeAlias++;
                    continue;
                }
                if (this.isRelatedCanonicalAliasField(key, definedIds)) {
                    stats.skippedRelatedCanonicalAlias++;
                    continue;
                }
                if (this.shouldSkipTemperatureUnitAliasField(key, wildcardKey, definedIds)) {
                    stats.skippedRelatedCanonicalAlias++;
                    continue;
                }
                const reason = this.categorizeUndefinedReason(key, wildcardKey, definedIdList);
                stats.errorReasonCount[reason] = (stats.errorReasonCount[reason] || 0) + 1;
                if (!isValid) {
                    errors.push(this.buildUndefinedFieldErrorMessage(key, reason));
                }
            }
            stats.errorCount = errors.length;
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
     * 获取最近一次 testData 对 codec 的校验统计
     */
    getLastTestDataValidationStats() {
        return {
            ...this.lastTestDataValidationStats,
            errorReasonCount: { ...this.lastTestDataValidationStats.errorReasonCount },
        };
    }
    createEmptyTestDataValidationStats() {
        return {
            checkedFields: 0,
            errorCount: 0,
            skippedFrame: 0,
            skippedArrayIndex: 0,
            skippedReserve: 0,
            skippedRelatedTypeAlias: 0,
            skippedRelatedCanonicalAlias: 0,
            errorReasonCount: {},
        };
    }
    /**
     * 识别 "xxx.type" 且 "xxx_types" 已存在的 related 去重场景
     */
    isRelatedTypeAliasField(key, definedIds) {
        if (!key.endsWith('.type')) {
            return false;
        }
        const parentId = key.slice(0, -'.type'.length);
        if (!parentId) {
            return false;
        }
        return definedIds.has(`${parentId}_types`);
    }
    /**
     * 识别 humidity/temperature/saltation 这类 leaf 字段被标准顶层字段覆盖的场景
     */
    isRelatedCanonicalAliasField(key, definedIds) {
        const candidates = this.getCanonicalCandidateIds(key);
        if (candidates.length === 0) {
            return false;
        }
        return candidates.some(candidate => definedIds.has(candidate));
    }
    getCanonicalCandidateIds(key) {
        const parts = key.split('.').filter(Boolean);
        if (parts.length < 2) {
            return [];
        }
        const leaf = this.toCanonicalLeaf(parts[parts.length - 1]);
        if (!leaf) {
            return [];
        }
        const candidates = new Set();
        candidates.add(leaf);
        const root = parts[0];
        if (root.endsWith('_alarm')) {
            const rootCanonical = root.slice(0, -'_alarm'.length);
            if (rootCanonical) {
                candidates.add(rootCanonical);
            }
        }
        return Array.from(candidates);
    }
    toCanonicalLeaf(leaf) {
        if (leaf === 'celsius_temperature' || leaf === 'fahrenheit_temperature') {
            return 'temperature';
        }
        if (leaf === 'temperature' || leaf === 'humidity') {
            return leaf;
        }
        if (leaf === 'saltation') {
            return 'temperature';
        }
        return null;
    }
    isCanonicalLikeField(key) {
        return this.getCanonicalCandidateIds(key).length > 0;
    }
    shouldSkipTemperatureUnitAliasField(key, wildcardKey, definedIds) {
        const normalizedKey = this.stripTemperatureUnitPrefixFromLeaf(key);
        const normalizedWildcardKey = this.stripTemperatureUnitPrefixFromLeaf(wildcardKey);
        const candidates = [normalizedKey, normalizedWildcardKey].filter((candidate) => Boolean(candidate));
        if (candidates.length === 0) {
            return false;
        }
        for (const candidate of candidates) {
            if (definedIds.has(candidate)) {
                return true;
            }
            if (this.isRelatedCanonicalAliasField(candidate, definedIds)) {
                return true;
            }
        }
        return false;
    }
    stripTemperatureUnitPrefixFromLeaf(key) {
        const parts = key.split('.');
        if (parts.length === 0) {
            return null;
        }
        const leaf = parts[parts.length - 1];
        const normalizedLeaf = this.stripTemperatureUnitPrefix(leaf);
        if (normalizedLeaf === leaf || normalizedLeaf.length === 0) {
            return null;
        }
        parts[parts.length - 1] = normalizedLeaf;
        return parts.join('.');
    }
    isTemperatureUnitAliasField(key) {
        const parts = key.split('.');
        const leaf = parts[parts.length - 1] || '';
        return this.stripTemperatureUnitPrefix(leaf) !== leaf;
    }
    stripTemperatureUnitPrefix(leaf) {
        if (leaf.startsWith('celsius_')) {
            return leaf.slice('celsius_'.length);
        }
        if (leaf.startsWith('fahrenheit_')) {
            return leaf.slice('fahrenheit_'.length);
        }
        return leaf;
    }
    categorizeUndefinedReason(key, wildcardKey, definedIdList) {
        if (this.isCanonicalLikeField(key) ||
            this.isCanonicalLikeField(wildcardKey) ||
            this.isTemperatureUnitAliasField(key) ||
            this.isTemperatureUnitAliasField(wildcardKey)) {
            return '未匹配标准字段';
        }
        const directParent = key.includes('.') ? key.split('.').slice(0, -1).join('.') : '';
        const wildcardParent = wildcardKey.includes('.') ? wildcardKey.split('.').slice(0, -1).join('.') : '';
        const hasNearbyIds = this.hasNearbyDefinedIds(key, wildcardKey, directParent, wildcardParent, definedIdList);
        if (hasNearbyIds) {
            return '可能被过滤字段';
        }
        return '纯未定义字段';
    }
    hasNearbyDefinedIds(key, wildcardKey, directParent, wildcardParent, definedIdList) {
        return definedIdList.some((definedId) => {
            if (directParent && (definedId.startsWith(`${directParent}.`) || directParent.startsWith(`${definedId}.`))) {
                return true;
            }
            if (wildcardParent && (definedId.startsWith(`${wildcardParent}.`) || wildcardParent.startsWith(`${definedId}.`))) {
                return true;
            }
            if (key.startsWith(`${definedId}.`) || wildcardKey.startsWith(`${definedId}.`)) {
                return true;
            }
            return false;
        });
    }
    buildUndefinedFieldErrorMessage(key, reason) {
        return `字段 "${key}" 在 codec.json 中未定义 [原因:${reason}]`;
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