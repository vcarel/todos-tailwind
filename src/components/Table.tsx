// API inspired from https://ant.design/components/table

type Column = {
  title: string
  key: string | number
  headClassName?: string
  render?: (value: any, row: any, index: number) => JSX.Element | string // eslint-disable-line @typescript-eslint/no-explicit-any
}

type dataRow = {
  [field: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

type Props = {
  columns: Column[]
  dataRows: dataRow[]
  rowKey?: string
}

const Table = ({ columns, dataRows, rowKey = "key" }: Props): JSX.Element => {
  return (
    <table className="min-w-full divide-y divide-gray-200 table-fixed">
      <thead className="bg-gray-50">
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                col.headClassName || ""
              }`}
              scope="col"
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataRows.map(row => (
          <tr key={row[rowKey]} className="bg-white">
            {columns.map((col, index) => (
              <td key={col.key} className="px-6 py-4 text-sm text-gray-500">
                {col.render ? col.render(row[col.key], row, index) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table
