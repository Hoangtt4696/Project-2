// Import Third-party Libs
import sanitizeHtml from 'sanitize-html';

// Import Helpers
import { formatSuccess } from '../util/helpers/data-response.helper';

// Import Model Helpers
import { query } from '../models/helpers/coupon.model.helper';

export const fetch = async (req, res) => {
  const page = req.query.page ? Number(sanitizeHtml(req.query.page)) : 1;
  const limit = req.query.limit ? Number(sanitizeHtml(req.query.limit)) : 20;
  const { shop, customerId } = req.body;

  const result = await query({
    shop,
    filterDataObj: {
      filters: [
        {
          operatorSymbol: '$gte',
          filterDataType: 'DateTime',
          fieldName: 'endDate',
          filterName: 'ORDate',
          lstFilterData: [
            {
              filterDateTimeData: new Date().toISOString(),
            },
          ],
        },
        {
          operatorSymbol: 'eq',
          filterDataType: 'DateTime',
          fieldName: 'endDate',
          filterName: 'ORDate',
          lstFilterData: [
            {
              filterDateTimeData: null,
            },
          ],
        },
        {
          operatorSymbol: 'eq',
          filterDataType: 'String',
          fieldName: 'customerId',
          filterName: 'OR',
          lstFilterData: [
            {
              filterData: customerId,
            },
          ],
        },
        {
          operatorSymbol: 'eq',
          filterDataType: 'String',
          fieldName: 'status',
          filterName: 'status',
          lstFilterData: [
            {
              filterData: 'new',
            },
          ],
        },
        {
          operatorSymbol: 'eq',
          filterDataType: 'String',
          fieldName: 'discount.status',
          filterName: 'discountStatus',
          lstFilterData: [
            {
              filterData: 'enabled',
            },
          ],
        },
      ],
      page,
      limit,
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
    },
  });

  res.json(formatSuccess({}, {
    ...result,
  }));
};
