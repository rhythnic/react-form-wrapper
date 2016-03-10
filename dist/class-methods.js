'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getField = getField;
exports.getName = getName;
exports.changeHandler = changeHandler;
exports.submitHandler = submitHandler;
exports.resetHandler = resetHandler;
exports.getInValue = getInValue;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _pureFunctions = require('./pure-functions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ***************************************************************
// These class methods brought out of the class definition
// because they are passed to the wrapped component, and so
// need to be bound to the class instance.
// ***************************************************************

function getField(childName) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var base = {
    name: this.getName(childName),
    value: this.getInValue(childName, opts),
    onChange: this.changeHandler
  };
  if (typeof base.value === 'boolean') {
    base.checked = base.value;
  }
  return base;
}

function getName(childName) {
  var _props = this.props;
  var name = _props.name;
  var delimiter = _props.delimiter;

  return name ? '' + name + delimiter + childName : childName;
}

function changeHandler(evt) {
  var _props2 = this.props;
  var onChange = _props2.onChange;
  var delimiter = _props2.delimiter;

  if (onChange && typeof onChange === 'function') {
    for (var _len = arguments.length, more = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      more[_key - 1] = arguments[_key];
    }

    return onChange.apply(undefined, [evt].concat(more));
  }
  if (!this._isMounted) {
    return false;
  }
  this.setState({ value: (0, _pureFunctions.update)(this.state.value, evt, delimiter) });
}

function submitHandler(evt) {
  evt.preventDefault();
  var _props3 = this.props;
  var onSubmit = _props3.onSubmit;
  var onChange = _props3.onChange;

  if (onSubmit && typeof onSubmit === 'function') {
    onSubmit(onChange ? evt : this.getValue({ toJS: true }));
  }
}

function resetHandler(evt) {
  evt.preventDefault();
  if (!this._isMounted) {
    return false;
  }
  var onReset = this.props.onReset;

  if (onReset && typeof onReset === 'function') {
    return onReset(evt);
  }
  console.log('setting state to ', this.props.value);
  this.setState({ value: _immutable2.default.fromJS(this.props.value) });
}

function getInValue(name) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var value = this.state && this.state.value || this.props.value;
  if (value) {
    value = value.getIn(name.split(this.props.delimiter));
    return opts.toJS && (_immutable.Map.isMap(value) || _immutable.List.isList(value)) ? value.toJS() : value;
  }
}