import { Shop, User } from "@prisma/client";
import useSWR from "swr";
import Header from "@components/Header";
import ShopThumbnail from "@components/ShopThumbnail";

interface ShopsReturn {
  ok: boolean;
  shops: Shop[];
}

export default function Browse() {
  const { data, error } = useSWR<ShopsReturn>("/api/shops");
  return (
    <>
      <Header />
      <h1 className="text-center text-lg text-violet-400 mt-20">
        Browse Shops
      </h1>
      <div className="w-full max-w-3xl mx-auto grid grid-cols-2 mt-12 gap-8">
        {data?.shops.map((shop) => ShopThumbnail(shop))}
      </div>
    </>
  );
}
