import Link from "next/link";
import Header from "@components/Header";
import { cls, createImageUrl } from "@libs/utils";
import { Heart, Review, Shop, User, Reservation } from "@prisma/client";
import { useRouter } from "next/router";
import useSWR from "swr";

interface MyReservations extends Shop {
  reservationShop: Shop;
  reservationShopId: Number;
  date: String;
  time: String;
}

interface UserProfileInfo extends User {
  shops: Shop[];
  reviews: Review[];
  hearts: {
    select: {
      likedShopId: true;
    };
  };
  reservations: MyReservations[];
}

interface ReturnInfo {
  ok: boolean;
  userWithDetails?: UserProfileInfo;
}

export default function Profile() {
  const router = useRouter();
  const { data } = useSWR<ReturnInfo>(`/api/users/me`);
  console.log(data);

  return (
    <>
      <Header />
      <div className="flex items-center space-x-8 ml-8">
        {data?.userWithDetails?.avatarId ? (
          <img
            src={createImageUrl(data?.userWithDetails.avatarId, "public")}
            className="w-12 rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-500 rounded-full" />
        )}

        <span>{data?.userWithDetails?.username}</span>

        <Link href="/profile/edit">
          <a className="rounded-md bg-violet-400 text-white px-3 py-1.5">
            Edit
          </a>
        </Link>
      </div>

      <div className="ml-8 mt-8">
        <span className="text-lg font-semibold mb-8">Your Shops</span>
        {data?.userWithDetails?.shops.map((shop) => (
          <div key={shop.id} className="my-2">
            <Link href={`/shops/${shop.id}`}>
              <a className="rounded-md bg-violet-400 text-white px-3 py-1.5">
                {shop.name}
              </a>
            </Link>
          </div>
        ))}
      </div>

      <div className="ml-8 mt-8">
        <span className="text-lg font-semibold">Your Reviews</span>
        {data?.userWithDetails?.reviews.map((review) => (
          <div key={review.id} className="py-2 flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                className={cls(
                  "w-5 h-5",
                  star <= review.score ? "text-yellow-400" : "text-gray-600"
                )}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                key={star}
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}

            <span className="ml-8">{review.review}</span>
          </div>
        ))}
      </div>

      <div className="ml-8 mt-8">
        <span className="text-lg font-semibold mb-8">Your Reservations</span>
        {data?.userWithDetails?.reservations.map((reservations) => (
          <div key={reservations.id} className="my-2">
            <Link href={`/shops/${reservations.reservationShopId}`}>
              <a className="rounded-md bg-violet-400 text-white px-3 py-1.5">
                {reservations.reservationShop.name} {reservations.date}{" "}
                {reservations.time}
              </a>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
