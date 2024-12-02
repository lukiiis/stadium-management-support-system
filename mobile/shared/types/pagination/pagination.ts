export type PaginatedResult<T> = {
    totalCount: number;
    page: number;
    pageSize: number;
    items: T[];
};