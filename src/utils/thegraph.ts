import axios from "axios"

type GraphVariables = { [key: string]: string | number | string[] }

export const fetchQuery = (query: string, variables: GraphVariables, endpoint: string) => {
  return axios.post(endpoint, { query, variables })
}
