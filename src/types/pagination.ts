export type PaginationType = {
  page: number
  pageSize: number
}

export type PaginationParamsType = {
  page: string
  pageSize: string
}

export type PaginationResponseType<T> = {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}
