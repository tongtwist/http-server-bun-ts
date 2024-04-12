import type {Socket} from "bun"

export type HTTPRequestStartLine = {
  readonly method: string
  readonly path: string
  readonly version: string
}

export type Headers = {[key: string]: string}

export type HeadersAndBody = {
  headers: Headers
  body: string
}

export function parseHeadersAndBody(lines: string[]): HeadersAndBody {
  lines.shift()
  const headers = parseHeaders(lines)
  const body = lines.join("\r\n")
  return {headers, body}
}

function parseHeaders(lines: string[]): Headers {
  let blankLineReached = false
  const headers: Headers = {}
  const keyValueSeparator = ": "
  while (lines.length > 0 && !blankLineReached) {
    const line = lines.shift()!
    blankLineReached = line === ""
    if (!blankLineReached) {
      const separatorPos = line.indexOf(keyValueSeparator)
      if (separatorPos >= 0) {
        const header = line.slice(0, separatorPos)
        const value = line.slice(separatorPos + keyValueSeparator.length)
        headers[header.toLowerCase()] = value
      }
    }
  }
  return headers
}

export function dataToLines(data: Buffer): string[] {
  return data.toString().split("\r\n")
}

export function parseStartLine(line: string): HTTPRequestStartLine | false {
  const parts = line.split(" ")
  if (parts.length < 3) {
    return false
  }
  const method = parts[0]
  const path = parts[1]
  const version = parts[2]
  return {method, path, version}
}

export function respondAndClose(socket: Socket, response: string) {
  socket.write(response)
  socket.end()
}

export function buildResponse(responseStartLine: string, headers: Headers, body: string): string {
  const responseParts = [responseStartLine]
  for (const header in headers) {
    responseParts.push(`${header}: ${headers[header]}`)
  }
  responseParts.push("")
  responseParts.push(body)
  return responseParts.join("\r\n")
}
