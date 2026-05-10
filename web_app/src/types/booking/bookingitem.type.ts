import { PriceType } from "../enums/PriceType.enum";

export interface BookingItemResponse {
  id: string;
  booking: string;
  priceType: PriceType;
  quantity: number;
  unitPrice: number;
}

export interface BookingItemRequest {
  priceType: PriceType;
  quantity: number;
  unitPrice: number;
}
