import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

export default function Header() {
  const router = useRouter();
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
        <a
          className={"text-white"}
          onClick={async () => {
            const value = confirm("로그아웃하시겠습니까?");
            if (value) {
              await axios.post("/api/logout", {});
              alert("로그아웃되었습니다.");
              router.push("/login");
            }
          }}
        >
          Logout
        </a>
      </Link>
    </div>
  );
}
