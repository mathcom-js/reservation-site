import Button from "@components/Button";
import Header from "@components/Header";
import {
  ImageInput,
  Input,
  SelectInput,
  TimePairInput,
} from "@components/Input";
import { getAvailableTimes, isPeriodical, timeToMinute } from "@libs/time";
import { Shop } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterForm {
  name: string;
  startTime: string;
  endTime: string;
  period: number;
  description: string;
  location: string;
  shopimage: FileList;
}

interface RegisterReturn {
  data: {
    ok: boolean;
    registeredShop?: Shop;
    error?: any;
  };
}

export default function Register() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const imageBlobs = watch("shopimage");

  useEffect(() => {
    if (imageBlobs && imageBlobs.length > 0) {
      const blob = imageBlobs[0];
      setPreviewUrl(URL.createObjectURL(blob));
    }
  }, [imageBlobs]);

  const onValid = async ({
    name,
    startTime,
    endTime,
    description,
    location,
    shopimage,
    period,
  }: RegisterForm) => {
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
      block = {
        ...box,
        imageId: data.result.id,
      };
    } else {
      block = box;
    }
    const { data }: RegisterReturn = await axios.post("/api/shops", block);

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onValid)}>
        <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
          <h1 className="text-center text-lg text-violet-400">
            Register Your Shop
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

          <Button text={!loading ? "Register" : "Loading"} />
        </div>
      </form>
      <span className="max-w-xl w-full grid mx-auto mt-10 text-center text-lg text-red-500">
        {errors.startTime?.message}
      </span>
    </>
  );
}
