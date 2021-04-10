import { ReactNode } from "react"

type Props = { children: ReactNode }

const Layout = ({ children }: Props): JSX.Element => (
  <div className="min-h-screen bg-gray-100">
    <div className="bg-indigo-600 pb-32">
      <header className="pt-12 pb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Todos</h1>
        </div>
      </header>
    </div>

    <main className="-mt-32 pt-2.5">
      <div className="max-w-7xl mx-auto pb-12 sm:px-6 lg:px-8">{children}</div>
    </main>
  </div>
)

export default Layout
