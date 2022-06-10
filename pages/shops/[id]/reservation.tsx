import Button from "@components/Button";
import Header from "@components/Header";
import { DateInput, SelectInput, TimePairInput } from "@components/Input";
import { getAvailableTimes, timeToMinute } from "@libs/time";
import { Shop } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface ReservateForm {
  time: string;
  date: string;
}

interface ShopReturn {
  ok: boolean;
  shop: Shop;
}

interface DateReservationReturn {
  ok: boolean;
  unAvailables: { time: number }[];
}

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm<ReservateForm>();

  const [loading, setLoading] = useState(false);
  const [timeList, setTimeList] = useState<string[]>([]);
  const [dateTimeList, setDateTimeList] = useState<string[]>([]);

  const date = watch("date");

  const { data: shopData } = useSWR<ShopReturn>(
    router.query.id ? `/api/shops/${router.query.id}` : null
  );
  const { data: reservationData, mutate: reservationMutate } =
    useSWR<DateReservationReturn>(
      date && router.query.id
        ? `/api/shops/${router.query.id}/reservation/${date}`
        : null
    );

  useEffect(() => {
    if (shopData && shopData.ok) {
      const startM = shopData.shop.startTime;
      const endM = shopData.shop.endTime;
      const period = shopData.shop.period;

      setTimeList(getAvailableTimes(startM, endM, period));
    }
  }, [shopData]);

  useEffect(() => {
    reservationMutate().then((res) => {
      if (res && res.unAvailables) {
        setDateTimeList(
          timeList.filter(
            (time) =>
              !res.unAvailables
                .map((obj) => obj.time)
                .includes(timeToMinute(time))
          )
        );
      } else {
        setDateTimeList(timeList);
      }
    });
  }, [date]);

  const onValid = async ({ time, date }: ReservateForm) => {
    if (loading) return;
    else setLoading(true);

    const { data } = await axios.post(
      `/api/shops/${router.query.id}/reservation`,
      {
        time: timeToMinute(time),
        date,
      }
    );

    if (!data.ok) {
      alert(data.error);
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

          <DateInput
            name="New Site"
            minDate={new Date()}
            register={register("date", { required: true })}
          />

          <SelectInput
            name="Available Time"
            data={dateTimeList}
            register={register("time", { required: true })}
          />

          <Button text="Reservate!" />
        </div>
        <span className="max-w-xl w-full grid mx-auto mt-10 text-center text-lg text-red-500">
          {errors.time?.message}
        </span>
      </form>
    </>
  );
}
