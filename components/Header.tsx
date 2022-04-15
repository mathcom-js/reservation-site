import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <div
      className="fixed top-0 bg-slate-800 w-full
                     grid grid-cols-2 text-center py-2.5 text-sm"
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
    </div>
  );
}
