import React from "react"
import { unstable_createRoot } from "react-dom"
import App from "./App"
import "~/styles/index.css"

const rootElement = document.getElementById("root")

if (rootElement) {
  unstable_createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
