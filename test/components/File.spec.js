import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import File from '../../scripts/components/File';

describe('File', () => {
  it('renders a link with the given name and url', () => {
    const wrapper = shallow(<File name="README.md" url="/owner/repo/blob/main/README.md" />);
    const link = wrapper.find('a');
    assert.strictEqual(link.prop('href'), '/owner/repo/blob/main/README.md');
    assert.strictEqual(wrapper.text(), 'README.md');
  });
});
