import type {Socket} from "bun"
import {LogActivityDirection, logRequest, logResponse, logActivity} from "./log"
import {
  type HTTPRequestStartLine,
  type HeadersAndBody,
  dataToLines,
  parseStartLine,
  buildResponse,
  respondAndClose,
  parseHeadersAndBody,
} from "./httpUtils"
import {getFilenameFromPath, saveFile, readFile} from "./fileUtils"
import {parseArgs} from "./programArgs"

const {flags} = parseArgs()
const directory =
  "directory" in flags && typeof flags.directory === "string" ? flags.directory : "staticFiles"
const server = Bun.listen({
  hostname: "localhost",
  port: 4221,
  socket: {
    close(socket: Socket) {
      socket.end()
    },
    async data(socket: Socket, data: Buffer) {
      let response: string | undefined
      const lines = dataToLines(data)
      if (lines.length > 0) {
        const startLine = parseStartLine(lines[0])
        if (startLine) {
          logRequest(socket, `${startLine.method} ${startLine.path}`)
          switch (startLine.method) {
            case "GET": {
              switch (startLine.path) {
                case "/":
                  response = buildResponse("HTTP/1.1 200 OK", {}, "")
                  break
                case "/user-agent":
                  response = userAgentResponse(lines)
                  break
              }
              response =
                response ?? echoResponse(startLine.path) ?? (await getFileResponse(startLine.path))
              break
            }
            case "POST": {
              response = response ?? (await postFileResponse(startLine.path, lines))
              break
            }
          }
        }
      }
      response = response ?? "HTTP/1.1 404 Not Found\r\n\r\n"
      const maxLength = 120
      if (response.length > maxLength) {
        response = response.slice(0, maxLength - 3) + "..."
      }
      logResponse(socket, response)
      respondAndClose(socket, response)
    },
    drain(socket: Socket) {},
    error(socket: Socket, error: Error) {},
    open(socket: Socket) {},
  },
})
logActivity(
  "Server",
  `is listening on ${server.hostname}:${server.port} ...`,
  LogActivityDirection.None,
)

function echoResponse(path: string): string | undefined {
  const echoPathShouldStartsWith = "/echo/"
  if (path.startsWith(echoPathShouldStartsWith)) {
    const body = path.slice(echoPathShouldStartsWith.length)
    return buildResponse(
      "HTTP/1.1 200 OK",
      {
        "Content-Type": "text/plain",
        "Content-Length": body.length.toString(),
      },
      body,
    )
  }
}

function userAgentResponse(lines: string[]): string {
  const {headers} = parseHeadersAndBody(lines)
  const body = headers["user-agent"]
  return buildResponse(
    "HTTP/1.1 200 OK",
    {
      "Content-Type": "text/plain",
      "Content-Length": body.length.toString(),
    },
    body,
  )
}

async function getFileResponse(path: string): Promise<string | undefined> {
  const pathPrefix = "/files/"
  if (path.startsWith(pathPrefix) && path.length > pathPrefix.length) {
    const filename = getFilenameFromPath(path, pathPrefix)
    const content = await getFileContent(filename)
    if (content) {
      return buildResponse(
        "HTTP/1.1 200 OK",
        {
          "Content-Type": "application/octet-stream",
          "Content-Length": content.length.toString(),
        },
        content,
      )
    }
  }
}

async function getFileContent(filename: string): Promise<string | undefined> {
  try {
    return await readFile(directory as string, filename)
  } catch (err) {
    console.log(`Cannot read "${filename}" file. ${(err as Error).message}`)
  }
}

async function postFileResponse(path: string, lines: string[]): Promise<string | undefined> {
  const pathPrefix = "/files/"
  if (path.startsWith(pathPrefix) && path.length > pathPrefix.length) {
    const filename = getFilenameFromPath(path, pathPrefix)
    const {body} = parseHeadersAndBody(lines)
    const fileSaved = await saveFile(directory, filename, body)
    if (fileSaved) {
      return buildResponse("HTTP/1.1 201 OK", {}, "")
    }
  }
}
