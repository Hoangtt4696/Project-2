import uuidv1 from 'uuid/v1';
import uuidv4 from 'uuid/v4';

export const validateEmail = email => {
  return new RegExp(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g).test(email);
};

export const genPrivateKey = prefix => {
  return `sk_${prefix ? `${prefix}_` : ''}${uuidv1()}`.replace(/-/g, '');
};

export const genPublicKey = prefix => {
  return `pk_${prefix ? `${prefix}_` : ''}${uuidv4()}`.replace(/-/g, '');
};
