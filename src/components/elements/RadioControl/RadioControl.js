import React, {Component} from 'react';
import CSSModules from 'react-css-modules';

import styles from './RadioControl.sss';


let idCounter = 0;

@CSSModules(styles, {allowMultiple: true})
export default class RadioControl extends Component {
  state = {
    value: false
  };

  constructor(props) {
    super(props);
    
    this.state.value = props.value;
    this.id = idCounter++;
  }
  
  componentWillReceiveProps (nextProps) {
    this.setState({value: nextProps.value});
  }
  
  onChange = e => {
    const {onChange, disabled, data} = this.props;
    if (onChange && !disabled && e.target.checked)
      onChange(data);
  };

  render() {
    const {data, name, label, disabled} = this.props;
    let style = `RadioControl`;
    if (disabled)
      style += ` disabled`;

    return (
      <div styleName={style}>
        <input styleName="input"
               type="radio"
               id={this.id}
               name={name}
               value={data}
               checked={this.state.value === data}
               onChange={this.onChange} />
        <label styleName="label" htmlFor={this.id}>{label}</label>
      </div>
    );
  }
}
