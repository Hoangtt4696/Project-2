/* eslint-disable no-nested-ternary */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Import Third-party libs
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
  FormFeedback,
  Container,
} from 'reactstrap';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import _merge from 'lodash/merge';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { formatMoney } from '../../../../util/helpers/haravan.helper';
import { connect } from 'react-redux';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';
import CustomInput from '../InputWithButton/InputWithButton';

// Import Css
import styles from './SettingCoupon.css';
import { showToast } from '../../../App/AppActions';
import { TOAST_MESSAGE } from '../../../../consts/common.const';

const propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object,
  handleChangeCoupon: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  getIntl: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
};

const defaultProps = {
  data: {},
};

class SettingCoupon extends Component {
  constructor(props) {
    super(props);
    const { type, data, getIntl } = this.props;
    let optionExpDate = 'default';

    switch (type) {
      case 'couponCustomer': {
        this.field = {
          heading: getIntl('headingCustomer'),
          subHeading: getIntl('subHeadingCustomer'),
        };

        this.conditionOrderAmount = {};

        break;
      }

      case 'couponOrder': {
        this.field = {
          heading: getIntl('headingOrder'),
          subHeading: getIntl('subHeadingOrder'),
        };

        this.conditionOrderAmount = {
          conditionOrderAmount: 0,
        };

        break;
      }
    }

    if (data.expDate) {
      optionExpDate = 'custom';
    }

    this.state = {
      focus: {
        discountAmount: false,
        applyOrderAmount: false,
        conditionOrderAmount: false,
      },
      type,
      optionExpDate,
      valid: {
        discountAmount: {
          value: true,
          type: '',
        },
        applyOrderAmount: {
          value: true,
          type: '',
        },
        conditionOrderAmount: {
          value: true,
          type: '',
        },
        expDate: {
          value: true,
          type: '',
        },
      },
      couponData: _merge({
        discountType: 'fixed_amount',
        applyTo: 'customer',
        active: false,
        useWithPromotion: false,
        prefix: '',
        neverExpire: false,
        startAt: moment(),
        endAt: moment(),
        ...this.conditionOrderAmount,
        expDate: null,
        applyOrderAmount: null,
      }, data, {}),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.optionExpDate =
        (nextProps.data.expDate !== undefined && nextProps.data.expDate !== null) ? 'custom' : 'default';

      this.setState({
        optionExpDate: this.optionExpDate,
        couponData: _merge(this.state.couponData, nextProps.data, {}),
      });
    }
  }

  // ====== Get Field ==========

  getDiscountAmountField() {
    const { couponData, valid, focus } = this.state;

    let value = isNaN(couponData.discountAmount) ? '' : Number(couponData.discountAmount);

    if (couponData.discountType === 'fixed_amount') {
      if (!focus.discountAmount) {
        value = couponData.discountAmount !== undefined ? formatMoney({ number: couponData.discountAmount }) : 0;
      }

      return this.getTextGroupField({
        name: 'discountAmount',
        value,
        handleChange: this.handleInputChange.bind(this),
        textButton: 'đ',
        isDisabled: couponData.active,
        valid: valid.discountAmount.value,
        typeError: valid.discountAmount.type,
      });
    }

    return this.getTextGroupField({
      name: 'discountAmount',
      value: isNaN(couponData.discountAmount) ? '' : Number(couponData.discountAmount),
      handleChange: this.handleInputChange.bind(this),
      textButton: '%',
      isDisabled: couponData.active,
      valid: valid.discountAmount.value,
      typeError: valid.discountAmount.type,
    });
  }

  getApplyOrderAmountField() {
    const { couponData, valid, focus } = this.state;
    let value = isNaN(couponData.applyOrderAmount) ? '' : Number(couponData.applyOrderAmount);

    if (couponData.applyTo === 'order') {
      if (!focus.applyOrderAmount) {
        value = couponData.applyOrderAmount !== undefined ? formatMoney({ number: couponData.applyOrderAmount }) : 0;
      }

      return (
        [
          (
          <Col className="text-center" md={1}>
            <div style={{ marginTop: '2.4rem' }}>{this.getConditionApplyIntl('applyToOrderLabel')}</div>
          </Col>
          ),
          (
          <Col>
            {this.getTextGroupField({
              name: 'applyOrderAmount',
              value,
              handleChange: this.handleInputChange.bind(this),
              isDisabled: couponData.active,
              textButton: 'đ',
              valid: valid.applyOrderAmount.value,
              typeError: valid.applyOrderAmount.type,
            })}
          </Col>
          ),
        ]
      );
    } else if (couponData.applyTo === 'customer') {
      return (
        <Col style={{ flexBasis: '12%' }}>
          <div style={{ marginTop: '2.4rem' }}>{this.getConditionApplyIntl('applyToCustomerNote')}</div>
        </Col>
      );
    }
  }

