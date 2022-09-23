import { Layout } from 'antd';
import { useRouter } from 'next/dist/client/router';
import React, { Component, FunctionComponent, useCallback, useMemo, useState } from 'react';
import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';

const { Content } = Layout;

export const useLayout = (page: Component) => {
  return <AdminLayout>{page}</AdminLayout>;
};

const AdminLayout: FunctionComponent = ({ children }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false)

  const onCollapse = () => {
    console.log(collapsed);
    setCollapsed(!collapsed)
  }

  const whiteUrl = ['/auth/login', '/500', '/404', '/403', '/'];
  const showMenu = useMemo(() => {
    return whiteUrl.includes(router.route)
  }, [router.route])
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      {showMenu ? ' ' : <AdminSidebar collapsed={collapsed} onCollapse={onCollapse}/>}
      <Layout className="site-layout">
        {showMenu ? '' : <AdminHeader collapsed={collapsed} onCollapse={onCollapse}/>}
        <Content style={{ margin: '0 16px', overflow: 'auto' }}>{children}</Content>
        {/* <Footer style={{ textAlign: 'center' }}>中方信富 ©2020</Footer> */}
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
