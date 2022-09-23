import { Layout } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { FunctionComponent, PropsWithChildren, useState } from 'react';
import styles from './admin-layout.module.scss';
import { LayoutChildProps } from './indexLayout';

const { Sider } = Layout;

const AdminMenu = dynamic(() => import('./dynamic/admin-menu'), {
  loading: () => <ul />,
  ssr: false
});

const AdminSidebar: FunctionComponent<LayoutChildProps> = (
  props: PropsWithChildren<LayoutChildProps>
) => {
  // const [collapsed, setCollapsed] = useState(false);

  // const handleCollapseSwitch = () => {
  //   setCollapsed(!collapsed);
  // };

  return (
    <Sider
      // collapsible
      className={styles.sidebar}
      collapsed={props.collapsed}
      style={{ overflow: 'hidden' }}
      // onCollapse={handleCollapseSwitch}
    >
      <Link href="/">
        <div className={styles.logo}>中方信富(上海分公司)营销推广管理平台</div>
      </Link>
      <AdminMenu />
    </Sider>
  );
};

export default AdminSidebar;
