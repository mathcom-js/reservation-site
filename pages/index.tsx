import { useState } from "react";
import Header from "../components/Header";

interface ItemProps {
  name: string;
  startTime: string;
  endTime: string;
  imgurl?: string;
  star: number;
  description: string;
}

const DEFAULT_IMG_URL =
  "https://cdn-lostark.game.onstove.com/uploadfiles/shop/5171483d30e344b381b869225d2544ed.jpg";

const ItemShow = (item: ItemProps) => {
  return (
    <div className="w-full border shadow-lg rounded-xl" key={item.name}>
      <div className="text-center text-violet-400 py-2 ">{item.name}</div>
      <div className="grid grid-cols-[2fr_1fr] h-40">
        <div className="flex items-center justify-center">
          {item.imgurl ? (
            <img src={item.imgurl} className="w-24" />
          ) : (
            <img src={DEFAULT_IMG_URL} className="w-24" />
          )}
        </div>
        <div className="flex flex-col justify-between mb-4 text-center">
          <span className="text-violet-800">Open</span>
          <span className="text-xs">{item.startTime}</span>
          <span className="text-violet-800">Close</span>
          <span className="text-xs">{item.endTime}</span>
          <span className="flex justify-center space-x-2">
            <svg
              className="w-6 h-6 text-yellow-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
            </svg>
            <span>{item.star}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default function Browse() {
  const [itemList, setItemList] = useState<ItemProps[] | undefined>([
    {
      name: "ShopTest1",
      description: "This is awesome shop!!",
      startTime: "17:00",
      endTime: "24:00",
      star: 9.8,
    },
    {
      name: "ShopTest2",
      description: "This is kind shop!!",
      startTime: "17:00",
      endTime: "24:00",
      star: 5.9,
    },
  ]);
  return (
    <>
      <Header />
      <div className="max-w-xl w-full flex flex-col mx-auto mt-20 space-y-8">
        <h1 className="text-center text-lg text-violet-400">Browse Shops</h1>
        {itemList?.map((item) => ItemShow(item))}
      </div>
    </>
  );
}
