import { PaginationParamsType, PaginationType } from "../pagination"

export type QueryUsersType = {
  email?: string
}

export type QueryUsersRouterType = QueryUsersType & PaginationParamsType

export type QueryUsersRepositoryType = QueryUsersType & PaginationType

export type URIParamUserIdType = {
  id: string
}
