import "../styles/globals.css";
import type { AppProps } from "next/app";

const Footer = () => {
  return (
    <div
      className="fixed bottom-0 bg-slate-700 text-white w-full
                 flex items-center justify-center py-2"
    >
      &copy; 2022. JGJ all rights reserved.
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
