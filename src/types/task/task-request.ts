import { PaginationParamsType, PaginationType } from "../pagination"

export type QueryTasksType = {
  userId: string

  name?: string
  startDate?: string
  endDate?: string
}

export type QueryTasksRouterType = QueryTasksType & PaginationParamsType

export type QueryTasksRepositoryType = QueryTasksType & PaginationType

export type URIParamTaskIdType = {
  id: string
}
