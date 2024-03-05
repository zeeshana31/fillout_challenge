require('dotenv').config()

import axios from 'axios'
import cors from 'cors'
import express, { Response } from 'express'
import helmet from 'helmet'
import { FilterClauseType, FilteredResponseRequest } from './types'
import { compareCondition } from './utils'

const app = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(helmet())
app.use(express.json())

const { API_KEY, API_URL } = process.env

app.get(
  '/:formId/filteredResponses',
  async (req: FilteredResponseRequest, res: Response) => {
    const { formId } = req.params
    const { filters } = req.query

    const paramsKeys = [
      'limit',
      'afterDate',
      'beforeDate',
      'offset',
      'status',
      'includeEditLink',
      'sort',
    ]

    const params = {}

    Object.entries(req.query).map(([key, value]) => {
      if (paramsKeys.includes(key)) {
        params[key] = value
      }
    })

    const result = await axios.get(
      `${API_URL}/v1/api/forms/${formId}/submissions`,
      {
        headers: { Authorization: `Bearer ${API_KEY}` },
        params,
      }
    )

    const filtersQuery: FilterClauseType[] = JSON.parse(filters)

    if (filtersQuery) {
      result.data.responses = result.data.responses.filter((response) => {
        return filtersQuery.every((condition) => {
          return response.questions.some((question) => {
            if (question.id === condition.id) {
              return compareCondition(
                condition.condition,
                question.value,
                condition.value
              )
            }
            return false
          })
        })
      })
    }

    result.data.totalResponses = result.data.responses.length
    result.data.pageCount = Math.ceil(
      result.data.responses.length / parseInt(req.query.limit)
    )

    return res.json(result.data)
  }
)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
