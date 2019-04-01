// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// import Third-party Components
import FontAwesome from 'react-fontawesome';
import { Label, FormGroup, Input, InputGroup, InputGroupAddon } from 'reactstrap';

// Import Third-party Libs
import moment from 'moment';
import _get from 'lodash/get';

// Import Styles
import styles from './InputWithButton.css';

const propTypes = {
  onChange: PropTypes.any,
  onClick: PropTypes.any,
  dateProps: PropTypes.any,
  handleChange: PropTypes.any,
};

const defaultProps = {
  dateProps: moment(),
};

class InputWithButton extends PureComponent {
  constructor(props) {
    super(props);

    const date = moment(this.props.dateProps);

    let hour = Number(date.hours()) % 12;

    if (Number(date.hours()) === 12 || Number(date.hours()) === 0) {
      hour = 12;
    }

    this.state = {
      date,
      hour,
      min: date.minutes(),
      meridian: date.hours() < 12 ? 'SA' : 'CH',
      isOpen: false,
      temp: {
        hour,
        min: date.minutes(),
      },
      focus: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dateProps) {
      const date = moment(nextProps.dateProps);

      let hour = Number(date.hours()) % 12;

      if (Number(date.hours()) === 12 || Number(date.hours()) === 0) {
        hour = 12;
      }

      const newState = {
        date,
        hour,
        min: date.minutes(),
        meridian: date.hours() < 12 ? 'SA' : 'CH',
        temp: {
          hour,
          min: date.minutes() < 10 ? `0${date.minutes()}` : date.minutes(),
        },
      };

      this.setState(newState);
    }
  }

  getLabel() {
    if (this.props.title) {
      return <Label for="status">{this.props.title}</Label>;
    }
  }

  componentDidUpdate() {
    if (this.state.isOpen) {
      ReactDOM.findDOMNode(this.refs.refWrapTimePicker).focus();

      if (this.state.focus) {
        ReactDOM.findDOMNode(this.refs[this.state.focus]).focus();
      }
    }
  }

  updateMin({ plus = true }) {
    const { min, hour, meridian } = this.state;
    const newState = {};

    newState.temp = {};

    let minPlus = min < 59 ? Number(min) + 1 : 0;
    let minMinus = min > 0 ? Number(min) - 1 : 59;

    if (!plus && Number(min) === 0) {
      newState.hour = Number(hour) - 1;
      newState.temp.hour = Number(hour) - 1;

      if (Number(hour) === 12) {
        newState.meridian = meridian === 'SA' ? 'CH' : 'SA';
      }
    }

    if (plus && Number(min) === 59) {
      newState.hour = Number(hour) + 1;
      newState.temp.hour = Number(hour) + 1;

      if (Number(hour) === 11) {
        newState.meridian = meridian === 'SA' ? 'CH' : 'SA';
      }
    }

    newState.min = plus ? minPlus : minMinus;

    minPlus = minPlus < 10 ? `0${minPlus}` : minPlus;
    minMinus = minMinus < 10 ? `0${minMinus}` : minMinus;

    newState.temp.min = plus ? minPlus : minMinus;

    this.setState(newState, () => {
      this.handleChangeTime();
    });
  }

  updateHour({ plus = true }) {
    const { hour, meridian } = this.state;
    const newState = {};

    newState.temp = {};

    const hourPlus = hour < 12 ? Number(hour) + 1 : 1;
    const hourMinus = hour > 1 ? Number(hour) - 1 : 12;

    newState.hour = hourPlus;
    newState.temp.hour = hourPlus;

    if (!plus) {
      newState.hour = hourMinus;
      newState.temp.hour = hourMinus;

      if (Number(hour) === 12) {
        newState.meridian = meridian === 'SA' ? 'CH' : 'SA';
      }
    }

    if (plus && Number(hour) === 11) {
      newState.meridian = meridian === 'SA' ? 'CH' : 'SA';
    }

    this.setState(newState, () => {
      this.handleChangeTime();
    });
  }

  handleChangeInput(e) {
    let value = e.target.value;

    const name = e.target.name;
    const { temp } = this.state;
    const newState = {};

    if (name === 'hour') {
      value = isNaN(value) ? _get(temp, 'hour', 0) : value;
    } else if (name === 'min') {
      value = isNaN(value) ? _get(temp, 'min', 0) : value;
    }

    newState.temp = Object.assign({}, this.state.temp, {});

    newState.temp[name] = value;

    newState.focus = name;

    this.setState(newState);
  }

  handleKeyPress(e) {
    const name = e.target.name;
    const value = e.target.value;

    if (e.which !== 8 && isNaN(String.fromCharCode(e.which))) {
      e.preventDefault();
    }

    if (e.which === 13 && !isNaN(value)) {
      const newState = {};

      newState.temp = Object.assign({}, this.state.temp, {});

      if (name === 'hour' && value <= 12 && value > 0) {
        newState.temp[name] = value;
        newState[name] = value;
      }

      if (name === 'min' && value < 60 && value >= 0) {
        if (value < 10) {
          newState.temp[name] = `0${value}`;
          newState[name] = Number(value);
        } else {
          newState.temp[name] = value;
          newState[name] = Number(value);
        }
      }

      this.setState(newState, () => this.handleChangeTime());
    }
  }

