import _get from 'lodash/get';

import React, { PureComponent } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

import { TabContent, TabPane, Nav, NavItem } from 'reactstrap';

import styles from './styles.css';

const propTypes = {
  items: PropTypes.array.isRequired,
};

class Tab extends PureComponent {
  getItems() {
    const { items } = this.props;
    const pathname = _get(this.props, 'children.props.location.pathname');

    return items.map(item => {
      let activeClass = '';

      if (item.subTab && item.subTab.indexOf(pathname) !== -1) {
        activeClass = 'active';
      }

      return (
        <NavItem key={item.key}>
          <Link
            to={item.route}
            className={`nav-link ${activeClass}`}
            activeClassName="active"
            onlyActiveOnIndex
          >
            {item.title}
          </Link>
        </NavItem>
      );
    });
  }

  render() {
    return (
      <section className={styles.customTab}>
        <Nav tabs>
          {this.getItems()}
        </Nav>
        <TabContent activeTab="content">
          <TabPane tabId="content">
            {this.props.children}
          </TabPane>
        </TabContent>
      </section>
    );
  }
}

Tab.propTypes = propTypes;

export default Tab;
