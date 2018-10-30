export class PageResultModel<T> {
    metaData: PageMetaData;
    items: T[];
}

export class PageMetaData {
    PageCount: number;
    TotalItemCount: number;
    PageNumber: number;
    PageSize: number;
    HasPreviousPage: boolean;
    HasNextPage: boolean;
    IsFirstPage: boolean;
    IsLastPage: boolean;
    FirstItemOnPage: number;
    LastItemOnPage: number;
}
