import React, {Component} from 'react';
import InlineSVG from 'svg-inline-react';
import {bindActionCreators} from 'redux';
import CSSModules from 'react-css-modules';
import {connect} from 'react-redux';
import {Helmet} from "react-helmet";
import ScrollAnim from 'rc-scroll-anim';
import {Link} from 'react-router-dom';

import {showStartEvents} from 'ducks/events';
import {showModal} from 'ducks/nav';

import styles from './StartView.sss';


const ScrollLink = ScrollAnim.Link;
const ScrollElement = ScrollAnim.Element;

const UPDATE_EVENTS_TIME = 7000;

@CSSModules(styles, {allowMultiple: true})
class StartView extends Component {
  state = {
    eventToday: null,
    eventTomorrow: null,
    eventNext: null
  };
  timer;
  eventTodayNum = 0;
  eventTomorrowNum = 0;
  eventNextNum = 0;

  loc = this.props.user.loc;


  constructor(props) {
    super(props);

    props.eventsActions.showStartEvents();
  }

  componentWillReceiveProps(nextProps) {
    if (this.loc != nextProps.user.loc) {
      this.loc = nextProps.user.loc;
      nextProps.eventsActions.showStartEvents();
      return;
    }

    if (this.timer)
      return;

    const {eventsToday, eventsTomorrow, eventsNext} = nextProps.events.startEvents;
    if (!eventsToday.length && !eventsTomorrow.length && !eventsNext.length)
      return;

    this.setState({
      eventToday: eventsToday[0],
      eventTomorrow: eventsTomorrow[0],
      eventNext: eventsNext[0]
    });

    this.timer = setInterval(this.onTimer, UPDATE_EVENTS_TIME);
  }

