import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import NaverImg from "../public/NaverImg.png";
import KakaoImg from "../public/KakaoImg.png";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const naverRef = useRef<any>();

  const kakaoLogin = () => {
    if (loading) return;
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

  useEffect(() => {
    const token_info = router.asPath.split("#")[1];
    if (token_info)
      axios.post("/api/users/naver", token_info).then(() => router.push("/"));
  }, [router]);

  useEffect(() => {
    try {
      naverLoginInit();
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY!);
    } catch (err) {
      console.log(err);
    }
  }, []);

  const naverLoginInit = async () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
      callbackUrl: window.location.href,
      isPopup: false,
      loginButton: { color: "green", type: 1, height: 1 },
    });
    naverLogin.init();
  };

  const naverLogin = () => {
    naverRef.current.children[0].click();
  };

  return (
    <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
      <h1 className="text-center text-lg text-violet-400">
        Make Your Reservation!
      </h1>

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
    </div>
  );
}
