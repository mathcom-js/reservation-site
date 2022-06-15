import Button from "@components/Button";
import Header from "@components/Header";
import {
  ImageInput,
  Input,
  SelectInput,
  TimePairInput,
} from "@components/Input";
import { isPeriodical, minuteToTime, timeToMinute } from "@libs/time";
import { Shop, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR, { mutate } from "swr";

interface EditedForm {
  name: string;
  startTime: string;
  endTime: string;
  period: number;
  description: string;
  location: string;
  shopimage: FileList;
}

interface EditedReturn {
  data: {
    ok: boolean;
    EditedShop?: Shop;
    error?: any;
  };
}

interface ReviewWithUser extends User {
  id: number;
  review: string;
  score: number;
  createdUserId: number;
  createdUser: User;
}

interface ShopWithDetails extends Shop {
  user: {
    username: string;
  };
  Reviews: ReviewWithUser[];
  _count: {
    hearts: number;
  };
}

interface ShopReturn {
  ok: boolean;
  shop?: ShopWithDetails;
}

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<EditedForm>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { data: shopData, mutate } = useSWR<ShopReturn>(
    router.query.id ? `/api/shops/${router.query.id}` : null
  );

  const imageBlobs = watch("shopimage");

  useEffect(() => {
    if (imageBlobs && imageBlobs.length > 0) {
      const blob = imageBlobs[0];
      setPreviewUrl(URL.createObjectURL(blob));
    }
  }, [imageBlobs]);

  useEffect(() => {
    if (shopData && shopData.shop) {
      setValue("name", shopData.shop.name);
      setValue("description", shopData.shop.description);
      setValue("location", shopData.shop.location);
      setValue("startTime", minuteToTime(shopData.shop.startTime));
      setValue("endTime", minuteToTime(shopData.shop.endTime));
      setValue("period", shopData.shop.period);
    }
  }, [shopData]);

  const onValid = async ({
    name,
    startTime,
    endTime,
    description,
    location,
    shopimage,
    period,
  }: EditedForm) => {
    if (loading) return;
    else setLoading(true);

    const startM = timeToMinute(startTime);
    const endM = timeToMinute(endTime);

    if (endM - startM <= 0) {
      setError("startTime", {
        type: "string",
        message: "Ends so quickly",
      });
      setLoading(false);
      return;
    }

    if ((endM - startM) % period !== 0) {
      setError("startTime", {
        type: "string",
        message: "Time period is not matching",
      });
      setLoading(false);
      return;
    }

    const box = {
      name,
      startTime: startM,
      endTime: endM,
      period: +period,
      description,
      location,
    };
    let block;

    if (shopimage && shopimage.length > 0) {
      const {
        data: { uploadURL },
      } = await axios.get("/api/image");

      const formData = new FormData();
      formData.append("file", shopimage[0], "test");
      const { data } = await axios.post(uploadURL, formData);
      block = { ...box, imageId: data.result.id };
    } else {
      block = box;
    }

    const { data }: EditedReturn = await axios.put(
      `/api/shops/${router.query.id}`,
      block
    );

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
      alert("access denied");
      setLoading(false);
    } else {
      router.push(`/shops/${router.query.id}`);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onValid)}>
        <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
          <h1 className="text-center text-lg text-violet-400">
            Edit Your Shop
          </h1>

          <Input
            register={register("name", { required: true })}
            name="Your Shop Name"
          />

          <TimePairInput
            name="Your Time"
            startRegister={register("startTime", {
              validate: {
                halfOrClock: (value) =>
                  isPeriodical(value, 30) || "Starts at half or clock",
              },
            })}
            endRegister={register("endTime")}
          />

          <SelectInput
            name="Time period"
            register={register("period")}
            data={[15, 30, 60, 120, 240]}
          />

          <Input
            register={register("description", { required: true })}
            name="Your Description"
          />
          <Input
            register={register("location", { required: true })}
            name="Your Location"
          />
          <ImageInput
            register={register("shopimage")}
            name="Your Shop Image"
            previewUrl={previewUrl}
          />

          <Button text={!loading ? "Submit" : "Loading"} />
        </div>
      </form>
      <span className="max-w-xl w-full grid mx-auto mt-10 text-center text-lg text-red-500">
        {errors.startTime?.message}
      </span>
    </>
  );
}
