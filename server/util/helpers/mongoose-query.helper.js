/* eslint no-case-declarations: 1 */

// Import Third-party Libs
import _get from 'lodash/get';
import _isDate from 'lodash/isDate';
import _isEmpty from 'lodash/isEmpty';
import _isArray from 'lodash/isArray';
import _merge from 'lodash/merge';
import extendify from 'extendify';
import escapeStringRegexp from 'escape-string-regexp';
import moment from 'moment';

// Import Utils
import log from '../loggerUtil';

// Import Conts
import {
  QUERY_TYPE,
  QUERY_DATA_TYPE,
  QUERY_SORT_TYPE,
  QUERY_SORT_TYPE_NAME,
} from '../../consts/const';

const merge = extendify({
  inPlace: false,
  isDeep: true,
  arrays: 'replace',
  booleans: 'replace',
  numbers: 'replace',
  strings: 'replace',
});

// Helper Functions
function toJSON({ key, value }) {
  if (!key) {
    return null;
  }

  key = key.toString().trim();

  return key ? { [key]: value } : null;
}

function toBoolean(data) {
  if (data == null) {
    return '';
  }

  data = data.toString().toLowerCase().trim();

  return data === 'true';
}

function startOfTime({ time, unitOfTime }) {
  let currentTime = new Date();

  if (_isDate(time)) {
    currentTime = new Date(time.toISOString());
  }

  return moment(currentTime).startOf(unitOfTime);
}

function endOfTime(time, unitOfTime) {
  let currentTime = new Date();

  if (_isDate(time)) {
    currentTime = new Date(time.toISOString());
  }

  return moment(currentTime).endOf(unitOfTime);
}

function buildDateTimeFilter({ operator, filterName, fieldName, time }) {
  let startTime = new Date();
  let endTime = new Date();

  switch (filterName) {
    case 'Year':
      startTime = startOfTime({
        time,
        unitOfTime: 'year',
      });
      endTime = endOfTime({
        time,
        unitOfTime: 'year',
      });
      break;

    case 'Month':
      startTime = startOfTime({
        time,
        unitOfTime: 'month',
      });
      endTime = endOfTime({
        time,
        unitOfTime: 'month',
      });
      break;

    case 'Day':
      startTime = startOfTime({
        time,
        unitOfTime: 'day',
      });
      endTime = endOfTime({
        time,
        unitOfTime: 'day',
      });
      break;

    case 'Hour':
      startTime = startOfTime({
        time,
        unitOfTime: 'hour',
      });
      endTime = endOfTime({
        time,
        unitOfTime: 'hour',
      });
      break;
    case 'FromDate':
      startTime = startOfTime({
        time,
        unitOfTime: 'day',
      });
      endTime = null;
      break;

    default:
      startTime = time ? moment(time) : null;
      endTime = null;
  }

  const filter = {};

  filter[operator || '$gte'] = startTime ? startTime.toDate() : null;

  if (endTime) {
    filter[operator || '$lte'] = endTime.toDate();
  }

  return toJSON({
    key: fieldName,
    value: filter,
  });
}

function buildDateTimeListFilter({ operator, filterName, fieldName, times }) {
  const filters = [];

  if (_isEmpty(times)) {
    return null;
  }

  times.forEach(time => {
    const filter = buildDateTimeFilter({
      operator,
      filterName,
      fieldName,
      time,
    });

    filters.push(filter);
  });

  return filters;
}

function buildRegexesFilter({ fieldName, regexes }) {
  const filters = [];

  if (_isEmpty(regexes)) {
    return null;
  }

  regexes.forEach(regex => {
    if (regex) {
      filters.push(toJSON({
        key: fieldName,
        value: {
          $regex: new RegExp(escapeStringRegexp(regex), 'i'),
        },
      }));
    } else {
      filters.push(toJSON({
        key: fieldName,
        value: {
          $eq: regex,
        },
      }));
    }
  });
}

