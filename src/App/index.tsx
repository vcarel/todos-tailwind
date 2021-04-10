import { QueryClient, QueryClientProvider } from "react-query"
import Todos from "./Todos"
import Layout from "~/components/Layout"

const queryClient = new QueryClient()

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Todos />
      </Layout>
    </QueryClientProvider>
  )
}

export default App
