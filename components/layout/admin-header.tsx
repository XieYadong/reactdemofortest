import {
  AccountBookOutlined,
  ApiOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import {
  AutoComplete,
  Avatar,
  Col,
  Dropdown,
  Form,
  Button,
  Layout,
  Menu,
  message,
  Modal,
  Row
} from 'antd';
import { LayoutChildProps } from './indexLayout';
import { request } from 'utils/helpers/http';
import { useSelector, useDispatch } from 'react-redux';

import { getAPIEndpoint } from 'lib/options/api.options';
// import { useUserInfo } from 'lib/hooks/userinfo';
import React, { FunctionComponent, PropsWithChildren, useEffect } from 'react';
import styles from './admin-header.module.scss';
import user from 'utils/helpers/user';

const { Header } = Layout;
const { confirm } = Modal;

const AdminHeader: FunctionComponent<LayoutChildProps> = (
  props: PropsWithChildren<LayoutChildProps>
) => {
  // const { userinfo, token } = useUserInfo();
  const username = useSelector((state: any) => state.userInfo.username);

  const handleSearch = (keyword: string) => {
    console.log('auto-complete', keyword);
  };
  const signOut = async () => {
    // location.href = '/invest-admin/admin/logout';
    const token = user.verifyToken();
    request(getAPIEndpoint('/invest-admin/admin/logout'), {
      method: 'POST',
      token
    });
    localStorage.removeItem('token');
    location.href = '/auth/login';
  };

  const handleCopyToken = () => {
    confirm({
      title: '授权 Token',
      icon: <InfoCircleOutlined />,
      content: '点击确定复制授权 Token',
      onOk() {
        // navigator.clipboard.writeText(token);
        message.info('Token 复制成功');
      },
      onCancel() {
        message.warn('取消复制 Token');
      }
    });
  };

  const menu = (
    <Menu style={{ width: 150 }}>
      <Menu.Item icon={<AccountBookOutlined />} disabled={true}></Menu.Item>

      <Menu.Item icon={<LogoutOutlined />} onClick={signOut}>
        登出
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className={styles.header} style={{ padding: '0 25px' }}>
      <Row align="middle" style={{ height: '100%' }}>
        <Col flex="auto">
          <Row align="middle">
            <Col style={{ display: 'flex' }}>
              <div className="pull-left">
                <Button
                  onClick={() => props.onCollapse()}
                  icon={
                    props.collapsed ? (
                      <MenuUnfoldOutlined />
                    ) : (
                      <MenuFoldOutlined />
                    )
                  }></Button>
              </div>
            </Col>
            <Col>{props.children}</Col>
          </Row>
        </Col>
        <Col className={styles.userProfile}>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
              {username}
            </a>
          </Dropdown>
        </Col>
      </Row>
    </Header>
  );
};

export default AdminHeader;
