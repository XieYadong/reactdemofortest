import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import classNames from 'classnames';

import STYLES from './index.module.scss';

const navList = [
  {
    key: 'home',
    label: '首页',
    // href: '/home',
    href: '/',
    icon: '-iconai-home'
  },
  {
    key: 'demand',
    label: '上传中心',
    href: '/demand',
    icon: '-iconzhaoxuqiu'
  },
  {
    key: 'salary',
    label: '收益中心',
    href: '/salary',
    icon: '-iconwestar-payroll'
  }
];

export default ({ className, context = {}, showLinks = true, ...rest }) => {
  const router = useRouter();

  const activeKey = useMemo(() => {
    return router.pathname.split('/')[1] || 'home';
  }, [router.pathname]);

  return (
    <nav className={classNames(STYLES.nav, className)}>
      <Link href="/">
        <div className={STYLES.logo}>&nbsp;| 供稿平台</div>
      </Link>
      <ul className={STYLES.links}>
        {showLinks &&
          navList.map(item => (
            <Link key={item.key} href={item.href}>
              <li className={activeKey === item.key ? STYLES.active : ''}>
                {item.label}
              </li>
            </Link>
          ))}
      </ul>
    </nav>
  );
};
