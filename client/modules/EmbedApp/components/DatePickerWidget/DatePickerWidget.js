// Import React
import React from 'react';
import PropTypes from 'prop-types';

// Import Third-party Components
import DatePicker from 'react-datepicker';

// Import Components
import CustomInputDatePicker from '../CustomInputDatePicker/CustomInputDatePicker';

// Import Third-party libs
import moment from 'moment';

// Import Styles
import styles from './DatePickerWidget.css';

const propTypes = {
  defaultDate: PropTypes.object,
  minDateProps: PropTypes.object,
};

const defaultProps = {
  defaultDate: moment(),
  minDateProps: moment(),
};

class DatePickerWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentDate: this.props.defaultDate,
      minDateProps: moment(),
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.defaultDate) {
      this.setState({
        currentDate: nextProps.defaultDate,
      });

      if (nextProps.minDate) {
        this.setState({
          minDateProps: nextProps.minDate,
          currentDate: nextProps.defaultDate < nextProps.minDate ? nextProps.minDate : nextProps.defaultDate,
        }, () => {
          this.handleChange(this.state.currentDate);
        });
      }
    }
  }

  handleChange(date) {
    const { handleChangeDate } = this.props;

    this.setState({
      currentDate: date,
    });

    return handleChangeDate(date);
  }

  render() {
    const { currentDate, minDateProps } = this.state;
    const { name, title, isDisabled, showDisabledMonthNavigation } = this.props;
    const minDates = showDisabledMonthNavigation ? {
      minDate: minDateProps,
    } : '';

    return (
      <DatePicker
        name={name}
        title={title}
        selected={currentDate}
        onChange={this.handleChange.bind(this)}
        dateFormat="DD-MM-YYYY"
        className="form-control"
        disabled={isDisabled}
        dayClassName={date => (date ? styles.dayClassName : undefined)}
        showDisabledMonthNavigation={showDisabledMonthNavigation}
        {...minDates}
        customInput={<CustomInputDatePicker />}
      />
    );
  }
}

DatePickerWidget.propTypes = propTypes;
DatePickerWidget.defaultProps = defaultProps;

export default DatePickerWidget;

