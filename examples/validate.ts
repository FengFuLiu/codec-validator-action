import { CodecValidator } from '../src/test';

const codecJsonPath = process.argv[2] || './examples/codec.json';

const validator = new CodecValidator();
const result = validator.validateCodecJson(codecJsonPath);

console.log(`\n===== Codec 验证结果 =====\n`);
console.log(`文件: ${codecJsonPath}`);
console.log(`状态: ${result.valid ? '✅ 通过' : '❌ 失败'}`);

if (result.errors.length > 0) {
	console.log(`\n错误 (${result.errors.length}):`);
	result.errors.forEach((e) => console.log(`  - ${e}`));
}

if (result.warnings.length > 0) {
	console.log(`\n警告 (${result.warnings.length}):`);
	result.warnings.forEach((w) => console.log(`  - ${w}`));
}

if (result.valid && result.warnings.length === 0) {
	console.log('\n所有校验均通过，无错误无警告。');
}

console.log('');
