import type { AppProps } from 'next/app';
// import 'antd-mobile/dist/antd-mobile.css'
import { LayoutBox } from 'components/layout/indexLayout';
import { useInit } from 'lib/hooks/init';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import styles from 'styles/mixin.module.scss';
import { util } from 'utils/helpers';
import 'antd/dist/antd.css';
import zhCN from 'antd/lib/locale/zh_CN';
import 'styles/globals.css';
import { ConfigProvider } from 'antd';
import { Provider } from 'react-redux';
import store from '../lib/reducers';
import user from 'utils/helpers/user';
import { useRouter } from 'next/dist/client/router';
import React, {
  FunctionComponent,
  useEffect,
  PropsWithChildren,
  useState
} from 'react';

// 全局使用中文

dayjs.locale('zh-cn');
function MyApp({ Component, pageProps, envs }: any): JSX.Element {
  // const {authentication,econfig} = useInit();
  // const {authentication,econfig} = useInit();
  // useEffect(() => {
  //   const onAppUpdated = (url, { shallow }) => {
  //     console.log(
  //       `App is changing to ${url} ${
  //         shallow ? 'with' : 'without'
  //       } shallow routing`
  //     );
  //   };
  //   console.log(envs, 'process.env');
  //   router.events.on('routeChangeComplete', onAppUpdated);

  //   // If the component is unmounted, unsubscribe
  //   // from the event with the `off` method:
  //   return () => {
  //     router.events.off('routeChangeComplete', onAppUpdated);
  //   };
  // }, []);
  const router = useRouter();

  const whiteUrl = ['/auth/login', '/500', '/404', '/403', '/'];
  useEffect(() => {
    console.log(router, 'router');
    if (user.verifyToken()) {
    } else {
      if (whiteUrl.includes(router.route) === false) {
        router.push({
          pathname: '/auth/login',
          query: { redirect_url: router.route }
        });
      }
    }
  }, []);
  return (
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        {whiteUrl.includes(router.route) ? (
          <Component {...pageProps} />
        ) : (
          <LayoutBox>
            <Component {...pageProps} />
          </LayoutBox>
        )}
      </ConfigProvider>
    </Provider>
  );
}
MyApp.getInitialProps = async ctx => {
  const envs = {
    NODE: process.env.NODE_ENV,
    a: 'qwqw'
  };
  return { envs };
};
export default MyApp;

function getBrowser() {
  throw new Error('Function not implemented.');
}

export async function getStaticProps(context) {
  const envs = {
    NODE: process.env.NODE_ENV,
    a: process.env.PORTFOLIO_SERV_API_BASE_URI
  };
  return {
    props: { envs }
  };
}
