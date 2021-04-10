import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import nock from "nock"
import { QueryClient, QueryClientProvider, setLogger } from "react-query"
import Todos from "./Todos"
import { Todo } from "~/queries/todos"

setLogger({ error: () => null, log: () => null, warn: () => null })
const clientOptions = { defaultOptions: { queries: { retry: 1, retryDelay: 0 } } }

const mockedData: Todo[] = [
  {
    completed: false,
    id: 1,
    title: "delectus aut autem",
    userId: 1,
  },
  {
    completed: false,
    id: 2,
    title: "quis ut nam facilis et officia qui",
    userId: 1,
  },
  {
    completed: false,
    id: 3,
    title: "fugiat veniam minus",
    userId: 1,
  },
  {
    completed: true,
    id: 4,
    title: "et porro tempora",
    userId: 1,
  },
]

describe("<Todos>", () => {
  describe("loader & error management", () => {
    it("should display loader first", () => {
      nock("http://localhost").get("/todos").reply(200)
      render(
        <QueryClientProvider client={new QueryClient(clientOptions)}>
          <Todos />
        </QueryClientProvider>
      )
      expect(screen.getByText("Loading")).toBeInTheDocument()
    })

    it("should display error when API is not available", async () => {
      nock("http://localhost").get("/todos").reply(404)
      render(
        <QueryClientProvider client={new QueryClient(clientOptions)}>
          <Todos />
        </QueryClientProvider>
      )
      await waitFor(() =>
        expect(screen.getByText("Oops. The API returned a HTTP 404…")).toBeInTheDocument()
      )
    })
  })

  describe("empty data", () => {
    it("should display empty message when no data", async () => {
      nock("http://localhost").get("/todos").reply(200, [])
      render(
        <QueryClientProvider client={new QueryClient(clientOptions)}>
          <Todos />
        </QueryClientProvider>
      )

      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())
      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([["#", "Title", "Completed"]])
      expect(screen.getByText("Your todo list is empty")).toBeInTheDocument()
    })
  })

  describe("data & filters", () => {
    beforeEach(() => {
      nock("http://localhost").get("/todos").reply(200, mockedData)
      render(
        <QueryClientProvider client={new QueryClient(clientOptions)}>
          <Todos />
        </QueryClientProvider>
      )
    })

    it("should display all data", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())
      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([
        ["#", "Title", "Completed"],
        ["1", "delectus aut autem", "No"],
        ["2", "quis ut nam facilis et officia qui", "No"],
        ["3", "fugiat veniam minus", "No"],
        ["4", "et porro tempora", "Yes"],
      ])
    })

    it("should filter by status = completed", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())

      screen.getByRole("button", { name: "Completed" }).click()

      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([
        ["#", "Title", "Completed"],
        ["4", "et porro tempora", "Yes"],
      ])
    })

    it("should filter by status = to do", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())

      screen.getByRole("button", { name: "To do" }).click()

      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([
        ["#", "Title", "Completed"],
        ["1", "delectus aut autem", "No"],
        ["2", "quis ut nam facilis et officia qui", "No"],
        ["3", "fugiat veniam minus", "No"],
      ])
    })

    it("should reset status filter", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())

      screen.getByRole("button", { name: "To do" }).click()
      screen.getByRole("button", { name: "All" }).click()

      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([
        ["#", "Title", "Completed"],
        ["1", "delectus aut autem", "No"],
        ["2", "quis ut nam facilis et officia qui", "No"],
        ["3", "fugiat veniam minus", "No"],
        ["4", "et porro tempora", "Yes"],
      ])
    })

    it("should filter by text", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())

      const input = screen.getByRole("searchbox")
      fireEvent.change(input, { target: { value: "et" } })

      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([
        ["#", "Title", "Completed"],
        ["2", "quis ut nam facilis et officia qui", "No"],
        ["4", "et porro tempora", "Yes"],
      ])
    })

    it("should combine filters", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())

      const input = screen.getByRole("searchbox")
      fireEvent.change(input, { target: { value: "et" } })
      screen.getByRole("button", { name: "To do" }).click()

      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([
        ["#", "Title", "Completed"],
        ["2", "quis ut nam facilis et officia qui", "No"],
      ])
    })

    it("should display no result message when no matching filters", async () => {
      await waitFor(() => expect(screen.getByRole("table")).toBeInTheDocument())

      const input = screen.getByRole("searchbox")
      fireEvent.change(input, { target: { value: "will not find anything" } })

      const tableContent = screen
        .getAllByRole("row")
        .map(row => Array.from(row.children).map(cell => cell.textContent?.trim()))
      expect(tableContent).toEqual([["#", "Title", "Completed"]])
      expect(screen.getByText("No result found")).toBeInTheDocument()
    })
  })
})
