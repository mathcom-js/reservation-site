import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import { time } from "console";

export default function Header() {
  const router = useRouter();

  const KakaoLogout = () => {
    if (!window.Kakao.Auth.getAccessToken()) {
      alert("Not logged in.");
      return;
    }

    window.Kakao.Auth.logout(() => {
      console.log(window.Kakao.Auth.getAccessToken());
    });
  };
  const onLogout = async () => {
    const {
      data: { logintype },
    } = await axios.get("api/users/me/logintype");

    // Naver?
    if (logintype == "Naver") {
      const value = confirm("로그아웃하시겠습니까?");
      if (value) {
        alert("로그아웃되었습니다.");
        window.open("https://nid.naver.com/nidlogin.logout");
        await axios.post("/api/logout", {});
        router.push("/login");
      }
    }

    if (logintype == "Kakao") {
      const value = confirm("로그아웃하시겠습니까?");
      if (value) {
        alert("로그아웃되었습니다.");
        localStorage.clear();
        await axios.post("/api/logout", {});
        router.push("/login");
        // KakaoLogout();
      }
    }
    // const value = confirm("로그아웃하시겠습니까?");
    // if (value) {
    //   await axios.post("/api/logout", {});
    //   alert("로그아웃되었습니다.");
    //   router.push("/login");
    // }
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