  getMinusField() {
    const { optionExpDate } = this.state;

    if (optionExpDate !== 'custom') return null;

    return (
      <FormGroup>
        <Label>&nbsp;</Label>
        <div className={`${styles.spanCenter} text-center`}>-</div>
      </FormGroup>
    );
  }

  getExpDateField() {
    const { optionExpDate, couponData, valid } = this.state;

    if (optionExpDate === 'custom') {
      return (
        this.getTextGroupField({
          name: 'expDate',
          value: Number(couponData.expDate),
          handleChange: this.handleInputChange.bind(this),
          isDisabled: couponData.active,
          textButton: 'Ngày',
          valid: valid.expDate.value,
          typeError: valid.expDate.type,
        })
      );
    }

    return null;
  }

  getSelectField({ label, name, value, handleChange, options, isDisabled = false }) {
    return (
      <FormGroup>
        <Label for="appName">{label}</Label>
        <Select
          name={name}
          value={value}
          onChange={handleChange}
          options={options}
          disabled={isDisabled}
          searchable={false}
          clearable={false}
        />
      </FormGroup>
    );
  }

  getTextField({
   label = '',
   name, value,
   handleChange,
   placeholder = '',
   isDisabled = false,
   valid = true,
   typeError,
   maxLength = '',
  }) {
    let errContent = '';

    switch (typeError) {
      case 'empty':
        errContent = this.props.getIntl('errorEmpty');
        break;

      case 'notNumber':
        errContent = this.props.getIntl('errorNotNumber');
        break;

      case 'overSize':
        errContent = this.props.getIntl('errorOverSize');
        break;
    }

    return (
      <FormGroup>
        <Label for="status">{label}&nbsp;</Label>
        <Input
          type="text"
          disabled={isDisabled}
          name={name}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          invalid={!valid}
          maxLength={maxLength}
        />
        <FormFeedback>{errContent}</FormFeedback>
      </FormGroup>
    );
  }

  getTextGroupField({
    label = '',
    name,
    value,
    handleChange,
    placeholder = '',
    textButton,
    isDisabled = false,
    valid = true,
    typeError,
  }) {
    let errContent = '';

    const styleMoney = {
      textDecoration: 'underline',
    };

    switch (typeError) {
      case 'empty':
        errContent = this.props.getIntl('errorEmpty');
        break;

      case 'notNumber':
        errContent = this.props.getIntl('errorNotNumber');
        break;

      case 'overSize':
        errContent = this.props.getIntl('errorOverSize');
        break;
    }

    return (
      <FormGroup>
        <Label for="status">{label}&nbsp;</Label>
        <InputGroup>
          <Input
            type="text"
            disabled={isDisabled}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            invalid={!valid}
            onKeyPress={this.handleKeyPress.bind(this)}
            onFocus={this.handleFocus.bind(this, { e: 'focus' })}
            onBlur={this.handleFocus.bind(this, { e: 'blur' })}
          />
          <InputGroupAddon addonType="append" style={textButton === 'đ' ? styleMoney : {}}>{textButton}</InputGroupAddon>
          <FormFeedback>{errContent}</FormFeedback>
        </InputGroup>
      </FormGroup>
    );
  }

  getActiveButton() {
    const { couponData } = this.state;

    if (couponData.active) {
      return (
        <p style={{ textAlign: 'right' }}>
          <Button outline color="danger" onClick={this.handleSaveButton.bind(this)}>{this.props.getIntl('button.inActive')}</Button>
        </p>
      );
    }

    return (
      <p style={{ textAlign: 'right' }}>
        <Button color="primary" onClick={this.handleSaveButton.bind(this)}>{this.props.getIntl('button.active')}</Button>
      </p>
    );
  }

  getHrField() {
    const { type } = this.state;

    return type === 'couponOrder' ? <hr style={{ marginBottom: '2rem' }} /> : '';
  }

  // ===== Get Intl ==========

  getCouponSettingIntl(key) {
    const couponSectionIntl = 'section.couponSetting';
    const { getIntl } = this.props;

    return getIntl(`${couponSectionIntl}.${key}`);
  }

