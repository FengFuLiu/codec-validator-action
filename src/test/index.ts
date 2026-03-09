/**
 * Codec 验证器
 * 验证 codec.json 文件的完整性和正确性
 */

import fs from 'fs';
import { CodecJson, CodecObject, ValidationResult } from './types';
import { validateItem } from './validate';

export class CodecValidator {
	/**
	 * 验证 codec.json 文件
	 * @param codecJsonPath codec.json 文件路径
	 * @returns 验证结果
	 */
	validateCodecJson(codecJsonPath: string): { valid: boolean; errors: string[]; warnings: string[] } {
		const errors: string[] = [];
		const warnings: string[] = [];

		try {
			// 检查文件是否存在
			if (!fs.existsSync(codecJsonPath)) {
				return {
					valid: false,
					errors: [`codec.json 文件不存在: ${codecJsonPath}`],
					warnings: [],
				};
			}

			// 读取并解析JSON
			const content = fs.readFileSync(codecJsonPath, 'utf8');
			const json: CodecJson = JSON.parse(content);

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
						} else {
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
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return {
				valid: false,
				errors: [`codec.json 验证失败: ${errorMessage}`],
				warnings: [],
			};
		}
	}

	private validateItem(item: CodecObject, allItems: CodecObject[]): ValidationResult[] {
		return validateItem(item, allItems);
	}

	/**
	 * 验证测试数据中的字段ID是否在codec.json中定义
	 * @param testJsonData 测试数据
	 * @param codecJsonPath codec.json 文件路径
	 * @returns 验证结果
	 */
	validateTestDataAgainstCodec(testJsonData: Record<string, any>, codecJsonPath: string): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		try {
			// 读取codec.json
			if (!fs.existsSync(codecJsonPath)) {
				return {
					valid: false,
					errors: [`codec.json 文件不存在: ${codecJsonPath}`],
				};
			}

			const content = fs.readFileSync(codecJsonPath, 'utf8');
			const json: CodecJson = JSON.parse(content);

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
			const checkedKeys = new Set<string>();

			for (const key in flatData) {
				if (key === 'frame') continue; // 跳过frame字段
				if (checkedKeys.has(key)) continue;
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
		} catch (error) {
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
	private flattenObject(obj: any, prefix: string = ''): Record<string, any> {
		const result: Record<string, any> = {};

		for (const key in obj) {
			if (!obj.hasOwnProperty(key)) continue;

			const newKey = prefix ? `${prefix}.${key}` : key;
			const value = obj[key];

			if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
				// 递归展平嵌套对象
				Object.assign(result, this.flattenObject(value, newKey));
			} else if (Array.isArray(value)) {
				// 处理数组
				value.forEach((item, index) => {
					if (item !== null && typeof item === 'object') {
						Object.assign(result, this.flattenObject(item, `${newKey}.${index}`));
					} else {
						result[`${newKey}.${index}`] = item;
					}
				});
			} else {
				result[newKey] = value;
			}
		}

		return result;
	}

	/**
	 * 将数组索引转换为通配符
	 * 例如: "settings.0.value" => "settings._item.value"
	 */
	private convertArrayIndexToWildcard(key: string): string {
		return key.replace(/\.\d+\./g, '._item.').replace(/\.\d+$/g, '._item');
	}
}
