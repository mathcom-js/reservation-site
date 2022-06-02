import Button from "../components/Button";
import Header from "../components/Header";
import { FileInput, Input, TimeInput } from "../components/Input";
import { Shop } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterForm {
  name: string;
  startTime: string;
  endTime: string;
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
  const { register, handleSubmit, setValue } = useForm<RegisterForm>();
  const [id, setId] = useState("");

  const onValid = async ({
    name,
    startTime,
    endTime,
    description,
    location,
    shopimage,
  }: RegisterForm) => {
    let block;
    if (shopimage && shopimage.length > 0) {
      const {
        data: { uploadURL },
      } = await axios.get("/api/image");

      const formData = new FormData();
      formData.append("file", shopimage[0], "test");
      const { data } = await axios.post(uploadURL, formData);
      block = {
        name,
        startTime,
        endTime,
        description,
        location,
        shopimage,
        imageId: data.result.id,
      };
    } else {
      block = {
        name,
        startTime,
        endTime,
        description,
        location,
        shopimage,
      };
    }
    const { data }: RegisterReturn = await axios.post("/api/shops", block);

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleSubmit(onValid)}>
        <div className="max-w-xl w-full flex flex-col mx-auto mt-20 space-y-8">
          <h1 className="text-center text-lg text-violet-400">
            Register Your Shop
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
          <FileInput
            register={register("shopimage", { required: true })}
            name="Your Shop Image"
          />

          <Button text="Register" />
        </div>
      </form>
    </>
  );
}
