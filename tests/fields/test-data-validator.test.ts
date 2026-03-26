import { afterEach, beforeEach, describe, test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CodecValidator } from '../../src/test';

function writeCodecJson(codecPath: string, ids: string[]): void {
	const codecJson = {
		version: '1.0.0',
		object: ids.map((id) => ({ id })),
	};
	fs.writeFileSync(codecPath, JSON.stringify(codecJson), 'utf8');
}

describe('CodecValidator.validateTestDataAgainstCodec', () => {
	let tmpDir: string;
	let codecPath: string;
	let validator: CodecValidator;

	beforeEach(() => {
		tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codec-validator-action-'));
		codecPath = path.join(tmpDir, 'codec.json');
		validator = new CodecValidator();
	});

	afterEach(() => {
		fs.rmSync(tmpDir, { recursive: true, force: true });
	});

	test('related type alias 字段应跳过且不报错（xxx.type -> xxx_types）', () => {
		writeCodecJson(codecPath, ['humidity_alarm_types']);

		const result = validator.validateTestDataAgainstCodec(
			{
				humidity_alarm: { type: 1 },
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedRelatedTypeAlias, 1);
		assert.equal(stats.errorCount, 0);
	});

	test('related canonical alias 字段应跳过且不报错', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				temperature_alarm: { celsius_temperature: 23.5 },
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedRelatedCanonicalAlias, 1);
		assert.equal(stats.errorCount, 0);
	});

	test('传入 relatedAliasMap 时命中映射应跳过且不报错', () => {
		writeCodecJson(codecPath, ['voltage_three_phase_imbalcance']);

		const result = validator.validateTestDataAgainstCodec(
			{
				voltage_unbalance_alarm: {
					over_range_alarm_deactivation: { voltage_unbalance: 12.02 },
					over_range_alarm_trigger: { voltage_unbalance: 98.06 },
				},
			},
			codecPath,
			{
				relatedAliasMap: {
					'voltage_unbalance_alarm.over_range_alarm_deactivation.voltage_unbalance': 'voltage_three_phase_imbalcance',
					'voltage_unbalance_alarm.over_range_alarm_trigger.voltage_unbalance': 'voltage_three_phase_imbalcance',
				},
			}
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedRelatedCanonicalAlias, 2);
		assert.equal(stats.errorCount, 0);
	});

	test('未传 options 时 relatedAliasMap 规则不生效（保持兼容旧行为）', () => {
		writeCodecJson(codecPath, ['voltage_three_phase_imbalcance']);

		const result = validator.validateTestDataAgainstCodec(
			{
				voltage_unbalance_alarm: {
					over_range_alarm_deactivation: { voltage_unbalance: 12.02 },
					over_range_alarm_trigger: { voltage_unbalance: 98.06 },
				},
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 2);
		assert.match(result.errors[0], /字段 "voltage_unbalance_alarm\.over_range_alarm_deactivation\.voltage_unbalance" 在 codec\.json 中未定义/);
		assert.match(result.errors[1], /字段 "voltage_unbalance_alarm\.over_range_alarm_trigger\.voltage_unbalance" 在 codec\.json 中未定义/);
		assert.equal(stats.skippedRelatedCanonicalAlias, 0);
	});

	test('relatedAliasMap 未命中时不应跳过字段', () => {
		writeCodecJson(codecPath, ['voltage_three_phase_imbalcance']);

		const result = validator.validateTestDataAgainstCodec(
			{
				current_alarm: {
					info: {
						over_range_alarm_trigger: { voltage_unbalance: 11.11 },
					},
				},
			},
			codecPath,
			{
				relatedAliasMap: {
					'voltage_unbalance_alarm.over_range_alarm_trigger.voltage_unbalance': 'voltage_three_phase_imbalcance',
				},
			}
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 1);
		assert.match(result.errors[0], /字段 "current_alarm\.info\.over_range_alarm_trigger\.voltage_unbalance" 在 codec\.json 中未定义/);
		assert.equal(stats.skippedRelatedCanonicalAlias, 0);
	});

	test('传入 ignoreRowPropertyIds 精确匹配时应跳过且不报错', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				custom_alarm: {
					trigger: {
						voltage_delta: 1,
					},
				},
			},
			codecPath,
			{
				ignoreRowPropertyIds: ['custom_alarm.trigger.voltage_delta'],
			}
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedIgnoreRow, 1);
		assert.equal(stats.errorCount, 0);
	});

	test('传入 ignoreRowPropertyIds 父路径匹配时应跳过且不报错', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				custom_alarm: {
					trigger: {
						voltage_delta: 1,
					},
				},
			},
			codecPath,
			{
				ignoreRowPropertyIds: ['custom_alarm.trigger'],
			}
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedIgnoreRow, 1);
		assert.equal(stats.errorCount, 0);
	});

	test('未命中 ignoreRowPropertyIds 时不应跳过字段', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				custom_alarm: {
					trigger: {
						voltage_delta: 1,
					},
				},
			},
			codecPath,
			{
				ignoreRowPropertyIds: ['other_alarm.trigger'],
			}
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 1);
		assert.match(result.errors[0], /字段 "custom_alarm\.trigger\.voltage_delta" 在 codec\.json 中未定义/);
		assert.equal(stats.skippedIgnoreRow, 0);
	});

	test('celsius_saltation 在基准字段被 related 去重时应通过 canonical 映射跳过', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				temperature_alarm: {
					mutation_alarm_trigger: {
						celsius_saltation: 0.5,
					},
				},
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedRelatedCanonicalAlias, 1);
		assert.equal(stats.errorCount, 0);
	});

	test('fahrenheit_saltation 在基准字段被 related 去重时应通过 canonical 映射跳过', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				temperature_alarm: {
					mutation_alarm_trigger: {
						fahrenheit_saltation: 32.9,
					},
				},
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedRelatedCanonicalAlias, 1);
		assert.equal(stats.errorCount, 0);
	});

	test('celsius_unknown/fahrenheit_unknown 未命中时应标记为“未匹配标准字段”', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				temperature_alarm: {
					mutation_alarm_trigger: {
						celsius_unknown: 1,
						fahrenheit_unknown: 2,
					},
				},
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 2);
		assert.ok(result.errors.every((err) => /\[原因:未匹配标准字段\]/.test(err)));
		assert.equal(stats.errorReasonCount['未匹配标准字段'], 2);
		assert.equal(stats.errorCount, 2);
	});

	test('温标前缀别名命中跳过后应累加到 skippedRelatedCanonicalAlias', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				temperature_alarm: {
					mutation_alarm_trigger: {
						celsius_saltation: 0.4,
						fahrenheit_saltation: 32.7,
					},
				},
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, true);
		assert.deepEqual(result.errors, []);
		assert.equal(stats.skippedRelatedCanonicalAlias, 2);
		assert.equal(stats.errorCount, 0);
	});

	test('未命中 related 跳过时，错误应包含原因标签', () => {
		writeCodecJson(codecPath, ['humidity_alarm.status']);

		const result = validator.validateTestDataAgainstCodec(
			{
				humidity_alarm: { level: 2 },
			},
			codecPath
		);

		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 1);
		assert.match(result.errors[0], /\[原因:可能被过滤字段\]/);
	});

	test('纯未定义字段应标记为“纯未定义字段”', () => {
		writeCodecJson(codecPath, ['temperature']);

		const result = validator.validateTestDataAgainstCodec(
			{
				unknown_field: 1,
			},
			codecPath
		);

		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 1);
		assert.match(result.errors[0], /\[原因:纯未定义字段\]/);
	});

	test('frame/数组索引/.reserve 字段应按规则跳过', () => {
		writeCodecJson(codecPath, ['known']);

		const result = validator.validateTestDataAgainstCodec(
			{
				frame: 1,
				data: [1, 2],
				history: [{ timestamp: 123 }],
				device: { reserve: 0 },
				unknown: 7,
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 1);
		assert.match(result.errors[0], /字段 "unknown" 在 codec\.json 中未定义/);
		assert.equal(stats.skippedFrame, 1);
		assert.equal(stats.skippedArrayIndex, 3);
		assert.equal(stats.skippedReserve, 1);
	});

	test('统计项应与错误列表一致，且返回值是防御性拷贝', () => {
		writeCodecJson(codecPath, ['sensor.exists']);

		const result = validator.validateTestDataAgainstCodec(
			{
				sensor: { missing: 1 },
				random: 2,
			},
			codecPath
		);

		const stats = validator.getLastTestDataValidationStats();
		assert.equal(result.valid, false);
		assert.equal(result.errors.length, 2);
		assert.equal(stats.errorCount, result.errors.length);
		assert.equal(stats.errorReasonCount['可能被过滤字段'], 1);
		assert.equal(stats.errorReasonCount['纯未定义字段'], 1);

		stats.errorReasonCount['纯未定义字段'] = 999;
		const statsAfterMutation = validator.getLastTestDataValidationStats();
		assert.equal(statsAfterMutation.errorReasonCount['纯未定义字段'], 1);
	});
});
