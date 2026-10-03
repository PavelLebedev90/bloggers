export type PaginationMetaView = {
  totalCount: number;
  pageSize: number;
  page: number;
  pagesCount: number;
};

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export type Queries<S extends string> = {
  pageNumber: number;
  pageSize: number;
  sortBy: S;
  sortDirection: SortDirection;
};
