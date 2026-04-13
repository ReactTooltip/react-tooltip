import { readdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import minimist from 'minimist'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const resultsDir = path.join(__dirname, 'results')

const args = minimist(process.argv.slice(2))
const latest = Number(args.latest ?? 3)
const useAll = Boolean(args.all)
const generationArg = args.generation
const useAllGenerations = Boolean(args['all-generations'])
const explicitFiles = args._.map((inputPath) => path.resolve(inputPath))

function aggregateNumbers(values) {
  const sorted = values
    .filter((value) => typeof value === 'number' && Number.isFinite(value))
    .sort((left, right) => left - right)

  if (sorted.length === 0) {
    return {
      median: null,
      p95: null,
      min: null,
      max: null,
      mean: null,
      standardDeviation: null,
      spreadPercent: null,
      sampleCount: 0,
    }
  }

  const middle = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 0
      ? (sorted[middle - 1] + sorted[middle]) / 2
      : sorted[middle]
  const mean = sorted.reduce((total, value) => total + value, 0) / sorted.length
  const variance =
    sorted.reduce((total, value) => total + (value - mean) ** 2, 0) / sorted.length
  const standardDeviation = Math.sqrt(variance)
  const p95 = sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * 0.95) - 1)]

  return {
    median,
    p95,
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean,
    standardDeviation,
    spreadPercent: median === 0 ? null : ((p95 - median) / Math.abs(median)) * 100,
    sampleCount: sorted.length,
  }
}

function formatMs(value) {
  return typeof value === 'number' ? `${value.toFixed(2)} ms` : '—'
}

function formatBytes(value) {
  return typeof value === 'number' ? `${(value / 1024).toFixed(1)} KiB` : '—'
}

