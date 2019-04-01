export default {
  headingCustomer: 'Email gửi khuyến mãi Đăng ký thành viên',
  subHeadingCustomer: 'Email này sẽ được gửi cho khách hàng khi đăng ký thành viên trên website của bạn. Để khách hàng nhận được mã ưu đãi tương ứng.',
  headingOrder: 'Email gửi khuyến mãi Hoàn tất đơn hàng',
  subHeadingOrder: 'Email này sẽ được gửi cho tất cả khách hàng hoàn tất đơn hàng. Để khách hàng nhận được mã ưu đãi tương ứng.',
  noteField: 'Lưu ý: Bạn không nên chỉnh sửa những biến giá trị trong nội dung email. Để đảm bảo hệ thống lấy đúng giá trị.',
  actionNoteField: 'Xem trước thông tin chỉnh sửa trước khi bấm "Áp dụng".',
  titleVariableDocument: 'Nội dung biến trong email: ',
  linkVariable: 'Xem thêm tài liệu về nội dung biến trong email',
  emailSection: {
    info: {
      title: 'Thông tin gửi Email',
      emailFromField: 'Email gửi tin',
      emailFromPlaceholder: 'Nhập email gửi tin ...',
      fromNameField: 'Tên người gửi',
      fromNamePlaceholder: 'Nhập tên người gửi ...',
      fromName: 'App Thank You Coupon',
      emailFrom: 'Email_shop@gmail.com',
      emailSubjectField: 'Chủ đề Email',
      emailSubjectPlaceholder: 'Nhập chủ đề email ...',
      emailSubjectCustomer: 'Quà tặng dành riêng cho các thành viên mới !',
      emailSubjectOrder: 'Quà tặng dành riêng cho các đơn hàng hoàn tất !',
    },
    content: {
      title: 'Nội dung Email',
      titleEmailField: 'Tiêu đề Email',
      titleEmailPlaceholder: 'Nhập tiêu đề email ...',
      titleEmail: 'Gửi tặng bạn mã ưu đãi',
      contentField: 'Nội dung Email',
      contentPlaceholder: 'Nhập nội dung email ...',
      content: '<div style="border: 1px solid #f5f5f5;">\n' +
        '   <div>\n' +
        '      <div style="padding: 1.3em; font-weight: bold; font-size: 1.2em; text-transform: uppercase; text-align: center; color: #fff; background-color: #007AB7;">GỬI TẶNG BẠN MÃ ƯU ĐÃI</div>\n' +
        '      <div style="padding: 2em;">\n' +
        '         <p style="white-space: pre-line; line-height: 1.4rem;">Cảm ơn bạn đã mua hàng tại {{shop_name}},</p>\n' +
        '         <p style="white-space: pre-line; line-height: 1.4rem;">Mong rằng bạn có trải nghiệm tốt khi mua hàng tại {{shop_name}}. {{shop_name}} xin gửi tặng bạn mã giảm giá cho lần mua hàng kế tiếp.</p>\n' +
        '         <div style="padding: 2em; text-align: center; background-color: #cafffa40;">\n' +
        '            <p style="font-weight: bold; font-size: 1.3em; text-align: center;">Khuyến mãi {{discount_amount}} cho đơn hàng kế tiếp</p>\n' +
        '            <p>Nhập mã khuyến mãi này cho đơn hàng kế tiếp để được giảm giá {{discount_amount}} giá trị đơn hàng.</p>\n' +
        '            <div style="background-color: #F70026; padding: 0.3em;">\n' +
        '               <div style="font-size: 1.5em; border: 2px dashed navajowhite; color: white; font-weight: bold; padding: 0.7em; text-align: center;">{{coupon_code}}</div>\n' +
        '            </div>\n' +
        '         </div>\n' +
        '      </div>\n' +
        '   </div>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mã giảm giá</p>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Chỉ được áp dụng một lần duy nhất.</p>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Áp dụng cho {{apply_to}} {{apply_order_amount}}.</p>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">- Có hiệu lực {{exp_date}}.</p>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Mọi thắc mắc và góp ý, xin quý khách vui lòng liên hệ với {{shop_name}} thông qua:</p>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">Email: {{email_shop}}&nbsp;</p>\n' +
        '   <p style="white-space: pre-wrap; line-height: 1.4rem; padding-left: 2rem;">{{shop_name}} trân trọng cảm ơn và rất hân hạnh được phục vụ quý khách!</p>\n' +
        '</div>',
    },
  },
  variable: {
    shopName: 'Tên cửa hàng',
    discountAmount: 'Giá trị mã giảm giá',
    applyTo: 'Loại giảm giá',
    applyOrderAmount: 'Giá trị đơn hàng',
    expDate: 'Thời gian hiệu lực của mã giảm giá',
    emailShop: 'Email cửa hàng',
    couponCode: 'Mã khuyến mãi',
  },
  button: {
    preview: 'Xem trước',
    save: 'Áp dụng',
    cancel: 'Hủy chỉnh sửa',
    edit: 'Chỉnh sửa',
  },
};
