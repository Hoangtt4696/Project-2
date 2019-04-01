import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import { Row, Col, Form, FormGroup, Label, Input, Button, Container } from 'reactstrap';
import _merge from 'lodash/merge';
import _get from 'lodash/get';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';
import EmailPreview from '../EmailPreview/EmailPreview';

// Import Css
import styles from './EmailSetting.css';

const propTypes = {
  getIntl: PropTypes.func.isRequired,
  type: PropTypes.string,
  shop: PropTypes.object,
  emailSettings: PropTypes.object,
  couponSettings: PropTypes.object,
};

class EmailSetting extends PureComponent {
  constructor(props) {
    super(props);

    const { type, getIntl, shop, emailSettings, couponSettings } = this.props;

    switch (type) {
      case 'emailCustomer': {
        this.field = {
          heading: getIntl('headingCustomer'),
          subHeading: getIntl('subHeadingCustomer'),
        };

        break;
      }
      case 'emailOrder': {
        this.field = {
          heading: getIntl('headingOrder'),
          subHeading: getIntl('subHeadingOrder'),
        };

        break;
      }
    }

    this.state = {
      button: {
        preview: true,
        edit: true,
        cancel: false,
        save: false,
      },
      isEdit: false,
      isPreview: false,
      type,
      emailSettings: _merge({
        fromEmail: shop.emailShop || this.getInfoSectionIntl('emailFrom'),
        fromName: shop.shopName || this.getInfoSectionIntl('fromName'),
        subject: type === 'emailCustomer' ? this.getInfoSectionIntl('emailSubjectCustomer') : this.getInfoSectionIntl('emailSubjectOrder'),
        content: this.getContentSectionIntl('content'),
      }, emailSettings, {}),
      tempSettings: _merge({
        fromEmail: shop.emailShop || this.getInfoSectionIntl('emailFrom'),
        fromName: shop.shopName || this.getInfoSectionIntl('fromName'),
        subject: type === 'emailCustomer' ? this.getInfoSectionIntl('emailSubjectCustomer') : this.getInfoSectionIntl('emailSubjectOrder'),
        content: this.getContentSectionIntl('content'),
      }, emailSettings, {}),
      couponSettings,
      shop,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.emailSettings) {
      this.setState({
        emailSettings: _merge(this.state.emailSettings, nextProps.emailSettings, {}),
        tempSettings: _merge(this.state.tempSettings, nextProps.emailSettings, {}),
      });

      if (nextProps.shop && !nextProps.emailSettings.fromEmail) {
        const object = Object.assign({}, this.state.emailSettings);

        object.fromEmail = nextProps.shop.emailShop;
        object.fromName = nextProps.shop.shopName;

        this.setState({
          emailSettings: _merge(object, nextProps.emailSettings, {}),
        });
      }
    }

    if (nextProps.couponSettings) {
      this.setState({
        couponSettings: nextProps.couponSettings,
      });
    }

    if (nextProps.shop) {
      this.setState({
        shop: nextProps.shop,
      });
    }
  }

  getInfoSectionIntl(key) {
    const conditionSectionIntl = 'emailSection.info';
    const { getIntl } = this.props;

    return getIntl(`${conditionSectionIntl}.${key}`);
  }

  getContentSectionIntl(key) {
    const conditionSectionIntl = 'emailSection.content';
    const { getIntl } = this.props;

    return getIntl(`${conditionSectionIntl}.${key}`);
  }

  getVariableIntl(key) {
    const conditionSectionIntl = 'variable';
    const { getIntl } = this.props;

    return getIntl(`${conditionSectionIntl}.${key}`);
  }

  getEmailInfo() {
    const { emailSettings, isEdit } = this.state;

    return (
      <Row>
        <Col>
          <Row>
            <Col>
              <p className={styles.titleSection}>{this.getInfoSectionIntl('title')}</p>
            </Col>
          </Row>
          <Row>
            <Container style={{ marginLeft: '3rem' }}>
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="fromName">{this.getInfoSectionIntl('fromNameField')}</Label>
                      <Input
                        disabled={!isEdit}
                        type="text"
                        onChange={this.handleChangeInput.bind(this)}
                        name="fromName"
                        value={emailSettings.fromName}
                        id="fromName"
                        placeholder={this.getInfoSectionIntl('fromNamePlaceholder')}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="fromEmail">{this.getInfoSectionIntl('emailFromField')}</Label>
                      <Input
                        disabled={!isEdit}
                        type="text"
                        onChange={this.handleChangeInput.bind(this)}
                        name="fromEmail"
                        value={emailSettings.fromEmail}
                        id="fromEmail"
                        placeholder={this.getInfoSectionIntl('emailFromPlaceholder')}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="subject">{this.getInfoSectionIntl('emailSubjectField')}</Label>
                      <Input
                        disabled={!isEdit}
                        type="text"
                        onChange={this.handleChangeInput.bind(this)}
                        name="subject"
                        value={emailSettings.subject}
                        id="subject"
                        placeholder={this.getInfoSectionIntl('emailSubjectPlaceholder')}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Row>
        </Col>
      </Row>
    );
  }

