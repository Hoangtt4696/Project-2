const cultures = [
  {
    code: 'vi-VN',
    thousands: ',',
    decimal: '.',
    numberdecimal: 0,
    money_format: '{{amount}}',
  },
  {
    code: 'en-US',
    thousands: ',',
    decimal: '.',
    numberdecimal: 2,
    money_format: '{{amount}}',
  },
];

const getCulture = (code = '') => {
  const foundCultures = cultures.filter(culture => culture.code === code);

  return foundCultures.length ? foundCultures[0] : cultures[0];
};

const haravanFormat = getCulture();
const moneyFormat = '{{amount}}';

export const floatToString = ({ numeric, decimals }) => {
  const amount = numeric.toFixed(decimals).toString();

  amount.replace('.', haravanFormat.decimal);

  if (amount.match(`^[\.${haravanFormat.decimal}]\d+`)) {
    return `0${amount}`;
  }

  return amount;
};

export const formatMoney = ({ number, format }) => {
  let value = '';
  const patt = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = (format || moneyFormat);
  const addCommas = (moneyString) => {
    return moneyString.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${haravanFormat.thousands}`);
  };

  number = number * 100;
  number = number / 100;

  if (typeof number === 'string') {
    number = number.replace(haravanFormat.thousands, '');
  }

  switch (formatString.match(patt)[1]) {
    case 'amount':
      value = addCommas(floatToString({
        numeric: number,
        decimals: haravanFormat.numberdecimal,
      }));
      break;
    case 'amount_no_decimals':
      value = addCommas(floatToString({
        numeric: number,
        decimals: 0,
      }));
      break;
    case 'amount_with_comma_separator':
      value = floatToString({
        numeric: number,
        decimals: haravanFormat.numberdecimal,
      }).replace(/\./, ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = addCommas(floatToString({
        numeric: number,
        decimals: 0,
      })).replace(/\./, ',');
      break;
  }

  return formatString.replace(patt, value);
};
