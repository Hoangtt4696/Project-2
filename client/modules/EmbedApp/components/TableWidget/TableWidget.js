import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

// Import Third-party
import FontAwesome from 'react-fontawesome';
import ReactTable from 'react-table';
import { connect } from 'react-redux';
import moment from 'moment';

// Import Css
import styles from './TableWidget.css';

// Import Component
import withIntl from '../../../../components/HOC/withIntl';

const defaultProps = {
  dataSource: [],
  totalPages: 1,
  type: '',
  initPage: 0,
};
const propTypes = {
  dataSource: PropTypes.array,
  totalPages: PropTypes.number,
  type: PropTypes.string,
  handleListCoupon: PropTypes.func,
  initPage: PropTypes.number,
};

class TableWidget extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      selectAll: 0,
      selection: {},
      data: this.props.dataSource,
      totalPages: this.props.totalPages,
      type: this.props.type,
      initPage: this.props.initPage,
    };

    this.requestData = this.requestData.bind(this);
    this.toggleRow = this.toggleRow.bind(this);
    this.toggleSelectAll = this.toggleSelectAll.bind(this);
  }

  initPage = this.props.initPage;

  componentWillReceiveProps(nextProps) {
    if (nextProps.dataSource) {
      this.setState({
        data: nextProps.dataSource,
      });
    }

    if (nextProps.totalPages) {
      this.setState({
        totalPages: nextProps.totalPages,
      });
    }

    if (nextProps.initPage !== undefined) {
      this.setState({
        initPage: nextProps.initPage,
      });

      this.initPage = nextProps.initPage;
    }

    if (nextProps.type) {
      this.setState({
        type: nextProps.type,
      });
    }
  }

  toggleRow(couponCode) {
    const newSelection = Object.assign({}, this.state.selection);

    newSelection[couponCode] = !this.state.selection[couponCode];

    const arrValues = Object.values(newSelection);

    let countChecked = 0;

    for (let i = 0; i < arrValues.length; i++) {
      if (arrValues[i] === true) {
        countChecked += 1;
      }
    }

    const flagSelectAll = countChecked === this.state.data.length;

    this.setState({
      selection: newSelection,
      selectAll: flagSelectAll ? 1 : 0,
    }, () => {
      this.props.handleListCoupon(newSelection);
    });
  }

  toggleSelectAll() {
    const newSelection = {};

    if (!this.state.selectAll) {
      this.state.data.forEach(x => {
        newSelection[x.couponCode] = true;
      });
    }

    this.setState({
      selection: newSelection,
      selectAll: this.state.selectAll === 0 ? 1 : 0,
    }, () => {
      this.props.handleListCoupon(newSelection);
    });
  }

  getTableFieldIntl(key) {
    const shopSectionIntl = 'tableField';
    const { getIntl } = this.props;

    return getIntl(`${shopSectionIntl}.${key}`);
  }

  requestData({ pageSize, page, initPage }) {
    const criteria = {
      page,
      limit: pageSize,
      type: this.state.type,
      initPage,
    };

    // console.log(`page: ${page} ==== initPage: ${initPage}`);

    this.props.requestData({ criteria }).then(() => {
      this.setState({
        selectAll: 0,
        selection: {},
      }, () => {
        this.props.handleListCoupon({});
      });
    });
  }

  fetchData(state) {
    this.requestData({
      initPage: this.initPage,
      page: ++state.page,
      pageSize: state.pageSize,
    });
  }

  render() {
    const { getIntl } = this.props;
    const headerStyle = { textAlign: 'left', borderRight: 'none', fontSize: '14px' };
    const cellStyle = { borderRight: 'none', fontSize: '14px' };
    const alignItems = { alignItems: 'center' };

    const columns = [
      {
        id: 'checkbox',
        accessor: '',
        Cell: r => {
          return (
            <div className={styles.checkbox}>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={this.state.selection[r.original.couponCode] === true}
                  onChange={this.toggleRow.bind(this, r.original.couponCode)}
                />
                <span className={styles.cr}><FontAwesome name="check" className={styles.crIcon} /></span>
              </label>
            </div>
          );
        },
        Header: (
          <div className={styles.checkbox}>
            <label>
              <input
                type="checkbox"
                className="checkbox"
                checked={this.state.selectAll === 1}
                onChange={this.toggleSelectAll.bind(this)}
              />
              <span className={styles.cr}><FontAwesome name="check" className={styles.crIcon} /></span>
            </label>
          </div>
        ),
        maxWidth: 60,
        headerStyle: { ...headerStyle, ...alignItems },
        sortable: false,
        style: cellStyle,
        resizable: false,
      },
      {
        Header: this.getTableFieldIntl('customerEmail'),
        accessor: 'customerEmail',
        headerStyle,
        style: cellStyle,
      },
      {
        Header: this.getTableFieldIntl('couponCode'),
        accessor: 'couponCode',
        headerStyle,
        style: cellStyle,
      },
      {
        Header: this.getTableFieldIntl('status'),
        accessor: 'status',
        Cell: r => {
          if (r.original.status) {
            switch (r.original.status) {
              case 'used' : {
                return <span className={styles.couponUsed}>{getIntl('status.used')}</span>;
              }

              case 'new' : {
                if (r.original.endDate && (moment(r.original.endDate) < moment())) {
                  return <span className={styles.couponExpire}>{getIntl('status.expire')}</span>;
                }

                return <span className={styles.couponNew}>{getIntl('status.new')}</span>;
              }
            }
          }
        },
        headerStyle,
        style: cellStyle,
      },
      {
        Header: this.getTableFieldIntl('refOrderNumber'),
        id: 'refOrderNumber',
        accessor: d => (d.refOrder ? d.refOrder.orderNumber : ''),
        headerStyle,
        style: { ...cellStyle, color: '#4A90E2' },
      },
      {
        Header: this.getTableFieldIntl('refOrderEmail'),
        id: 'refOrderEmail',
        accessor: d => (d.refOrder ? d.refOrder.customerEmail : ''),
        headerStyle,
        style: cellStyle,
      },
    ];

    const { data, totalPages, initPage } = this.state;

    return (
      <div className={styles.wrapTable}>
        <ReactTable
          data={data}
          columns={columns}
          previousText={<FontAwesome name="angle-double-left" />}
          nextText={<FontAwesome name="angle-double-right" />}
          pageText="Trang"
          ofText="/ "
          rowsText=""
          defaultPageSize={10}
          noDataText="Không có dữ liệu"
          className="-highlight"
          pageSizeOptions={[10, 20, 50]}
          pages={totalPages}
          page={initPage}
          onPageChange={(pageIndex) => { this.initPage = pageIndex; }}
          sortable={false}
          onFetchData={this.fetchData.bind(this)}
          manual
        />
      </div>
    );
  }
}

TableWidget.defaultProps = defaultProps;
TableWidget.propTypes = propTypes;

export default withIntl({
  prefix: 'components.tableWidget',
})(connect()(TableWidget));
