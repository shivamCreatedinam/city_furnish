"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _FBShareOpenGraphValueContainer = _interopRequireDefault(require("./FBShareOpenGraphValueContainer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Represents an open graph action.
 */
class ShareOpenGraphAction extends _FBShareOpenGraphValueContainer.default {
  /**
   * The action type.
   */
  constructor(actionType) {
    super(null);

    _defineProperty(this, "actionType", void 0);

    this.actionType = actionType;
  }

}

var _default = ShareOpenGraphAction;
exports.default = _default;
//# sourceMappingURL=FBShareOpenGraphAction.js.map