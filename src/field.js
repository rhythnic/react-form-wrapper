import assign from 'lodash/assign';
import flatten from 'lodash/flatten';
import { List, Map } from 'immutable';

import { buildName, buildPath } from './pure-functions';

export default class Field {

  constructor(childName, parent) {
    const name = buildName(parent.props.name, childName, parent._delimiter)
    const path = buildPath(name, parent._delimiter);

    Object.defineProperties(this, {
      parent: {
        value: parent
      },
      path: {
        value: path
      },
      valuePath: {
        value: flatten( buildPath(childName, parent._delimiter) )
      },
      isArray: {
        value: Array.isArray( path[ path.length - 1 ] )
      },
      name: {
        value: name,
        enumerable: true
      },
      onChange: {
        value: parent.changeHandler,
        enumerable: true
      },
      value: {
        get() {
          return this.getValue();
        },
        enumerable: true
      },
      checked: {
        get() {
          // TODO: this doesn't work for array items
          const val = this.getValue();
          return typeof val === 'boolean' ? val : undefined;
        },
        enumerable: true
      }
    })

  }

  getValue(opts = {}) {
    const ctx = (this.parent.state && this.parent.state.value) || this.parent.props.value;
    let value;
    if (ctx) {
      value = ctx.getIn(this.valuePath);
    }
    if (value == null && this.isArray) {
      value = List();
    }
    if (opts.toJS && (List.isList(value) || Map.isMap(value))) {
      return value.toJS();
    }
    return value == null ? '' : value;
  }

  checkIsArray() {
    if (!this.isArray) {
      throw new Error("Form Wrapper: Array functions can only be used on Array fields.")
    }
  }

  at(name, ...other) {
    return this.parent.getField(`${this.name}${this.parent._delimiter}${name}`, ...other);
  }

  push(value) {
    this.checkIsArray();
    this.onChange({ op: 'add', path: this.path, value })
  }

  remove(index) {
    this.checkIsArray();
    this.onChange({ op: 'remove', path: [...this.path, index] });
  }

  withProps(props = {}, opts = {}) {
    const toJS = opts.toJS || props.multiple;
    const value = this.getValue({ toJS });
    const ownProps = {
      name: this.name,
      value,
      onChange: this.parent.changeHandler
    };
    if (typeof value === 'boolean') {
      ownProps.checked = value;
    }
    return assign(ownProps, props);
  }

}
