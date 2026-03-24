/**
 * Codec 验证器
 * 验证 codec.json 文件的完整性和正确性
 */
interface TestDataValidationStats {
    checkedFields: number;
    errorCount: number;
    skippedFrame: number;
    skippedArrayIndex: number;
    skippedReserve: number;
    skippedRelatedTypeAlias: number;
    skippedRelatedCanonicalAlias: number;
    errorReasonCount: Record<string, number>;
}
export declare class CodecValidator {
    private lastTestDataValidationStats;
    /**
     * 验证 codec.json 文件
     * @param codecJsonPath codec.json 文件路径
     * @returns 验证结果
     */
    validateCodecJson(codecJsonPath: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
    private validateItem;
    /**
     * 验证测试数据中的字段ID是否在codec.json中定义
     * @param testJsonData 测试数据
     * @param codecJsonPath codec.json 文件路径
     * @returns 验证结果
     */
    validateTestDataAgainstCodec(testJsonData: Record<string, any>, codecJsonPath: string): {
        valid: boolean;
        errors: string[];
    };
    /**
     * 获取最近一次 testData 对 codec 的校验统计
     */
    getLastTestDataValidationStats(): TestDataValidationStats;
    private createEmptyTestDataValidationStats;
    /**
     * 识别 "xxx.type" 且 "xxx_types" 已存在的 related 去重场景
     */
    private isRelatedTypeAliasField;
    /**
     * 识别 humidity/temperature/saltation 这类 leaf 字段被标准顶层字段覆盖的场景
     */
    private isRelatedCanonicalAliasField;
    private getCanonicalCandidateIds;
    private toCanonicalLeaf;
    private isCanonicalLikeField;
    private shouldSkipTemperatureUnitAliasField;
    private stripTemperatureUnitPrefixFromLeaf;
    private isTemperatureUnitAliasField;
    private stripTemperatureUnitPrefix;
    private categorizeUndefinedReason;
    private hasNearbyDefinedIds;
    private buildUndefinedFieldErrorMessage;
    /**
     * 展平嵌套对象
     * 例如: {a: {b: 1}} => {"a.b": 1}
     */
    private flattenObject;
    /**
     * 将数组索引转换为通配符
     * 例如: "settings.0.value" => "settings._item.value"
     */
    private convertArrayIndexToWildcard;
}
export {};
//# sourceMappingURL=index.d.ts.map