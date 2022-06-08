import Button from "@components/Button";
import Header from "@components/Header";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ReservateForm {
  start: string;
  end: string;
}

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ReservateForm>();
  const [loading, setLoading] = useState(false);

  const onValid = async ({ start, end }: ReservateForm) => {
    if (loading) return;
    else setLoading(true);

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate < new Date()) {
      setError("start", {
        type: "string",
        message: "Start time should be later than now.",
      });
      setLoading(false);
      return;
    }
    if (startDate > endDate) {
      setError("start", {
        type: "string",
        message: "End time should be later than start time.",
      });
      setLoading(false);
      return;
    }

    const { data } = await axios.post(
      `/api/shops/${router.query.id}/reservation`,
      {
        start: startDate,
        end: endDate,
      }
    );

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
      alert("access denied");
      setLoading(false);
    } else {
      router.push(`/shops/${router.query.id}`);
    }

    setLoading(false);
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onValid)}>
        <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
          <h1 className="text-center text-lg text-violet-400">Reservate</h1>

          <div className="flex flex-col space-y-2">
            <span className="text-xs">The Time you want</span>
            <div className="flex w-full justify-center">
              <input
                className="w-full focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
                type="datetime-local"
                {...register("start")}
              />
              <span className="mx-8">-</span>
              <input
                className="w-full focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
                type="datetime-local"
                {...register("end")}
              />
            </div>
          </div>

          <Button text="Reservate!" />
        </div>
        <span className="max-w-xl w-full grid mx-auto mt-10 text-center text-lg text-red-500">
          {errors.start?.message}
        </span>
      </form>
    </>
  );
}
