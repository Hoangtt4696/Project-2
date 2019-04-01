export default {
  headingCustomer: 'Khuyến mãi khi đăng ký thành viên',
  subHeadingCustomer: 'Áp dụng khi khách hàng đăng ký tài khoản trên website của bạn.',
  headingOrder: 'Khuyến mãi khi đơn hàng hoàn tất',
  subHeadingOrder: 'Áp dụng cho tất cả khách hàng mua hàng và khi đơn hàng được xác nhân là hoàn tất (Đã thanh toán và đã giao hàng) thỏa các điều kiện áp dụng thì sẽ được nhân một mã khuyến mãi.',
  section: {
    couponSetting: {
      heading: 'Thiết lập Mã khuyến mãi',
      prefixLabel: 'Tiếp đầu ngữ',
      prefixPlaceholder: 'Tối đa 4 ký tự',
      preToolTip1: 'Là 4 ký tự đầu tiên trong chuỗi ký tự của Mã khuyến mãi. Hệ thống sẽ tạo ngẫu nhiên thêm 8 ký tự nữa để tạo thành Mã khuyến mãi.',
      preToolTip2: 'Bạn có thể không tạo tiếp đầu ngữ, hệ thống sẽ ngẫu nhiên tạo một chuỗi 12 ký tự cho Mã khuyến mãi.',
      discountTypeLabel: 'Chọn loại khuyến mãi',
      optionDiscountType: {
        fixed_amount: 'Tiền mặt (VND)',
        percentage: 'Phần trăm (%)',
      },
      discountAmountField: 'Giảm',
      expDateLabel: 'Thời gian chạy khuyến mãi',
      expDateField: 'Đến',
      expDateCheckbox: 'Không hết hạn chạy khuyến mãi',
      btnNow: 'Hôm nay',
    },
    conditionApply: {
      heading: 'Điều kiện sử dụng Mã khuyến mãi',
      useWithPromotionField: 'Cho phép sử dụng chung với chương trình khuyến mãi',
      applyToLabel: 'Áp dụng cho',
      optionApplyTo: {
        customer: 'Khách nhận Mã khuyến mãi',
        order: 'Giá trị đơn hàng',
      },
      applyToCustomerNote: 'Chỉ áp dụng với khách được nhận mã khuyến mãi',
      applyToOrderLabel: 'Từ',
      expDateLabel: 'Thời gian Mã khuyến mãi có hiệu lực',
      optionExpDate: {
        default: 'Bằng thời gian chạy khuyến mãi',
        custom: 'Chọn số ngày có hiệu lực',
      },
    },
    conditionCreate: {
      heading: 'Điều kiện tạo Mã khuyến mãi',
      conditionOrderAmountLabel: 'Giá trị đơn hàng từ',
    },
  },
  button: {
    active: 'Áp dụng',
    inActive: 'Ngừng khuyến mãi',
  },
  errorEmpty: 'Giá trị không hợp lệ',
  errorNotNumber: 'Vui lòng nhập số',
  errorOverSize: 'Giá trị giảm % phải lớn hơn 0 và nhỏ hơn 100',
};
