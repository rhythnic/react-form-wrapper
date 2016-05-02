'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupDom;

var _jsdom = require('jsdom');

var _jsdom2 = _interopRequireDefault(_jsdom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setupDom() {
  if (typeof document !== 'undefined') {
    return;
  }

  global.document = _jsdom2.default.jsdom('<html><body></body></html>');
  global.window = document.defaultView;
  global.navigator = window.navigator;
};