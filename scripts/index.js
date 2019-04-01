const scriptUpdateCouponCustomerId = require('./01-update_coupon_customer_id.script');

const scriptNumber = process.argv[2];

switch (scriptNumber) {
  case '01':
    scriptUpdateCouponCustomerId.start();
    break;
}
