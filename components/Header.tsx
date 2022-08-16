import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

export default function Header() {
  const router = useRouter();

  const KakaoLogout = () => {
    window.Kakao.Auth.logout(function (response: any) {
      console.log("okay");
    });
  };

  const onLogout = async () => {
    const {
      data: { logintype },
    } = await axios.get("api/users/me/logintype");

    const kakaokey = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;
    if (logintype == "Naver") {
      const value = confirm("로그아웃하시겠습니까?");
      if (value) {
        window.open("https://nid.naver.com/nidlogin.logout");
        await axios.post("/api/logout", {});
        router.push("/login");
      }
    }

    if (logintype == "Kakao") {
      const value = confirm("로그아웃하시겠습니까?");
      if (value) {
        const logout_uri = window.location.href + "login";
        localStorage.clear();
        await axios.post("/api/logout", {});
        router.push(
          `https://kauth.kakao.com/oauth/logout?client_id=${kakaokey}&logout_redirect_uri=${logout_uri}`
        );
        router.push("/login");
        KakaoLogout();
      }
    }
  };

  return (
    <div
      className="fixed top-0 bg-slate-800 w-full
                     grid grid-cols-4 text-center py-2.5 text-sm z-10"
    >
      <Link href="/">
        <a
          className={router.pathname === "/" ? "text-violet-400" : "text-white"}
        >
          Browse
        </a>
      </Link>
      <Link href="/register">
        <a
          className={
            router.pathname === "/register" ? "text-violet-400" : "text-white"
          }
        >
          Register
        </a>
      </Link>
      <Link href="/profile">
        <a
          className={
            router.pathname.includes("/profile")
              ? "text-violet-400"
              : "text-white"
          }
        >
          Profile
        </a>
      </Link>
      <Link href="/">
        <a className={"text-white"} onClick={onLogout}>
          Logout
        </a>
      </Link>
    </div>
  );
}
