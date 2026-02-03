/**
 * 导出验证器供 npm 包使用
 * 这个文件是 npm 包的入口，不包含 GitHub Actions 的依赖
 */

export { CodecValidator } from './test';
export type { CodecJson, CodecObject, ValidationResult } from './test/types';
export { bacnet_units_def } from './utils/bacnet-units';
export type { BacnetUnitDef } from './utils/bacnet-units';
