// Import React
import React, { PureComponent } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';

// Import Components
import withIntl from '../../../../components/HOC/withIntl';

const propTypes = {
  getIntl: PropTypes.func.isRequired,
};

class HomePage extends PureComponent {
  render() {
    const { getIntl } = this.props;

    return (
      <div>
        <Helmet title={getIntl('title')} />
        <h1>{getIntl('heading')}</h1>
      </div>
    );
  }
}

HomePage.propTypes = propTypes;

export default withIntl({
  prefix: 'pages.homePage',
})(HomePage);
