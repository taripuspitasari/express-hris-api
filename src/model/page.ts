export type Paging = {
  current_page: number;
  size: number;
  total_page: number;
};

export type Pageable<T> = {
  data: Array<T>;
  paging: Paging;
};
