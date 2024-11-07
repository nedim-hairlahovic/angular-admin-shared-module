import { DataTablePaginationType } from "./data-table";

export interface Pagination {
    getContentKey(): string;
    getCurrentPageKey(): string;
    getTotalPagesKey(): string;
    getTotalElementsKey(): string;
    getRequestParams(page: number, size: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): any;
}

export class SpringPagination implements Pagination {
    getContentKey(): string {
        return 'content';
    }

    getCurrentPageKey(): string {
        return 'currentPage';
    }

    getTotalPagesKey(): string {
        return 'totalPages';
    }

    getTotalElementsKey(): string {
        return 'totalElements';
    }

    getRequestParams(page: number, size: number, sortBy?: string, sortOrder?: 'ASC' | 'DESC'): any {
        const params = {
            page: page,
            size: size
        } as any;

        if (sortBy && sortOrder) {
            params.sort = `${sortBy},${sortOrder}`;
        }

        return params;
    }
}

export class PaginationFactory {
    static createPagination(type: DataTablePaginationType): Pagination {
        switch (type) {
            case DataTablePaginationType.SPRING:
                return new SpringPagination();
            default:
                throw new Error('Invalid pagination type');
        }
    }
}
