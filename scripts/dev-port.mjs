const DEFAULT_PORT = 3000

function readPortValue(args, index, prefix) {
  const arg = args[index]

  if (arg.includes('=')) {
    return arg.split('=')[1]
  }

  if (arg.startsWith(prefix) && arg.length > prefix.length) {
    return arg.slice(prefix.length)
  }

  return args[index + 1]
}

function parsePort(args = process.argv.slice(2), defaultPort = DEFAULT_PORT) {
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--port' || arg.startsWith('--port=')) {
      const parsed = Number(readPortValue(args, index, '--port'))
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed
      }
    }

    if (arg === '-p' || arg.startsWith('-p=')) {
      const parsed = Number(readPortValue(args, index, '-p'))
      if (Number.isInteger(parsed) && parsed > 0) {
        return parsed
      }
    }
  }

  return defaultPort
}

export { DEFAULT_PORT, parsePort }
