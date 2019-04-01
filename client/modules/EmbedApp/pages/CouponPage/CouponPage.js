import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
// Import Components
import withIntl from '../../../../components/HOC/withIntl';
import TabContents from '../../components/TabContents/TabContents';
import { connect } from 'react-redux';
import Coupon from '../../components/Coupon/Coupon';

// Import Actions
import { countCoupon } from '../../actions/CouponActions';
import { fetchSettings } from '../../actions/SettingActions';

// Import Selectors
import { getCount } from '../../reducers/CouponReducer';
import { getSetting } from '../../reducers/SettingReducer';

const propTypes = {
  totalCoupon: PropTypes.number,
  getIntl: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  settingCoupons: PropTypes.object,
  params: PropTypes.object,
};
const defaultProps = {
  totalCoupon: 0,
  settingCoupons: {},
};

class CouponPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalCoupon: this.props.totalCoupon,
      settingCoupons: this.props.settingCoupons,
    };
  }

  componentDidMount() {
    this.props.dispatch(countCoupon());

    this.props.dispatch(fetchSettings([
      'couponCustomer',
      'couponOrder',
    ]));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.totalCoupon) {
      this.setState({
        totalCoupon: nextProps.totalCoupon,
      });
    }

    if (nextProps.settingCoupons) {
      this.setState({
        settingCoupons: nextProps.settingCoupons,
      });
    }
  }

  render() {
    const { params, getIntl } = this.props;

    const { totalCoupon, settingCoupons } = this.state;

    if (params.type) {
      return (
        <Coupon type={params.type} />
      );
    }

    return (
      <div>
        <Helmet title={getIntl('title')} />
        <TabContents
          hasCoupon={totalCoupon !== 0}
          settingCoupons={settingCoupons}
        />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
// CouponPage.need = [() => { return fetchCoupon(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    totalCoupon: getCount(state),
    settingCoupons: getSetting(state),
  };
}

CouponPage.propTypes = propTypes;
CouponPage.defaultProps = defaultProps;

CouponPage.contextTypes = {
  router: React.PropTypes.object,
};

export default withIntl({
  prefix: 'pages.couponPage',
})(connect(mapStateToProps)(CouponPage));