function buildFilterField(filterDataObj) {
  if (_isEmpty(filterDataObj) || _isEmpty(_get(filterDataObj, 'lstFilterData', []))) {
    return null;
  }

  const { fieldName, filterName, filterDataType, lstFilterData } = filterDataObj;
  let operatorSymbol = '';

  if (filterDataObj.operatorSymbol) {
    operatorSymbol = filterDataObj.operatorSymbol.trim();
  }

  if (lstFilterData.length === 1) {
    const filter = lstFilterData[0];
    let filterData = _get(filter, 'filterData', null) || _get(filter, 'filterDateTimeData', null);

    if (['Int64', 'Int32', 'Double'].includes(filterDataType)) {
      filterData = filter.filterData;
    }

    switch (filterDataType) {
      case 'Boolean':
        if (operatorSymbol === 'eq') {
          return toJSON({
            key: fieldName,
            value: toBoolean(filterData),
          });
        } else if (operatorSymbol) {
          return toJSON({
            key: fieldName,
            value: toJSON({
              key: `$${operatorSymbol}`,
              value: toBoolean(filterData),
            }),
          });
        }
        return null;

      case 'DateTime':
        if (filterName === 'StartDate' || filterName === 'EndDate') {
          return null;
        }

        const time = filterData;

        if (filterName === 'ORDate') {
          if (operatorSymbol === 'eq') {
            return toJSON({
              key: '$and',
              value: [
                toJSON({
                  key: '$or',
                  value: [
                    toJSON({
                      key: fieldName,
                      value: time,
                    }),
                  ],
                }),
              ],
            });
          }

          return toJSON({
            key: '$and',
            value: [
              toJSON({
                key: '$or',
                value: [
                  toJSON({
                    key: fieldName,
                    value: buildDateTimeFilter({
                      operator: operatorSymbol,
                      filterName,
                      fieldName,
                      time,
                    })[fieldName],
                  }),
                ],
              }),
            ],
          });
        }

        return toJSON({
          key: '$or',
          value: buildDateTimeListFilter({
            operator: operatorSymbol,
            filterName,
            fieldName,
            times: [
              time,
            ],
          }),
        });

      case 'String':
        if (['', '--'].includes(filterData)) {
          if (operatorSymbol === 'eq') {
            return toJSON({
              key: fieldName,
              value: null,
            });
          } else if (operatorSymbol !== '') {
            return toJSON({
              key: fieldName,
              value: toJSON({
                key: `${operatorSymbol}`,
                value: null,
              }),
            });
          }
        } else {
          if (operatorSymbol === 'eq') {
            if (filterName === 'OR') {
              return toJSON({
                key: '$or',
                value: [
                  toJSON({
                    key: fieldName,
                    value: filterData,
                  }),
                ],
              });
            }

            return toJSON({
              key: fieldName,
              value: filterData,
            });
          } else if (operatorSymbol === 'regex') {
            if (_isArray(filterData)) {
              return toJSON({
                key: '$or',
                value: buildRegexesFilter({
                  fieldName,
                  regexes: filterData,
                }),
              });
            }

            return toJSON({
              key: fieldName,
              value: {
                $regex: new RegExp(escapeStringRegexp(filterData), 'i'),
              },
            });
          } else if (operatorSymbol !== '') {
            if (filterName === 'OR') {
              return toJSON({
                key: '$or',
                value: [
                  toJSON({
                    key: fieldName,
                    value: toJSON({
                      key: `${operatorSymbol}`,
                      value: filterData,
                    }),
                  }),
                ],
              });
            }

            return toJSON({
              key: fieldName,
              value: toJSON({
                key: `${operatorSymbol}`,
                value: filterData,
              }),
            });
          }
        }
        return null;

      case 'Int64':
      case 'Int32':
      case 'Double':
        if (operatorSymbol === 'eq') {
          return toJSON({
            key: fieldName,
            value: parseFloat(filterData),
          });
        } else if (operatorSymbol !== '') {
          return toJSON({
            key: fieldName,
            value: toJSON({
              key: `${operatorSymbol}`,
              value: parseFloat(filterData),
            }),
          });
        }
        return null;

      default:
        return null;
    }
  }

  const lstData = [];
  const lstDataDate = [];
  const lstBool = [];
  const lstDate = [];
  let lstString = [];
  const lstInt64 = [];
  const lstInt32 = [];
  const lstDouble = [];

  lstFilterData.forEach(filter => {
    lstData.push(filter.filterData);
    lstDataDate.push(filter.filterDateTimeData);
  });

  switch (filterDataType) {
    case 'Boolean':
      lstData.forEach(item => {
        lstBool.push(toBoolean(item));
      });
      break;

    case 'DateTime':
      lstDataDate.forEach(item => {
        lstDate.push(item);
      });
      break;

    case 'String':
      lstString = lstData;
      break;

    case 'Int64':
      lstData.forEach(item => {
        lstInt64.push(Number(item));
      });
      break;

    case 'Int32':
      lstData.forEach(item => {
        lstInt32.push(parseInt(item)); // eslint-disable-line
      });
      break;

    case 'Double':
      lstData.forEach(item => {
        lstDouble.push(parseFloat(item));
      });
      break;

    default:
      return null;
  }

  switch (filterDataType) {
    case 'Boolean':
      return toJSON({
        key: fieldName,
        value: {
          $in: lstBool,
        },
      });

    case 'DateTime':
      return toJSON({
        key: '$or',
        value: buildDateTimeListFilter({
          filterName,
          fieldName,
          times: lstDate,
        }),
      });

    case 'String':
      if (operatorSymbol === 'regex') {
        return toJSON({
          key: '$or',
          value: buildRegexesFilter({
            fieldName,
            regexes: lstString,
          }),
        });
      }
      if (lstString.includes('--')) {
        lstString.push(null);

        return toJSON({
          key: fieldName,
          value: {
            $in: lstString,
          },
        });
      }
      return toJSON({
        key: fieldName,
        value: {
          $in: lstString,
        },
      });

    case 'Int64':
      return toJSON({
        key: fieldName,
        value: {
          $in: lstInt64,
        },
      });

    case 'Int32':
      return toJSON({
        key: fieldName,
        value: {
          $in: lstInt32,
        },
      });

    case 'Double':
      return toJSON({
        key: fieldName,
        value: {
          $in: lstDouble,
        },
      });
    default:
      return null;
  }
}

