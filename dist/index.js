'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _reactAddonsPureRenderMixin = require('react-addons-pure-render-mixin');

var _reactAddonsPureRenderMixin2 = _interopRequireDefault(_reactAddonsPureRenderMixin);

var _classMethods = require('./class-methods');

var classMethods = _interopRequireWildcard(_classMethods);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

exports.default = function (schema) {
  return function (WrappedComponent) {
    var Form = function (_Component) {
      _inherits(Form, _Component);

      function Form(props) {
        _classCallCheck(this, Form);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Form).call(this, props));

        for (var method in classMethods) {
          _this[method] = classMethods[method].bind(_this);
        }

        //this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
        _this.schema = schema;
        _this.state = _this.initialState(props);
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
            this.setState({ value: _immutable2.default.fromJS(np.value) });
          }
        }
      }, {
        key: 'initialState',
        value: function initialState(props) {
          return props.onChange ? {} : { value: _immutable2.default.fromJS(props.value) };
        }
      }, {
        key: 'getValue',
        value: function getValue() {
          var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          var value = this.state && this.state.value || this.props.value;
          return value && (opts.toJS ? value.toJS() : value);
        }
      }, {
        key: 'getProps',
        value: function getProps() {
          return Object.assign({}, this.props, {
            onSubmit: this.submitHandler,
            onChange: this.changeHandler,
            onReset: this.resetHandler,
            getField: this.getField,
            getValue: this.getInValue,
            value: this.getValue() });
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
      name: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.object]),
      delimiter: _react.PropTypes.string
    };

    Form.defaultProps = {
      value: {},
      name: null,
      delimiter: '.'
    };

    return Form;
  };
};