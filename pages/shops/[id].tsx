import { Review, Shop } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Header from "@components/Header";
import { cls, createImageUrl } from "@libs/utils";

interface ShopWithDetails extends Shop {
  user: {
    username: string;
  };
  Reviews: Review[];
  _count: {
    hearts: number;
  };
}

interface ShopReturn {
  ok: boolean;
  shop: ShopWithDetails;
  isLiked: boolean;
}

export default function ShopIdElement() {
  const router = useRouter();
  const { data, mutate } = useSWR<ShopReturn>(
    router.query.id ? `/api/shops/${router.query.id}` : null
  );

  const onHeartClicked = () => {
    if (!data || !router.query.id) return;

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
    axios.post(`/api/shops/${router.query.id}/heart`);
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

      <div className="pl-4 mb-8">
        <div className="font-semibold text-lg mb-2">Reviews</div>
        {data?.shop.Reviews.map((review) => (
          <div key={review.id} className="py-2 flex items-center">
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
          </div>
        ))}
      </div>

      <div></div>
    </>
  );
}
