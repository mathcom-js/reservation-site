import { Shop, Review } from "@prisma/client";
import useSWR from "swr";
import Header from "@components/Header";
import ShopThumbnail from "@components/ShopThumbnail";

interface ShopInfo extends Shop {
  Reviews: Review[];
  _count: {
    hearts: number;
  };
}

interface ShopsReturn {
  ok: boolean;
  shops: ShopInfo[];
}

export default function Browse() {
  const { data } = useSWR<ShopsReturn>("/api/shops");
  return (
    <>
      <Header />
      <h1 className="text-center text-lg text-violet-400">Browse Shops</h1>
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center mt-12 space-y-8">
        {data?.shops.map((shop) => ShopThumbnail(shop))}
      </div>
    </>
  );
}
