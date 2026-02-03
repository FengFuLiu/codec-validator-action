/**
 * Codec 验证器
 * 验证 codec.json 文件的完整性和正确性
 */
export declare class CodecValidator {
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
    /**
     * 验证单个 codec 对象
     * @param item codec 对象
     * @param allItems 所有 codec 对象
     * @returns 验证结果列表
     */
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
//# sourceMappingURL=index.d.ts.map