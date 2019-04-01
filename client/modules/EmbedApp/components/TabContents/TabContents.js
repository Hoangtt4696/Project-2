// Import Third-party Libs
import moment from 'moment';

// Import React
import React from 'react';
import PropTypes from 'prop-types';

// Import Third-party Components
import { Link } from 'react-router';
import { Table } from 'reactstrap';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';

// Import Styles
import styles from './TabContents.css';

moment.locale('vi');

const propTypes = {
  hasCoupon: PropTypes.bool,
  settingCoupons: PropTypes.object,
};

const defaultProps = {
  hasCoupon: false,
  settingCoupons: {},
};

class TabContents extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      idContent: 'listTypeCoupon',
    };
  }

  render() {
    const { getIntl, hasCoupon, settingCoupons } = this.props;
    const { couponCustomer = {}, couponOrder = {} } = settingCoupons;

    if (!hasCoupon) {
      return (
        <div className={styles.wrapContentBlank}>
          <h3 className={styles.textCenter}>{getIntl('headingNoData')}</h3>
          <p className={styles.textCenter}>
            {getIntl('subHeadingNoData')}
          </p>
          <p className={styles.textCenter}>{getIntl('noteNoData')}</p>
        </div>
      );
    }

    return (
      <div className={styles.wrapContent}>
        <Table>
          <thead>
            <tr>
              <th>{getIntl('discountTypeField')}</th>
              <th>{getIntl('startAtField')}</th>
              <th>{getIntl('endAtField')}</th>
              <th>{getIntl('prefixField')}</th>
              <th>{getIntl('expField')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><Link to="/coupon/customer">{getIntl('customerField')}</Link></td>
              <td>{moment(couponCustomer.startAt).format('DD/MM/YYYY h:mm A')}</td>
              <td>{couponCustomer.neverExpire ?
                <div className={styles.imgInfinity} />
                : moment(couponCustomer.endAt).format('DD/MM/YYYY h:mm A')}</td>
              <td>{couponCustomer.prefix}</td>
              <td>{couponCustomer.expDate ? `${couponCustomer.expDate} Ngày` : ''}</td>
            </tr>
            <tr>
              <td><Link to="/coupon/order">{getIntl('orderField')}</Link></td>
              <td>{moment(couponOrder.startAt).format('DD/MM/YYYY h:mm A')}</td>
              <td>{couponOrder.neverExpire ?
                <div className={styles.imgInfinity} />
                : moment(couponOrder.endAt).format('DD/MM/YYYY h:mm A')}</td>
              <td>{couponOrder.prefix}</td>
              <td>{couponOrder.expDate ? `${couponOrder.expDate} Ngày` : ''}</td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}

TabContents.protoTypes = propTypes;
TabContents.defaultProps = defaultProps;

export default withIntl({
  prefix: 'components.tabContents',
})(TabContents);