  getConditionApplyIntl(key) {
    const conditionSectionIntl = 'section.conditionApply';
    const { getIntl } = this.props;

    return getIntl(`${conditionSectionIntl}.${key}`);
  }

  getConditionCreateIntl(key) {
    const conditionCreateIntl = 'section.conditionCreate';
    const { getIntl } = this.props;

    return getIntl(`${conditionCreateIntl}.${key}`);
  }

  // ====== Get Section ========

  getSectionCouponSetting() {
    const optionDiscountType = [
      {
        value: 'fixed_amount',
        label: this.getCouponSettingIntl('optionDiscountType.fixed_amount'),
        name: 'discountType',
      },
      {
        value: 'percentage',
        label: this.getCouponSettingIntl('optionDiscountType.percentage'),
        name: 'discountType',
      },
    ];

    const { couponData } = this.state;

    return (
      <Row>
        <Col>
          <Row className={styles.marginBottom15}>
            <Col>
              <span className={styles.headingSection}>{this.getCouponSettingIntl('heading')}</span>
            </Col>
          </Row>
          <Row>
            <Container style={{ marginLeft: '3rem', marginRight: '3rem' }}>
              <Row>
                <Col>
                  {this.getTextField({
                    label: this.getCouponSettingIntl('prefixLabel'),
                    name: 'prefix',
                    value: couponData.prefix,
                    handleChange: this.handleInputChange.bind(this),
                    placeholder: this.getCouponSettingIntl('prefixPlaceholder'),
                    isDisabled: couponData.active,
                    maxLength: 4,
                  })}
                </Col>
                <Col>
                  <FormGroup>
                    <Label>&nbsp;</Label>
                    <div className={styles.spanCenter}>
                      <FontAwesome name="question-circle" className={styles.preTooltip} />
                      <span className={styles.textHover}>
                        <p style={{ marginBottom: '0' }}>{this.getCouponSettingIntl('preToolTip1')}</p>
                        <p style={{ marginBottom: '0' }}>{this.getCouponSettingIntl('preToolTip2')}</p>
                      </span>
                    </div>
                  </FormGroup>
                </Col>
                <Col className="text-center" md={1} />
              </Row>
              <Row>
                <Col>
                  {this.getSelectField({
                    label: this.getCouponSettingIntl('discountTypeLabel'),
                    name: 'discountType',
                    value: couponData.discountType,
                    handleChange: this.handleChangeDiscountType.bind(this),
                    options: optionDiscountType,
                    isDisabled: couponData.active,
                  })}
                </Col>
                <Col md={1} className="text-center">
                  <div style={{ marginTop: '2.4rem' }}>{this.getCouponSettingIntl('discountAmountField')}</div>
                </Col>
                <Col>
                  {this.getDiscountAmountField()}
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <label>{this.getCouponSettingIntl('expDateLabel')}</label>
                    <DatePicker
                      selected={moment(couponData.startAt)}
                      onChange={this.handleStartAtChange.bind(this)}
                      dateFormat="DD/MM/YYYY"
                      className="form-control"
                      name="startAt"
                      key="startAt"
                      disabled={couponData.active}
                      customInput={<CustomInput handleChange={this.handleStartAtChange.bind(this)} dateProps={moment(couponData.startAt)} />}
                      locale="vi"
                      dayClassName={date => (date ? styles.dayClassName : undefined)}
                      showDisabledMonthNavigation
                      minDate={moment()}
                    />
                  </FormGroup>
                </Col>
                <Col md={1} className="text-center">
                  <div style={{ marginTop: '2.4rem' }}>{this.getCouponSettingIntl('expDateField')}</div>
                </Col>
                <Col>
                  <FormGroup>
                    <label>&nbsp;</label>
                    <DatePicker
                      selected={moment(couponData.endAt)}
                      onChange={this.handleEndAtChange.bind(this)}
                      dateFormat="DD/MM/YYYY"
                      className="form-control"
                      name="endAt"
                      key="endAt"
                      disabled={couponData.neverExpire || couponData.active}
                      customInput={<CustomInput handleChange={this.handleEndAtChange.bind(this)} dateProps={moment(couponData.endAt)} />}
                      locale="vi"
                      showDisabledMonthNavigation
                      dayClassName={date => (date ? styles.dayClassName : undefined)}
                      minDate={moment(couponData.startAt) < moment() ? moment() : moment(couponData.startAt)}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormGroup>
                    <div className={styles.checkbox}>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          name="neverExpire"
                          value={couponData.neverExpire}
                          onChange={this.handleInputChange.bind(this)}
                          checked={couponData.neverExpire}
                          disabled={couponData.active}
                        />
                        <span className={styles.cr}><FontAwesome name="check" className={styles.crIcon} /></span>
                        &nbsp;&nbsp;<span style={{ lineHeight: 1.6 }}>{this.getCouponSettingIntl('expDateCheckbox')}</span>
                      </label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Container>
          </Row>
        </Col>
      </Row>
    );
  }

