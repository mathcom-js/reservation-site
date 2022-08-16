import { Review, Shop, User, Reservation } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import Header from "@components/Header";
import { cls, createImageUrl } from "@libs/utils";
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

export default function ShopIdElement() {
  const router = useRouter();

  const { data, mutate } = useSWR<ShopReturn>(
    router.query.id ? `/api/shops/${router.query.id}` : null
  );

  return (
    <>
      <Header />
      <div className="relative">
        <h1 className="text-center text-xl text-violet-400">
          {data?.shop.name}
        </h1>
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
        </div>
      ))}
    </>
  );
}
