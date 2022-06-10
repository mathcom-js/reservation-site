import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8"></meta>
          <body>
            <script
              defer
              src="https://developers.kakao.com/sdk/js/kakao.js"
            ></script>
            <script src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"></script>
            <Main />
            <NextScript />
          </body>
        </Head>
      </Html>
    );
  }
}
