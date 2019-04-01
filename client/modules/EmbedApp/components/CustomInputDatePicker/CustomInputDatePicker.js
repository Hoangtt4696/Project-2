import React, { PureComponent } from 'react';
import { InputGroup, InputGroupAddon, Button, Input, FormGroup, Label } from 'reactstrap';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';

import styles from './CustomInputDatePicker.css';

const propTypes = {
  onChange: PropTypes.any,
  onClick: PropTypes.any,
};

class CustomInputDatePicker extends PureComponent {
  getLabel() {
    if (this.props.title) {
      return <Label for="status">{this.props.title}</Label>;
    }
  }

  render() {
    const { value, disabled, onClick, onChange, name } = this.props;

    return (
      <FormGroup>
        {this.getLabel()}
        <InputGroup style={{ zIndex: '0' }}>
          <Input value={value} disabled={disabled} onChange={onChange} onClick={onClick} className={styles[name]} readOnly />
          <InputGroupAddon addonType="append">
            <Button outline color="primary" className={styles.btnDate} onClick={this.props.onClick}>
              <FontAwesome name="calendar" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    );
  }
}

CustomInputDatePicker.propTypes = propTypes;

export default CustomInputDatePicker;
