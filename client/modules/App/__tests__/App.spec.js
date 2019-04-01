import React from 'react';
import test from 'ava';
import sinon from 'sinon';
// import { mount } from 'enzyme';
import { App } from '../App';
import styles from '../App.css';
import { intlShape } from 'react-intl';
import { intl, shallowWithIntl, mountWithIntl } from '../../../util/react-intl-test-helper';
// import { toggleAddPost } from '../AppActions';

const intlProp = { ...intl, enabledLanguages: ['vi', 'en'] };
const children = <h1>Test</h1>;
const dispatch = sinon.spy();
const props = {
  children,
  dispatch,
  intl: intlProp,
};

test('renders properly', t => {
  const wrapper = shallowWithIntl(
    <App {...props} />
  );

  // t.is(wrapper.find('Helmet').length, 1);
  // t.is(wrapper.find('Header').length, 1);
  // t.is(wrapper.find('Footer').length, 1);
  // t.is(wrapper.find('Header').prop('toggleAddPost'), wrapper.instance().toggleAddPostSection);
  // t.truthy(wrapper.find('Header + div').hasClass(styles.container));
  // t.truthy(wrapper.find('Header + div').children(), children);
  t.truthy(wrapper.find(`div.${styles.container}`));
});

test('calls componentDidMount', t => {
  sinon.spy(App.prototype, 'componentDidMount');
  mountWithIntl(
    <App {...props} />,
    {
      context: {
        router: {
          isActive: sinon.stub().returns(true),
          push: sinon.stub(),
          replace: sinon.stub(),
          go: sinon.stub(),
          goBack: sinon.stub(),
          goForward: sinon.stub(),
          setRouteLeaveHook: sinon.stub(),
          createHref: sinon.stub(),
        },
        intl,
      },
      childContextTypes: {
        router: React.PropTypes.object,
        intl: intlShape,
      },
    },
  );

  t.truthy(App.prototype.componentDidMount.calledOnce);
  App.prototype.componentDidMount.restore();
});

// test('calling toggleAddPostSection dispatches toggleAddPost', t => {
//   const wrapper = shallowWithIntl(
//     <App {...props} />
//   );
//
//   wrapper.instance().toggleAddPostSection();
//   t.truthy(dispatch.calledOnce);
//   t.truthy(dispatch.calledWith(toggleAddPost()));
// });
