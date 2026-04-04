import { useQuery } from "@tanstack/react-query";
import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";

export type Banner = {
  id: number;
  name: string;
  position: number;
  imageUrl: string;
};

const bannerRepository = {
  getBanner: () => {
    return get<Banner[]>(requests.banners.getBanners);
  },
};

export function useBanners() {
  return useQuery({
    queryKey: ["banners"],
    queryFn: () => bannerRepository.getBanner(),
    refetchOnMount: "always",
  });
}
