// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';
import Coupon from '../../components/SettingCoupon/SettingCoupon';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { getSetting } from '../../reducers/SettingReducer';
import { fetchSettings, saveSettings } from '../../actions/SettingActions';

const propTypes = {
  settingCoupons: PropTypes.object,
  getIntl: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};
const defaultProps = {
  settingCoupons: {},
};

class SettingCouponPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      settingCoupons: this.props.settingCoupons,
    };
  }

  componentDidMount() {
    this.props.dispatch(fetchSettings([
      'couponCustomer',
      'couponOrder',
    ]));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settingCoupons) {
      this.setState({
        settingCoupons: nextProps.settingCoupons,
      });
    }
  }

  handleChangeCoupon(type, couponData) {
    const newState = Object.assign({}, this.state, {});

    newState.settingCoupons = {};

    newState.settingCoupons[type] = couponData;

    this.setState(newState);
  }

  handleSave() {
    const { couponCustomer, couponOrder } = this.state.settingCoupons;

    this.props.dispatch(saveSettings({
      couponCustomer,
      couponOrder,
    }));
  }

  render() {
    const { getIntl } = this.props;
    const { couponOrder, couponCustomer } = this.state.settingCoupons;

    return (
      <div>
        <Helmet title={getIntl('title')} />
        <Coupon
          type="couponCustomer"
          data={couponCustomer}
          handleChangeCoupon={this.handleChangeCoupon.bind(this)}
          handleSave={this.handleSave.bind(this)}
        />
        <div>
          <hr />
        </div>
        <Coupon
          type="couponOrder"
          data={couponOrder}
          handleChangeCoupon={this.handleChangeCoupon.bind(this)}
          handleSave={this.handleSave.bind(this)}
        />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
SettingCouponPage.need = [() => {
  return fetchSettings([
    'couponOrder',
    'couponCustomer',
  ]);
}];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    settingCoupons: getSetting(state) || {},
  };
}

SettingCouponPage.propTypes = propTypes;
SettingCouponPage.defaultProps = defaultProps;

SettingCouponPage.contextTypes = {
  router: React.PropTypes.object,
};

export default withIntl({
  prefix: 'pages.couponSettingPage',
})(connect(mapStateToProps)(SettingCouponPage));
