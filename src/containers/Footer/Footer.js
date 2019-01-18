import React, {Component} from 'react';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import CSSModules from 'react-css-modules';

import {showModal} from "ducks/nav";

import styles from './Footer.sss';


@CSSModules(styles, {allowMultiple: true})
class Footer extends Component {
  render() {
    return (
      <div styleName="Footer">
        Пидарасы inc., 2019
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:   bindActionCreators({showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
