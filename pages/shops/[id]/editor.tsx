import Button from "@components/Button";
import Header from "@components/Header";
import { ImageInput, Input, TimeInput } from "@components/Input";
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
  const { register, handleSubmit, setValue, watch } = useForm<EditedForm>();
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
      if (shopData.shop.startTime) {
        setValue("startTime", shopData.shop.startTime);
      }
      if (shopData.shop.endTime) {
        setValue("endTime", shopData.shop.endTime);
      }
    }
  }, [shopData]);

  const onValid = async ({
    name,
    startTime,
    endTime,
    description,
    location,
    shopimage,
  }: EditedForm) => {
    if (loading) return;
    else setLoading(true);

    const box = { name, startTime, endTime, description, location };
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
    console.log(data.ok);
    mutate();

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
          <div className="flex flex-col space-y-2">
            <span className="text-xs">Your Time</span>
            <div className="flex w-full justify-center">
              <input
                className="w-full focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
                type="time"
                {...register("startTime")}
              />
              <span className="mx-8">-</span>
              <input
                className="w-full focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5"
                type="time"
                {...register("endTime")}
              />
            </div>
          </div>
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

          <Button text="Register" />
        </div>
      </form>
    </>
  );
}
