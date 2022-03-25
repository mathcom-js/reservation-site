import { useState } from "react";

function cls(...classnames: string[]) {
  return classnames.join(" ");
}

export default function Login() {
  const [method, setMethod] = useState("admin");
  const onAdminClick = () => {
    setMethod("admin");
  };
  const onGuestClick = () => {
    setMethod("guest");
  };
  return (
    <div
      className="max-w-md w-full flex flex-col mx-auto
     mt-32 space-y-4 bg-slate-50 shadow-lg rounded-2xl pb-4"
    >
      <div className="flex justify-center">
        <button
          onClick={onAdminClick}
          className={cls(
            "w-full py-1.5",
            method === "admin" ? "" : "bg-slate-700 rounded-tl-2xl"
          )}
        >
          Login as admin
        </button>
        <button
          onClick={onGuestClick}
          className={cls(
            "w-full py-1.5",
            method === "guest" ? "" : "bg-slate-700 rounded-tr-2xl"
          )}
        >
          Login as guest
        </button>
      </div>
      <form className="flex flex-col items-center space-y-4">
        <div className="flex flex-col text-sm w-1/2">
          <span>Username</span>
          <input type="text" className="border-2 border-gray-300" />
        </div>
        <div className="flex flex-col text-sm w-1/2">
          <span>Password</span>
          <input type="password" className="border-2 border-gray-300" />
        </div>
        <button className="w-1/2 bg-green-600 shadow-md rounded-md py-1 text-white">
          Log in
        </button>
      </form>
      <button className="w-1/2 bg-blue-600 shadow-md rounded-md py-1 text-white mx-auto">
        Sign up
      </button>
    </div>
  );
}
