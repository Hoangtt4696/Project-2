// Import React
import React, { PureComponent } from 'react';
import { injectIntl } from 'react-intl';

export default function (options = { prefix: '' }) {
  return function init(IntlComponent) {
    const IntlComp = class extends PureComponent {
      intl(key) {
        const pageIntl = this.props.intl.messages;

        return pageIntl[`${options.prefix ? `${options.prefix}.` : ''}${key}`];
      }

      render() {
        return (
          <IntlComponent
            getIntl={this.intl.bind(this)}
            {...this.props}
          />
        );
      }
    };

    return injectIntl(IntlComp);
  };
}
