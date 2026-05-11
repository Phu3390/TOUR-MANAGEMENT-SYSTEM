import type { ApiResponse } from "../ApiResponse.type";
import type { BaseQueryRequest, PageResponse } from "../pagination.type";
import type { TourResponse } from "./tour.type";

export interface ReviewRequest {
  rating: number;
  content: string;
  imageUrl?: string;
}

export interface ReviewResponse {
  id: string;
  tour: TourResponse;
  userId: string;
  reviewerName: string;
  rating: number;
  content: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ReviewQueryRequest extends BaseQueryRequest {
  tourId?: string;
  userId?: string;
  reviewerName?: string;
  minRating?: number;
  maxRating?: number;
}

export type PageReviewResponse = ApiResponse<PageResponse<ReviewResponse>>;

export type ListDetailReviewResponse = ApiResponse<ReviewResponse[]>;

export type DetailReviewResponse = ApiResponse<ReviewResponse>;