import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';

// Import Third-party
import Select from 'react-select';
import { InputGroup, InputGroupAddon, Button, Input, FormGroup, Label, Row, Col } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

// Import CSS
import styles from './SearchWidget.css';

const propTypes = {
  getIntl: PropTypes.func.isRequired,
  handleSearch: PropTypes.func,
  criteria: PropTypes.object.isRequired,
};

const defaultProps = {
  criteria: {},
};

class SearchWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      criteria: this.props.criteria,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.criteria) {
      this.setState({
        criteria: nextProps.criteria,
      });
    }
  }

  getButtonClear({ isEmpty, name }) {
    if (!isEmpty) {
      return <Button onClick={this.handleDelSearch.bind(this, name)} className={styles.btnDelete} ><FontAwesome name="times" /></Button>;
    }
  }

  getTextField({ label = '', name, value, handleChange, isEmpty, placeholder = '' }) {
    return (
      <FormGroup>
        <Label for={name}>{label}&nbsp;</Label>
        <InputGroup>
          <Input
            value={value}
            onChange={handleChange}
            name={name}
            placeholder={placeholder}
          />
          <InputGroupAddon addonType="append">
            <div>{this.getButtonClear({ isEmpty, name })}</div>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    );
  }

  getSelectField({ value, name, option, handleChange, label = '' }) {
    return (
      <FormGroup>
        <Label for={name}>{label}&nbsp;</Label>
        <Select
          name={name}
          value={value}
          onChange={handleChange}
          options={option}
          searchable={false}
        />
      </FormGroup>
    );
  }

  handleChangeInput(e) {
    const object = Object.assign({}, this.state.criteria);
    const value = e.target.value;
    const name = e.target.name;

    object[name] = value;

    this.setState({ criteria: object }, () => {
      this.handleChangeCriteria(this.state.criteria);
    });
  }

  handleChangeStatus = (selectedOption) => {
    const object = Object.assign({}, this.state.criteria);

    object.statusOption = selectedOption.value;

    this.setState({
      criteria: object,
    }, () => {
      this.handleChangeCriteria(this.state.criteria);
    });
  };

  handleDelSearch(name) {
    const object = Object.assign({}, this.state.criteria);

    object[name] = '';

    this.setState({
      criteria: object,
    }, () => {
      this.handleChangeCriteria(this.state.criteria);
    });
  }

  handleChangeCriteria(criteria) {
    return this.props.handleChangeCriteria(criteria);
  }

  render() {
    const { criteria } = this.state;
    const { getIntl } = this.props;
    const statusOptions = [
      {
        value: 'all',
        label: getIntl('statusSelect.all'),
      },
      {
        value: 'used',
        label: getIntl('statusSelect.used'),
      },
      {
        value: 'new',
        label: getIntl('statusSelect.new'),
      },
      {
        value: 'expired',
        label: getIntl('statusSelect.expired'),
      },
    ];

    return (
      <FormGroup>
        <div className={styles.wrapSearchWidget}>
          <Row>
            <Col>
              {this.getTextField({
                label: getIntl('emailField'),
                name: 'customerEmail',
                value: criteria.customerEmail || '',
                handleChange: this.handleChangeInput.bind(this),
                isEmpty: criteria.customerEmail === '',
                placeholder: getIntl('emailPlaceholder'),
              })}
            </Col>
            <Col>
              {this.getTextField({
                label: getIntl('couponCodeField'),
                name: 'couponCode',
                value: criteria.couponCode || '',
                handleChange: this.handleChangeInput.bind(this),
                isEmpty: criteria.couponCode === '',
                placeholder: getIntl('couponCodePlaceholder'),
              })}
            </Col>
          </Row>
          <Row>
            <Col>
              {this.getSelectField({
                name: 'statusOption',
                value: criteria.statusOption,
                option: statusOptions,
                label: getIntl('statusField'),
                handleChange: this.handleChangeStatus.bind(this),
              })}
            </Col>
            <Col>
              {this.getTextField({
                label: getIntl('orderIDField'),
                name: 'orderNumber',
                value: criteria.orderNumber || '',
                handleChange: this.handleChangeInput.bind(this),
                isEmpty: criteria.orderNumber === '',
                placeholder: getIntl('orderIDPlaceholder'),
              })}
            </Col>
          </Row>
        </div>
      </FormGroup>
    );
  }
}

SearchWidget.propTypes = propTypes;

SearchWidget.defaultProps = defaultProps;

export default withIntl({
  prefix: 'components.searchWidget',
})(SearchWidget);
