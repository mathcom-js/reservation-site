// Use for redirect
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";

export default function RedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    async function authCode() {
      if (router.query && router.query.code) {
        const code = router.query.code;
        router.push("/");
        const response = await axios.post(
          "/api/tokens",
          { code },
          { headers: { "Content-Type": "application/json" } }
        );
        console.log(response);
      }
    }
    authCode();
  }, [router]);

  return <></>;
}
