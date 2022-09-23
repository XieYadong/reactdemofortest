import { Menu } from 'antd';
// import { useMenu } from 'lib/hooks/menu';
// import { MenuOptions } from 'next-env';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import Icon from 'components/common/Iconfont';
import React, { FunctionComponent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Item from 'antd/lib/list/Item';
import styles from './admin-menu.module.scss';
import { useMemo } from 'react';

const { SubMenu } = Menu;
import Router from 'next/router';

function translateDataToTree(dataa) {
  let arr = [];
  let data = JSON.parse(JSON.stringify(dataa)).filter(item => item.hidden);
  let parentsAll = data.filter(
    value =>
      value.parentId == 'undefined' ||
      value.parentId == null ||
      value.parentId == 0
  );
  let childrens = data.filter(
    value =>
      value.parentId !== 'undefined' &&
      value.parentId != null &&
      value.parentId != 0
  );
  let translator = parents => {
    parents.forEach(parent => {
      // if (!childrens.forEach) {
      // }
      let childs = childrens.filter(item => {
        return item.parentId == parent.id;
      });
      if (childs && childs.length > 0) {
        parent.childrens = childs;
        translator(parent.childrens);
      }
    });
  };

  translator(parentsAll);
  console.log(parentsAll, 'parents1');

  return parentsAll;
}

function renderMenu(menuOptions: any): JSX.Element {
  if (menuOptions.childrens?.length > 0) {
    return (
      <SubMenu
        key={menuOptions.path + menuOptions.title}
        title={menuOptions.title}
        icon={menuOptions.icon && <Icon type={menuOptions.icon} />}>
        {menuOptions.childrens
          .sort((a, b) => a.sort - b.sort)
          .map(item => renderMenu(item))}
      </SubMenu>
    );
  } else {
    return menuOptions.target ? (
      <Menu.Item key={menuOptions.path || ''}>
        <Link href={menuOptions.name || ''}>
          <a href={menuOptions.name || ''} target="_blank">
            {menuOptions.title}
          </a>
        </Link>
      </Menu.Item>
    ) : (
      <Menu.Item
        key={
          menuOptions.name
            ? menuOptions.name
            : menuOptions.title + menuOptions.id
        }>
        <Link href={menuOptions.name || ''}>
          <span>
            {menuOptions.icon && <Icon type={menuOptions.icon} />}
            <span> {menuOptions.title} </span>
          </span>
        </Link>
      </Menu.Item>
    );
  }
}

const AdminMenu: FunctionComponent = () => {
  // const { menu } ={menu:[]};
  const { pathname } = useRouter();
  console.log(pathname, 'pathname');
  const menuArray = useSelector((state: any) => state.userInfo.menu);
  const menu = useMemo(() => {
    return translateDataToTree(menuArray);
  }, [menuArray]);
  console.log(menu, '');
  const onselect = ({ item, key, keyPath, selectedKeys }) => {
    Router.push(key);
    console.log(item, key, 'item');
  };
  return (
    <div className={styles.menu}>
      <Menu
        defaultSelectedKeys={[pathname]}
        selectedKeys={[pathname]}
        onSelect={onselect}
        mode="inline"
        theme="dark">
        {menu?.length > 0 &&
          menu.sort((a, b) => a.sort - b.sort).map(item => renderMenu(item))}
      </Menu>
    </div>
  );
};

export default AdminMenu;
