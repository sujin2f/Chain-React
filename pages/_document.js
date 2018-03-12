import React, { Component } from 'react';
import Document, { Head, Main, NextScript } from 'next/document'

import { build } from '../package';

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head>
          <title>{build.productName}</title>
          <link rel="icon" type="image/png" sizes="32x32" href={require('../app/assets/images/favicon-32x32.png')} />
          <link rel="icon" type="image/png" sizes="16x16" href={require('../app/assets/images/favicon-16x16.png')} />
          <link rel="stylesheet" href="/_next/static/style.css" />
        </Head>
        <body id="Body">
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
