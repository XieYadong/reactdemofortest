import React, { FunctionComponent } from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface LayoutProps {
  headerTitle?: string;
}
//存在是历史遗留问题可以当文件控制中间件
export const LayoutBox: FunctionComponent<LayoutProps> = ({
  children,
  ...rest
}) => {
  return <Content>{children}</Content>;
};
