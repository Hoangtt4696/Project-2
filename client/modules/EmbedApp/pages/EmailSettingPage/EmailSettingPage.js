// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import _get from 'lodash/get';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';
// import EmailPreview from '../../components/EmailPreview/EmailPreview';
import EmailSetting from '../../components/EmailSetting/EmailSetting';

// Import Store: Reducer, Action
import { getShop } from '../../reducers/ShopReducer';
import { fetchShop } from '../../actions/ShopActions';
import { getSetting } from '../../reducers/SettingReducer';
import { fetchSettings, saveSettings } from '../../actions/SettingActions';

// Import Css
import styles from './EmailSettingPage.css';

const propTypes = {
  settings: PropTypes.object,
  getIntl: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  shop: PropTypes.object,
};
const defaultProps = {
  settings: {},
  shop: {},
};

class EmailSettingPage extends PureComponent {
  constructor(props) {
    super(props);

    const emailCustomer = _get(this.props, 'settings.emailCustomer', {});
    const emailOrder = _get(this.props, 'settings.emailOrder', {});

    const couponCustomer = _get(this.props, 'settings.couponCustomer', {});
    const couponOrder = _get(this.props, 'settings.couponOrder', {});

    const shopName = _get(this.props, 'shop.name', '');
    const emailShop = _get(this.props, 'shop.email', '');

    this.state = {
      emailSettings: {
        emailCustomer,
        emailOrder,
      },
      couponSettings: {
        couponOrder,
        couponCustomer,
      },
      shop: {
        shopName,
        emailShop,
      },
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchSettings([
      'emailCustomer',
      'emailOrder',
      'couponCustomer',
      'couponOrder',
    ]));

    this.props.dispatch(fetchShop());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settings) {
      const emailCustomer = _get(nextProps, 'settings.emailCustomer', {});
      const emailOrder = _get(nextProps, 'settings.emailOrder', {});

      const couponCustomer = _get(nextProps, 'settings.couponCustomer', {});
      const couponOrder = _get(nextProps, 'settings.couponOrder', {});

      this.setState({
        emailSettings: {
          emailOrder,
          emailCustomer,
        },
        couponSettings: {
          couponCustomer,
          couponOrder,
        },
      });
    }

    if (nextProps.shop) {
      this.setState({
        shop: {
          shopName: _get(nextProps.shop, 'name', ''),
          emailShop: _get(nextProps.shop, 'email', ''),
        },
      });
    }
  }

  handleButtonSave({ type, settings }) {
    const object = Object.assign({}, this.state.emailSettings);

    object[type] = settings;

    this.setState({
      emailSettings: object,
    }, () => {
      this.props.dispatch(saveSettings({
        [type]: this.state.emailSettings[type],
      }));
    });
  }

  render() {
    const { getIntl } = this.props;
    const { emailSettings, shop, couponSettings } = this.state;

    return (
      <div className={styles.container}>
        <Helmet title={getIntl('title')} />
        <div className="container-fluid">
          <EmailSetting
            type="emailCustomer"
            handleButtonSave={this.handleButtonSave.bind(this)}
            couponSettings={couponSettings.couponCustomer}
            shop={shop}
            emailSettings={emailSettings.emailCustomer}
          />
          <hr />
          <EmailSetting
            type="emailOrder"
            handleButtonSave={this.handleButtonSave.bind(this)}
            shop={shop}
            emailSettings={emailSettings.emailOrder}
            couponSettings={couponSettings.couponOrder}
          />
        </div>
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
EmailSettingPage.need = [() => {
  return fetchSettings([
    'emailCustomer',
    'emailOrder',
    'couponCustomer',
    'couponOrder',
  ]);
}];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    settings: getSetting(state) || {},
    shop: getShop(state) || {},
  };
}

EmailSettingPage.propTypes = propTypes;
EmailSettingPage.defaultProps = defaultProps;

EmailSettingPage.contextTypes = {
  router: PropTypes.object,
};

export default withIntl({
  prefix: 'pages.emailSettingPage',
})(connect(mapStateToProps)(EmailSettingPage));
