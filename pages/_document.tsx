import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import styles from '../styles/index.module.scss';
export default class extends Document {
  render() {
    return (
      <html>
        <Head>
          <meta
          // name="viewport"
          // content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
        </Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            !(function (e) {
              window._env = {
              }
            })();
            `
          }}></script>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
