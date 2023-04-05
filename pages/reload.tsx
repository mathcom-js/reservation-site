import Button from "@components/Button";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Reload() {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  });
  return (
    <>
      <div
        className="mt-4 flex items-center justify-center"
        onClick={() => {
          router.push("/");
        }}
      >
        <Button text="Reload" />
      </div>
    </>
  );
}
