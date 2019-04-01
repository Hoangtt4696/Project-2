import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const settingSchema = new Schema({
  shop: { type: String, required: true, unique: true },
  settings: {
    type: Schema.Types.Mixed,
    couponOrder: {
      active: {
        type: Boolean,
        default: false,
      },
      discountType: {
        type: String,
        enum: ['fixed_amount', 'percentage'],
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      applyTo: {
        type: String,
        enum: ['customer', 'order'],
      },
      applyOrderAmount: {
        type: Number,
        default: 0,
      },
      orderAmount: {
        type: Number,
        default: 0,
      },
      expDate: {
        type: Number,
        default: 0,
      },
      useWithPromotion: {
        type: Boolean,
        default: false,
      },
    },
    couponCustomer: {
      active: {
        type: Boolean,
        default: false,
      },
      discountType: {
        type: String,
        enum: ['fixed_amount', 'percentage'],
        default: 'fixed_amount',
      },
      discountAmount: {
        type: Number,
        default: 0,
      },
      applyTo: {
        type: String,
        enum: ['customer', 'order'],
      },
      orderAmount: {
        type: Number,
        default: 0,
      },
      expDate: {
        type: Number,
        default: 0,
      },
      useWithPromotion: {
        type: Boolean,
        default: false,
      },
    },
    emailCustomer: {
      subject: {
        type: String,
        default: 'Quà tặng dành riêng cho các thành viên mới !',
      },
      fromEmail: {
        type: String,
        default: 'Email_shop@gmail.com',
      },
      titleEmail: {
        type: String,
        default: 'GỬI TẶNG BẠN MÃ ƯU ĐÃI',
      },
      content: {
        type: String,
        default: '<div style="border: 1px solid #f5f5f5;"><div>' +
        '<div style="padding: 1.3em; font-weight: bold; font-size: 1.2em; text-transform: uppercase; text-align: center; color: #fff; background-color: #007AB7;">' +
        'GỬI TẶNG BẠN M&Atilde; ƯU Đ&Atilde;I</div><div style="padding: 2em;"><p style="white-space: pre-line; line-height: 1.4rem;">' +
        'Cảm ơn bạn đã mua hàng tại {{shop_name}},</p><p style="white-space: pre-line; line-height: 1.4rem;">' +
        'Mong rằng bạn có trải nghiệm tốt khi mua hàng tại {{shop_name}}. {{shop_name}} xin gửi tặng bạn mã giảm giá cho lần mua hàng kế tiếp.</p>' +
        '<div style="padding: 2em; text-align: center; background-color: #cafffa40;">' +
        '<p style="font-weight: bold; font-size: 1.3em; text-align: center;">Khuyến mãi {{discount_amount}} cho đơn hàng kế tiếp</p>' +
        '<p>Nhập mã khuyến mãi này cho đơn hàng kế tiếp để được giảm giá {{discount_amount}} giá trị đơn hàng.</p>' +
        '<div style="background-color: #F70026; padding: 0.3em;">' +
        '<div style="font-size: 1.5em; border: 2px dashed navajowhite; color: white; font-weight: bold; padding: 0.7em; text-align: center;">' +
        '{{coupon_code}}</div></div></div></div></div>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mã giảm giá</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Chỉ được áp dụng một lần duy nhất.</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Áp dụng cho {{apply_to}} {{apply_order_amount}}.</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Có hiệu lực {{exp_date}}.</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mọi thắc mắc và góp ý, xin quý khách vui lòng liên hệ với {{shop_name}} thông qua:</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Email: {{email_shop}}&nbsp;</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">{{shop_name}} trân trọng cảm ơn và rất hân hạnh được phục vụ quý khách!</p></div>',
      },
    },
    emailOrder: {
      subject: {
        type: String,
        default: 'Quà tặng dành riêng cho các đơn hàng hoàn tất !',
      },
      fromEmail: {
        type: String,
        default: 'Email_shop@gmail.com',
      },
      titleEmail: {
        type: String,
        default: 'GỬI TẶNG BẠN MÃ ƯU ĐÃI',
      },
      content: {
        type: String,
        default: '<div style="border: 1px solid #f5f5f5;"><div>' +
        '<div style="padding: 1.3em; font-weight: bold; font-size: 1.2em; text-transform: uppercase; text-align: center; color: #fff; background-color: #007AB7;">' +
        'GỬI TẶNG BẠN M&Atilde; ƯU Đ&Atilde;I</div><div style="padding: 2em;"><p style="white-space: pre-line; line-height: 1.4rem;">' +
        'Cảm ơn bạn đã mua hàng tại {{shop_name}},</p><p style="white-space: pre-line; line-height: 1.4rem;">' +
        'Mong rằng bạn có trải nghiệm tốt khi mua hàng tại {{shop_name}}. {{shop_name}} xin gửi tặng bạn mã giảm giá cho lần mua hàng kế tiếp.</p>' +
        '<div style="padding: 2em; text-align: center; background-color: #cafffa40;">' +
        '<p style="font-weight: bold; font-size: 1.3em; text-align: center;">Khuyến mãi {{discount_amount}} cho đơn hàng kế tiếp</p>' +
        '<p>Nhập mã khuyến mãi này cho đơn hàng kế tiếp để được giảm giá {{discount_amount}} giá trị đơn hàng.</p>' +
        '<div style="background-color: #F70026; padding: 0.3em;">' +
        '<div style="font-size: 1.5em; border: 2px dashed navajowhite; color: white; font-weight: bold; padding: 0.7em; text-align: center;">' +
        '{{coupon_code}}</div></div></div></div></div>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mã giảm giá</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Chỉ được áp dụng một lần duy nhất.</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Áp dụng cho {{apply_to}} {{apply_order_amount}}.</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Có hiệu lực {{exp_date}}.</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mọi thắc mắc và góp ý, xin quý khách vui lòng liên hệ với {{shop_name}} thông qua:</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Email: {{email_shop}}&nbsp;</p>' +
        '<p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">{{shop_name}} trân trọng cảm ơn và rất hân hạnh được phục vụ quý khách!</p></div>',
      },
    },
  },
}, {
  timestamps: {},
});

settingSchema.index({ shop: 1 });

export default mongoose.model('Setting', settingSchema);
