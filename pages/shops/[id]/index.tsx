import { Review, Shop, User, Reservation } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Header from "@components/Header";
import { cls, createImageUrl } from "@libs/utils";
import { useState } from "react";
import Link from "next/link";
import Button from "@components/Button";
import { useForm } from "react-hook-form";
import { minuteToTime, timeToMinute } from "@libs/time";

interface ReviewWithUser extends User {
  id: number;
  review: string;
  score: number;
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

interface UserProfileInfo extends User {}

interface ReturnInfo {
  ok: boolean;
  userWithDetails: UserProfileInfo;
}

interface reservationReturn extends Reservation {
  ok: boolean;
  reservations: reservationInfo[];
}

interface reservationInfo extends User {
  id: number;
  time: number;
  date: string;
  reservationUser: User;
}

export default function ShopIdElement() {
  const router = useRouter();

  const { data, mutate } = useSWR<ShopReturn>(
    router.query.id ? `/api/shops/${router.query.id}` : null
  );
  const { data: resdata } = useSWR<reservationReturn>(
    router.query.id ? `/api/shops/${router.query.id}/reservation` : null
  );
  const { data: retdata } = useSWR<ReturnInfo>("/api/users/me");

  const { register, handleSubmit, setValue } = useForm<ReviewForm>();

  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(5);
  const [reviewId, setReviewId] = useState<number | undefined>();

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

  const onValid = async ({ review }: ReviewForm) => {
    if (loading) return;
    else setLoading(true);

    const { data }: ReviewReturn = await axios.post(
      `/api/shops/${router.query.id}/review`,
      {
        score,
        review,
      }
    );
    mutate();

    if (!data.ok) {
      console.log(data.error);
      setLoading(false);
    } else {
      setValue("review", "");
      setLoading(false);
    }
  };

  const onReviewDeleteClicked = async () => {
    if (loading) return;
    else setLoading(true);

    const { data }: ReviewDeleteReturn = await axios.delete(
      `/api/shops/${router.query.id}/review/${reviewId}`
    );
    mutate();

    if (!data.ok) {
      console.log(data.error);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  const onShopEditClicked = async () => {
    if (loading) return;
    else setLoading(true);
    router.push(`/shops/${router.query.id}/editor`);
  };

  const onShopDeleteClicked = async () => {
    if (loading) return;
    else setLoading(true);

    if (confirm("상점을 삭제하시겠습니까?")) {
      const deleteCheck = prompt(
        "정말로 삭제하시겠습니까?",
        "가게의 이름을 입력해주세요"
      );
      if (data && deleteCheck === data.shop.name) {
        alert("삭제가 완료되었습니다");
        const { data }: ShopDeleteReturn = await axios.delete(
          `/api/shops/${router.query.id}`
        );

        if (!data.ok) {
          console.log(data.error);
        } else {
          router.push("/");
        }
      } else {
        alert("가게 이름을 잘못 입력하셨습니다. 삭제 실패");
      }
    } else {
    }
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="relative">
        <h1 className="text-center text-xl text-violet-400">
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
      <div className="flex flex-col space-y-4 mb-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-2 text-center">
          <span className="flex items-center justify-center text-lg">⏰</span>
          <span className="text-violet-800 flex items-center justify-center">
            {data && minuteToTime(data.shop.startTime)}-
            {data && minuteToTime(data.shop.endTime)}
          </span>
        </div>

        <div className="grid grid-cols-2 text-center">
          <span className="flex items-center justify-center text-lg">🏠</span>
          <span className="text-violet-800 flex items-center justify-center">
            {data?.shop.location}
          </span>
        </div>

        <div className="grid grid-cols-2 text-center">
          <span className="flex items-center justify-center text-lg">🧾</span>
          <span className="text-violet-800 flex items-center justify-center">
            {data?.shop.description}
          </span>
        </div>
      </div>

      <div className="mb-10 mt-10 w-full flex justify-center">
        {data && retdata ? (
          data.shop.userId === retdata.userWithDetails.id ? (
            <div>
              <button
                onClick={() => {
                  onShopEditClicked();
                }}
                className="text-xs bg-blue-400 rounded-md p-2
            text-white hover:bg-blue-600 transition-colors mr-5"
              >
                Shop Edit
              </button>
              <button
                onClick={() => {
                  onShopDeleteClicked();
                }}
                className="text-xs bg-red-400 rounded-md p-2
            text-white hover:bg-red-600 transition-colors ml-5"
              >
                Shop Delete
              </button>
            </div>
          ) : (
            <Link href={`/shops/${router.query.id}/reservation`}>
              <a>
                <Button text="Reservate Now!" />
              </a>
            </Link>
          )
        ) : (
          <></>
        )}
      </div>

      <div className="py-2 grid grid-cols-[1fr_1fr_3fr_1fr] items-center mb-2 text-center font-bold">
        <span>Name</span>
        <span>Rating</span>
        <span>Review</span>
        <span>X</span>
      </div>

      {data?.shop.Reviews.map((review) => (
        <div
          key={review.id}
          className="py-2 grid grid-cols-[1fr_1fr_3fr_1fr] items-center mb-2 text-center"
        >
          <span>{review.createdUser.username}</span>
          <div className="flex items-center justify-center">
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
          </div>

          <span>{review.review}</span>
          <form onSubmit={handleSubmit(onReviewDeleteClicked)}>
            {retdata && review.createdUser.id === retdata.userWithDetails.id ? (
              <button
                onClick={() => {
                  setReviewId(review.id);
                }}
                className="text-red-500 font-bold"
              >
                X
              </button>
            ) : (
              <></>
            )}
          </form>
        </div>
      ))}

      <form
        onSubmit={handleSubmit(onValid)}
        className={
          data?.shop.userId === retdata?.userWithDetails.id ? "hidden" : ""
        }
      >
        <div className="w-full py-2 my-4 font-semibold text-center">
          Add your review
        </div>
        <div className="py-2 grid grid-cols-[1fr_1fr_3fr_1fr] items-center mb-2 text-center">
          <span>{retdata?.userWithDetails.username}</span>

          <div className="flex items-center justify-center">
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
          </div>
          <input
            type="text"
            className="focus:outline-none focus:border-violet-400 border-2 border-gray-200 rounded-md px-2 mx-8"
            {...register("review")}
          />
          <div>
            <Button text="Submit" />
          </div>
        </div>
      </form>

      <div
        className={
          data?.shop.userId === retdata?.userWithDetails.id ? "mt-24" : "hidden"
        }
      >
        <span className="py-2 grid items-center mb-2 text-center font-bold">
          Reservation List
        </span>
        <div className="py-2 grid grid-cols-[1fr_1fr_1fr] items-center mb-2 text-center font-bold">
          <span>Name</span>
          <span>Date</span>
          <span>Time</span>
        </div>

        {resdata?.reservations?.map((res) => (
          <div
            key={res.id}
            className="py-2 grid grid-cols-[1fr_1fr_1fr] items-center mb-2 text-center"
          >
            <span>{res.reservationUser.username}</span>
            <span>{res.date}</span>
            <span>
              {Math.floor(res.time / 60)}시 {res.time % 60}분
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
