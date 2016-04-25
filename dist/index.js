'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _lodash = require('lodash');

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _classMethods = require('./class-methods');

var _pureFunctions = require('./pure-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var update = exports.update = _pureFunctions.update;

exports.default = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var schema = _ref.schema;
  var _ref$delimiter = _ref.delimiter;
  var delimiter = _ref$delimiter === undefined ? '.' : _ref$delimiter;
  return function (WrappedComponent) {
    var Form = function (_Component) {
      _inherits(Form, _Component);

      function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, props));

        for (var method in _classMethods.methodsForWrappedComponent) {
          _this[method] = _classMethods.methodsForWrappedComponent[method].bind(_this);
        }

        _this.shouldComponentUpdate = _reactAddonsPureRenderMixin2.default.shouldComponentUpdate.bind(_this);
        _this._delimiter = delimiter;
        _this._schema = schema;
        _this._paths = {};
        _this._fields = {};
        if (!props.onChange) {
          _this.state = _this.initialState(props);
        }
        return _this;
      }

      _createClass(Form, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
          this._isMounted = true;
        }
      }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
          this._isMounted = false;
        }
      }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(np) {
          if (this._isMounted && !np.onChange && np.value !== this.props.value) {
            this.setState(this.initialState(np));
          }
        }
      }, {
        key: 'initialState',
        value: function initialState(_ref2) {
          var _ref2$value = _ref2.value;
          var value = _ref2$value === undefined ? {} : _ref2$value;

          if (value && (0, _lodash.isObject)(value)) {
            return { value: _immutable2.default.fromJS(value) };
          } else {
            throw new Error("Attempting to set parent form wrapper value to non-object");
          }
        }
      }, {
        key: 'getValue',
        value: function getValue() {
          var _ref3 = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var _ref3$toJS = _ref3.toJS;
          var toJS = _ref3$toJS === undefined ? true : _ref3$toJS;

          var value = this.state && this.state.value || this.props.value;
          return value && (toJS ? value.toJS() : value);
        }
      }, {
        key: 'getProps',
        value: function getProps() {
          return (0, _lodash.assign)({}, this.props, {
            onSubmit: this.submitHandler,
            onChange: this.changeHandler,
            onReset: this.resetHandler,
            getName: this.getName,
            getField: this.getField,
            getValue: this.getInValue,
            value: this.getValue({ toJS: false })
          });
        }
      }, {
        key: 'render',
        value: function render() {
          return (0, _react.createElement)(WrappedComponent, this.getProps());
        }
      }]);

      return Form;
    }(_react.Component);

    Form.propTypes = {
      onSubmit: _react.PropTypes.func,
      onReset: _react.PropTypes.func,
      onChange: _react.PropTypes.func,
      value: _react.PropTypes.object,
      name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object])
    };

    Form.defaultProps = {
      name: null
    };

    return Form;
  };
};