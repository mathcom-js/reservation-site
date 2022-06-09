import { minuteToTime } from "@libs/time";
import { Shop, Review } from "@prisma/client";
import Link from "next/link";
import { createImageUrl } from "../libs/utils";

interface ShopInfo extends Shop {
  Reviews: Review[];
  _count: {
    hearts: number;
  };
}

const ShopThumbnail = ({
  description,
  endTime,
  startTime,
  imageId,
  id,
  location,
  name,
  Reviews,
  _count: { hearts },
}: ShopInfo) => {
  let total = 0;
  Reviews.forEach((Review) => {
    total += Review.score;
  });
  const avg = Reviews.length !== 0 ? total / Reviews.length : 0;
  return (
    <div className="w-full border shadow-lg rounded-xl" key={id}>
      <div className="grid grid-cols-[3fr_2fr]">
        <Link href={`/shops/${id}`}>
          <a className="flex items-center justify-center py-4">
            {imageId ? (
              <img src={createImageUrl(imageId, "regular")} className="w-48" />
            ) : (
              <div className="w-48 h-48 bg-slate-200" />
            )}
          </a>
        </Link>
        <div className="flex flex-col justify-between py-4 text-center">
          <span className="text-violet-400 ">{name}</span>

          <div className="grid grid-cols-[1fr_4fr] text-center">
            <span className="flex items-center justify-center text-sm">⏰</span>
            <span className="text-violet-800 flex items-center justify-center">
              {minuteToTime(startTime)}-{minuteToTime(endTime)}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_4fr] text-center">
            <span className="flex items-center justify-center text-sm">🏠</span>
            <span className="text-violet-800 flex items-center justify-center">
              {location}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_4fr] text-center">
            <span className="flex items-center justify-center text-sm">🧾</span>
            <span className="text-violet-800 flex items-center justify-center text-xs">
              {description}
            </span>
          </div>

          <div className="grid grid-cols-2">
            <div className="flex justify-center space-x-2">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
              <span>{avg}</span>
            </div>

            <div className="flex justify-center space-x-2">
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
              <span>{hearts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopThumbnail;
