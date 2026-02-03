/**
 * 测试辅助函数
 */

import { CodecObject } from '../src/test/types';

/**
 * 创建基础的测试 codec 对象
 */
export function createTestCodecObject(
	overrides: Partial<CodecObject> = {}
): CodecObject {
	return {
		id: 'test_id',
		name: 'Test Object',
		access_mode: 'R',
		data_type: 'NUMBER',
		value_type: 'FLOAT',
		bacnet_type: 'analog_input_object',
		...overrides,
	};
}

/**
 * 生成指定字节长度的字符串
 */
export function generateStringWithByteLength(byteLength: number): string {
	// 使用 ASCII 字符，每个字符 1 字节
	return 'a'.repeat(byteLength);
}

/**
 * 生成包含多字节字符的字符串
 */
export function generateMultiByteString(
	charCount: number,
	char: string = '中'
): string {
	return char.repeat(charCount);
}
