import React, {Component, PropTypes, createElement} from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import assign from 'lodash/assign';
import getOr from 'lodash/fp/getOr';
import get from 'lodash/fp/get';
import buildField, { extendField } from './field';
import * as immutableJS from './immutable-js-state';



export default ({ schema, immutable = immutableJS } = {}) => WrappedComponent => {

  class FormWrapper extends Component {
    constructor(props) {
      super(props);

      this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

      this.immutable = immutable;
      this.schema = schema;
      this.fieldCache = {};
      this.onChange = this.changeHandler.bind(this);
      this.state = this.initialState(props);

      this.methodProps = {
        submitHandler: this.submitHandler.bind(this),
        resetHandler:  this.resetHandler.bind(this),
        field:         this.getField.bind(this)
      };
    }

    componentDidMount() {
      this._isMounted = true;
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    componentWillReceiveProps(np) {
      ['onChange', 'delimiter', 'name']
        .filter(prop => np[prop] !== this.props[prop])
        .forEach(prop => {
          throw new Error(`Prop ${prop} cannot change from it's initial value.`)
        });
      if (this._isMounted && np.value !== this.props.value) {
        this.setState(this.initialState(np));
      }
    }

    initialState(props) {
      if (props.onChange) { return {}; }
      const value = props.value || {};
      if (typeof value !== 'object') {
        throw new Error("Attempting to set parent form wrapper value to non-object");
      }
      return assign({}, this.state, {
        value: this.immutable.fromJS(value),
        version: getOr(-1)('version')(this.state) + 1
      });
    }

    getValue(opts = {}) {
      const value = get('onChange')(this.props) ? this.props.value : get('value')(this.state);
      return !opts.toJS ? value : this.immutable.toJS(value);
    }

    getField(childName, opts) {
      const name = !this.props.name
        ? childName
        : `${this.props.name}${this.props.delimiter}${childName}`;
      let field = this.fieldCache[name];
      if (!field) {
        field = this.fieldCache[name] = buildField(name, childName, this);
      }
      return field.isAlteredByType || !opts
        ? field
        : extendField(field, opts);
    }

    changeHandler(patch) {
      if (!patch.isPatch) {
        const field = this.fieldCache[patch.target.name];
        patch = field.patch(patch);
      }
      if (this.props.onChange) { return this.props.onChange(patch); }
      if (!this._isMounted) { return false; }
      const value = this.immutable.applyPatch(this.state.value, patch);
      this.setState({ value });
    }

    submitHandler(evt) {
      evt.preventDefault();
      const { onSubmit } = this.props;
      if (onSubmit) {
        onSubmit(this.getValue({toJS:true}), evt);
      }
    }

    resetHandler(evt) {
      evt.preventDefault();
      if (this.props.onReset) { this.props.onReset(evt); }
      if (this._isMounted) {
        this.setState(this.initialState(this.props));
      }
    }

    render() {
      return createElement(
        WrappedComponent,
        assign({}, this.methodProps, { value: this.getValue() })
      );
    }
  }

  FormWrapper.propTypes = {
    onSubmit: PropTypes.func,
    onReset: PropTypes.func,
    onChange: PropTypes.func,
    delimiter: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    name:  PropTypes.string
  }

  FormWrapper.defaultProps = {
    delimiter: '.',
    name: ''
  }

  return FormWrapper;
}
