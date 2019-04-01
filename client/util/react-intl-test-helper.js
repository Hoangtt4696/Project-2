/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helpers functions aim to address that and wrap a valid,
 * English-locale intl context around them.
 */

import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';

// You can pass your messages to the IntlProvider. Optional: remove if unneeded.
const messages = require('../../Intl/localizationData/vi');

// Create the IntlProvider to retrieve context for wrapping around.
const intlProvider = new IntlProvider({ locale: 'vi', messages }, {});
export const { intl } = intlProvider.getChildContext();
const getIntl = (node, key, prefix = '') => {
  const pageIntl = node.props.intl.messages;

  return pageIntl[`${prefix ? `${prefix}.` : ''}${key}`];
};

/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
const nodeWithIntlProp = (node, { prefix = '' } = {}) => {
  return React.cloneElement(node, { intl, getIntl: key => { getIntl(node, key, prefix); } });
};

export const shallowWithIntl = (node, { prefix = '' } = {}) => {
  return shallow(nodeWithIntlProp(node), { context: { intl, getIntl: key => { getIntl(node, key, prefix); } } });
};

export const mountWithIntl = (node, options, { prefix = '' } = {}) => {
  return mount(nodeWithIntlProp(node, { prefix }), {
    context: { intl, getIntl: key => { getIntl(node, key, prefix); } },
    childContextTypes: { intl: intlShape, getIntl: key => { getIntl(node, key, prefix); } },
  });
};
