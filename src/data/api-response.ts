export default interface ApiResponse<T> {
    successful: boolean;
    translationKey?: string;
    data: T;
}