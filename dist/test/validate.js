"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateItem = validateItem;
// 关联性验证器
const access_mode_validator_1 = require("./relationships/access-mode-validator");
const data_type_validator_1 = require("./relationships/data-type-validator");
const unit_validator_1 = require("./relationships/unit-validator");
const reference_validator_1 = require("./relationships/reference-validator");
// 基础字段验证器
const id_1 = require("./fields/id");
const description_1 = require("./fields/description");
const name_1 = require("./fields/name");
const access_mode_1 = require("./fields/access-mode");
const data_type_1 = require("./fields/data-type");
const value_type_1 = require("./fields/value-type");
const value_1 = require("./fields/value");
const max_length_1 = require("./fields/max-length");
const unit_1 = require("./fields/unit");
const bacnet_type_1 = require("./fields/bacnet-type");
const bacnet_unit_type_id_1 = require("./fields/bacnet-unit-type-id");
const bacnet_unit_type_1 = require("./fields/bacnet-unit-type");
const reference_1 = require("./fields/reference");
/**
 * 验证单个 codec 对象（纯函数，不依赖 fs）
 */
function validateItem(item, allItems) {
    const validations = [
        // 云端准出表/网关准入表 - 基础字段验证
        { ...id_1.IdValidator.validate(item), severity: 'error' },
        { ...id_1.IdValidator.validateUnique(item, allItems), severity: 'error' },
        { ...description_1.DescriptionValidator.validate(item), severity: 'error' },
        { ...name_1.NameValidator.validate(item), severity: 'error' },
        { ...access_mode_1.AccessModeFieldValidator.validate(item), severity: 'error' },
        { ...data_type_1.DataTypeFieldValidator.validate(item), severity: 'error' },
        { ...value_type_1.ValueTypeFieldValidator.validate(item), severity: 'error' },
        { ...value_1.ValueValidator.validate(item), severity: 'error' },
        { ...value_1.ValueValidator.validateValues(item), severity: 'error' },
        { ...max_length_1.MaxLengthValidator.validate(item), severity: 'error' },
        { ...unit_1.UnitFieldValidator.validate(item), severity: 'error' },
        { ...unit_1.UnitFieldValidator.validateUnitConsistency(item), severity: 'error' },
        { ...bacnet_type_1.BacnetTypeFieldValidator.validate(item), severity: 'error' },
        { ...bacnet_unit_type_id_1.BacnetUnitTypeIdValidator.validate(item), severity: 'error' },
        { ...bacnet_unit_type_1.BacnetUnitTypeValidator.validate(item), severity: 'error' },
        { ...reference_1.ReferenceFieldValidator.validate(item), severity: 'error' },
        // 关联性验证（字段组合关系）
        { ...access_mode_validator_1.AccessModeValidator.validate(item), severity: 'error' },
        { ...data_type_validator_1.DataTypeValidator.validateBacnetType(item), severity: 'error' },
        { ...data_type_validator_1.DataTypeValidator.validateValueType(item), severity: 'error' },
        { ...unit_validator_1.UnitValidator.validate(item), severity: 'error' },
        { ...reference_validator_1.ReferenceValidator.validate(item, allItems), severity: 'error' },
    ];
    return validations.filter(result => !result.valid);
}
//# sourceMappingURL=validate.js.map