import React, { FunctionComponent, PropsWithChildren } from 'react';
import styles from './admin-header.module.scss';
// import { NavBar ,Icon} from 'antd-mobile';
import { useRouter } from 'next/router';

interface HeaderProps {
  title: string;
}
const Header: FunctionComponent<HeaderProps> = (
  props: PropsWithChildren<HeaderProps>
) => {
  const router = useRouter();
  const signOut = () => {
    location.href = '/api/auth/signout';
  };

  return <p>sasa</p>;
};

export default Header;
