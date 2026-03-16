export type ProductDto = {
  id: number;
  branchProductId: number;
  name: string;
  imageUrl: string | null;
  originalPrice: number;
  finalPrice: number;
  offerPrice: number | null;
  hasDiscount: boolean;
  discountPercentage: number | null;
};
