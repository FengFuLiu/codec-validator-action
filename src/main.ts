import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { CodecValidator } from './test';

/**
 * 生成验证报告
 */
async function generateReport(
	targetPath: string,
	result: { valid: boolean; errors: string[]; warnings: string[] },
	objectCount: number = 0
): Promise<void> {
	const fileName = path.basename(targetPath);
	const totalIssues = result.errors.length + result.warnings.length;

	// 创建 Summary（在 GitHub Actions 中显示）
	await core.summary
		.addHeading('Codec.json 验证报告', 1)
		.addRaw('\n')
		.addHeading('📊 验证结果', 2)
		.addTable([
			[
				{ data: '项目', header: true },
				{ data: '值', header: true },
			],
			['📄 文件名', fileName],
			['📦 对象数量', objectCount.toString()],
			['✅ 验证状态', result.valid ? '✅ 通过' : '❌ 失败'],
			['❌ 错误数', result.errors.length.toString()],
			['⚠️  警告数', result.warnings.length.toString()],
		])
		.addRaw('\n');

	// 添加错误详情
	if (result.errors.length > 0) {
		core.summary.addHeading(`❌ 错误详情 (${result.errors.length})`, 2);
		core.summary.addList(result.errors);
		core.summary.addRaw('\n');
	}

	// 添加警告详情
	if (result.warnings.length > 0) {
		core.summary.addHeading(`⚠️ 警告详情 (${result.warnings.length})`, 2);
		core.summary.addList(result.warnings);
		core.summary.addRaw('\n');
	}

	// 添加成功消息
	if (result.valid && totalIssues === 0) {
		core.summary
			.addHeading('✨ 验证成功', 2)
			.addQuote(
				`成功验证 ${objectCount} 个对象，所有验证规则均已通过，未发现任何问题。`
			)
			.addRaw('\n');
	} else if (!result.valid) {
		core.summary
			.addHeading('❌ 验证失败', 2)
			.addQuote(
				`验证 ${objectCount} 个对象时发现 ${result.errors.length} 个错误，${result.warnings.length} 个警告。请检查上述问题并修复。`
			)
			.addRaw('\n');
	}

	// 添加页脚
	core.summary
		.addRaw('\n---\n')
		.addRaw(
			'<sub>由 [Codec Validator Action](https://github.com/FengFuLiu/codec-validator-action) 生成 | 支持 18 种验证规则</sub>'
		);

	// 写入 summary
	await core.summary.write();
}

async function run(): Promise<void> {
  try {
    // 获取输入参数
    const codecPath = core.getInput('codec-path');
    const failOnWarning = core.getInput('fail-on-warning') === 'true';

    // 查找 codec.json 文件
    let targetPath = '';

    if (codecPath) {
      // 使用指定的路径
      targetPath = codecPath;
    } else {
      // 自动检测当前目录下的 codec.json 文件
      const currentDir = process.cwd();
      const files = fs.readdirSync(currentDir);
      const codecFile = files.find(file => file.includes('codec.json'));

      if (codecFile) {
        targetPath = path.join(currentDir, codecFile);
      }
    }

    if (!targetPath) {
      core.setFailed('❌ 未找到 codec.json 文件');
      core.setOutput('result', 'failed');
      core.setOutput('errors-count', '0');
      core.setOutput('warnings-count', '0');
      return;
    }

    if (!fs.existsSync(targetPath)) {
      core.setFailed(`❌ codec.json 文件不存在: ${targetPath}`);
      core.setOutput('result', 'failed');
      core.setOutput('errors-count', '0');
      core.setOutput('warnings-count', '0');
      return;
    }

    core.info(`\n========== Codec.json 验证 ==========`);
    core.info(`📄 验证文件: ${path.basename(targetPath)}`);
    core.info(`📂 完整路径: ${targetPath}\n`);

    // 读取文件获取对象数量
    let objectCount = 0;
    try {
      const content = fs.readFileSync(targetPath, 'utf8');
      const json = JSON.parse(content);
      if (json.object && Array.isArray(json.object)) {
        objectCount = json.object.length;
        core.info(`📦 对象数量: ${objectCount}\n`);
      }
    } catch (error) {
      // 如果读取失败，继续验证，让验证器报告错误
    }

    // 执行验证
    const validator = new CodecValidator();
    const result = validator.validateCodecJson(targetPath);

    // 生成验证报告
    await generateReport(targetPath, result, objectCount);

    // 输出结果
    if (result.valid && result.warnings.length === 0) {
      core.info('✅ codec.json 验证通过');
      core.info('====================================\n');
      core.setOutput('result', 'success');
      core.setOutput('errors-count', '0');
      core.setOutput('warnings-count', '0');
    } else if (result.valid && result.warnings.length > 0) {
      // 有警告但无错误
      core.info('✅ codec.json 验证通过');
      core.warning(`⚠️  发现 ${result.warnings.length} 个警告:`);
      result.warnings.forEach((warning, index) => {
        core.warning(`   ${index + 1}. ${warning}`);
      });

      if (failOnWarning) {
        core.info('====================================\n');
        core.setFailed('验证失败: 发现警告且 fail-on-warning 已启用');
        core.setOutput('result', 'failed');
        core.setOutput('errors-count', '0');
        core.setOutput('warnings-count', result.warnings.length.toString());
        return;
      }

      core.info('====================================\n');
      core.setOutput('result', 'success');
      core.setOutput('errors-count', '0');
      core.setOutput('warnings-count', result.warnings.length.toString());
    } else {
      // 有错误
      if (result.errors.length > 0) {
        core.error('❌ codec.json 验证错误:');
        result.errors.forEach((error, index) => {
          core.error(`   ${index + 1}. ${error}`);
        });
      }

      if (result.warnings.length > 0) {
        core.warning('⚠️  codec.json 验证警告:');
        result.warnings.forEach((warning, index) => {
          core.warning(`   ${index + 1}. ${warning}`);
        });
      }

      core.info('====================================\n');
      core.setFailed(`验证失败: 发现 ${result.errors.length} 个错误`);
      core.setOutput('result', 'failed');
      core.setOutput('errors-count', result.errors.length.toString());
      core.setOutput('warnings-count', result.warnings.length.toString());
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`执行失败: ${error.message}`);
    } else {
      core.setFailed('执行失败: 未知错误');
    }
    core.setOutput('result', 'failed');
    core.setOutput('errors-count', '0');
    core.setOutput('warnings-count', '0');
  }
}

run();
