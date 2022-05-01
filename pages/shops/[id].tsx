import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { cls } from "../../libs/utils";

interface Rev {
  id: number;
  review: string;
  score: number;
}

interface ShopDetailInfos {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  imageurl?: string;
  description: string;
  reviewAvg: number;
  heartCount: number;
  location: string;
  isLiked: boolean;
  reviews: Rev[];
}

const FAKE_DATA: ShopDetailInfos[] = [
  {
    id: 1,
    name: "ShopTest1",
    description: "Peroro chicken",
    startTime: "17:00",
    endTime: "03:00",
    imageurl:
      "https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/d9cf449d-b7d5-4006-0fb7-f6aff0f81600/public",
    reviewAvg: 7.8,
    location: "Busan",
    heartCount: 4,
    isLiked: true,
    reviews: [
      { review: "This shop is very good", id: 1, score: 4 },
      { review: "This shop sucks", id: 2, score: 2 },
    ],
  },
  {
    id: 2,
    name: "ShopTest2",
    description: "Mad guys, foods",
    startTime: "18:00",
    endTime: "22:00",
    imageurl:
      "https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/051c8ba8-4dc8-4da5-c966-8a483a61f700/public",
    reviewAvg: 6.9,
    location: "Suwon",
    heartCount: 11,
    isLiked: false,
    reviews: [
      { review: "This shop is perfecto", id: 3, score: 5 },
      { review: "I hate mad guys", id: 4, score: 1 },
    ],
  },
  {
    id: 3,
    name: "ShopTest3",
    description: "VIP Only",
    startTime: "16:00",
    endTime: "23:00",
    reviewAvg: 9.9,
    location: "Seoul",
    heartCount: 11,
    isLiked: false,
    reviews: [
      { review: "Expensive but awesone", id: 5, score: 5 },
      { review: "Tooo Heavy..., but taste is good", id: 6, score: 4 },
    ],
  },
];

export default function ShopIdElement() {
  const router = useRouter();
  const [itemData, setItemData] = useState<ShopDetailInfos>();
  const [isUserLiked, setIsUserLiked] = useState<boolean>(false);
  const [userLikes, setUserLikes] = useState(0);

  useEffect(() => {
    const id = router.query.id?.toString();
    if (id) {
      setItemData(FAKE_DATA[+id - 1]);
      setIsUserLiked(FAKE_DATA[+id - 1].isLiked);
      setUserLikes(FAKE_DATA[+id - 1].heartCount);
    }
  }, [router]);

  const onHeartClicked = () => {
    if (isUserLiked) setUserLikes((prev) => prev - 1);
    else setUserLikes((prev) => prev + 1);
    setIsUserLiked((prev) => !prev);
  };

  return (
    <>
      <Header />
      <div className="relative">
        <h1 className="text-center text-xl text-violet-400 mt-20">
          {itemData?.name}
        </h1>
        <button onClick={onHeartClicked} className="absolute right-4">
          {isUserLiked ? (
            <svg
              className="w-5 h-5 text-pink-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clip-rule="evenodd"
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          )}
          <span className="text-pink-500">{userLikes}</span>
        </button>
      </div>
      <div className="flex justify-center items-center my-8">
        {itemData?.imageurl ? (
          <img src={itemData.imageurl} className="h-96" />
        ) : (
          <div className="w-96 h-96 bg-slate-200" />
        )}
      </div>
      <div className="flex flex-col space-y-4 mb-8">
        <div className="grid grid-cols-[1fr_4fr] text-center">
          <span className="flex items-center justify-center text-lg">⏰</span>
          <span className="text-violet-800 flex items-center justify-center">
            {itemData?.startTime}-{itemData?.endTime}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_4fr] text-center">
          <span className="flex items-center justify-center text-lg">🏠</span>
          <span className="text-violet-800 flex items-center justify-center">
            {itemData?.location}
          </span>
        </div>

        <div className="grid grid-cols-[1fr_4fr] text-center">
          <span className="flex items-center justify-center text-lg">🧾</span>
          <span className="text-violet-800 flex items-center justify-center">
            {itemData?.description}
          </span>
        </div>
      </div>

      <div className="pl-4 mb-8">
        <div className="font-semibold text-lg mb-2">Reviews</div>
        {itemData?.reviews.map((review) => (
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

      <div></div>
    </>
  );
}
