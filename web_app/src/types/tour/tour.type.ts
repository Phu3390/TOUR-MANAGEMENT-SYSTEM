import type { ApiResponse } from "../ApiResponse.type";
import type { TourStatus } from "../enums/TourStatus.enum";
import { TourType } from "../enums/TourType.enum";
import type { BaseQueryRequest, PageResponse } from "../pagination.type";
import type { TourDetailRequest, TourDetailResponse } from "./tourdetail.type";

export interface TourRequest {
  title: string;
  slug: string;
  location: string;
  duration: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  gallery: string[];
  rating?: number;
  totalReviews?: number;
  tourType: TourType;
  status: TourStatus;
}

export interface TourResponse {
  id: string;
  title: string;
  slug: string;
  location: string;
  duration: string;
  shortDesc: string;
  longDesc: string;
  imageUrl: string;
  gallery: string[];
  rating: number;
  totalReviews: number;
  tourType: TourType;
  status: TourStatus;
  createdAt: string;
  updatedAt: string;
  tourDetails: TourDetailResponse[];
}

export interface CreateTourRequest{
  tour: TourRequest;
  tourDetails: TourDetailRequest[];
}

export interface TourQueryRequest extends BaseQueryRequest {
  status?: TourStatus; 
  location?: string;
  duration?: string;
  tourType?: TourType;
  minRating?: number;
  maxRating?: number;
  minPrice?: number;
  maxPrice?: number;
}

export interface UploadImageResponse {
  handle: string;
  url: string;
}

export type FormUploadImageResponse = ApiResponse<UploadImageResponse>

export type FormUploadImagesResponse = ApiResponse<UploadImageResponse[]>

export type PageTourResponse = ApiResponse<PageResponse<TourResponse>>

export type DetailTourResponse = ApiResponse<TourResponse>
