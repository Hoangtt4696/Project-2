import React from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import { Card, CardBody, CardHeader, Label, Row, Col } from 'reactstrap';
import DatePickerWidget from '../DatePickerWidget/DatePickerWidget';
import Select from 'react-select';
import FontAwesome from 'react-fontawesome';
import moment from 'moment';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';
import SearchWidget from '../SearchWidget/SearchWidget';

// Import CSS
import styles from './FilterWidget.css';

const propTypes = {
  handleFilter: PropTypes.func,
};

class FilterWidget extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      createAtOption: 'all',
      startDate: moment(),
      endDate: moment(),
      customerEmail: '',
      couponCode: '',
      orderNumber: '',
      statusOption: 'all',
      filtered: false,
    };
  }

  handleFilter() {
    const {
      startDate,
      endDate,
      customerEmail,
      couponCode,
      orderNumber,
      statusOption,
      createAtOption,
    } = this.state;

    this.setState({
      filtered: true,
    });

    this.props.handleFilter({
      startDate: moment(startDate).startOf('day'),
      endDate: moment(endDate).endOf('day'),
      customerEmail,
      couponCode,
      orderNumber,
      statusOption,
      createAtOption,
    });
  }

  handleChangeSelect = (selectedOption) => {
    let startDates;
    let endDates;

    switch (selectedOption.value) {
      case 'option' : {
        startDates = moment();
        endDates = moment();

        break;
      }

      case 'today' : {
        startDates = moment();
        endDates = moment();

        break;
      }

      case 'yesterday' : {
        startDates = moment().subtract(1, 'day').startOf('day');
        endDates = moment().subtract(1, 'day').endOf('day');

        break;
      }

      case 'thisWeek' : {
        startDates = moment().startOf('isoWeek');
        endDates = moment().endOf('isoWeek');

        break;
      }

      case 'lastWeek' : {
        startDates = moment().startOf('isoWeek').subtract(7, 'day');
        endDates = moment(startDates).endOf('isoWeek');

        break;
      }

      case 'thisMonth' : {
        startDates = moment().startOf('month');
        endDates = moment().endOf('month');

        break;
      }

      case 'lastMonth' : {
        startDates = moment().startOf('month').subtract(1, 'month');
        endDates = moment(startDates).endOf('month');

        break;
      }
    }

    this.setState({
      createAtOption: selectedOption.value,
      startDate: startDates,
      endDate: endDates,
    });
  };

  handleChangeStartDate(date) {
    this.setState({
      startDate: date,
    });
  }

  handleChangeEndDate(date) {
    this.setState({
      endDate: date,
    });
  }

  handleChangeCriteria(criteria) {
    this.setState({
      ...Object.assign({}, this.state, criteria),
    });
  }

  handleClearFilter() {
    this.setState({
      customerEmail: '',
      couponCode: '',
      orderNumber: '',
      statusOption: 'all',
      filtered: false,
      createAtOption: 'all',
    });

    this.handleChangeSelect({ value: 'all' });

    this.props.handleFilterAll({});
  }

  getCreatedAtSelectIntl(key) {
    const createdAtIntl = 'createdAtSelect';
    const { getIntl } = this.props;

    return getIntl(`${createdAtIntl}.${key}`);
  }

  getClearFilterButton() {
    const { getIntl } = this.props;
    const { filtered } = this.state;

    if (!filtered) {
      return null;
    }

    return (
      <button onClick={this.handleClearFilter.bind(this)} className="btn btn-outline-primary" style={{ fontSize: '.9rem' }}>
        <FontAwesome name="times" />&nbsp; {getIntl('clearFilterButton')}
      </button>
    );
  }

  render() {
    const {
      createAtOption,
      customerEmail,
      orderNumber,
      statusOption,
      couponCode,
      startDate,
      endDate,
    } = this.state;
    const { getIntl } = this.props;
    const createdAtOptions = [
      {
        value: 'all',
        label: this.getCreatedAtSelectIntl('all'),
      },
      {
        value: 'option',
        label: this.getCreatedAtSelectIntl('option'),
      },
      {
        value: 'today',
        label: this.getCreatedAtSelectIntl('today'),
      },
      {
        value: 'yesterday',
        label: this.getCreatedAtSelectIntl('yesterday'),
      },
      {
        value: 'thisWeek',
        label: this.getCreatedAtSelectIntl('thisWeek'),
      },
      {
        value: 'lastWeek',
        label: this.getCreatedAtSelectIntl('lastWeek'),
      },
      {
        value: 'thisMonth',
        label: this.getCreatedAtSelectIntl('thisMonth'),
      },
      {
        value: 'lastMonth',
        label: this.getCreatedAtSelectIntl('lastMonth'),
      },
    ];

    return (
      <Card className={styles.card}>
        <CardHeader className={styles.cardHeader}><FontAwesome name="gears" />&nbsp;&nbsp;{getIntl('filterTitle')}</CardHeader>
        <CardBody className={styles.cardBody}>
          <Row>
            <Col md={5} className={styles.filterWidget}>
              <Row style={{ marginBottom: '1rem' }}>
                <Col>
                  <Label for="status">{getIntl('createdAtField')}</Label>
                  <Select
                    name="form-field-name"
                    value={createAtOption}
                    onChange={this.handleChangeSelect.bind(this)}
                    options={createdAtOptions}
                    searchable={false}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <DatePickerWidget
                    name="startDate"
                    defaultDate={startDate}
                    handleChangeDate={this.handleChangeStartDate.bind(this)}
                    title={getIntl('startDate')}
                    isDisabled={createAtOption !== 'option'}
                  />
                </Col>
                <Col>
                  <DatePickerWidget
                    name="endDate"
                    defaultDate={endDate}
                    handleChangeDate={this.handleChangeEndDate.bind(this)}
                    title={getIntl('endDate')}
                    isDisabled={createAtOption !== 'option'}
                    showDisabledMonthNavigation
                    minDate={startDate}
                  />
                </Col>
              </Row>
            </Col>
            <Col className={styles.searchWidget}>
              <SearchWidget
                criteria={{
                  customerEmail,
                  couponCode,
                  orderNumber,
                  statusOption,
                }}
                handleChangeCriteria={this.handleChangeCriteria.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <div className="container-fluid text-right">
              {this.getClearFilterButton()}
              &nbsp;
              &nbsp;
              <button onClick={this.handleFilter.bind(this)} className="btn btn-primary" style={{ fontSize: '.9rem' }}>
                <FontAwesome name="filter" />&nbsp; {getIntl('filterButton')}
              </button>
            </div>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

FilterWidget.propTypes = propTypes;

export default withIntl({
  prefix: 'components.filterWidget',
})(FilterWidget);
