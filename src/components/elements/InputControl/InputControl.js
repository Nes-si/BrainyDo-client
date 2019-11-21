import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import IconsComponent from 'components/elements/IconsComponent/IconsComponent';
import LoaderComponent from "components/elements/LoaderComponent/LoaderComponent";

import styles from './InputControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class InputControl extends Component {
  onChange = e => {
    const {onChange, showLoader} = this.props;
    if (onChange && !showLoader)
      onChange(e.target.value);
  };

  render() {
    let {label, value, placeholder, onChange, readOnly, autoFocus, onKeyDown, onBlur, DOMRef, icon,
      onIconClick, inputType, dropdown, red, showLoader} = this.props;

    if (!onChange)
      readOnly = true;

    if (value == undefined)
      value = ``;

    if (!inputType)
      inputType = `text`;

    let inputStyles = 'input';
    if (readOnly)
      inputStyles += ' input-readOnly';
    if (dropdown)
      inputStyles += ' input-disabled';
    if (red)
      inputStyles += ' input-red';

    let iconEl;
    if (icon)
      iconEl = (
        <div onClick={onIconClick} styleName={'icon ' + icon}>
          <IconsComponent icon={icon} />
        </div>);

    return (
      <div styleName="InputControl">
        <label styleName="label"> {label} </label>
        <div styleName="input-wrapper">
          {iconEl}
          <input type={inputType}
                 styleName={inputStyles}
                 value={showLoader ? '' : value}
                 autoFocus={autoFocus}
                 placeholder={placeholder}
                 onChange={this.onChange}
                 onBlur={onBlur}
                 onKeyDown={onKeyDown}
                 readOnly={readOnly}
                 ref={DOMRef} />
          {showLoader &&
            <div styleName="loader-wrapper">
              <LoaderComponent/>
            </div>
          }
        </div>
      </div>
    );
  }
}
