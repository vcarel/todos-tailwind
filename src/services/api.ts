export class CancelablePromise<PayloadType> extends Promise<PayloadType> {
  public cancel?: () => void
}

export const jsonGet = <PayloadType>(url: string): CancelablePromise<PayloadType> => {
  const controller = new AbortController()
  const promise: CancelablePromise<PayloadType> = (async () => {
    const response = await fetch(url, { mode: "cors", signal: controller.signal })
    if (!response.ok) {
      await handleKoResponse<PayloadType>("GET", url, response)
    }
    return await response.json()
  })()
  promise.cancel = () => controller.abort()
  return promise
}

export class FetchError<PayloadType> extends Error {
  method: string
  url: string
  status: number
  jsonData: PayloadType

  constructor(method: string, url: string, status: number, jsonData: PayloadType) {
    super("API error")
    this.method = method
    this.url = url
    this.status = status
    this.jsonData = jsonData
  }
}

const handleKoResponse = async <PayloadType>(method: string, url: string, response: Response) => {
  const jsonData: PayloadType =
    response.headers.get("Content-Type") === "application/json" ? await response.json() : null
  throw new FetchError<PayloadType>(method, url, response.status, jsonData)
}
