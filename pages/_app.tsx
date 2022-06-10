import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "@components/Footer";
import { SWRConfig } from "swr";
import axios from "axios";
import { useEffect } from "react";

declare global {
  interface Window {
    Kakao: any;
    naver: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => axios.get(url).then((res) => res.data),
      }}
    >
      <title>Make Your Reservation!</title>
      <div className="my-20">
        <Component {...pageProps} />
      </div>
      <Footer />
    </SWRConfig>
  );
}

export default MyApp;
