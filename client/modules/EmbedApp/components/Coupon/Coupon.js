// Import React
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Import Third-party Libs
import { Button, Breadcrumb, BreadcrumbItem, Row, Col } from 'reactstrap';
import moment from 'moment';
import _merge from 'lodash/merge';

// Import Components
import FilterWidget from '../FilterWidget/FilterWidget';
import TableWidget from '../TableWidget/TableWidget';
import withIntl from '../../../../components/HOC/withIntl';
import ModalExport from '../ModalExport/ModalExport';

// Import Helpers
import { updateFilter } from '../../../../util/helpers/query-filter.helper';

import { fetchCoupon, exportCoupon } from '../../actions/CouponActions';
import { getCoupon } from '../../reducers/CouponReducer';

// Import Css
import styles from './Coupon.css';

const propTypes = {
  type: PropTypes.string.isRequired,
  coupons: PropTypes.array,
  initPage: PropTypes.number,
};

const defaultProps = {
  coupons: [],
  initPage: 0,
};

class Coupon extends PureComponent {
  static filterData = {
    filters: [
      {
        operatorSymbol: 'gte',
        filterDataType: 'DateTime',
        fieldName: 'createdAt',
        filterName: 'StartDate',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'lte',
        filterDataType: 'DateTime',
        fieldName: 'createdAt',
        filterName: 'EndDate',
        lstFilterData: null,
      },
      {
        operatorSymbol: '$lt',
        filterDataType: 'String',
        fieldName: 'endDate',
        filterName: 'endDate',
        lstFilterData: null,
      },
      {
        operatorSymbol: '$gte',
        filterDataType: 'DateTime',
        fieldName: 'endDate',
        filterName: 'ORDate',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'DateTime',
        fieldName: 'endDate',
        filterName: 'ORDate',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'String',
        fieldName: 'customerEmail',
        filterName: 'OR',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'String',
        fieldName: 'refOrder.customerEmail',
        filterName: 'OR',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'String',
        fieldName: 'refOrder.orderNumber',
        filterName: 'orderNumber',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'String',
        fieldName: 'couponCode',
        filterName: 'couponCode',
        lstFilterData: null,
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'String',
        fieldName: 'status',
        filterName: 'status',
        lstFilterData: null,
      },
      {
        operatorSymbol: '$nin',
        filterDataType: 'String',
        fieldName: 'status',
        filterName: 'statusNIN',
        lstFilterData: null,
      },
      {
        operatorSymbol: '$in',
        filterDataType: 'String',
        fieldName: 'couponCode',
        filterName: 'listCoupon',
        lstFilterData: null,
      },
    ],
    page: 1,
    limit: 10,
    sortType: 'asc',
    fieldSort: 'createdAt',
    populateField: {
      couponCode: 1,
      orderId: 1,
      orderNumber: 1,
      customerEmail: 1,
      registerDate: 1,
      startDate: 1,
      endDate: 1,
      refOrder: 1,
      status: 1,
      createdAt: 1,
      _id: 1,
    },
  };

  static defaultFilterData = JSON.parse(JSON.stringify(Coupon.filterData));

  constructor(props) {
    super(props);

    this.state = {
      coupons: [],
      type: this.props.type,
      totalPages: 1,
      totalRecord: 0,
      isOpen: false,
      listCouponChosen: [],
    };
  }

