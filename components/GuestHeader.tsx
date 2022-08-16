import Link from "next/link";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();

  return (
    <div
      className="fixed top-0 bg-slate-800 w-full
                     flex items-center justify-center text-center py-2.5 text-sm z-10"
    >
      <button
        className={
          router.pathname === "/guest" ? "hidden" : "absolute left-6 text-white"
        }
        onClick={() => router.back()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
          />
        </svg>
      </button>

      <Link href="/login">
        <a className="text-white">Sign in?</a>
      </Link>
    </div>
  );
}
