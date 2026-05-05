import type { ApiResponse } from "../ApiResponse.type";
import type { PriceType } from "../enums/PriceType.enum";

export interface TourPriceRequest {
  price: number;
  priceType: PriceType;
}

export interface TourPriceResponse {
    id: string;
    price: number;
    priceType: PriceType;
    createdAt: string;
}

export type FormListTourPriceResponse = ApiResponse<TourPriceResponse[]>

export type FormTourPriceResponse = ApiResponse<TourPriceResponse>
