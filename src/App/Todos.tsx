import { CheckIcon, SearchIcon, XIcon } from "@heroicons/react/solid"
import { useMemo, useState } from "react"
import Highlighter from "react-highlight-words"
import ButtonGroup from "~/components/ButtonGroup"
import Loader from "~/components/Loader"
import Table from "~/components/Table"
import { Todo, useTodos } from "~/queries/todos"

enum StatusFilter {
  all,
  completed,
  todo,
}

type FilterableTodo = Todo & { lowerCaseTitle: string }

const Todos = (): JSX.Element => {
  const { data, error } = useTodos()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(StatusFilter.all)

  // --- Search logic ---

  const filterableData = useMemo(
    () =>
      data?.map<FilterableTodo>(todo => ({ ...todo, lowerCaseTitle: todo.title.toLowerCase() })),
    [data]
  )

  const { filteredData, hasMatchingText, searchTokens } = useMemo(() => {
    if (!filterableData) {
      return {}
    }

    let filteredData = filterableData

    if (statusFilter === StatusFilter.completed) {
      filteredData = filteredData.filter(todo => todo.completed)
    } else if (statusFilter === StatusFilter.todo) {
      filteredData = filteredData.filter(todo => !todo.completed)
    }

    const trimmedSearch = search.trim()

    const searchTokens = trimmedSearch.toLowerCase().split(/\s+/)
    const hasMatchingText = (todo: FilterableTodo) => {
      return (
        searchTokens[0] === "" || searchTokens.every(token => todo.lowerCaseTitle.includes(token))
      )
    }

    if (trimmedSearch) {
      filteredData = filteredData.filter(hasMatchingText)
    }

    return { filteredData, hasMatchingText, searchTokens }
  }, [filterableData, search, statusFilter])

  // --- Render full-page loader ---

  if (error || !filteredData || !hasMatchingText) {
    return <Loader error={error} />
  }

  // --- Table cell renderers ---

  const Completed = (value: boolean) =>
    value ? (
      <>
        <CheckIcon className="h-5 w-5 text-green-500 inline" /> Yes
      </>
    ) : (
      <>
        <XIcon className="h-5 w-5 text-indigo-500 inline" /> No
      </>
    )

  const Title = (value: string, row: FilterableTodo) => {
    const isMatching = hasMatchingText(row)
    return isMatching ? (
      <Highlighter
        autoEscape
        highlightClassName="font-bold text-black bg-yellow-300"
        searchWords={searchTokens || []}
        textToHighlight={value}
      />
    ) : (
      value
    )
  }

  // --- Table setup ---

  const columns = [
    {
      key: "id",
      title: "#",
    },
    {
      headClassName: "w-3/4",
      key: "title",
      render: Title,
      title: "Title",
    },
    {
      headClassName: "w-1/6",
      key: "completed",
      render: Completed,
      title: "Completed",
    },
  ]

  return (
    <>
      <div className="bg-white sm:rounded-lg shadow overflow-hidden sm:mb-6 py-2">
        <div className="my-2 whitespace-nowrap sm:inline">
          <label
            className="text-gray-600 ml-4 mr-4 font-semibold w-14 inline-block sm:w-auto sm:text-sm"
            htmlFor="search"
          >
            Search
          </label>
          <div className="relative rounded-md shadow-sm inline-block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="focus:ring-indigo-500 focus:border-indigo-500 block pl-10 sm:text-sm border-gray-300 rounded-md placeholder-gray-400 w-auto sm:w-48 md:w-64"
              id="search"
              placeholder="Keywords"
              size={16}
              type="search"
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="my-2 whitespace-nowrap sm:inline sm:ml-2 md:ml-4">
          <label
            className="text-gray-600 ml-4 mr-4 font-semibold w-14 inline-block sm:w-auto sm:text-sm"
            htmlFor="search"
          >
            Status
          </label>
          <ButtonGroup>
            {/* Buttons use two handlers here: onClick for keyboard navigation, and onMouseDown for UI reactivity  */}
            <ButtonGroup.Button
              active={statusFilter === StatusFilter.all}
              onClick={() => setStatusFilter(StatusFilter.all)}
              onMouseDown={() => setStatusFilter(StatusFilter.all)}
            >
              All
            </ButtonGroup.Button>
            <ButtonGroup.Button
              active={statusFilter === StatusFilter.completed}
              onClick={() => setStatusFilter(StatusFilter.completed)}
              onMouseDown={() => setStatusFilter(StatusFilter.completed)}
            >
              Completed
            </ButtonGroup.Button>
            <ButtonGroup.Button
              active={statusFilter === StatusFilter.todo}
              onClick={() => setStatusFilter(StatusFilter.todo)}
              onMouseDown={() => setStatusFilter(StatusFilter.todo)}
            >
              To do
            </ButtonGroup.Button>
          </ButtonGroup>
        </div>
      </div>

      <div className="bg-white sm:rounded-lg shadow overflow-hidden min-h-96">
        <Table columns={columns} dataRows={filteredData} rowKey="id" />
        {(data?.length || 0) === 0 && (
          <div className="px-6 py-3 text-center italic text-gray-700">Your todo list is empty</div>
        )}
        {(data?.length || 0) > 0 && filteredData.length === 0 && (
          <div className="px-6 py-3 text-center italic text-gray-700">No result found</div>
        )}
      </div>
    </>
  )
}

export default Todos
