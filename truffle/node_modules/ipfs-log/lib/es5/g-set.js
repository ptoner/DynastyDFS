'use strict';
/**
 * Interface for G-Set CRDT
 *
 * From:
 * "A comprehensive study of Convergent and Commutative Replicated Data Types"
 * https://hal.inria.fr/inria-00555588
 */

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var GSet =
/*#__PURE__*/
function () {
  function GSet(values) {
    (0, _classCallCheck2.default)(this, GSet);
  } // eslint-disable-line


  (0, _createClass2.default)(GSet, [{
    key: "append",
    value: function append(value) {}
  }, {
    key: "merge",
    value: function merge(set) {}
  }, {
    key: "get",
    value: function get(value) {}
  }, {
    key: "has",
    value: function has(value) {}
  }, {
    key: "values",
    get: function get() {}
  }, {
    key: "length",
    get: function get() {}
  }]);
  return GSet;
}();

module.exports = GSet;