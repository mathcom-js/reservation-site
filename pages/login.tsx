import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface LoginForm {
  name: string;
}

interface LoginReturn {
  data: {
    ok: boolean;
    foundUser?: User;
  };
}

interface SignReturn {
  data: {
    ok: boolean;
    newUser?: User;
  };
}

export default function Login() {
  const [method, setMethod] = useState<"LogIn" | "SignUp">("LogIn");
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginForm>();
  const [loading, setLoading] = useState(false);

  const login_with_Kakao = () => {
    if (loading) return;
    else setLoading(true);

    try {
      return new Promise((resolve, reject) => {
        if (!window.Kakao) {
          reject("Kakao instance does not exist.");
        }
        window.Kakao.Auth.login({
          success: function (response: any) {
            const data = JSON.stringify(response);
            console.log(data);
            // axios
            //   .post("/api/tokens", data, {
            //     headers: { "Content-Type": "application/json" },
            //   })
            //   .then((res) => console.log(res));
            const { access_token } = response;
            console.log(access_token);
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

                // const user = response.kakao_account;
                // console.log(user);
                // user.host = "kakao";
                // const user_info = document.querySelector("#userinfo");
                // if (user_info) user_info.value = JSON.stringify(user);
                // console.log(user_info);
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
    naverlogin();
  }, []);

  const naverlogin = async () => {
    const naverLogin = new window.naver.LoginWithNaverId({
      clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
      callbackUrl: "http://localhost:3000/login",
      isPopup: false,
      loginButton: { color: "green", type: 1, height: 1 },
    });
    naverLogin.init();
  };

  const setSignUp = () => {
    setMethod("SignUp");
  };
  const setLogIn = () => {
    setMethod("LogIn");
  };

  const onValid = async ({ name }: LoginForm) => {
    if (method === "LogIn") {
      const { data }: LoginReturn = await axios.get(`/api/users?name=${name}`);
      if (!data.ok) {
        alert("No user!");
      } else {
        router.push("/");
      }
    } else {
      const { data }: SignReturn = await axios.post(
        "/api/user",
        { name },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!data.ok) {
        alert("Duplicate name!");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
      <h1 className="text-center text-lg text-violet-400">
        Make Your Reservation!
      </h1>

      {/* <div className="grid grid-cols-2">
        <button
          className={cls(
            method === "LogIn"
              ? "text-violet-400 border-violet-400"
              : "text-gray-400",
            "border-b pb-2"
          )}
          onClick={setLogIn}
        >
          Log In
        </button>
        <button
          className={cls(
            method === "SignUp"
              ? "text-violet-400 border-violet-400"
              : "text-gray-400",
            "border-b pb-2"
          )}
          onClick={setSignUp}
        >
          Sign Up
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onValid)}
        className="flex flex-col space-y-8"
      >
        <Input register={register("name", { required: true })} name="Name" />
        {method === "LogIn" ? (
          <Button text="Log In" />
        ) : (
          <Button text="Sign Up" />
        )}
      </form>

      <div>
        <div className="border-t border-gray-200 w-full relative top-3.5 -z-10" />
        <div className="text-center">
          <span className="text-xs text-gray-500 bg-white px-3">Or use</span>
        </div>
      </div> */}
      <div className="grid grid-cols-2">
        <button
          id="naverIdLogin"
          className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
hover:bg-slate-50 transition-colors rounded-md"
        ></button>
        <button
          className="flex items-center justify-center border border-gray-200 py-2 text-xs text-gray-400
           hover:bg-slate-50 transition-colors rounded-md"
          onClick={login_with_Kakao}
        >
          <svg
            className="w-8 h-8"
            id="kakao"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-75 -90 350 350"
          >
            <polygon
              className="kakao logo"
              fill="#3c1e1e"
              points="45 140 40 185 90 150 45 140"
            />
            <ellipse
              className="kakao logo"
              fill="#3c1e1e"
              cx="100"
              cy="80"
              rx="100"
              ry="80"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
