// Import React
import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Tab from '../../components/Tab/Tab';
import withIntl from '../../components/HOC/withIntl';

// Import Style
import styles from './App.css';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  getTabItems() {
    const { getIntl } = this.props;

    return [
      {
        title: getIntl('tabs.home'),
        route: '/',
        key: 'home',
        subTab: ['/coupon/order', '/coupon/customer'],
      },
      {
        title: getIntl('tabs.couponSetting'),
        route: '/coupon-settings',
        key: 'couponSettings',
      },
      {
        title: getIntl('tabs.emailSetting'),
        route: '/email-settings',
        key: 'emailSettings',
      },
    ];
  }

  render() {
    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title="MERN Starter - Blog App"
            titleTemplate="%s - Blog App"
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
          />
          <div className={styles.container}>
            <div className="container-fluid">
              <Tab items={this.getTabItems()}>
                {this.props.children}
              </Tab>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  getIntl: PropTypes.func.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default withIntl()(connect(mapStateToProps)(App));
