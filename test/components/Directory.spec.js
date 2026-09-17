import React from 'react';
import assert from 'assert';
import sinon from 'sinon';
import { shallow } from 'enzyme';
import request from 'superagent';
import Directory from '../../scripts/components/Directory';

describe('Directory', () => {
  afterEach(() => {
    if (request.get.restore) {
      request.get.restore();
    }
  });

  it('starts collapsed with no children', () => {
    const wrapper = shallow(<Directory name="src" url="/owner/repo/explore/main/src" />);
    assert.strictEqual(wrapper.state('expanded'), false);
    assert.deepStrictEqual(wrapper.state('children'), []);
  });

  it('fetches and renders children on expand', () => {
    const children = [{ name: 'App.scala', url: '/owner/repo/blob/main/src/App.scala', isDirectory: false }];
    sinon.stub(request, 'get').returns({
      end: (cb) => cb(null, { text: JSON.stringify(children) }),
    });

    const wrapper = shallow(<Directory name="src" url="/owner/repo/explore/main/src" />);
    wrapper.instance().toggleFolder('/owner/repo/explore/main/src');
    wrapper.update();

    assert.strictEqual(wrapper.state('expanded'), true);
    assert.strictEqual(wrapper.state('children').length, 1);
    assert.strictEqual(request.get.calledWith('/owner/repo/explore/main/src'), true);
  });

  it('collapses without issuing a network call on second toggle', () => {
    sinon.stub(request, 'get');
    const wrapper = shallow(<Directory name="src" url="/owner/repo/explore/main/src" />);
    wrapper.setState({ expanded: true, children: [{ name: 'x', url: '/x', isDirectory: false }] });

    wrapper.instance().toggleFolder('/owner/repo/explore/main/src');
    wrapper.update();

    assert.strictEqual(wrapper.state('expanded'), false);
    assert.deepStrictEqual(wrapper.state('children'), []);
    assert.strictEqual(request.get.called, false);
  });

  // Regression test for the unhandled JSON.parse fix: a session-expiry redirect to an
  // HTML sign-in page must not throw inside the click handler.
  it('does not throw when the server returns non-JSON', () => {
    sinon.stub(request, 'get').returns({
      end: (cb) => cb(null, { text: '<html>sign in</html>' }),
    });

    const wrapper = shallow(<Directory name="src" url="/owner/repo/explore/main/src" />);
    assert.doesNotThrow(() => {
      wrapper.instance().toggleFolder('/owner/repo/explore/main/src');
    });
    wrapper.update();

    assert.strictEqual(wrapper.state('expanded'), true);
    assert.deepStrictEqual(wrapper.state('children'), []);
  });

  it('leaves children empty when the request errors', () => {
    sinon.stub(request, 'get').returns({
      end: (cb) => cb(new Error('network error'), null),
    });

    const wrapper = shallow(<Directory name="src" url="/owner/repo/explore/main/src" />);
    wrapper.instance().toggleFolder('/owner/repo/explore/main/src');
    wrapper.update();

    assert.deepStrictEqual(wrapper.state('children'), []);
  });
});