  onTimer = () => {
    const {eventsToday, eventsTomorrow, eventsNext} = this.props.events.startEvents;

    if (this.eventTodayNum >= eventsToday.length - 1)
      this.eventTodayNum = 0;
    else
      this.eventTodayNum++;
    const eventToday = eventsToday[this.eventTodayNum];

    if (this.eventTomorrowNum >= eventsTomorrow.length - 1)
      this.eventTomorrowNum = 0;
    else
      this.eventTomorrowNum++;
    const eventTomorrow = eventsTomorrow[this.eventTomorrowNum];

    if (this.eventNextNum >= eventsNext.length - 1)
      this.eventNextNum = 0;
    else
      this.eventNextNum++;
    const eventNext = eventsNext[this.eventNextNum];

    this.setState({eventToday, eventTomorrow, eventNext});
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {eventToday, eventTomorrow, eventNext} = this.state;

    const imageToday    = eventToday    ? eventToday.image.url()    : require('assets/images/events/event1.png');
    const imageTomorrow = eventTomorrow ? eventTomorrow.image.url() : require('assets/images/events/event2.png');
    const imageNext     = eventNext     ? eventNext.image.url()     : require('assets/images/events/event3.png');

    return (
      <div styleName="StartView">
        <Helmet>
          <title>Добро пожаловать — BrainyDo</title>
        </Helmet>

        <section styleName="page-open">
          <div styleName="back-images">
            <div styleName="image-left" />
            <div styleName="image-right" />
          </div>

          <div styleName='title'>
            Привет! Это пиздатый сервис
          </div>

          <div styleName="events">
            <div styleName="item">
              <div styleName="item-title">Сегодня</div>
                <Link styleName="item-image"
                      to={eventToday ? `/event-${eventToday.origin.id}` : ''}
                      title={eventToday ? eventToday.name : null}
                      style={{backgroundImage: `url(${imageToday})`}} />
            </div>
            <div styleName="item">
              <div styleName="item-title">Завтра</div>
                <Link styleName="item-image"
                      to={eventTomorrow ? `/event-${eventTomorrow.origin.id}` : ''}
                      title={eventTomorrow ? eventTomorrow.name : null}
                      style={{backgroundImage: `url(${imageTomorrow})`}} />
            </div>
            <div styleName="item">
              <div styleName="item-title">На следующей неделе</div>
                <Link styleName="item-image"
                      to={eventNext ? `/event-${eventNext.origin.id}` : ''}
                      title={eventNext ? eventNext.name : null}
                      style={{backgroundImage: `url(${imageNext})`}} />
            </div>
          </div>

          <ScrollLink styleName="arrow-down-wrapper" to="page1">
            <InlineSVG styleName="arrow-down"
                       src={require("assets/images/arrow-down.svg")}
                       onClick={this.scrollDown} />
          </ScrollLink>
        </section>

        <ScrollElement id="page1">
          <section styleName="page-about">
            <div styleName='title'>
              Мы служим силам света
            </div>
            <div styleName='text'>
              <p>
                Бе-бе бе-бе-бе бе-бе бе. Бе-бе-бе-бе-бе бе бе-бе-бе бе-бе. Бе. Бе-бе. Бе.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam feugiat odio ac tortor imperdiet laoreet. Ut placerat dolor eu metus auctor dignissim in ac eros. Nullam porttitor eros sed faucibus pharetra. Duis ornare nulla ac turpis rhoncus cursus. Sed cursus magna ut ante imperdiet, pulvinar sagittis neque accumsan. Vestibulum ante est, mattis eget aliquet eu, consectetur eget ligula. Quisque vitae feugiat purus. Nulla facilisi.
              </p>
              <p>
                Fusce tincidunt, libero sit amet porta fringilla, urna elit consectetur sem, ac fringilla lectus turpis sed purus. Maecenas lacinia felis non mauris pellentesque, aliquam convallis quam bibendum. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin eget consequat est, at faucibus turpis. Donec augue lorem, condimentum ut fermentum cursus, consectetur sit amet dolor. Sed rhoncus libero vitae vehicula feugiat. Vestibulum et tempor nibh. Integer sodales justo id pulvinar mattis. Vestibulum fringilla, ex et fringilla semper, erat nisl dignissim tellus, non ultrices ligula quam convallis lectus. Mauris nunc eros, lacinia ac posuere nec, consectetur ac justo.
              </p>
              <p>
                Morbi a feugiat ante. Vestibulum iaculis risus id erat laoreet, et iaculis est congue. Morbi suscipit quam eget justo semper hendrerit sed vitae dui. Duis dictum lorem tortor, vitae interdum elit efficitur at. Aenean vehicula, urna at facilisis dapibus, ligula purus mattis quam, et eleifend nisi nunc vel lacus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec ac eros et mauris fringilla sollicitudin eu a nulla. Mauris eu lorem nec orci tempor viverra condimentum id tortor. Sed sed faucibus ex, sed mattis ipsum. Etiam mollis nunc a est suscipit pretium. Donec pulvinar volutpat urna convallis suscipit. Nullam vel metus non est venenatis accumsan id sed leo. Nam sit amet odio eget orci euismod convallis. Nulla facilisi. Cras laoreet ligula at ex condimentum maximus. Duis scelerisque massa non aliquet dictum.
              </p>
              <p>
                Vivamus nibh velit, interdum vel velit in, convallis condimentum sapien. Quisque dignissim erat tellus, sed tempor nisi tincidunt nec. Quisque ac elementum ligula, sit amet bibendum ante. Suspendisse sagittis ligula tellus, ac finibus lectus accumsan eu. Morbi hendrerit erat id augue vestibulum, vitae egestas lacus elementum. Phasellus eleifend turpis nec turpis finibus pulvinar ac at quam. Etiam auctor quam vehicula auctor fermentum. Suspendisse potenti.
              </p>
              <p>
                Donec ultricies ante a diam aliquam, quis facilisis quam tempor. Aenean ac lacus fermentum, tincidunt dui vel, lacinia libero. Pellentesque tristique tincidunt ligula vitae tincidunt. Nam sapien elit, faucibus vehicula justo quis, elementum rhoncus ipsum. Etiam rutrum nulla sed eros ultricies, nec dapibus lorem vulputate. Vivamus eget nulla id nulla placerat ullamcorper. Proin dapibus elit non ante tempus ornare.
              </p>
            </div>
          </section>
        </ScrollElement>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.events,
    user:   state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    eventsActions:bindActionCreators({showStartEvents}, dispatch),
    navActions:   bindActionCreators({showModal}, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(StartView);