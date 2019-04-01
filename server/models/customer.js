import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  _id: { type: Number, required: true, index: { unique: true } },
  shop: { type: String, required: true },
  couponSent: { type: Boolean, default: false },
  accepts_marketing: { type: Boolean, default: false },
  addresses: [],
  default_address: {
    address1: { type: String, default: null },
    address2: { type: String, default: null },
    city: { type: String, default: null },
    company: { type: String, default: null },
    country: { type: String, default: 'Vietnam' },
    first_name: { type: String, default: null },
    id: { type: Number },
    last_name: { type: String, default: null },
    phone: { type: String, default: null },
    province: { type: String, default: null },
    zip: { type: String, default: null },
    name: { type: String, default: null },
    province_code: { type: String, default: null },
    country_code: { type: String, default: 'vn' },
    default: { type: Boolean, default: true },
    district: { type: String, default: null },
    district_code: { type: String, default: null },
    ward: { type: String, default: null },
    ward_code: { type: String, default: null },
  },
  phone: { type: String, default: null },
  email: { type: String, default: null },
  first_name: { type: String, default: null },
  multipass_identifier: { type: String, default: null },
  last_name: { type: String, default: null },
  last_order_id: { type: Number, default: 0 },
  last_order_name: { type: String, default: null },
  note: { type: String, default: null },
  orders_count: { type: Number, default: 0 },
  state: { type: String, default: null },
  tags: { type: String, default: null },
  total_spent: { type: Number, default: 0 },
  updated_at: { type: Date, default: null },
  verified_email: { type: Boolean, default: false },
  group_name: { type: String, default: null },
}, {
  timestamps: {},
});

customerSchema.index({ shop: 1 });
customerSchema.index({ email: 1 });

export default mongoose.model('Customer', customerSchema);
