import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import InputControl from 'components/elements/InputControl/InputControl';

import styles from './DropdownControl.sss';

import ImageArrowDown from 'assets/images/arrow-down.svg';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    value: '',
    listVis: false,
    list: []
  };


  constructor(props) {
    super(props);

    const {list, current} = props;
    if (list)
      this.state.list = list;

    if (this.state.list.indexOf(current) != -1 || current === undefined)
      this.state.value = current;
  }

  static getDerivedStateFromProps(props, state) {
    const {list, current} = props;

    if (state.list === list && state.value === current)
      return null;

    const newState = {list, value: ''};

    if (list.indexOf(current) != -1 || current === undefined)
      newState.value = current;

    return newState;
  }

  onItemClick = item => {
    this.setState({
      value: item,
      listVis: false
    });
    this.props.onSuggest(item);
  };

  onInputClick = () => {
    this.setState({
      listVis: !this.state.listVis
    });
  };

  onBlur = () => {
    this.setState({
      listVis: false
    });
  };

  render() {
    const {label, disabled} = this.props;

    let {value} = this.state;
    if (value == '')
      value = '(empty)';
    else if (!value)
      value = '(undefined)';

    if (disabled)
      return <InputControl label={label}
                           icon="lock"
                           value={value}
                           dropdown={true}
                           readOnly={true} />;

    const inputClasses = classNames({
      'input': true,
      'empty': !this.state.value
    });

    const arrowClasses = classNames({
      'arrow-down': true,
      'arrow-rotated': this.state.listVis
    });

    return (
      <div styleName='DropdownControl' onBlur={this.onBlur}>
        {label &&
          <div styleName="label">{label}</div>
        }
        <div styleName="input-wrapper">
          <InlineSVG styleName={arrowClasses} src={ImageArrowDown} />
          <input styleName={inputClasses}
                 value={value}
                 onClick={this.onInputClick}
                 readOnly />
          {this.state.listVis &&
            <div styleName="items">
              {this.state.list.map(item => {
                const styleName = classNames({
                  'item': true,
                  'empty': !item
                });
                return (
                  <div onMouseDown={e => this.onItemClick(item)}
                       styleName={styleName}
                       key={item}>
                    {item ? item : '(empty)'}
                  </div>
                );
              })}
            </div>
          }
        </div>
      </div>
    );
  }
}
