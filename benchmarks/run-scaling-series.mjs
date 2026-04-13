import { spawn } from 'child_process'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2), {
  alias: {
    r: 'runs',
  },
  default: {
    runs: 3,
  },
})

const runCount = Number(args.runs)

if (!Number.isInteger(runCount) || runCount <= 0) {
  throw new Error(`Expected --runs/-r to be a positive integer, received: ${args.runs}`)
}

const passthroughArgs = process.argv.slice(2).filter((arg, index, allArgs) => {
  if (arg === '-r' || arg === '--runs') {
    return false
  }

  const previousArg = allArgs[index - 1]
  if (previousArg === '-r' || previousArg === '--runs') {
    return false
  }

  return true
})

function formatStep(step, total, label) {
  return `[series ${step}/${total}] ${label}`
}

function runCommand(command, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: 'inherit',
      shell: false,
    })

    child.on('error', reject)
    child.on('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          signal
            ? `${command} ${commandArgs.join(' ')} exited with signal ${signal}`
            : `${command} ${commandArgs.join(' ')} exited with code ${code}`,
        ),
      )
    })
  })
}

async function main() {
  console.log(formatStep(1, runCount + 2, 'Building benchmark bundle'))
  await runCommand('yarn', ['build-esbuild'])

  for (let index = 0; index < runCount; index += 1) {
    console.log(formatStep(index + 2, runCount + 2, `Running benchmark pass ${index + 1}/${runCount}`))
    await runCommand('node', ['./benchmarks/run-benchmark.mjs', ...passthroughArgs])
  }

  console.log(formatStep(runCount + 2, runCount + 2, `Aggregating latest ${runCount} run(s)`))
  await runCommand('node', ['./benchmarks/aggregate-benchmarks.mjs', '--latest', String(runCount)])
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
