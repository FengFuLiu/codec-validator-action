import * as core from '@actions/core';
import * as fs from 'fs';
import * as path from 'path';
import { CodecValidator } from './codec-validator';

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

    // 执行验证
    const validator = new CodecValidator();
    const result = validator.validateCodecJson(targetPath);

    // 输出结果
    if (result.valid) {
      core.info('✅ codec.json 验证通过');

      if (result.warnings.length > 0) {
        core.warning(`⚠️  发现 ${result.warnings.length} 个警告:`);
        result.warnings.forEach((warning, index) => {
          core.warning(`   ${index + 1}. ${warning}`);
        });

        if (failOnWarning) {
          core.setFailed('验证失败: 发现警告且 fail-on-warning 已启用');
          core.setOutput('result', 'failed');
          core.setOutput('errors-count', '0');
          core.setOutput('warnings-count', result.warnings.length.toString());
          return;
        }
      }

      core.info('====================================\n');
      core.setOutput('result', 'success');
      core.setOutput('errors-count', '0');
      core.setOutput('warnings-count', result.warnings.length.toString());
    } else {
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
