import type {Socket} from "bun"

export enum LogActivityDirection {
  In = "-->",
  Out = "<--",
  IO = "<->",
  None = "",
}

export function logRequest(socket: Socket, reqDescription: string) {
  logActivity(socket.remoteAddress, reqDescription, LogActivityDirection.In)
}

export function logResponse(socket: Socket, response: string) {
  const txt = response.replaceAll(/\r/g, "\\r").replaceAll(/\n/g, "\\n")
  logActivity(
    socket.remoteAddress,
    txt.length > 100 ? `${txt.slice(0, 97)}...` : txt,
    LogActivityDirection.Out,
  )
}

export function logActivity(
  who: string,
  what: string,
  direction: LogActivityDirection = LogActivityDirection.IO,
) {
  const dir = direction !== LogActivityDirection.None ? ` ${direction}` : ""
  console.log(`${Date.now()} [${who}]${dir} ${what}`)
}
