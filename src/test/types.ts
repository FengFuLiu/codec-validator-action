/**
 * 验证相关的类型定义
 */

export interface ValidationResult {
	valid: boolean;
	id: string | null;
	message: string | null;
	severity?: 'error' | 'warning';
}

export interface CodecObject {
	id: string;
	description?: string;
	name?: string;
	access_mode: string;
	data_type: string;
	value_type: string;
	bacnet_type: string;
	unit?: string;
	bacnet_unit_type_id?: number;
	bacnet_unit_type?: string;
	reference?: string[];
	value?: any;
	values?: Record<string, any>[];
	max_length?: number;
	range?: [number, number];
}

export interface CodecJson {
	version: string;
	object: CodecObject[];
}