function buildStartEndDateFilter(filterDataObj) {
  const filterData = {};
  let startDate = null;
  let endDate = null;
  let fieldName = '';

  const { filters } = filterDataObj;

  if (_isEmpty(filters)) {
    return null;
  }

  filters.forEach(filter => {
    if (_get(filter, 'filterName') === 'StartDate') {
      fieldName = filter.fieldName;

      if (!_isEmpty(filter.lstFilterData)) {
        startDate = new Date(filter.lstFilterData[0].filterDateTimeData);
        startDate.setUTCSeconds(0);
      }
    } else if (_get(filter, 'filterName') === 'EndDate') {
      if (!_isEmpty(filter.lstFilterData)) {
        endDate = new Date(filter.lstFilterData[0].filterDateTimeData);
        endDate.setUTCSeconds(0);
      }
    }
  });

  if (startDate) {
    filterData.$gte = startDate;
  }

  if (endDate) {
    filterData.$lte = endDate;
  }

  if (!startDate || !endDate) {
    return null;
  }

  return toJSON({
    key: fieldName,
    value: filterData,
  });
}

function buildSearchField({ fieldsFreeText = [], freeText = '' }) {
  const lstSearch = [];

  freeText = freeText.trim();

  if (!freeText || _isEmpty(fieldsFreeText)) {
    return {};
  }

  fieldsFreeText.forEach(item => {
    if (item && item.trim()) {
      lstSearch.push(toJSON({
        key: item,
        value: {
          $regex: new RegExp(escapeStringRegexp(freeText), 'i'),
        },
      }));
    }
  });

  if (_isEmpty(lstSearch)) {
    return {};
  }

  return toJSON({
    key: '$or',
    value: lstSearch,
  });
}

function buildSearchFieldMulti({ fieldsMultiFreeText = [], freeText = '' }) {
  const lstSearch = [];

  freeText = freeText.trim();

  if (!freeText || _isEmpty(fieldsMultiFreeText)) {
    return {};
  }

  fieldsMultiFreeText.forEach(item => {
    if (item && item.trim()) {
      const queries = freeText.split(',');
      const conditions = [];

      queries.forEach(query => {
        conditions.push(new RegExp(escapeStringRegexp(query.trim()), 'i'));
      });

      lstSearch.push(toJSON({
        key: item,
        value: {
          $in: conditions,
        },
      }));
    }
  });

  if (_isEmpty(lstSearch)) {
    return {};
  }

  return toJSON({
    key: '$or',
    value: lstSearch,
  });
}

