import Header from "@components/Header";
import { User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/Button";
import { Input } from "@components/Input";

interface EditForm {
  username: string;
  avatar?: FileList;
}

interface EditReturn {
  data: {
    ok: boolean;
    updatedUser?: User;
    error?: any;
  };
}

export default function EditProfile() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm<EditForm>();
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValue("username", "TEST");
  }, []);

  const onValid = async ({ username, avatar }: EditForm) => {
    if (loading) return;
    else setLoading(true);

    let block;
    if (avatar && avatar.length > 0) {
      const {
        data: { uploadURL },
      } = await axios.get("/api/image");

      const formData = new FormData();
      formData.append("file", avatar[0], "test");
      const { data } = await axios.post(uploadURL, formData);
      block = { username, avatarId: data.result.id };
    } else {
      block = { username };
    }

    const { data }: EditReturn = await axios.put("/api/users/me", block);

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
      setLoading(false);
    } else {
      router.push("/profile");
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-xl w-full flex flex-col mx-auto mt-20 space-y-8">
        <h1 className="text-center text-lg text-violet-400">
          Edit Your Profile
        </h1>
        <form
          onSubmit={handleSubmit(onValid)}
          className="flex flex-col space-y-8"
        >
          <Input
            register={register("username", { required: true })}
            name="Username"
          />
          <input {...register("avatar")} type="file" accept="image/*" />
          {id ? (
            <img
              src={`https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/${id}/avatar`}
            />
          ) : (
            <div></div>
          )}

          <Button text="Submit" />
        </form>
      </div>
      <div></div>
    </>
  );
}
