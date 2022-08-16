import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "@components/Footer";
import { SWRConfig } from "swr";
import axios from "axios";

declare global {
  interface Window {
    Kakao: any;
    naver: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => axios.get(url).then((res) => res.data),
      }}
    >
      <script defer src="https://developers.kakao.com/sdk/js/kakao.js" />
      <script
        defer
        src="https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js"
      />
      <title>Make Your Reservation!</title>
      <div className="my-20">
        <Component {...pageProps} />
      </div>
      <Footer />
    </SWRConfig>
  );
}

export default MyApp;
