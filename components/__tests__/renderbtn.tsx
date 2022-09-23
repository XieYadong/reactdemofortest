import React from 'react';
// import Button from '../Button';
// import { render } from 'enzyme';
// import { expect } from 'chai';

import { render, mount,configure  } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

import Btn from '../common/index';
describe('Button 组件', () => {
  it('正确渲染 Button 组件', () => {
      const button = render(<Btn/>);
      expect(button).toMatchSnapshot();
  });
  it('测试 Button 组件 onClick 事件', () => {
    const fn = jest.fn();
    const button = mount(<Btn onClick={fn}/>);
    button.find(".button").simulate('click');
    expect(fn).toBeCalled();
});
 
});