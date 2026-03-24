import { get } from "@/src/shared/http/http";
import { requests } from "@/src/shared/http/endpoints";
import { PaymentMethod } from "../types/Checkout";

export const paymentMethodRepository = {
  getAll: async (): Promise<PaymentMethod[]> => {
    try {
      const response = await get<PaymentMethod[]>(requests.paymentMethod.getAll);
      if (response && response.length > 0) return response;
      throw new Error("No data");
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      throw error;
    }
  },
};
