import React, {Component} from 'react';
import CSSModules from 'react-css-modules';
import classNames from 'classnames';
import InlineSVG from 'svg-inline-react';

import InputControl from 'components/elements/InputControl/InputControl';

import styles from './DropdownControl.sss';


@CSSModules(styles, {allowMultiple: true})
export default class DropdownControl extends Component {
  state = {
    value: '',
    listVis: false,
    disabled: false
  };
  list = [];


  constructor(props) {
    super(props);

    const {list, current, disabled} = props;
    if (list)
      this.list = list;

    this.state.disabled = disabled;

    if (this.list.indexOf(current) != -1 || current === undefined)
      this.state.value = current;
  }

  componentWillReceiveProps(nextProps) {
    const {list, current, disabled} = nextProps;

    this.list = list;

    if (list.indexOf(current) != -1 || current === undefined)
      this.setState({value: current, disabled});
    else
      this.setState({value: '', disabled});
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
    const {label} = this.props;

    let {value} = this.state;
    if (value == '')
      value = '(empty)';
    else if (!value)
      value = '(undefined)';

    if (this.state.disabled)
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
        <InlineSVG styleName={arrowClasses} src={require("assets/images/arrow-down.svg")} />
        <input styleName={inputClasses}
               value={value}
               onClick={this.onInputClick}
               readOnly />
        {this.state.listVis &&
          <div styleName="items">
            {this.list.map((item, key) => {
              const styleName = classNames({
                'item': true,
                'empty': !item
              });
              return (
                <div onMouseDown={() => this.onItemClick(item)}
                     styleName={styleName}
                     key={key}>
                  {item ? item : '(empty)'}
                </div>
              );
            })}
          </div>
        }
      </div>
    );
  }
}
