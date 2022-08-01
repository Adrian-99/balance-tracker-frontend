import ApiResponse from "./api-response";

export default interface Page<T> extends ApiResponse<T[]> {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    isLastPage: boolean;
}