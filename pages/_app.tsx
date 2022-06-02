import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "@components/Footer";
import { SWRConfig } from "swr";
import axios from "axios";
import { useEffect } from "react";

declare global {
  interface Window {
    Kakao: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    window.Kakao.init("2aec4359bd683f2e8d0f3d400a605adc");
  }, []);

  return (
    <SWRConfig
      value={{
        fetcher: (url: string) => axios.get(url).then((res) => res.data),
      }}
    >
      <Component {...pageProps} />
      <Footer />
    </SWRConfig>
  );
}

export default MyApp;
