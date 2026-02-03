"use strict";
/**
 * 导出验证器供 npm 包使用
 * 这个文件是 npm 包的入口，不包含 GitHub Actions 的依赖
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bacnet_units_def = exports.CodecValidator = void 0;
var test_1 = require("./test");
Object.defineProperty(exports, "CodecValidator", { enumerable: true, get: function () { return test_1.CodecValidator; } });
var bacnet_units_1 = require("./utils/bacnet-units");
Object.defineProperty(exports, "bacnet_units_def", { enumerable: true, get: function () { return bacnet_units_1.bacnet_units_def; } });
//# sourceMappingURL=index.js.map