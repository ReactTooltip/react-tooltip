import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'
import minimist from 'minimist'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const benchmarkDir = __dirname
const workerCachesRoot = path.join(benchmarkDir, '.cache', 'workers')
const seriesStartedAt = Date.now()

const args = minimist(process.argv.slice(2), {
  alias: {
    r: 'runs',
    w: 'workers',
  },
  default: {
    runs: 3,
    workers: 1,
  },
})

const runCount = Number(args.runs)
const workerCount = Number(args.workers)

if (!Number.isInteger(runCount) || runCount <= 0) {
  throw new Error(`Expected --runs/-r to be a positive integer, received: ${args.runs}`)
}

if (!Number.isInteger(workerCount) || workerCount <= 0) {
  throw new Error(`Expected --workers/-w to be a positive integer, received: ${args.workers}`)
}

const passthroughArgs = process.argv.slice(2).filter((arg, index, allArgs) => {
  if (arg === '-r' || arg === '--runs' || arg === '-w' || arg === '--workers') {
    return false
  }

  const previousArg = allArgs[index - 1]
  if (
    previousArg === '-r' ||
    previousArg === '--runs' ||
    previousArg === '-w' ||
    previousArg === '--workers'
  ) {
    return false
  }

  return true
})

function formatDuration(ms) {
  if (ms < 1000) {
    return `${ms}ms`
  }

  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes === 0) {
    return `${seconds}s`
  }

  return `${minutes}m ${seconds}s`
}

function logSeries(message) {
  const elapsedMs = Date.now() - seriesStartedAt
  const timestamp = new Date().toLocaleTimeString()
  console.log(`[series ${timestamp} +${formatDuration(elapsedMs)}] ${message}`)
}

function pipeChildOutput(stream, prefix) {
  if (!stream) {
    return () => {}
  }

  let pending = ''
  const handleData = (chunk) => {
    pending += chunk.toString()
    const lines = pending.split('\n')
    pending = lines.pop() ?? ''
    lines.forEach((line) => {
      if (line.length > 0) {
        console.log(`${prefix} ${line}`)
      }
    })
  }

  stream.on('data', handleData)

  return () => {
    if (pending.length > 0) {
      console.log(`${prefix} ${pending}`)
      pending = ''
    }
    stream.off('data', handleData)
  }
}

function runCommand(command, commandArgs, { label } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, commandArgs, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: false,
    })

    const stdoutCleanup = pipeChildOutput(child.stdout, `[${label}]`)
    const stderrCleanup = pipeChildOutput(child.stderr, `[${label}][stderr]`)

    child.on('error', (error) => {
      stdoutCleanup()
      stderrCleanup()
      reject(error)
    })

    child.on('exit', (code, signal) => {
      stdoutCleanup()
      stderrCleanup()

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

function buildRunTasks(totalRuns) {
  return Array.from({ length: totalRuns }, (_, index) => ({
    runNumber: index + 1,
    label: `pass-${String(index + 1).padStart(String(totalRuns).length, '0')}`,
  }))
}

async function runTasksInParallel(tasks, totalWorkers) {
  await mkdir(workerCachesRoot, { recursive: true })

  let nextTaskIndex = 0
  let completedTasks = 0

  const runWorkerLoop = async (workerNumber) => {
    while (nextTaskIndex < tasks.length) {
      const task = tasks[nextTaskIndex]
      nextTaskIndex += 1

      const taskStartedAt = Date.now()
      const cacheDir = path.join(workerCachesRoot, `worker-${workerNumber}`)
      const workerLabel = `worker ${workerNumber}`

      logSeries(
        `${workerLabel} starting pass ${task.runNumber}/${tasks.length} (${completedTasks}/${tasks.length} completed)`,
      )

      await runCommand(
        'node',
        [
          './benchmarks/run-benchmark.mjs',
          '--worker',
          String(workerNumber),
          '--label',
          task.label,
          '--cacheDir',
          cacheDir,
          ...passthroughArgs,
        ],
        {
          label: `${workerLabel} ${task.label}`,
        },
      )

      completedTasks += 1
      const elapsedMs = Date.now() - taskStartedAt
      const averageMsPerTask = (Date.now() - seriesStartedAt) / completedTasks
      const remainingTasks = tasks.length - completedTasks
      const estimatedRemainingMs = Math.round(averageMsPerTask * remainingTasks)

      logSeries(
        `${workerLabel} finished pass ${task.runNumber}/${tasks.length} in ${formatDuration(elapsedMs)} (${completedTasks}/${tasks.length} completed, est. remaining ${formatDuration(estimatedRemainingMs)})`,
      )
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(totalWorkers, tasks.length) }, (_, index) =>
      runWorkerLoop(index + 1),
    ),
  )
}

async function main() {
  logSeries('Building Rollup production bundle')
  await runCommand('yarn', ['build'], { label: 'build' })

  logSeries(
    `Starting scaling series with ${runCount} run(s) across ${workerCount} worker(s)`,
  )

  const tasks = buildRunTasks(runCount)
  await runTasksInParallel(tasks, workerCount)

  logSeries(`Aggregating latest ${runCount} run(s)`)
  await runCommand(
    'node',
    ['./benchmarks/aggregate-benchmarks.mjs', '--latest', String(runCount)],
    { label: 'aggregate' },
  )

  logSeries(`Series completed in ${formatDuration(Date.now() - seriesStartedAt)}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
