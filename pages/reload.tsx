import Button from "@components/Button";
import { useRouter } from "next/router";

export default function Reload() {
  const router = useRouter();
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
