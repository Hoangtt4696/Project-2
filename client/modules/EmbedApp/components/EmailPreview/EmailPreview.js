import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import _replace from 'lodash/replace';
import moment from 'moment';
import randomID from 'random-id';

// Import Component
import withIntl from '../../../../components/HOC/withIntl';
import { Modal, ModalBody } from 'react-modal-bootstrap';
import { formatMoney } from '../../../../util/helpers/haravan.helper';

const propTypes = {
  getIntl: PropTypes.func.isRequired,
  emailSettings: PropTypes.object,
  shop: PropTypes.object,
};

const defaulProps = {
  emailSettings: {},
  shop: {},
};

class EmailPreview extends PureComponent {
  constructor(props) {
    super(props);

    const { isPreview, emailSettings, shop, couponSettings } = this.props;

    this.state = {
      isOpen: isPreview,
      emailSettings,
      shop,
      couponSettings,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.isPreview !== 'undefined') {
      this.setState({
        isOpen: nextProps.isPreview,
      });
    }

    if (nextProps.emailSettings) {
      this.setState({
        emailSettings: nextProps.emailSettings,
      });
    }

    if (nextProps.shop) {
      this.setState({
        shop: nextProps.shop,
      });
    }

    if (nextProps.couponSettings) {
      this.setState({
        couponSettings: nextProps.couponSettings,
      });
    }
  }

  hideModal = () => {
    this.setState({
      isOpen: false,
    }, () => {
      this.props.handleChangePreview(this.state.isOpen);
    });
  };

  replaceVarToVal(content) {
    const { getIntl } = this.props;
    const { shop, couponSettings } = this.state;
    const applyToReplacement = couponSettings.applyTo === 'order' ? getIntl('applyOrderAmount') : getIntl('customerEmail');
    const applyOrderAmountReplacement = couponSettings.applyTo === 'order' ?
      `${formatMoney({ number: couponSettings.applyOrderAmount })}đ` : '';
    let discountAmountReplacement = '{{discount_amount}}';

    if (couponSettings.discountAmount) {
      discountAmountReplacement = couponSettings.discountType === 'percentage' ?
        `${couponSettings.discountAmount}%` :
        `${formatMoney({ number: couponSettings.discountAmount })}đ`;
    }

    const expDateDiff = `${getIntl('toDate')} ${moment(couponSettings.endAt).format('DD/MM/YYYY HH:mm')}`;

    let expDateReplacement =
      isNaN(couponSettings.expDate)
        ? ''
        : `${getIntl('toDate')} ${moment().add(Number(couponSettings.expDate), 'days').format('DD/MM/YYYY  HH:mm')}`;

    if (!couponSettings.expDate) {
      expDateReplacement = couponSettings.neverExpire ? getIntl('neverExpireDate') : expDateDiff;
    }

    const couponCode = couponSettings.prefix ?
      `${couponSettings.prefix}${randomID(12 - couponSettings.prefix.length)}` :
      randomID(12);

    const arrKey = [
      '{{shop_name}}',
      '{{email_shop}}',
      '{{discount_amount}}',
      '{{apply_to}}',
      '{{apply_order_amount}}',
      '{{exp_date}}',
      '{{coupon_code}}',
    ];

    const arrReplacement = [
      shop.shopName,
      shop.emailShop,
      discountAmountReplacement,
      applyToReplacement,
      applyOrderAmountReplacement,
      expDateReplacement,
      couponCode.toUpperCase(),
    ];

    const arrContent = arrKey.map((val, key) => {
      content = _replace(content, new RegExp(val, 'g'), arrReplacement[key]);
      return content;
    });

    return arrContent.slice(-1)[0];
  }

  render() {
    const { emailSettings } = this.state;

    return (
      <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal} size="modal-lg">
        <ModalBody>
          <div dangerouslySetInnerHTML={{ __html: this.replaceVarToVal(emailSettings.content) }} />
        </ModalBody>
      </Modal>
    );
  }
}

EmailPreview.propTypes = propTypes;
EmailPreview.defaultProps = defaulProps;

export default withIntl({
  prefix: 'components.emailPreview',
})(EmailPreview);