function buildFilter(filterDataObj) {
  let lstMatch = {};
  const startEndDateFilter = buildStartEndDateFilter(filterDataObj);
  const searchFilter = buildSearchField({
    fieldsFreeText: _get(filterDataObj, 'fieldsFreeText'),
    freeText: _get(filterDataObj, 'freeText'),
  });
  const multiSearchFilter = buildSearchFieldMulti({
    fieldsMultiFreeText: _get(filterDataObj, 'fieldsMultiFreeText'),
    freeText: _get(filterDataObj, 'freeText'),
  });

  if (startEndDateFilter) {
    lstMatch = merge(lstMatch, startEndDateFilter);
  }

  if (!_isEmpty(filterDataObj.filters)) {
    filterDataObj.filters.forEach(item => {
      if (!_isEmpty(_get(item, 'lstFilterData', []))) {
        const filter = buildFilterField(item);

        if (filter) {
          if (lstMatch.$or && filter.$or) {
            filter.$or.forEach(or => {
              lstMatch.$or.push(or);
            });
          } else if (lstMatch.$and && filter.$and) {
            filter.$and.forEach(and => {
              if (and.$or) {
                lstMatch.$and.forEach(filterAnd => {
                  if (filterAnd.$or) {
                    filterAnd.$or = filterAnd.$or.concat(and.$or);
                  }
                });
              } else {
                lstMatch.$and.push(and);
              }
            });
          } else {
            lstMatch = merge(lstMatch, filter);
          }
        }
      }
    });
  }

  if (_get(searchFilter, '$or') && lstMatch.$or) {
    searchFilter.$or.forEach(item => {
      lstMatch.$or.push(item);
    });
  }

  if (searchFilter && !searchFilter.$or) {
    lstMatch = merge(lstMatch, searchFilter);
  }

  if (_get(multiSearchFilter, '$or') && lstMatch.$or) {
    multiSearchFilter.$or.forEach(item => {
      lstMatch.$or.push(item);
    });
  }

  if (_get(multiSearchFilter, '$and') && lstMatch.$and) {
    multiSearchFilter.$and.forEach(item => {
      lstMatch.$and.push(item);
    });
  }

  if (multiSearchFilter && !multiSearchFilter.$or) {
    lstMatch = merge(lstMatch, multiSearchFilter);
  }

  return lstMatch;
}

function buildSortFieldInt({ fieldName, sortType = QUERY_SORT_TYPE.ASC }) {
  return toJSON({
    key: fieldName,
    value: sortType,
  });
}

function buildSortField({ sortName, sortTypeName }) {
  let sortType = QUERY_SORT_TYPE.ASC;
  let sortFields = {};

  if (sortTypeName === QUERY_SORT_TYPE_NAME.DESC) {
    sortType = QUERY_SORT_TYPE.DESC;
  }

  switch (sortName) {
    case 'Year':
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Year',
        sortType,
      }));
      break;

    case 'Month':
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Year',
        sortType,
      }));
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Month',
        sortType,
      }));
      break;

    case 'Day':
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Year',
        sortType,
      }));
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Month',
        sortType,
      }));
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Day',
        sortType,
      }));
      break;

    case 'Hour':
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Year',
        sortType,
      }));
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Month',
        sortType,
      }));
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Day',
        sortType,
      }));
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: 'Hour',
        sortType,
      }));
      break;

    default:
      sortFields = merge(sortFields, buildSortFieldInt({
        fieldName: sortName,
        sortType,
      }));
  }

  return sortFields;
}

/*
  filterDataObj: {
    filters: [
      {
        lstFilterData: [
          {
            filterDateTimeData: new Date(),
          },
        ],
        operatorSymbol: 'eq',
        filterDataType: 'DateTime',
        fieldName: 'created_at',
        filterName: 'StartDate',
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'DateTime',
        fieldName: 'created_at',
        filterName: 'EndDate',
        lstFilterData: [
          {
            filterDateTimeData: new Date(2018, 7, 12),
          },
        ],
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'DateTime',
        fieldName: 'cancelled_at',
        filterName: 'Day',
        lstFilterData: [
          {
            filterDateTimeData: new Date(2018, 7, 22),
          },
        ],
      },
      {
        operatorSymbol: 'in',
        filterDataType: 'String',
        fieldName: 'pos_district_code',
        filterName: 'PosDistrictCode',
        lstFilterData: [
          {
            filterData: ['Q1', 'Q2', 'Q3'],
          },
        ],
      },
      {
        operatorSymbol: 'eq',
        filterDataType: 'String',
        fieldName: 'code',
        filterName: 'Code',
        lstFilterData: [
          {
            filterData: 'test_code',
          },
        ],
      },
    ],
    page: 2,
    limit: 50,
    sortType: 'desc',
    fieldSort: 'created_at',
    freeText: 'something free text',
    fieldsFreeText: ['email', 'address'],
    fieldsMultiFreeText: ['order_number', 'sku'],
    isExport: false,
    filterName: 'Filter Name',
    modelName: 'TestModel',
    sumOnly: false,
    populateField: {
      _id: 1,
      order_number: 1,
      customer: 1,
    },
  }
 */