  componentDidMount() {
    const { type } = this.state;

    Coupon.filterData = JSON.parse(JSON.stringify(Coupon.defaultFilterData));

    this.props.dispatch(fetchCoupon({
      type,
      filterData: Coupon.filterData,
    }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.coupons) {
      this.setState({
        coupons: nextProps.coupons.records,
        totalRecord: nextProps.coupons.totalRecord,
        totalPages: Math.ceil(nextProps.coupons.totalRecord / 10) === 0 ? 1 : Math.ceil(nextProps.coupons.totalRecord / 10),
      });
    }

    if (nextProps.type) {
      this.setState({
        type: nextProps.type,
      });
    }
  }

  handleFilterAll() {
    const { type } = this.state;

    Coupon.filterData = JSON.parse(JSON.stringify(Coupon.defaultFilterData));

    this.setState({ initPage: 0 });

    this.props.dispatch(fetchCoupon({
      type,
      filterData: Coupon.filterData,
    }));
  }

  updateFilterStatus(statusOption) {
    switch (statusOption) {
      case 'used':
        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'status',
          value: statusOption,
          operator: 'eq',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'endDate',
          value: null,
          operator: '$lt',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'statusNIN',
          value: null,
          operator: '$nin',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: null,
          operator: '$gte',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: '',
          operator: 'eq',
        });

        break;

      case 'new':
        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'status',
          value: statusOption,
          operator: 'eq',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'endDate',
          value: null,
          operator: '$lt',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'statusNIN',
          value: null,
          operator: '$nin',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: moment(),
          operator: '$gte',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: null,
          operator: 'eq',
        });

        break;

      case 'expired':
        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'status',
          value: null,
          operator: 'eq',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'statusNIN',
          value: ['used'],
          operator: '$nin',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'endDate',
          value: moment(),
          operator: '$lt',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: null,
          operator: '$gte',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: '',
          operator: 'eq',
        });

        break;

      case 'all':
        updateFilter({
          filterData: Coupon.filterData,
          filterName: 'status',
          fieldName: 'status',
          value: null,
          operator: 'eq',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'endDate',
          value: null,
          operator: '$lt',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'status',
          filterName: 'statusNIN',
          value: null,
          operator: '$nin',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: null,
          operator: '$gte',
        });

        updateFilter({
          filterData: Coupon.filterData,
          fieldName: 'endDate',
          filterName: 'ORDate',
          value: '',
          operator: 'eq',
        });

        break;
    }
  }

  handleFilter({ startDate, endDate, customerEmail, couponCode, orderNumber, statusOption, createAtOption = '' }) {
    const { type } = this.state;

    updateFilter({
      filterData: Coupon.filterData,
      fieldName: 'createdAt',
      filterName: 'StartDate',
      value: startDate,
      operator: 'gte',
    });

    updateFilter({
      filterData: Coupon.filterData,
      fieldName: 'createdAt',
      filterName: 'EndDate',
      value: endDate,
      operator: 'lte',
    });

    if (createAtOption === 'all') {
      updateFilter({
        filterData: Coupon.filterData,
        fieldName: 'createdAt',
        filterName: 'StartDate',
        value: null,
        operator: 'gte',
      });

      updateFilter({
        filterData: Coupon.filterData,
        fieldName: 'createdAt',
        filterName: 'EndDate',
        value: null,
        operator: 'lte',
      });
    }

    updateFilter({
      filterData: Coupon.filterData,
      fieldName: 'customerEmail',
      filterName: 'OR',
      value: customerEmail,
      operator: 'eq',
    });

    updateFilter({
      filterData: Coupon.filterData,
      fieldName: 'refOrder.customerEmail',
      filterName: 'OR',
      value: customerEmail,
      operator: 'eq',
    });

    updateFilter({
      filterData: Coupon.filterData,
      fieldName: 'couponCode',
      filterName: 'couponCode',
      value: couponCode,
      operator: 'eq',
    });

    updateFilter({
      filterData: Coupon.filterData,
      fieldName: 'refOrder.orderNumber',
      filterName: 'orderNumber',
      value: orderNumber,
      operator: 'eq',
    });

    this.updateFilterStatus(statusOption);

    this.setState({
      initPage: 0,
    });

    Coupon.filterData.page = 1;

    this.props.dispatch(fetchCoupon({
      type,
      filterData: Coupon.filterData,
    }));
  }

  handleIsOpen(isOpen) {
    this.setState({
      isOpen,
    });
  }

  handleListCoupon(selection) {
    Object.keys(selection).forEach((key) => {
      if (!selection[key]) {
        delete selection[key];
      }
    });

    this.setState({
      listCouponChosen: Object.keys(selection),
    });
  }

  handleExportWithType(type = 'filter') {
    const { listCouponChosen } = this.state;

    if (type === 'chosen') {
      const filterNew = _merge({}, Coupon.filterData, {});

      if (filterNew.filters) {
        filterNew.filters.forEach(filter => {
          filter.lstFilterData = [];
        });
      }

      listCouponChosen.map(couponCode => { // eslint-disable-line array-callback-return
        updateFilter({
          filterData: filterNew,
          fieldName: 'couponCode',
          filterName: 'listCoupon',
          value: couponCode,
          operator: '$in',
        });
      });

      this.handleExport(filterNew);
    } else {
      this.handleExport(Coupon.filterData);
    }
  }

  handleExport(fitlerData) {
    const { type } = this.state;

    fitlerData.page = 1;

    this.props.dispatch(exportCoupon({
      type,
      filterData: fitlerData,
    }));
  }

  handleModalExport() {
    this.setState({
      isOpen: true,
    });
  }

  async requestData({ criteria }) {
    const newState = {};
    const { type } = this.state;
    const initPage = criteria.initPage;

    if (criteria.page === ++criteria.initPage) {
      Coupon.filterData.page = criteria.page;
      Coupon.filterData.limit = criteria.limit;

      await this.props.dispatch(fetchCoupon({
        type,
        filterData: Coupon.filterData,
      }));

      newState.totalPages = Math.ceil(this.state.totalRecord / criteria.limit) === 0 ? 1 : Math.ceil(this.state.totalRecord / criteria.limit);
    }

    newState.initPage = initPage;

    this.setState(newState);
  }

  getBreadCrumb() {
    const { getIntl } = this.props;
    const { type } = this.state;
    return (
      <Breadcrumb className={styles.breadcrumb}>
        <BreadcrumbItem>
          <Link to="/" > {getIntl('breadcrumbs.listCoupon')}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem className={styles.breadcrumbsItem} active>
          {type === 'customer' ? getIntl('breadcrumbs.couponCustomer') : getIntl('breadcrumbs.couponOrder')}
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }

  getBtnExport() {
    const { getIntl } = this.props;
    const { totalPages, totalRecord } = this.state;

    if (totalRecord < 1 && totalPages < 2) {
      return null;
    }

    return (
      <Button
        color="primary"
        style={{ fontSize: '.9rem' }}
        onClick={this.handleModalExport.bind(this)}
      >
        {getIntl('exportButton')}
      </Button>
    );
  }

  render() {
    const { coupons, totalPages, type, isOpen, initPage } = this.state;

    return (
      <div className={styles.wrapContent}>
        <Row>
          <Col>
            {this.getBreadCrumb()}
          </Col>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <div className="col">
            <FilterWidget handleFilter={this.handleFilter.bind(this)} handleFilterAll={this.handleFilterAll.bind(this)} />
          </div>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <div className="col text-md-right">
            {this.getBtnExport()}
          </div>
        </Row>
        <Row style={{ marginTop: '10px' }}>
          <div className="col">
            <TableWidget
              totalPages={totalPages}
              type={type}
              initPage={initPage}
              dataSource={coupons}
              requestData={this.requestData.bind(this)}
              handleListCoupon={this.handleListCoupon.bind(this)}
            />
          </div>
        </Row>
        <ModalExport
          isOpen={isOpen}
          handleIsOpen={this.handleIsOpen.bind(this)}
          handleExport={this.handleExportWithType.bind(this)}
        />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
// Coupon.need = [() => {
//   return fetchCoupon({
//     type: this.state.type,
//     filterData: Coupon.filterData,
//   });
// }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    coupons: getCoupon(state) || [],
  };
}

Coupon.propTypes = propTypes;
Coupon.defaultProps = defaultProps;

export default withIntl({
  prefix: 'components.coupon',
})(connect(mapStateToProps)(Coupon));
