// Import Third-party Libs
import _isEmpty from 'lodash/isEmpty';
import _isObject from 'lodash/isObject';

export const updateFilter = ({ filterData, filterName, value, fieldName, operator }) => {
  if (
    _isEmpty(filterData) ||
    !_isObject(filterData) ||
    !filterName ||
    !fieldName ||
    !operator ||
    _isEmpty(filterData.filters)
  ) {
    return;
  }

  filterData.filters.forEach(filter => {
    if (filter.filterName === filterName && filter.fieldName === fieldName && filter.operatorSymbol === operator) {
      if (value === null || value === '') {
        filter.lstFilterData = null;
      } else if (value !== '') {
        if (filter.operatorSymbol !== '$in') {
          filter.lstFilterData = [];
        }

        if (filter.filterDataType === 'DateTime') {
          filter.lstFilterData.push({
            filterDateTimeData: value,
          });
        } else {
          filter.lstFilterData.push({
            filterData: value,
          });
        }
      }
    }

    if (
      filter.filterName === filterName &&
      filterName === 'ORDate' &&
      filter.operatorSymbol === 'eq' &&
      value === null
    ) {
      filter.lstFilterData = [];
      filter.lstFilterData.push({ filterDateTimeData: value });
    }
  });
};

export const removeFilter = ({ filterData, filterName, fieldName, operator }) => {
  if (
    _isEmpty(filterData) ||
    !_isObject(filterData) ||
    !filterName ||
    !fieldName ||
    !operator ||
    _isEmpty(filterData.filters)
  ) {
    return;
  }

  filterData.filters = filterData.filters.filter(filter => {
    return !(filter.filterName === filterName &&
      filter.fieldName === fieldName &&
      filter.operatorSymbol === operator);
  });
};
