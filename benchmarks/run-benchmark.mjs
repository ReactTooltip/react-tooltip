import { mkdir, readFile, rm, writeFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import * as esbuild from 'esbuild'
import minimist from 'minimist'
import { chromium } from 'playwright'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const resultsDir = path.join(__dirname, 'results')
const fixtureHtmlPath = path.join(__dirname, 'fixture', 'index.html')
const fixtureEntryPath = path.join(__dirname, 'fixture', 'app.tsx')
const rootReactPath = path.join(rootDir, 'node_modules', 'react')
const rootReactDomPath = path.join(rootDir, 'node_modules', 'react-dom')
const benchmarkVersion = 3
const benchmarkLabel = 'precise-memory-gc-separated'

const args = minimist(process.argv.slice(2), {
  alias: {
    w: 'worker',
  },
})
const counts = `${args.counts ?? '50,100,500,2000,5000,10000,25000'}`
  .split(',')
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value > 0)
const timeoutMs = Number(args.timeoutMs ?? 1200)
const repeats = Number(args.repeats ?? 5)
const warmups = Number(args.warmups ?? 1)
const executablePath = args.executablePath ?? null
const workerId = args.worker ? String(args.worker) : null
const runLabel = args.label ? String(args.label) : null
const cacheDir = path.resolve(args.cacheDir ?? path.join(__dirname, '.cache'))
const cacheHtmlPath = path.join(cacheDir, 'index.html')
const fixtureBundlePath = path.join(cacheDir, 'app.js')
const benchmarkStartedAt = Date.now()

function aggregateNumbers(values) {
  const sorted = [...values].sort((left, right) => left - right)
  if (sorted.length === 0) {
    return {
      median: null,
      p95: null,
      min: null,
      max: null,
      mean: null,
      standardDeviation: null,
      spreadPercent: null,
    }
  }

  const middle = Math.floor(sorted.length / 2)
  const median =
    sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle]
  const mean = sorted.reduce((total, value) => total + value, 0) / sorted.length
  const variance = sorted.reduce((total, value) => total + (value - mean) ** 2, 0) / sorted.length
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
  }
}

function formatMs(value) {
  return typeof value === 'number' ? `${value.toFixed(2)} ms` : 'timeout'
}

function formatBytes(value) {
  return typeof value === 'number' ? `${(value / 1024).toFixed(1)} KiB` : '—'
}

