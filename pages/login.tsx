import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import NaverImg from "../public/NaverImg.png";
import KakaoImg from "../public/KakaoImg.png";
import Button from "@components/Button";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const naverRef = useRef<any>();

  const kakaoLoginInit = () => {
    return window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
  };

  const kakaoLogin = () => {
    if (loading || loadingError) return;
    else setLoading(true);

    try {
      return new Promise((resolve, reject) => {
        if (!window.Kakao) {
          reject("Kakao instance does not exist.");
        }
        window.Kakao.Auth.login({
          success: function (response: any) {
            window.Kakao.API.request({
              url: "/v2/user/me",
              success: function (response: any) {
                const {
                  id,
                  properties: { nickname },
                } = response;
                axios
                  .post("/api/users/kakao", {
                    kakaoId: id,
                    username: nickname,
                  })
                  .then((res) => res.data.ok && router.push("/"))
                  .finally(() => setLoading(false));
              },
              fail: function (error: any) {
                console.log(error);
              },
            });
          },
          fail: function (error: any) {
            console.log(error);
          },
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const naverLoginInit = () => {
    if (loadingError) return;
    try {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
        callbackUrl: window.location.href,
        isPopup: false,
        loginButton: { color: "green", type: 1, height: 1 },
      });
      naverLogin.init();
    } catch (err) {
      setLoadingError(true);
      console.log(err);
    }
  };

  const naverLogin = () => {
    if (loading || loadingError) return;
    else setLoading(true);

    try {
      naverRef.current.children[0].click();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token_info = router.asPath.split("#")[1];
    if (token_info) {
      setLoading(true);
      axios
        .post("/api/users/naver", token_info)
        .then(() => router.push("/"))
        .finally(() => setLoading(false));
    }
  }, [router]);

  useEffect(() => {
    try {
      naverLoginInit();
      kakaoLoginInit();
    } catch (err) {
      setLoadingError(true);
      console.log(err);
    }
  }, []);

  return (
    <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
      <h1 className="text-center text-lg text-violet-400">
        Make Your Reservation!
      </h1>
      {!loading ? (
        <div className="grid grid-cols-2">
          <div className="hidden" id="naverIdLogin" ref={naverRef} />
          <button
            className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
                  hover:bg-slate-50 transition-colors rounded-md"
            onClick={naverLogin}
          >
            <div className="w-8 h-8">
              <Image src={NaverImg} />
            </div>
          </button>
          <button
            className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
           hover:bg-slate-50 transition-colors rounded-md"
            onClick={kakaoLogin}
          >
            <div className="w-8 h-8">
              <Image src={KakaoImg} />
            </div>
          </button>
        </div>
      ) : (
        <div className="w-full text-center flex flex-col">
          <span className="text-2xl">Loading now...</span>
          <span className="text-lg mt-4">
            If you see this message for a long time, please refresh a page
          </span>
          <div
            className="mt-4"
            onClick={() => {
              router.reload();
            }}
          >
            <Button text="Reload" />
          </div>
        </div>
      )}
      {loadingError && (
        <div className="w-full flex flex-col items-center justify-center">
          <span className="text-lg text-violet-400 pt-12">
            Oops! Error occurred when loading a data!
          </span>
          <div
            className="mt-4"
            onClick={() => {
              router.reload();
            }}
          >
            <Button text="Reload" />
          </div>
        </div>
      )}

      <div className="grid">
        <button
          className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
                  hover:bg-slate-50 transition-colors rounded-md"
          onClick={() => {
            router.push("/guest");
          }}
        >
          Guest Login
        </button>
      </div>
    </div>
  );
}
