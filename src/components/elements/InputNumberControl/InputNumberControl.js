import React, {Component} from 'react';

import InputControl from "components/elements/InputControl/InputControl";


export default class InputNumberControl extends Component {
  state = {value: this.props.value};


  static getDerivedStateFromProps(props, state) {
    const valueParsed = InputNumberControl.parseValue(props.value, props);
    const valueParsedPrev = InputNumberControl.parseValue(state.value, props);
    if (valueParsed === valueParsedPrev)
      return null;
    return {value: valueParsed};
  }
  
  static parseValue(value, props) {
    const {min, max, isInt} = props;

    const parseFunc = isInt ? parseInt : parseFloat;
    let num = parseFunc(value);
    if (isNaN(num))
      return undefined;

    if (min !== undefined && min !== null && num < min)
      num = min;
    if (max !== undefined && max !== null && num > max)
      num = max;
    
    return num;
  }
  
  onChange = value => {
    value = value.replace(/[^\d.,]/g, '');
    value = value.replace(/,/g, '.');
    this.setState({value});
  };
  
  onBlur = () => {
    const valueParsed = InputNumberControl.parseValue(this.state.value, this.props);
    this.setState({value: valueParsed});
    this.props.onChange(valueParsed);
  };

  componentWillUnmount() {
    const valueParsed = InputNumberControl.parseValue(this.state.value, this.props);
    this.props.onChange(valueParsed);
  }

  render() {
    let {label, placeholder, readOnly, autoFocus, onKeyDown, DOMRef, icon} = this.props;
    
    return <InputControl value={this.state.value}
                         onChange={this.onChange}
                         onBlur={this.onBlur}
                         label={label}
                         icon={icon}
                         onKeyDown={onKeyDown}
                         placeholder={placeholder}
                         autoFocus={autoFocus}
                         readOnly={readOnly}
                         DOMRef={DOMRef} />;
  }
}
