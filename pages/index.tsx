import { User } from "@prisma/client";
import { useState } from "react";
import Header from "../components/Header";
import ShopThumbnail, { ShopInfos } from "../components/ShopThumbnail";

const FAKE_DATA: ShopInfos[] = [
  {
    id: 1,
    name: "ShopTest1",
    description: "Peroro chicken",
    startTime: "17:00",
    endTime: "03:00",
    imageurl:
      "https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/d9cf449d-b7d5-4006-0fb7-f6aff0f81600/regular",
    reviewAvg: 7.8,
    location: "Busan",
    heartCount: 4,
    isLiked: true,
  },
  {
    id: 2,
    name: "ShopTest2",
    description: "Mad guys, foods",
    startTime: "18:00",
    endTime: "22:00",
    imageurl:
      "https://imagedelivery.net/BDH_sV5MMFDjmj9Ky8ZKTQ/051c8ba8-4dc8-4da5-c966-8a483a61f700/regular",
    reviewAvg: 6.9,
    location: "Suwon",
    heartCount: 11,
    isLiked: false,
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
  },
];

export default function Browse() {
  const [itemList, setItemList] = useState<ShopInfos[]>(FAKE_DATA);
  return (
    <>
      <Header />
      <h1 className="text-center text-lg text-violet-400 mt-20">
        Browse Shops
      </h1>
      <div className="w-full max-w-3xl mx-auto grid grid-cols-2 mt-12 gap-8">
        {itemList?.map((item) => ShopThumbnail(item))}
      </div>
    </>
  );
}
