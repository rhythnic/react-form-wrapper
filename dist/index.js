'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.update = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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

var update = exports.update = _get__('updateForm');

exports.default = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var schema = _ref.schema;
  var _ref$delimiter = _ref.delimiter;
  var delimiter = _ref$delimiter === undefined ? '.' : _ref$delimiter;
  return function (WrappedComponent) {
    var FormWrapper = function (_get__2) {
      _inherits(FormWrapper, _get__2);

      function FormWrapper(props) {
        _classCallCheck(this, FormWrapper);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormWrapper).call(this, props));

        for (var method in _get__('methodsForWrappedComponent')) {
          _this[method] = _get__('methodsForWrappedComponent')[method].bind(_this);
        }

        _this.shouldComponentUpdate = _get__('PureRenderMixin').shouldComponentUpdate.bind(_this);
        _this._delimiter = delimiter;
        _this._schema = schema;
        _this._paths = {};
        _this._fields = {};
        if (!props.onChange) {
          _this.state = _this.initialState(props);
        }
        return _this;
      }

      _createClass(FormWrapper, [{
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
          var value = _ref2.value;

          value = value || {};
          if (value && _get__('isObject')(value)) {
            return { value: _get__('Immutable').fromJS(value) };
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
          return _get__('assign')({}, this.props, {
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
          return _get__('createElement')(WrappedComponent, this.getProps());
        }
      }]);

      return FormWrapper;
    }(_get__('Component'));

    FormWrapper.propTypes = {
      onSubmit: _get__('PropTypes').func,
      onReset: _get__('PropTypes').func,
      onChange: _get__('PropTypes').func,
      value: _get__('PropTypes').object,
      name: _get__('PropTypes').oneOfType([_get__('PropTypes').string, _get__('PropTypes').object])
    };

    return FormWrapper;
  };
};

var _RewiredData__ = {};
var _RewireAPI__ = {};

(function () {
  function addPropertyToAPIObject(name, value) {
    Object.defineProperty(_RewireAPI__, name, {
      value: value,
      enumerable: false,
      configurable: true
    });
  }

  addPropertyToAPIObject('__get__', _get__);
  addPropertyToAPIObject('__GetDependency__', _get__);
  addPropertyToAPIObject('__Rewire__', _set__);
  addPropertyToAPIObject('__set__', _set__);
  addPropertyToAPIObject('__reset__', _reset__);
  addPropertyToAPIObject('__ResetDependency__', _reset__);
  addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
  return _RewiredData__ === undefined || _RewiredData__[variableName] === undefined ? _get_original__(variableName) : _RewiredData__[variableName];
}

function _get_original__(variableName) {
  switch (variableName) {
    case 'updateForm':
      return _pureFunctions.update;

    case 'methodsForWrappedComponent':
      return _classMethods.methodsForWrappedComponent;

    case 'PureRenderMixin':
      return _reactAddonsPureRenderMixin2.default;

    case 'isObject':
      return _lodash.isObject;

    case 'Immutable':
      return _immutable2.default;

    case 'assign':
      return _lodash.assign;

    case 'createElement':
      return _react.createElement;

    case 'Component':
      return _react.Component;

    case 'PropTypes':
      return _react.PropTypes;
  }

  return undefined;
}

function _assign__(variableName, value) {
  if (_RewiredData__ === undefined || _RewiredData__[variableName] === undefined) {
    return _set_original__(variableName, value);
  } else {
    return _RewiredData__[variableName] = value;
  }
}

function _set_original__(variableName, _value) {
  switch (variableName) {}

  return undefined;
}

function _update_operation__(operation, variableName, prefix) {
  var oldValue = _get__(variableName);

  var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

  _assign__(variableName, newValue);

  return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
  return _RewiredData__[variableName] = value;
}

function _reset__(variableName) {
  delete _RewiredData__[variableName];
}

function _with__(object) {
  var rewiredVariableNames = Object.keys(object);
  var previousValues = {};

  function reset() {
    rewiredVariableNames.forEach(function (variableName) {
      _RewiredData__[variableName] = previousValues[variableName];
    });
  }

  return function (callback) {
    rewiredVariableNames.forEach(function (variableName) {
      previousValues[variableName] = _RewiredData__[variableName];
      _RewiredData__[variableName] = object[variableName];
    });
    var result = callback();

    if (!!result && typeof result.then == 'function') {
      result.then(reset).catch(reset);
    } else {
      reset();
    }

    return result;
  };
}

var _typeOfOriginalExport = typeof FormWrapper === 'undefined' ? 'undefined' : _typeof(FormWrapper);

function addNonEnumerableProperty(name, value) {
  Object.defineProperty(FormWrapper, name, {
    value: value,
    enumerable: false,
    configurable: true
  });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(FormWrapper)) {
  addNonEnumerableProperty('__get__', _get__);
  addNonEnumerableProperty('__GetDependency__', _get__);
  addNonEnumerableProperty('__Rewire__', _set__);
  addNonEnumerableProperty('__set__', _set__);
  addNonEnumerableProperty('__reset__', _reset__);
  addNonEnumerableProperty('__ResetDependency__', _reset__);
  addNonEnumerableProperty('__with__', _with__);
  addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;