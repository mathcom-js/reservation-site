import "../styles/globals.css";
import type { AppProps } from "next/app";
import Footer from "../components/Footer";
import { SWRConfig } from "swr";
import axios from "axios";

function MyApp({ Component, pageProps }: AppProps) {
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
