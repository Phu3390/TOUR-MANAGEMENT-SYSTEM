export interface BaseQueryRequest {
  keyword?: string;
  pageNumber?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  filters?: Map<string, unknown>;
}


export interface PageResponse<T> {
    content: T[];
    pageNumber: number;
    size: number;
    totalElements: number;
    totalPages: number;
    sizeCurrent: number; 
}