  getEmailContent() {
    return (
      <Row>
        <Col>
          <Row>
            <Col>
              <p className={styles.titleSection}>{this.getContentSectionIntl('title')}</p>
            </Col>
          </Row>
          <Row>
            <Container style={{ marginLeft: '3rem' }}>
              <Form>
                <Row>
                  <Col>
                    <FormGroup>
                      <Input
                        type="textarea"
                        value={_get(this.state, 'emailSettings.content', '')}
                        onChange={this.handleChangeInput.bind(this)}
                        name="content"
                        rows={25}
                        disabled={!this.state.isEdit}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Row>
        </Col>
      </Row>
    );
  }

  getButtonByCond({ visible, text, handleClick, color, isOutline, disabled = false }) {
    if (visible) {
      return (
        <Button
          disabled={disabled}
          style={{ marginLeft: '1rem' }}
          onClick={handleClick}
          outline={isOutline}
          color={color}
        >
          {text}
        </Button>
      );
    }
  }

  getButton() {
    const { getIntl } = this.props;
    const { button } = this.state;

    return (
      <Row>
        <Col>
          <Row>
            <Col className="text-right">
              {this.getButtonByCond({
                visible: button.cancel,
                text: getIntl('button.cancel'),
                handleClick: this.handleButtonCancel.bind(this),
                color: 'secondary',
                isOutline: false,
              })}
              {this.getButtonByCond({
                visible: button.save,
                text: getIntl('button.save'),
                handleClick: this.handleButtonSave.bind(this),
                color: 'primary',
                isOutline: false,
                disabled: !this.validateInput(),
              })}
              {this.getButtonByCond({
                visible: button.edit,
                text: getIntl('button.edit'),
                handleClick: this.handleButtonEdit.bind(this),
                color: 'primary',
                isOutline: false,
              })}
              {this.getButtonByCond({
                visible: button.preview,
                text: getIntl('button.preview'),
                handleClick: this.handleButtonPreview.bind(this),
                color: 'secondary',
                isOutline: false,
                disabled: !this.validateInput(),
              })}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }

  handleChangeColor({ name, color }) {
    const object = Object.assign({}, this.state.emailSettings);

    object[name] = color;

    this.setState({
      emailSettings: object,
    });
  }

  handleChangeInput(e) {
    const object = Object.assign({}, this.state.emailSettings);
    const name = e.target.name;
    const value = e.target.value;

    object[name] = value;

    this.setState({ emailSettings: object });
  }

  handleButtonSave() {
    const { type, emailSettings, button } = this.state;

    button.save = false;
    button.edit = true;
    button.cancel = false;

    this.setState({
      isEdit: false,
      button,
    });

    return this.props.handleButtonSave({ type, settings: emailSettings });
  }

  handleButtonEdit() {
    const { button } = this.state;

    button.cancel = true;
    button.save = true;
    button.edit = false;

    this.setState({
      isEdit: true,
      button,
    });
  }

  handleButtonCancel() {
    const { button, tempSettings } = this.state;

    button.edit = true;
    button.save = false;
    button.cancel = false;

    this.setState({
      isEdit: false,
      button,
      emailSettings: tempSettings,
    });
  }

  handleButtonPreview() {
    this.setState({
      isPreview: true,
    });
  }

  handleChangePreview(isShow) {
    this.setState({
      isPreview: isShow,
    });
  }

  validateInput() {
    const { emailSettings } = this.state;

    return (
      emailSettings.fromName &&
      emailSettings.fromEmail &&
      emailSettings.subject &&
      emailSettings.content
    );
  }

  render() {
    const { isPreview, emailSettings, shop, couponSettings } = this.state;
    const { getIntl } = this.props;

    return (
      <div className={styles.wrapSection}>
        <Row style={{ fontFamily: 'HelveticaNeue' }}>
          <Col className={styles.wrapLeftContent} md={3}>
            <h5 className={styles.headingLeft}>{this.field.heading}</h5>
            <p>{this.field.subHeading}</p>
            <p>{getIntl('actionNoteField')}</p>
            <p style={{ marginBottom: '7px' }}>{getIntl('titleVariableDocument')}</p>
            <div style={{ paddingLeft: '15px' }}>
              <ul className={styles.ulVarWrapper}>
                <li>{'{{shop_name}}: '}{this.getVariableIntl('shopName')}</li>
                <li>{'{{discount_amount}}: '}{this.getVariableIntl('discountAmount')}</li>
                <li>{'{{apply_to}}: '}{this.getVariableIntl('applyTo')}</li>
                <li>{'{{apply_order_amount}}: '}{this.getVariableIntl('applyOrderAmount')}</li>
                <li>{'{{exp_date}}: '}{this.getVariableIntl('expDate')}</li>
                <li>{'{{email_shop}}: '}{this.getVariableIntl('emailShop')}</li>
                <li>{'{{coupon_code}}: '}{this.getVariableIntl('couponCode')}</li>
              </ul>
            </div>
            <p className={styles.note}>{getIntl('noteField')}</p>
          </Col>
          <Col className={styles.wrapRightContent}>
            {this.getEmailInfo()}
            {this.getEmailContent()}
            <EmailPreview
              isPreview={isPreview}
              shop={shop}
              couponSettings={couponSettings}
              emailSettings={emailSettings}
              handleChangePreview={this.handleChangePreview.bind(this)}
            />
            {this.getButton()}
          </Col>
        </Row>
      </div>
    );
  }
}

EmailSetting.propTypes = propTypes;

export default withIntl({
  prefix: 'components.emailSetting',
})(EmailSetting);
