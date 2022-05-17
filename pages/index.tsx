import { Shop, User } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import ShopThumbnail from "../components/ShopThumbnail";

interface ShopsReturn {
  data: {
    ok: boolean;
    shops: Shop[];
  };
}

export default function Browse() {
  const [shopList, setShopList] = useState<Shop[]>([]);
  useEffect(() => {
    async function getShops() {
      const {
        data: { shops },
      }: ShopsReturn = await axios.get("/api/shops");
      setShopList(shops);
    }
    getShops();
  }, []);
  return (
    <>
      <Header />
      <h1 className="text-center text-lg text-violet-400 mt-20">
        Browse Shops
      </h1>
      <div className="w-full max-w-3xl mx-auto grid grid-cols-2 mt-12 gap-8">
        {shopList?.map((shop) => ShopThumbnail(shop))}
      </div>
    </>
  );
}
