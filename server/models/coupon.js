// Import Third-party Libs
import mongoose from 'mongoose';
import hintPlugin from 'mongoose-hint';

const Schema = mongoose.Schema;

const couponSchema = new Schema({
  shop: { type: String, required: true },
  couponCode: { type: String, required: true, unique: true },
  orderID: String,
  orderNumber: String,
  status: String,
  orderCreatedAt: Date,
  customerEmail: String,
  customerId: Number,
  registerDate: Date,
  startDate: Date,
  endDate: Date,
  refOrder: {
    customerEmail: String,
    customerId: Number,
    orderNumber: String,
    createdAt: Date,
    orderID: String,
  },
  discount: {
    applies_once: Boolean,
    applies_to_id: Number,
    code: String,
    ends_at: Date,
    id: Number,
    minimum_order_amount: Number,
    starts_at: Date,
    status: String,
    usage_limit: Number,
    value: Number,
    discount_type: String,
    times_used: Number,
    is_promotion: Boolean,
    applies_to_resource: String,
    variants: [],
    create_user: Number,
    first_name: String,
    last_name: String,
    set_time_active: Boolean,
  },
}, {
  timestamps: {},
});

const SHOP_INDEX = { shop: 1 };
const ORDER_ID_INDEX = { orderID: 1 };
const ORDER_ID_REF_INDEX = { 'refOrder.orderID': 1 };
const ORDER_ID_COMBINE_INDEX = { orderID: 1, 'refOrder.orderID': 1 };
const SHOP_ORDER_ID_COMBINE_INDEX = { shop: 1, orderID: 1, 'refOrder.orderID': 1 };
const CREATED_AT_INDEX = { createdAt: 1 };
const CUSTOMER_EMAIL_INDEX = { customerEmail: 1 };
const CUSTOMER_ID_INDEX = { customerId: 1 };
const END_DATE_INDEX = { endDate: 1 };
const STATUS_INDEX = { status: 1 };
const SHOP_END_DATE_STATUS_INDEX = { shop: 1, endDate: 1, status: 1 };
const DISCOUNT_BY_SHOP_INDEX = { 'discount.id': 1, 'discount.code': 1, shop: 1 };

couponSchema.index(SHOP_INDEX);
couponSchema.index(ORDER_ID_INDEX);
couponSchema.index(ORDER_ID_REF_INDEX);
couponSchema.index(ORDER_ID_COMBINE_INDEX);
couponSchema.index(SHOP_ORDER_ID_COMBINE_INDEX);
couponSchema.index(CREATED_AT_INDEX);
couponSchema.index(CUSTOMER_EMAIL_INDEX);
couponSchema.index(CUSTOMER_ID_INDEX);
couponSchema.index(END_DATE_INDEX);
couponSchema.index(STATUS_INDEX);
couponSchema.index(SHOP_END_DATE_STATUS_INDEX);
couponSchema.index(DISCOUNT_BY_SHOP_INDEX);

couponSchema.plugin(hintPlugin.find, [
  SHOP_END_DATE_STATUS_INDEX,
  SHOP_ORDER_ID_COMBINE_INDEX,
  DISCOUNT_BY_SHOP_INDEX,
  SHOP_INDEX,
  ORDER_ID_COMBINE_INDEX,
  ORDER_ID_INDEX,
  ORDER_ID_REF_INDEX,
  CUSTOMER_ID_INDEX,
  CUSTOMER_EMAIL_INDEX,
  END_DATE_INDEX,
  STATUS_INDEX,
  CREATED_AT_INDEX,
]);

module.exports = mongoose.model('Coupon', couponSchema);
