import { useQuery } from "react-query"
import { jsonGet } from "~/services/api"

export type Todo = {
  id: number
  completed: boolean
  title: string
  userId: number
}

export const useTodos = () => {
  return useQuery(["todos"], () => jsonGet<Todo[]>(process.env.REACT_APP_API_URL || ""))
}
