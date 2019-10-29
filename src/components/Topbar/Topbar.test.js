// @flow strict
import React from 'react';
import renderer from 'react-test-renderer';
import Topbar from './Topbar';

describe('Topbar', () => {
  const props = {
    children: 'test',
    title: 'test',
  };

  it('renders correctly', () => {
    const tree = renderer.create(<Topbar {...props} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
