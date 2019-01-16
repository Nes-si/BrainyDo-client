import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";

import StartHeader from 'components/start/StartHeader/StartHeader';
import {showModal, showAlert} from 'ducks/nav';

import styles from './StartView.sss';


@CSSModules(styles, {allowMultiple: true})
class StartView extends Component {
  render() {
    const {showModal} = this.props.navActions;

    return (
      <div className='container'>
        <Helmet>
          <title>Triple L</title>
        </Helmet>
        <StartHeader showModal={showModal}/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user:         state.user,
    serverStatus: state.serverStatus
  };
}

function mapDispatchToProps(dispatch) {
  return {
    navActions:  bindActionCreators({showModal, showAlert}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);