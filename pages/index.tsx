import Head from 'next/head';
import React, { FunctionComponent, PropsWithChildren } from 'react';
import { userContext } from 'lib/reducers/auth.reducers';

const Home: FunctionComponent = (props: PropsWithChildren<userContext>) => {
  return (
    <div>
      <Head>
        <title>首页标题</title>
      </Head>
      <div style={{ fontSize: '0.12rem' }}></div>
      {/* {JSON.stringify(props._userContext.userinfo.headimgurl)} */}
      {/* <img src={props._userContext.userinfo.headimgurl} alt=""/> */}
    </div>
  );
};

export default Home;
