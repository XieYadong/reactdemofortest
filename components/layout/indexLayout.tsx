import React, { FunctionComponent, useEffect, useState } from 'react';
import { Layout, message, Skeleton } from 'antd';
import Header from './components/Header';
import STYLES from './index.module.scss';
import { util } from 'utils/helpers';
import { useRouter } from 'next/router';
import AdminHeader from './admin-header';
import AdminSidebar from './admin-sidebar';
import { request } from 'utils/helpers/http';
import user from 'utils/helpers/user';
import { useSelector, useDispatch } from 'react-redux';
import { setUserinfo } from 'lib/reducers/user.reducers';

const { Content } = Layout;

import { getAPIEndpoint } from 'lib/options/api.options';
interface LayoutProps {
  // headerTitle: string;
}
export interface LayoutChildProps {
  onCollapse: () => void;
  collapsed: boolean;
}
export const LayoutBox: FunctionComponent<LayoutProps> = ({
  children,
  // headerTitle,
  ...rest
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const handleUserInfo = async (token: string) => {
    try {
      const res = await request(getAPIEndpoint('/invest-admin/admin/info'), {
        token
      });
      dispatch(setUserinfo(res.data));
      setLoading(false);
    } catch (error) {
      message.error(error.message);
      setLoading(false);
    }
  };
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapseSwitch = () => {
    setCollapsed(!collapsed);
  };
  useEffect(() => {
    if (user.verifyToken()) {
      handleUserInfo(user.verifyToken());
    }
  }, []);
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdminSidebar onCollapse={handleCollapseSwitch} collapsed={collapsed} />

      <Layout className="hasCustomer">
        <AdminHeader onCollapse={handleCollapseSwitch} collapsed={collapsed} />
        {/* <Skeleton loading={loading}> */}
        <Content style={{ margin: '0 16px' }}>{children}</Content>
        {/* </Skeleton> */}
      </Layout>
    </Layout>
  );
};