function buildMarkdownReport(result) {
  const lines = [
    '# React Tooltip Scaling Benchmark',
    '',
    `- Timestamp: ${result.timestamp}`,
    `- Duration: ${result.durationMs} ms`,
    `- Browser: ${result.browser}`,
    `- Counts: ${result.counts.join(', ')}`,
    `- Warmups: ${result.warmups}`,
    `- Repeats: ${result.repeats}`,
    `- Timeout: ${result.timeoutMs} ms`,
    `- Cache directory: ${result.cacheDir}`,
    `- Worker: ${result.workerId ?? 'standalone'}`,
    `- Label: ${result.runLabel ?? '—'}`,
    '',
    '| Count | V5 mount | V6 mount | Mount delta | V5 unmount | V6 unmount | Unmount delta | V5 mount mem | V6 mount mem | V5 issues | V6 issues |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ]

  result.summary.forEach((row) => {
    lines.push(
      `| ${row.count} | ${formatMs(row.v5.mount.median)} | ${formatMs(row.v6.mount.median)} | ${formatMs(row.mountDeltaMs)} | ${formatMs(row.v5.unmount.median)} | ${formatMs(row.v6.unmount.median)} | ${formatMs(row.unmountDeltaMs)} | ${formatBytes(row.v5.mountMemory.median)} | ${formatBytes(row.v6.mountMemory.median)} | ${row.v5.timeoutCount} | ${row.v6.timeoutCount} |`,
    )
  })

  return `${lines.join('\n')}\n`
}

function logProgress(message) {
  const timestamp = new Date().toLocaleTimeString()
  const elapsedSeconds = ((Date.now() - benchmarkStartedAt) / 1000).toFixed(1)
  const tags = ['benchmark']
  if (workerId) {
    tags.push(`worker:${workerId}`)
  }
  if (runLabel) {
    tags.push(runLabel)
  }
  console.log(`[${tags.join(' ')} ${timestamp} +${elapsedSeconds}s] ${message}`)
}

function timestampId() {
  return new Date().toISOString().replace(/[:.]/g, '-')
}

async function ensureFixtureBundle() {
  await mkdir(cacheDir, { recursive: true })

  await esbuild.build({
    entryPoints: [fixtureEntryPath],
    outfile: fixtureBundlePath,
    bundle: true,
    format: 'iife',
    sourcemap: false,
    platform: 'browser',
    alias: {
      react: rootReactPath,
      'react-dom': rootReactDomPath,
    },
    jsx: 'transform',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    loader: {
      '.js': 'jsx',
      '.ts': 'ts',
      '.tsx': 'tsx',
    },
  })

  const html = await readFile(fixtureHtmlPath, 'utf8')
  await writeFile(
    cacheHtmlPath,
    html.replace('<script type="module" src="/app.js"></script>', ''),
    'utf8',
  )
}

async function main() {
  logProgress('Preparing benchmark bundle')
  await rm(cacheDir, { recursive: true, force: true })
  await mkdir(resultsDir, { recursive: true })
  await ensureFixtureBundle()
  logProgress('Launching headless Chrome')

  const launchOptions = {
    headless: true,
    args: ['--enable-precise-memory-info', '--js-flags=--expose-gc'],
  }
  if (executablePath) {
    launchOptions.executablePath = executablePath
  }

  const browser = await chromium.launch(launchOptions)

  try {
    const page = await browser.newPage()
    page.on('console', (message) => {
      const text = message.text()
      if (text.includes('Download the React DevTools')) {
        return
      }
      console.log(`[page:${message.type()}] ${text}`)
    })
    page.on('pageerror', (error) => {
      console.error(`[pageerror] ${error.message}`)
    })

    logProgress('Loading benchmark fixture')
    await page.goto(pathToFileURL(cacheHtmlPath).toString(), {
      waitUntil: 'networkidle',
    })
    await page.addScriptTag({
      content: await readFile(fixtureBundlePath, 'utf8'),
    })
    await page.waitForFunction(() => Boolean(window.__reactTooltipBenchmark), null, {
      timeout: timeoutMs,
    })
    logProgress(`Running scaling benchmark for counts: ${counts.join(', ')}`)

    const runVersion = async (version) => {
      logProgress(`Starting ${version.toUpperCase()} run`)
      return page.evaluate(
        async ({ nextVersion, nextCounts, nextTimeoutMs, nextRepeats, nextWarmups }) => {
          const harness = window.__reactTooltipBenchmark
          if (!harness) {
            throw new Error('Benchmark harness was not initialized.')
          }

          const progressPrefix = `[${nextVersion.toUpperCase()}]`

          return harness.runScalingBenchmark({
            version: nextVersion,
            counts: nextCounts,
            timeoutMs: nextTimeoutMs,
            repeats: nextRepeats,
            warmups: nextWarmups,
            renderMode: 'shared',
            onProgress: (message) => {
              console.log(`${progressPrefix} ${message}`)
            },
          })
        },
        {
          nextVersion: version,
          nextCounts: counts,
          nextTimeoutMs: timeoutMs,
          nextRepeats: repeats,
          nextWarmups: warmups,
        },
      )
    }

    const versions = ['v5', 'v6']
    // Randomize execution order to avoid first-run bias
    if (Math.random() < 0.5) {
      versions.reverse()
    }
    logProgress(`Execution order: ${versions.join(' → ')}`)

    const results = {}
    for (const version of versions) {
      results[version] = await runVersion(version)
      logProgress(`Completed ${version.toUpperCase()} run`)
    }

    const v5 = results.v5
    const v6 = results.v6

    const summary = counts.map((count) => {
      const v5Samples = v5.samplesByCount.filter((sample) => sample.count === count)
      const v6Samples = v6.samplesByCount.filter((sample) => sample.count === count)

      const aggregateVersion = (samples) => {
        const successful = samples.filter((sample) => !sample.timedOut)
        return {
          mount: aggregateNumbers(
            successful
              .map((sample) => sample.mountDurationMs)
              .filter((value) => typeof value === 'number'),
          ),
          unmount: aggregateNumbers(
            successful
              .map((sample) => sample.unmountDurationMs)
              .filter((value) => typeof value === 'number'),
          ),
          mountMemory: aggregateNumbers(
            successful
              .map((sample) => sample.mountMemoryDeltaBytes)
              .filter((value) => typeof value === 'number'),
          ),
          unmountMemory: aggregateNumbers(
            successful
              .map((sample) => sample.unmountMemoryDeltaBytes)
              .filter((value) => typeof value === 'number'),
          ),
          timeoutCount: samples.filter((sample) => sample.timedOut).length,
          sampleCount: samples.length,
        }
      }

      const v5Aggregate = aggregateVersion(v5Samples)
      const v6Aggregate = aggregateVersion(v6Samples)

      return {
        count,
        v5: v5Aggregate,
        v6: v6Aggregate,
        mountDeltaMs:
          typeof v5Aggregate.mount.median === 'number' &&
          typeof v6Aggregate.mount.median === 'number'
            ? v6Aggregate.mount.median - v5Aggregate.mount.median
            : null,
        unmountDeltaMs:
          typeof v5Aggregate.unmount.median === 'number' &&
          typeof v6Aggregate.unmount.median === 'number'
            ? v6Aggregate.unmount.median - v5Aggregate.unmount.median
            : null,
        mountMemoryDeltaBytes:
          typeof v5Aggregate.mountMemory.median === 'number' &&
          typeof v6Aggregate.mountMemory.median === 'number'
            ? v6Aggregate.mountMemory.median - v5Aggregate.mountMemory.median
            : null,
      }
    })

    const result = {
      id: `scaling-${timestampId()}`,
      timestamp: new Date().toISOString(),
      durationMs: Date.now() - benchmarkStartedAt,
      benchmarkVersion,
      benchmarkLabel,
      benchmarkFeatures: {
        preciseMemory: true,
        exposedGc: true,
        gcSeparatedFromTiming: true,
      },
      cacheDir,
      workerId,
      runLabel,
      browser: await page.evaluate(() => window.navigator.userAgent),
      counts,
      warmups,
      repeats,
      timeoutMs,
      summary,
      aggregates: {
        v5MountDurationsMs: aggregateNumbers(
          summary.map((item) => item.v5.mount.median).filter((value) => typeof value === 'number'),
        ),
        v6MountDurationsMs: aggregateNumbers(
          summary.map((item) => item.v6.mount.median).filter((value) => typeof value === 'number'),
        ),
        v5UnmountDurationsMs: aggregateNumbers(
          summary
            .map((item) => item.v5.unmount.median)
            .filter((value) => typeof value === 'number'),
        ),
        v6UnmountDurationsMs: aggregateNumbers(
          summary
            .map((item) => item.v6.unmount.median)
            .filter((value) => typeof value === 'number'),
        ),
      },
      raw: {
        v5,
        v6,
      },
    }

    const outputPath = path.join(resultsDir, `${result.id}.json`)
    const reportPath = path.join(resultsDir, `${result.id}.md`)
    await writeFile(outputPath, `${JSON.stringify(result, null, 2)}\n`, 'utf8')
    await writeFile(reportPath, buildMarkdownReport(result), 'utf8')
    logProgress(`Saved benchmark results to ${outputPath}`)
    logProgress(`Saved benchmark report to ${reportPath}`)
  } finally {
    await browser.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
