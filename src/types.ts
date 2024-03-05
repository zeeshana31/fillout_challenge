import { Request } from 'express'

export type FilteredResponseRequest = Request<
  { formId: string },
  {},
  {},
  {
    limit: string
    afterDate: string
    beforeDate: string
    offset: string
    status: string
    includeEditLink: string
    sort: string
    filters: string
  }
>

export type FilterClauseType = {
  id: string
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than'
  value: number | string
}