function formatPercent(value) {
  return typeof value === 'number' ? `${value.toFixed(1)}%` : '—'
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

function getRunGeneration(run) {
  return Number.isInteger(run?.benchmarkVersion) ? run.benchmarkVersion : 0
}

async function resolveInputFiles() {
  if (explicitFiles.length > 0) {
    return explicitFiles
  }

  const entries = await readdir(resultsDir)
  const scalingEntries = entries
    .filter((entry) => entry.endsWith('.json'))
    .filter((entry) => entry.startsWith('scaling-'))
    .map((entry) => path.join(resultsDir, entry))
    .sort()

  if (useAll) {
    return scalingEntries
  }

  return scalingEntries.slice(-latest)
}

function resolveGenerationSelection(runs) {
  if (useAllGenerations) {
    return {
      selectedRuns: runs,
      generationLabel: 'all benchmark generations',
    }
  }

  if (generationArg !== undefined) {
    const requestedGeneration =
      generationArg === 'latest' ? Math.max(...runs.map(getRunGeneration)) : Number(generationArg)

    if (!Number.isInteger(requestedGeneration)) {
      throw new Error(`Invalid --generation value: ${generationArg}`)
    }

    return {
      selectedRuns: runs.filter((run) => getRunGeneration(run) === requestedGeneration),
      generationLabel:
        generationArg === 'latest'
          ? `latest benchmark generation (${requestedGeneration})`
          : `benchmark generation ${requestedGeneration}`,
    }
  }

  return {
    selectedRuns: runs,
    generationLabel: 'all benchmark generations',
  }
}

function buildMarkdownReport(result) {
  const lines = [
    '# Aggregated React Tooltip Scaling Benchmark',
    '',
    `- Timestamp: ${result.timestamp}`,
    `- Input files: ${result.inputFiles.length}`,
    `- Selection: ${result.selection}`,
    `- Generation filter: ${result.generationFilter}`,
    `- Counts: ${result.counts.join(', ')}`,
    '',
    '| Count | V5 mount | V6 mount | Mount delta | Mount spread | V5 unmount | V6 unmount | Unmount delta | Unmount spread | V5 mount mem | V6 mount mem | Mount mem delta | Mount mem spread | V5 unmount mem | V6 unmount mem | Unmount mem delta | Unmount mem spread | Samples | V5 timeouts | V6 timeouts |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ]

  result.summary.forEach((row) => {
    lines.push(
      `| ${row.count} | ${formatMs(row.v5.mount.median)} | ${formatMs(row.v6.mount.median)} | ${formatMs(row.mountDeltaMs)} | ${formatPercent(row.mountDeltaSpreadPercent)} | ${formatMs(row.v5.unmount.median)} | ${formatMs(row.v6.unmount.median)} | ${formatMs(row.unmountDeltaMs)} | ${formatPercent(row.unmountDeltaSpreadPercent)} | ${formatBytes(row.v5.mountMemory.median)} | ${formatBytes(row.v6.mountMemory.median)} | ${formatBytes(row.mountMemoryDeltaBytes)} | ${formatPercent(row.mountMemoryDeltaSpreadPercent)} | ${formatBytes(row.v5.unmountMemory.median)} | ${formatBytes(row.v6.unmountMemory.median)} | ${formatBytes(row.unmountMemoryDeltaBytes)} | ${formatPercent(row.unmountMemoryDeltaSpreadPercent)} | ${row.sampleCount} | ${row.v5.timeoutCount} | ${row.v6.timeoutCount} |`,
    )
  })

  return `${lines.join('\n')}\n`
}

async function main() {
  const inputFiles = await resolveInputFiles()

  if (inputFiles.length === 0) {
    throw new Error('No benchmark result files were found to aggregate.')
  }

  const allRuns = await Promise.all(
    inputFiles.map(async (inputFile) => JSON.parse(await readFile(inputFile, 'utf8'))),
  )
  const { selectedRuns: runs, generationLabel } = resolveGenerationSelection(allRuns)

  if (runs.length === 0) {
    throw new Error('No benchmark result files matched the requested generation filter.')
  }

  const counts = Array.from(
    new Set(runs.flatMap((run) => run.counts ?? [])),
  ).sort((left, right) => left - right)

  const summary = counts.map((count) => {
    const rows = runs
      .map((run) => run.summary?.find((entry) => entry.count === count))
      .filter(Boolean)

    const aggregateVersion = (version) => ({
      mount: aggregateNumbers(rows.map((row) => row[version]?.mount?.median)),
      unmount: aggregateNumbers(rows.map((row) => row[version]?.unmount?.median)),
      mountMemory: aggregateNumbers(rows.map((row) => row[version]?.mountMemory?.median)),
      unmountMemory: aggregateNumbers(rows.map((row) => row[version]?.unmountMemory?.median)),
      timeoutCount: rows.reduce(
        (total, row) => total + (row[version]?.timeoutCount ?? 0),
        0,
      ),
    })

    const v5 = aggregateVersion('v5')
    const v6 = aggregateVersion('v6')
    const sampleCount = Math.max(v5.mount.sampleCount, v6.mount.sampleCount)

    const mountDeltaMs =
      typeof v5.mount.median === 'number' && typeof v6.mount.median === 'number'
        ? v6.mount.median - v5.mount.median
        : null
    const unmountDeltaMs =
      typeof v5.unmount.median === 'number' && typeof v6.unmount.median === 'number'
        ? v6.unmount.median - v5.unmount.median
        : null
    const mountMemoryDeltaBytes =
      typeof v5.mountMemory.median === 'number' && typeof v6.mountMemory.median === 'number'
        ? v6.mountMemory.median - v5.mountMemory.median
        : null
    const unmountMemoryDeltaBytes =
      typeof v5.unmountMemory.median === 'number' && typeof v6.unmountMemory.median === 'number'
        ? v6.unmountMemory.median - v5.unmountMemory.median
        : null

    return {
      count,
      sampleCount,
      v5,
      v6,
      mountDeltaMs,
      unmountDeltaMs,
      mountMemoryDeltaBytes,
      unmountMemoryDeltaBytes,
      mountDeltaSpreadPercent:
        typeof v5.mount.spreadPercent === 'number' && typeof v6.mount.spreadPercent === 'number'
          ? Math.max(v5.mount.spreadPercent, v6.mount.spreadPercent)
          : null,
      unmountDeltaSpreadPercent:
        typeof v5.unmount.spreadPercent === 'number' && typeof v6.unmount.spreadPercent === 'number'
          ? Math.max(v5.unmount.spreadPercent, v6.unmount.spreadPercent)
          : null,
      mountMemoryDeltaSpreadPercent:
        typeof v5.mountMemory.spreadPercent === 'number' && typeof v6.mountMemory.spreadPercent === 'number'
          ? Math.max(v5.mountMemory.spreadPercent, v6.mountMemory.spreadPercent)
          : null,
      unmountMemoryDeltaSpreadPercent:
        typeof v5.unmountMemory.spreadPercent === 'number' && typeof v6.unmountMemory.spreadPercent === 'number'
          ? Math.max(v5.unmountMemory.spreadPercent, v6.unmountMemory.spreadPercent)
          : null,
    }
  })

  const result = {
    id: `aggregate-scaling-${timestampId()}`,
    timestamp: new Date().toISOString(),
    selection: useAll ? 'all scaling runs' : `latest ${latest} scaling run(s)`,
    generationFilter: generationLabel,
    inputFiles: runs.map((run, index) => inputFiles[allRuns.indexOf(run)] ?? inputFiles[index]),
    counts,
    summary,
  }

  const jsonPath = path.join(resultsDir, `${result.id}.json`)
  const markdownPath = path.join(resultsDir, `${result.id}.md`)

  await writeFile(jsonPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
  await writeFile(markdownPath, buildMarkdownReport(result), 'utf8')

  console.log(`Saved aggregate benchmark results to ${jsonPath}`)
  console.log(`Saved aggregate benchmark report to ${markdownPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
