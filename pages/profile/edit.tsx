import Header from "@components/Header";
import { User, Shop, Review } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@components/Button";
import { ImageInput, Input } from "@components/Input";
import useSWR from "swr";

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

interface UserProfileInfo extends User {
  shops: Shop[];
  reviews: Review[];
  hearts: {
    select: {
      likedShopId: true;
    };
  };
}

interface ReturnInfo {
  ok: boolean;
  userWithDetails: UserProfileInfo;
}
export default function EditProfile() {
  const router = useRouter();
  const { register, handleSubmit, setValue, watch } = useForm<EditForm>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const { data: me } = useSWR<ReturnInfo>("/api/users/me");
  const avatarBlobs = watch("avatar");

  useEffect(() => {
    if (me && me.ok) {
      setValue("username", me.userWithDetails.username);
    }
  }, [me]);

  useEffect(() => {
    if (avatarBlobs && avatarBlobs.length > 0) {
      const blob = avatarBlobs[0];
      setPreviewUrl(URL.createObjectURL(blob));
    }
  }, [avatarBlobs]);

  const onValid = async ({ username, avatar }: EditForm) => {
    if (loading) return;
    else setLoading(true);

    if (me && username === me.userWithDetails.username && !avatar) {
      router.push("/profile");
    }

    let block;
    const {
      data: { uploadURL },
    } = await axios.get("/api/image");

    const formData = new FormData();
    if (avatar && avatar.length > 0) {
      formData.append("file", avatar[0], "test");
      const { data: idReturn } = await axios.post(uploadURL, formData);
      block = { username, avatarId: idReturn.result.id };
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

      <div className="max-w-xl w-full flex flex-col mx-auto space-y-8">
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
          <ImageInput
            name="Avatar"
            register={register("avatar")}
            previewUrl={previewUrl}
          />

          <Button text="Submit" />
        </form>
      </div>
      <div></div>
    </>
  );
}
