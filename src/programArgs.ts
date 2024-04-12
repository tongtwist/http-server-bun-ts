export type ProgramArgsFlags = {[flag: string]: string | true}

export type ProgramArgs = {
  elements: ProgramArgsFlags[]
  flags: ProgramArgsFlags
}

export function parseArgs(): ProgramArgs {
  const result: ProgramArgs = {
    elements: [],
    flags: {},
  }
  for (let i = 0; i < process.argv.length; i++) {
    let elt: string = process.argv[i]
    const flag: ProgramArgsFlags = {}
    if (elt.startsWith("-")) {
      let endDots = 0
      for (; endDots < elt.length && elt[endDots] === "-"; endDots++);
      if (endDots === elt.length) {
        flag[elt] = true
        result.elements.push(flag)
      } else {
        const value = i < process.argv.length ? process.argv[++i] : true
        const name = elt.slice(endDots)
        flag[name] = value
        result.elements.push(flag)
        result.flags[name] = value
      }
    } else {
      flag[elt] = true
      result.elements.push(flag)
    }
  }
  return result
}