  getSectionConditionApply() {
    const optionApplyTo = [
      {
        value: 'customer',
        label: this.getConditionApplyIntl('optionApplyTo.customer'),
        name: 'applyTo',
      },
      {
        value: 'order',
        label: this.getConditionApplyIntl('optionApplyTo.order'),
        name: 'applyTo',
      },
    ];

    const optionExpDates = [
      {
        value: 'default',
        label: this.getConditionApplyIntl('optionExpDate.default'),
      },
      {
        value: 'custom',
        label: this.getConditionApplyIntl('optionExpDate.custom'),
      },
    ];

    const { couponData, optionExpDate } = this.state;

    return (
      <Row>
        <Col>
          <Row className={styles.marginBottom15}>
            <Col>
              <span className={styles.headingSection}>{this.getConditionApplyIntl('heading')}</span>
            </Col>
          </Row>
          <Row>
            <Container style={{ marginLeft: '3rem', marginRight: '3rem' }}>
              <Row>
                <Col>
                  <FormGroup>
                    <div className={styles.checkbox}>
                      <label>
                        <input
                          type="checkbox"
                          className="checkbox"
                          name="useWithPromotion"
                          value={couponData.useWithPromotion}
                          onChange={this.handleInputChange.bind(this)}
                          checked={couponData.useWithPromotion}
                          disabled={couponData.active}
                        />
                        <span className={styles.cr}><FontAwesome name="check" className={styles.crIcon} /></span>
                        &nbsp;&nbsp;<span style={{ lineHeight: 1.6 }}>{this.getConditionApplyIntl('useWithPromotionField')}</span>
                      </label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  {this.getSelectField({
                    label: this.getConditionApplyIntl('applyToLabel'),
                    name: 'applyTo',
                    value: couponData.applyTo,
                    handleChange: this.handleChangeApplyTo.bind(this),
                    options: optionApplyTo,
                    isDisabled: couponData.active,
                  })}
                </Col>
                {this.getApplyOrderAmountField()}
              </Row>
              <Row>
                <Col>
                  {this.getSelectField({
                    label: this.getConditionApplyIntl('expDateLabel'),
                    name: 'expDateSlect',
                    value: optionExpDate,
                    handleChange: this.handleChangeExpDate.bind(this),
                    options: optionExpDates,
                    isDisabled: couponData.active,
                  })}
                </Col>
                <Col className="text-center" md={1}>
                  {this.getMinusField()}
                </Col>
                <Col>
                  {this.getExpDateField()}
                </Col>
              </Row>
            </Container>
          </Row>
        </Col>
      </Row>
    );
  }

  getSectionConditionCreate() {
    const { couponData, valid, focus } = this.state;
    const typeError = String(valid.conditionOrderAmount.type) || '';

    let errContent = '';
    let value = Number(couponData.conditionOrderAmount);

    if (!focus.conditionOrderAmount) {
      value = couponData.conditionOrderAmount !== undefined ? formatMoney({ number: couponData.conditionOrderAmount }) : 0;
    }

    if (typeError === 'empty') {
      errContent = this.props.getIntl('errorEmpty');
    } else if (typeError === 'notNumber') {
      errContent = this.props.getIntl('errorNotNumber');
    } else if (typeError === 'overSize') {
      errContent = this.props.getIntl('errorOverSize');
    }

    if (this.state.type === 'couponOrder') {
      return (
        <Row>
          <Col>
            <Row className={styles.marginBottom15}>
              <Col>
                <span className={styles.headingSection}>{this.getConditionCreateIntl('heading')}</span>
              </Col>
            </Row>
            <Row>
              <Container style={{ marginLeft: '3rem', marginRight: '3rem' }}>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="status">{this.getConditionCreateIntl('conditionOrderAmountLabel')}&nbsp;</Label>
                      <InputGroup>
                        <Input
                          type="text"
                          disabled={couponData.active}
                          name="conditionOrderAmount"
                          value={value}
                          onChange={this.handleInputChange.bind(this)}
                          invalid={!valid.conditionOrderAmount.value}
                          onKeyPress={this.handleKeyPress.bind(this)}
                          onFocus={this.handleFocus.bind(this, { e: 'focus' })}
                          onBlur={this.handleFocus.bind(this, { e: 'blur' })}
                        />
                        <InputGroupAddon addonType="append" style={{ textDecoration: 'underline' }}>đ</InputGroupAddon>
                        <FormFeedback>{errContent}</FormFeedback>
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col className="text-center" md={1} />
                  <Col />
                </Row>
              </Container>
            </Row>
          </Col>
        </Row>
      );
    }
  }

