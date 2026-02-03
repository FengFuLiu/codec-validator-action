/**
 * 验证规则配置
 * 定义 codec.json 中各字段之间的合法组合关系
 */

export const ValidationRules = {
	// access_mode 对应的有效 bacnet_type
	accessModeRules: {
		R: ['binary_input_object', 'analog_input_object', 'multistate_value_object', 'character_string_value_object'],
		W: ['binary_output_object', 'analog_output_object', 'multistate_value_object', 'character_string_value_object'],
		RW: ['binary_value_object', 'analog_value_object', 'multistate_value_object', 'character_string_value_object'],
	},

	// data_type 对应的有效 bacnet_type
	dataTypeBacnetRules: {
		BOOL: ['binary_input_object', 'binary_output_object', 'binary_value_object'],
		NUMBER: ['analog_input_object', 'analog_output_object', 'analog_value_object'],
		ENUM: ['multistate_value_object'],
		STRING: ['character_string_value_object'],
	},

	// data_type 对应的有效 value_type
	dataTypeValueRules: {
		BOOL: ['UINT8'],
		NUMBER: ['INT8', 'UINT8', 'INT16', 'UINT16', 'INT32', 'UINT32', 'FLOAT'],
		TEXT: ['STRING'],
		ENUM: ['UINT8', 'UINT16', 'INT16'],
	},
};
