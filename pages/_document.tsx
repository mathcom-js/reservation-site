import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8"></meta>
          <body>
            <Script
              defer
              src="https://developers.kakao.com/sdk/js/kakao.js"
            ></Script>
            <Script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"></Script>
            <Main />
            <NextScript />
          </body>
        </Head>
      </Html>
    );
  }
}