  // ======== Handle Action =========
  validateInput() {
    const { couponData } = this.state;
    const defaultValue = {
      value: true,
      type: '',
    };

    let applyOrderAmount = defaultValue;
    let expDate = defaultValue;
    let conditionOrderAmount = defaultValue;
    let discountAmount = {};

    if (couponData.discountType === 'percentage') {
      discountAmount = {
        value:
          couponData.discountAmount !== ''
          && !isNaN(couponData.discountAmount)
          && Number(couponData.discountAmount) <= 100
          && Number(couponData.discountAmount) > 0,
        type:
          couponData.discountAmount === '' ?
            'empty' :
            isNaN(couponData.discountAmount) ?
              'notNumber' :
              Number(couponData.discountAmount) > 100 || Number(couponData.discountAmount) <= 0 ?
                'overSize' :
                '',
      };
    } else {
      discountAmount = {
        value:
          couponData.discountAmount !== ''
          && !isNaN(couponData.discountAmount)
          && Number(couponData.discountAmount) > 0,
        type:
          couponData.discountAmount === '' ?
            'empty' :
            isNaN(couponData.discountAmount) ?
              'notNumber' :
              Number(couponData.discountAmount) <= 0 ?
                'empty' :
                '',
      };
    }

    if (couponData.applyOrderAmount !== undefined && couponData.applyOrderAmount !== null) {
      applyOrderAmount = {
        value:
          couponData.applyOrderAmount !== ''
          && !isNaN(couponData.applyOrderAmount)
          && Number(couponData.applyOrderAmount) > 0,
        type:
          couponData.applyOrderAmount === '' ?
            'empty' :
            isNaN(couponData.applyOrderAmount) ?
              'notNumber' :
              Number(couponData.applyOrderAmount) <= 0 ?
                'empty' :
                '',
      };
    }

    if (couponData.expDate !== undefined && couponData.expDate !== null) {
      expDate = {
        value:
          couponData.expDate !== ''
          && !isNaN(couponData.expDate)
          && Number(couponData.expDate) > 0,
        type:
          couponData.expDate === '' ?
            'empty' :
            isNaN(couponData.expDate) ?
              'notNumber' :
              Number(couponData.expDate) <= 0 ?
                'empty' :
                '',
      };
    }

    if (couponData.conditionOrderAmount !== undefined) {
      conditionOrderAmount = {
        value:
          couponData.conditionOrderAmount !== ''
          && !isNaN(couponData.conditionOrderAmount)
          && Number(couponData.conditionOrderAmount) > 0,
        type:
          couponData.conditionOrderAmount === '' ?
            'empty' :
            isNaN(couponData.conditionOrderAmount) ?
              'notNumber' :
              Number(couponData.conditionOrderAmount) <= 0 ?
                'empty' :
                '',
      };
    }

    const valid = {
      discountAmount,
      applyOrderAmount,
      expDate,
      conditionOrderAmount,
    };

    this.setState({
      valid,
    });

    return discountAmount.value && applyOrderAmount.value && expDate.value && conditionOrderAmount.value;
  }

  handleFocus({ e }, event) {
    const { focus } = this.state;
    let value;

    if (e === 'focus') {
      value = true;
    } else {
      value = false;
    }
    focus[event.target.name] = value;

    this.setState({
      focus,
    });
  }

  handleKeyPress(event) {
    if (event.which !== 8 && isNaN(String.fromCharCode(event.which))) {
      event.preventDefault();
    }
  }

  handleInputChange(e) {
    const name = e.target.name;
    const type = e.target.type;
    let value = type === 'checkbox' ? e.target.checked : e.target.value;
    const { couponData } = this.state;

    if (name === 'discountAmount' || name === 'applyOrderAmount' || name === 'expDate' || name === 'conditionOrderAmount') {
      value = isNaN(value) ? 0 : Number(value);
    }

    couponData[name] = value;

    this.setState({
      couponData,
    }, () => {
      this.handleChangeCoupon();
    });
  }

