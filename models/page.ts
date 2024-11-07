export interface Page<T> {
    content: T[];
    totalPages: number;
    currentPage: number;
    totalElements: number;
    last: boolean;
}