export const executeQuery = async ({
  model,
  modelName, // eslint-disable-line no-unused-vars
  sumField,
  filterDataObj,
  queryType = QUERY_TYPE.DATA_WITH_COUNT,
  dataType = QUERY_DATA_TYPE.LEAN,
}) => {
  const emptyData = {
    records: [],
    totalRecord: 0,
    sum: 0,
  };

  try {
    if (!model) {
      return Promise.resolve();
    }

    filterDataObj.page = Number(filterDataObj.page) || 1;
    filterDataObj.limit = Number(filterDataObj.limit) || 20;

    const skip = (filterDataObj.page * filterDataObj.limit) - filterDataObj.limit;
    const criteria = buildFilter(filterDataObj);
    const populateField = filterDataObj.isExport ? {} : filterDataObj.populateField;
    let sort = {};

    if (_get(filterDataObj, 'fieldSort')) {
      const sortFields = filterDataObj.fieldSort.split(',');
      const sortTypes = filterDataObj.sortType.split(',');

      for (let i = 0; i < sortFields.length; i++) {
        sort = _merge(
          sort,
          buildSortField({
            sortName: sortFields[i],
            sortTypeName: sortTypes[i],
          })
        );
      }
    }

    const countModel = async () => {
      try {
        const count = await model.count(criteria);

        return Promise.resolve({
          records: [],
          totalRecord: count || 0,
        });
      } catch (e) {
        log.error(e);

        return Promise.resolve(emptyData);
      }
    };

    const sumModel = async () => {
      try {
        const cursor = await model
          .aggregate()
          .allowDiskUse(true)
          .match(criteria)
          .group({
            _id: null,
            sum: { $sum: `${sumField}` },
            count: { $sum: 1 },
          })
          .project({ _id: 0, sum: 1, count: 1 })
          .cursor();

        const dataSum = [];

        await cursor.eachAsync(async (doc) => {
          dataSum.push(doc);

          await Promise.resolve();
        });

        if (!_isEmpty(dataSum)) {
          return Promise.resolve({
            records: [],
            totalRecord: dataSum[0].count,
            sum: dataSum[0].sum,
          });
        }

        return Promise.resolve(emptyData);
      } catch (e) {
        log.error(e);

        return Promise.resolve(emptyData);
      }
    };

    const queryModel = async (count = 0) => {
      try {
        const cursor = model
          .find(criteria, populateField)
          .lean(dataType)
          .skip(skip)
          .limit(filterDataObj.limit)
          .sort(sort)
          .cursor();

        const records = [];

        await cursor.eachAsync(async (doc) => {
          records.push(doc);

          await Promise.resolve();
        });

        return Promise.resolve({
          records: records || [],
          totalRecord: count,
        });
      } catch (e) {
        log.error(e);

        return Promise.resolve(emptyData);
      }
    };

    if (queryType === QUERY_TYPE.COUNT_ONLY) {
      return await countModel();
    }

    if (queryType === QUERY_TYPE.SUM_ONLY) {
      return await sumModel();
    }

    if (queryType === QUERY_TYPE.FULL) {
      const sum = await sumModel();

      if (!sum.totalRecord) {
        return Promise.resolve(emptyData);
      }

      return await queryModel(sum.totalRecord);
    }

    if (queryType === QUERY_TYPE.DATA_WITH_COUNT) {
      const result = await countModel();

      if (!result) {
        return Promise.resolve(emptyData);
      }

      return await queryModel(result.totalRecord);
    }

    if (queryType === QUERY_TYPE.DATA_ONLY) {
      return await queryModel();
    }
  } catch (e) {
    log.error(e);

    return Promise.resolve(emptyData);
  }
};
