// Import Third-party Libs
import mongoose from 'mongoose';
import hintPlugin from 'mongoose-hint';

const Schema = mongoose.Schema;

const couponSchema = new Schema({
  shop: { type: String, required: true },
  applies_once: Boolean,
  applies_to_id: Number,
  code: String,
  ends_at: String,
  id: Number,
  minimum_order_amount: Number,
  starts_at: String,
  status: String,
  usage_limit: Number,
  value: Number,
  discount_type: String,
  times_used: Number,
  is_promotion: Boolean,
  applies_to_resource: String,
  variants: [],
  location_ids: [],
  create_user: Number,
  first_name: String,
  last_name: String,
  applies_customer_group_id: Schema.Types.Mixed,
  created_at: String,
  updated_at: String,
  promotion_apply_type: Number,
  applies_to_quantity: Number,
  order_over: Schema.Types.Mixed,
  is_new_coupon: Boolean,
  channel: Schema.Types.Mixed,
}, {
  timestamps: {},
});

const SHOP_INDEX = { shop: 1 };
const CODE_INDEX = { code: 1 };
const ID_INDEX = { id: 1 };
const UPDATED_AT_INDEX = { updatedAt: -1 };
const SHOP_ID_INDEX = { shop: 1, id: 1 };

couponSchema.index(SHOP_INDEX);
couponSchema.index(CODE_INDEX);
couponSchema.index(ID_INDEX);
couponSchema.index(UPDATED_AT_INDEX);
couponSchema.index(SHOP_ID_INDEX);

couponSchema.plugin(hintPlugin.find, [
  SHOP_ID_INDEX,
  UPDATED_AT_INDEX,
  SHOP_INDEX,
  ID_INDEX,
  CODE_INDEX,
]);

module.exports = mongoose.model('SellerCoupon', couponSchema);