  handleChangeTime() {
    const { min, meridian, hour, date } = this.state;

    let newTime = `${hour}:${min}`;

    if (meridian === 'CH' && Number(hour) < 12) {
      newTime = `${Number(hour) + 12}:${min}`;
    }

    if (meridian === 'SA' && Number(hour) === 12) {
      newTime = `0:${min}`;
    }

    this.props.handleChange(moment(`${moment(date).format('DD/MM/YYYY')} ${newTime}`, 'DD/MM/YYYY HH:mm'), { timeChange: true });
  }

  handlePlusTime({ type, plus = true }) {
    const { meridian } = this.state;
    const newState = {};

    switch (type) {
      case 'meridian' :
        newState.meridian = meridian === 'SA' ? 'CH' : 'SA';

        this.setState(newState, () => this.handleChangeTime());

        break;

      case 'hour' :
        this.updateHour({ plus });

        break;

      case 'min' :
        this.updateMin({ plus });

        break;
    }
  }

  renderTimePicker() {
    const { meridian, isOpen, temp } = this.state;
    const hour = _get(temp, 'hour', 1);
    const min = _get(temp, 'min', 0);

    if (!isOpen) {
      return null;
    }

    return (
      <div
        className={styles.wrapTableTimePicker}
        ref="refWrapTimePicker"
        tabIndex={0}
        onBlur={this.handleChangeOpen.bind(this, { blur: true })}
      >
        <table>
          <tbody>
            <tr>
              <td>
                <FontAwesome onClick={this.handlePlusTime.bind(this, { type: 'hour' })} name="chevron-up" />
              </td>
              <td className="separator">&nbsp;&nbsp;&nbsp;</td>
              <td>
                <FontAwesome onClick={this.handlePlusTime.bind(this, { type: 'min' })} name="chevron-up" />
              </td>
              <td className="separator">&nbsp;&nbsp;&nbsp;</td>
              <td className="meridian-column">
                <FontAwesome onClick={this.handlePlusTime.bind(this, { type: 'meridian' })} name="chevron-up" />
              </td>
            </tr>
            <tr>
              <td><Input
                className={styles.ipTimePicker}
                key="hour"
                ref="hour"
                name="hour"
                onChange={this.handleChangeInput.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}
                type="text"
                min={1}
                maxLength={2}
                value={hour}
              /></td>
              <td className="separator">:</td>
              <td><Input
                className={styles.ipTimePicker}
                name="min"
                key="min"
                ref="min"
                onChange={this.handleChangeInput.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}
                type="text"
                maxLength={2}
                value={min}
              /></td>
              <td className="separator">&nbsp;&nbsp;&nbsp;</td>
              <td><Input
                key="meridian"
                className={styles.ipTimePicker}
                type="text"
                maxLength="2"
                value={meridian}
                name="meridian"
              /></td>
            </tr>
            <tr>
              <td><FontAwesome onClick={this.handlePlusTime.bind(this, { type: 'hour', plus: false })} name="chevron-down" /></td>
              <td className="separator">&nbsp;&nbsp;&nbsp;</td>
              <td><FontAwesome onClick={this.handlePlusTime.bind(this, { type: 'min', plus: false })} name="chevron-down" /></td>
              <td className="separator">&nbsp;&nbsp;&nbsp;</td>
              <td><FontAwesome onClick={this.handlePlusTime.bind(this, { type: 'meridian' })} name="chevron-down" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  handleChangeOpen({ blur = false }, e) {
    const newState = { isOpen: true };

    if (blur) {
      newState.isOpen =
        _get(e, 'relatedTarget.name', '') === 'hour'
        || _get(e, 'relatedTarget.name', '') === 'min'
        || _get(e, 'relatedTarget.name', '') === 'meridian'
        || _get(e, 'relatedTarget.className', '') === styles.wrapTableTimePicker;
    }

    this.setState(newState);
  }

  render() {
    const { value, disabled, onClick, onChange, name } = this.props;
    const { hour, meridian, min } = this.state;

    return (
      <FormGroup>
        {this.getLabel()}
        <InputGroup style={{ zIndex: '1' }}>
          <Input value={value} disabled={disabled} onChange={onChange} onClick={onClick} className={styles[name]} readOnly />
          <InputGroupAddon addonType="append">
            <div className={styles.wrapTimePicker}>
              <Input
                key="time"
                onClick={this.handleChangeOpen.bind(this)}
                value={`${hour}:${min < 10 ? `0${min}` : min} ${meridian}`}
                disabled={disabled}
                style={{ borderRadius: '0 4px 4px 0' }}
              />
              {this.renderTimePicker()}
            </div>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
    );
  }
}

InputWithButton.propTypes = propTypes;
InputWithButton.defaultProps = defaultProps;

export default InputWithButton;
