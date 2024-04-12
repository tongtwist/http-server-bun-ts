const {join} = require("node:path")

export function getFilenameFromPath(path: string, prefix: string) {
  return path.slice(prefix.length)
}

export async function saveFile(
  directory: string,
  filename: string,
  content: string,
): Promise<number> {
  const resolvedName = resolveFilename(directory, filename)
  try {
    return await Bun.write(resolvedName, content)
  } catch (err) {
    console.log(`Cannot write given content into "${resolvedName}" file. ${(err as Error).message}`)
    return -1
  }
}

export async function readFile(directory: string, filename: string): Promise<string> {
  const resolvedName = join(directory, filename)
  const file = Bun.file(resolvedName)
  return await file.text()
}

function resolveFilename(directory: string, filename: string): string {
  return join(directory, filename)
}
