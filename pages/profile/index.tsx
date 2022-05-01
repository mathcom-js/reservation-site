import Link from "next/link";
import Header from "../../components/Header";
import { cls } from "../../libs/utils";

interface UserProfileInfo {
  id: number;
  username: string;
  shops: { id: number; name: string }[];
  reviews: { id: number; review: string; score: number }[];
  avatar?: string;
}

const FAKE_DATA: UserProfileInfo = {
  id: 1,
  username: "Sinclairr",
  shops: [{ id: 1, name: "Test1" }],
  reviews: [{ id: 1, review: "This Was good", score: 5 }],
  avatar:
    "https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/d9cf449d-b7d5-4006-0fb7-f6aff0f81600/avatar",
};

export default function Profile() {
  return (
    <>
      <Header />
      <div className="mt-20 flex items-center space-x-8 ml-8">
        {FAKE_DATA.avatar ? (
          <img src={FAKE_DATA.avatar} className="w-12 rounded-full" />
        ) : (
          <div className="w-12 h-12 bg-slate-500 rounded-full" />
        )}

        <span>{FAKE_DATA.username}</span>

        <Link href="/profile/edit">
          <a className="rounded-md bg-violet-400 text-white px-3 py-1.5">
            Edit
          </a>
        </Link>
      </div>

      <div className="ml-8 mt-8">
        <span className="text-lg font-semibold mb-8">Your Shops</span>
        {FAKE_DATA.shops.map((shop) => (
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
        {FAKE_DATA.reviews.map((review) => (
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
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}

            <span className="ml-8">{review.review}</span>
          </div>
        ))}
      </div>
    </>
  );
}
