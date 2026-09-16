import React from 'react';
import assert from 'assert';
import { shallow } from 'enzyme';
import FileNodes from '../../scripts/components/FileNodes';
import File from '../../scripts/components/File';
import Directory from '../../scripts/components/Directory';

describe('FileNodes', () => {
  const data = [
    { name: 'README.md', url: '/owner/repo/blob/main/README.md', isDirectory: false },
    { name: 'src', url: '/owner/repo/tree/main/src', isDirectory: true },
  ];

  it('renders a File for non-directory entries', () => {
    const wrapper = shallow(<FileNodes data={data} />);
    assert.strictEqual(wrapper.find(File).length, 1);
    assert.strictEqual(wrapper.find(File).prop('name'), 'README.md');
    assert.strictEqual(wrapper.find(File).prop('url'), '/owner/repo/blob/main/README.md');
  });

  it('renders a Directory for directory entries, rewriting /tree/ to /explore/', () => {
    const wrapper = shallow(<FileNodes data={data} />);
    assert.strictEqual(wrapper.find(Directory).length, 1);
    assert.strictEqual(wrapper.find(Directory).prop('name'), 'src');
    assert.strictEqual(wrapper.find(Directory).prop('url'), '/owner/repo/explore/main/src');
  });

  it('renders an empty list for no data', () => {
    const wrapper = shallow(<FileNodes data={[]} />);
    assert.strictEqual(wrapper.find(File).length, 0);
    assert.strictEqual(wrapper.find(Directory).length, 0);
  });
});
