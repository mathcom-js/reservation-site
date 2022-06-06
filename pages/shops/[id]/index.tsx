import { Review, Shop, User } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Header from "@components/Header";
import { cls, createImageUrl } from "@libs/utils";
import { useState } from "react";
import Link from "next/link";
import Button from "@components/Button";
import { useForm } from "react-hook-form";

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
  shop: ShopWithDetails;
  isLiked: boolean;
}

interface ReviewForm {
  score: number;
  review: string;
}

interface ReviewReturn {
  data: {
    ok: boolean;
    registeredReview: Review;
    error?: any;
  };
}

interface ReviewDeleteReturn {
  data: {
    ok: boolean;
    deletedReview: Review;
    error?: any;
  };
}

interface ShopDeleteReturn {
  data: {
    ok: boolean;
    deletedShop: Shop;
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

export default function ShopIdElement() {
  const router = useRouter();
  const { data, mutate } = useSWR<ShopReturn>(
    router.query.id ? `/api/shops/${router.query.id}` : null
  );
  const [loading, setLoading] = useState(false);

  const onHeartClicked = async () => {
    if (!data || !router.query.id || loading) return;
    else setLoading(true);

    mutate(
      {
        ...data,
        shop: {
          ...data.shop,
          _count: {
            hearts: data.isLiked
              ? data.shop._count.hearts - 1
              : data.shop._count.hearts + 1,
          },
        },
        isLiked: !data.isLiked,
      },
      false
    );
    await axios.post(`/api/shops/${router.query.id}/heart`);
    setLoading(false);
  };

  const { register, handleSubmit, setValue } = useForm<ReviewForm>();
  const [score, setScore] = useState(5);

  const onValid = async ({ review }: ReviewForm) => {
    if (loading) return;
    else setLoading(true);

    const { data }: ReviewReturn = await axios.post(
      `/api/shops/${router.query.id}`,
      {
        score,
        review,
      }
    );
    mutate();

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const { data: retdata } = useSWR<ReturnInfo>("/api/users/me");
  const [reviewId, setReviewId] = useState(Number);

  const onReviewDeleteClicked = async () => {
    if (loading) return;
    else setLoading(true);

    const { data }: ReviewDeleteReturn = await axios.delete(
      `/api/shops/${router.query.id}/review/${reviewId}`
    );
    mutate();

    if (!data.ok) {
      console.log(JSON.stringify(data.error));
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onShopDeleteClicked = async () => {
    if (loading) return;
    else setLoading(true);

    if (confirm("정말로 삭제하시겠습니까")) {
      const deleteCheck = prompt("진짜삭제?", "가게의 이름을 입력해주세요");
      if (data && deleteCheck === data.shop.name) {
        alert("와! 삭제!");
        const { data }: ShopDeleteReturn = await axios.delete(
          `/api/shops/${router.query.id}`
        );

        if (!data.ok) {
          console.log(JSON.stringify(data.error));
        } else {
          router.push("/");
        }
      } else {
        alert("가게 이름이 틀립니다. 삭제실패");
      }
    } else {
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="relative">
        <h1 className="text-center text-xl text-violet-400 mt-20">
          {data?.shop.name}
        </h1>
        <button onClick={onHeartClicked} className="absolute right-4">
          {data && data?.isLiked ? (
            <svg
              className="w-5 h-5 text-pink-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-pink-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          )}
          <span className="text-pink-500">{data?.shop._count.hearts}</span>
        </button>
      </div>
      <div className="flex justify-center items-center my-8">
        {data?.shop.imageId ? (
          <img
            src={createImageUrl(data?.shop.imageId, "public")}
            className="h-96"
          />
        ) : (
          <div className="w-96 h-96 bg-slate-200" />
        )}
      </div>
      <div className="flex flex-col space-y-4 mb-8">
        <div className="grid grid-cols-[1fr_4fr] text-center">
          <span className="flex items-center justify-center text-lg">⏰</span>
          <span className="text-violet-800 flex items-center justify-center">
            {data?.shop.startTime}-{data?.shop.endTime}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_4fr] text-center">
          <span className="flex items-center justify-center text-lg">🏠</span>
          <span className="text-violet-800 flex items-center justify-center">
            {data?.shop.location}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_4fr] text-center">
          <span className="flex items-center justify-center text-lg">🧾</span>
          <span className="text-violet-800 flex items-center justify-center">
            {data?.shop.description}
          </span>
        </div>
      </div>

      <div className="mb-5 w-full flex justify-center">
        <Link href={`/shops/${router.query.id}/reservation`}>
          <a>
            <Button text="Reservate Now!" />
          </a>
        </Link>
      </div>

      <div className="pl-4 mb-8">
        <div className="flex flex-row mb-2">
          <span className="font-semibold text-lg mr-10">Reviews</span>

          <form onSubmit={handleSubmit(onValid)} className="flex w-full">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cls(
                  "w-5 h-5",
                  star <= score ? "text-yellow-400" : "text-gray-600"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  setScore(star);
                }}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
            <textarea
              className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md pl-1.5 w-full mr-5"
              {...register("review")}
            />
            <Button text="Submit" />
          </form>
        </div>

        {data?.shop.Reviews.map((review) => (
          <div key={review.id} className="py-2 flex items-center">
            <span className="ml-8 w-20">{review.createdUser.username}</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={cls(
                  "w-5 h-5",
                  star <= review.score ? "text-yellow-400" : "text-gray-600"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}

            <span className="ml-8">{review.review}</span>
            <span className="ml-auto mr-8">
              {retdata &&
              review.createdUserId === retdata.userWithDetails.id ? (
                <button
                  onClick={() => {
                    setReviewId(review.id);
                    onReviewDeleteClicked();
                  }}
                >
                  Delete
                </button>
              ) : (
                <></>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-20 w-full flex justify-center">
        {data && retdata && data.shop.userId === retdata.userWithDetails.id ? (
          <button
            onClick={() => {
              onShopDeleteClicked();
            }}
            className="text-xs bg-red-400 rounded-md py-2
            text-white hover:bg-red-600 transition-colors"
          >
            Shop Delete
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