  handleStartAtChange(date, { timeChange = false }) {
    const { couponData } = this.state;
    const timeOld = moment(couponData.startAt).format('HH:mm');
    let newDate = date;

    if (!timeChange) {
      newDate = moment(`${moment(date).format('DD/MM/YYYY')} ${timeOld}`, 'DD/MM/YYYY HH:mm');
    }

    couponData.startAt = newDate;

    if (moment(couponData.endAt) < moment(newDate)) {
      couponData.endAt = newDate;
    }

    this.setState({
      couponData,
    }, () => {
      this.handleChangeCoupon();
    });
  }

  handleEndAtChange(date, { timeChange = false }) {
    const { couponData } = this.state;
    const timeOld = moment(couponData.endAt).format('HH:mm');
    let newDate = date;

    if (!timeChange) {
      newDate = moment(`${moment(date).format('DD/MM/YYYY')} ${timeOld}`, 'DD/MM/YYYY HH:mm');
    }

    couponData.endAt = newDate;

    this.setState({
      couponData,
    }, () => {
      this.handleChangeCoupon();
    });
  }

  async handleChangeCoupon() {
    const { type, couponData } = this.state;

    await this.props.handleChangeCoupon(type, couponData);
  }

  handleChangeApplyTo(optionApplyTo) {
    const { couponData } = this.state;

    couponData[optionApplyTo.name] = optionApplyTo.value;

    if (optionApplyTo.value === 'customer') {
      couponData.applyOrderAmount = null;
    }

    this.setState({
      couponData,
    }, () => {
      this.handleChangeCoupon();
    });
  }

  handleChangeExpDate(optionExpDate) {
    const { couponData } = this.state;

    couponData.expDate = 0;

    if (optionExpDate.value === 'default') {
      couponData.expDate = null;
    }

    this.setState({
      optionExpDate: optionExpDate.value,
      couponData,
    }, () => {
      this.handleChangeCoupon();
    });
  }

  handleChangeDiscountType(optionDiscountType) {
    const { couponData } = this.state;

    couponData[optionDiscountType.name] = optionDiscountType.value;

    this.setState({
      couponData,
    }, () => {
      this.handleChangeCoupon();
    });
  }

  handleSaveButton() {
    const { couponData } = this.state;
    const newState = {};

    newState.couponData = Object.assign({}, couponData, {});

    if (!couponData.active) {
      if (this.validateInput() && moment(couponData.startAt) > moment(couponData.endAt)) {
        if (!couponData.neverExpire) {
          this.props.dispatch(showToast({
            type: TOAST_MESSAGE.TYPE.ERROR,
            message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
          }));
        } else {
          if (moment(couponData.startAt) >= moment()) {
            newState.couponData.active = true;

            this.setState(newState, async () => {
              await this.handleChangeCoupon();
              this.props.handleSave();
            });
          } else {
            this.props.dispatch(showToast({
              type: TOAST_MESSAGE.TYPE.ERROR,
              message: 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại',
            }));
          }
        }
      }

      if (this.validateInput() && moment(couponData.startAt) <= moment(couponData.endAt)) {
        if (moment(couponData.startAt) >= moment()) {
          newState.couponData.active = true;

          this.setState(newState, async () => {
            await this.handleChangeCoupon();
            this.props.handleSave();
          });
        } else {
          this.props.dispatch(showToast({
            type: TOAST_MESSAGE.TYPE.ERROR,
            message: 'Thời gian bắt đầu phải lớn hơn thời gian hiện tại',
          }));
        }
      }
    } else {
      newState.couponData.active = false;

      this.setState(newState, async () => {
        await this.handleChangeCoupon();
        this.props.handleSave();
      });
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <div className="container-fluid">
          <Row>
            <Col md={3} className={styles.wrapLeftContent}>
              <h5 className={styles.headingLeft} >{this.field.heading}</h5>
              <p style={{ color: '#707070' }}>{this.field.subHeading}</p>
            </Col>
            <Col className={styles.wrapRightContent}>
              {this.getSectionConditionCreate()}
              {this.getHrField()}
              {this.getSectionCouponSetting()}
              <hr style={{ marginBottom: '2rem' }} />
              {this.getSectionConditionApply()}
              <Row>
                <Col>
                  {this.getActiveButton()}
                </Col>
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

SettingCoupon.propTypes = propTypes;
SettingCoupon.defaultProps = defaultProps;

export default connect()(withIntl({
  prefix: 'components.settingCoupon',
})(SettingCoupon));
