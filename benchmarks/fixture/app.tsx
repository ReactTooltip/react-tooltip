import React, { useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import { Tooltip as TooltipV5 } from '../../docs/node_modules/react-tooltip/dist/react-tooltip.mjs'
import { Tooltip as TooltipV6 } from '../../dist/react-tooltip.mjs'

type BenchmarkVersion = 'v5' | 'v6'

type RenderMode = 'shared'

type FixtureState = {
  version: BenchmarkVersion
  count: number
  renderMode: RenderMode
  place?: string
}

type ScenarioSample = {
  count: number
  mountDurationMs: number | null
  unmountDurationMs: number | null
  updateDurationMs: number | null
  mountMemoryDeltaBytes: number | null
  unmountMemoryDeltaBytes: number | null
  timedOut: boolean
}

type ScenarioResult = {
  version: BenchmarkVersion
  renderMode: RenderMode
  samplesByCount: ScenarioSample[]
}

type BenchmarkHarness = {
  runScalingBenchmark: (args: {
    version: BenchmarkVersion
    counts: number[]
    timeoutMs: number
    repeats: number
    warmups: number
    renderMode: RenderMode
    onProgress?: (message: string) => void
  }) => Promise<ScenarioResult>
}

declare global {
  interface Window {
    __reactTooltipBenchmark?: BenchmarkHarness
    __REACT_DEVTOOLS_GLOBAL_HOOK__?: {
      isDisabled?: boolean
    }
    gc?: () => void
  }
}

window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
  isDisabled: true,
}

function readUsedHeapBytes() {
  const performanceWithMemory = window.performance as Performance & {
    memory?: {
      usedJSHeapSize: number
    }
  }

  return performanceWithMemory.memory?.usedJSHeapSize ?? null
}

function nextFrame() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve())
  })
}

async function collectGarbage() {
  if (typeof window.gc === 'function') {
    window.gc()
    await nextFrame()
    window.gc()
    await nextFrame()
  }
}

async function readStableHeapBytes() {
  await collectGarbage()
  return readUsedHeapBytes()
}

async function waitUntil(predicate: () => boolean, timeoutMs: number) {
  const startedAt = window.performance.now()

  while (window.performance.now() - startedAt < timeoutMs) {
    if (predicate()) {
      return true
    }
    await nextFrame()
  }

  return false
}

function BenchmarkFixture({ version, count, place }: FixtureState) {
  const TooltipComponent = version === 'v5' ? TooltipV5 : TooltipV6
  const tooltipId = `benchmark-tooltip-${version}`

  const anchorIds = useMemo(
    () => Array.from({ length: count }, (_, index) => `anchor-${version}-${index}`),
    [count, version],
  )

  useEffect(() => {
    document.body.setAttribute('data-benchmark-count', String(count))
    document.body.setAttribute('data-benchmark-version', version)
  }, [count, version])

  return (
    <div className="benchmark-surface" aria-hidden="true">
      <div className="anchor-grid">
        {anchorIds.map((id, index) => (
          <button
            key={id}
            id={id}
            className="anchor"
            data-tooltip-id={tooltipId}
            data-tooltip-content={`Anchor ${index}`}
            type="button"
          >
            {index}
          </button>
        ))}
      </div>
      <TooltipComponent id={tooltipId} place={place} />
    </div>
  )
}

const rootNode = document.getElementById('root')

if (!rootNode) {
  throw new Error('Benchmark root element was not found.')
}

const benchmarkRoot = createRoot(rootNode)

function renderFixture(nextState: FixtureState) {
  return new Promise<void>((resolve) => {
    flushSync(() => {
      benchmarkRoot.render(<BenchmarkFixture {...nextState} />)
    })
    resolve()
  })
}

function unmountFixture() {
  return new Promise<void>((resolve) => {
    flushSync(() => {
      benchmarkRoot.render(<></>)
    })
    resolve()
  })
}

async function runScalingBenchmark({
  version,
  counts,
  timeoutMs,
  repeats,
  warmups,
  renderMode,
  onProgress,
}: {
  version: BenchmarkVersion
  counts: number[]
  timeoutMs: number
  repeats: number
  warmups: number
  renderMode: RenderMode
  onProgress?: (message: string) => void
}): Promise<ScenarioResult> {
  const samplesByCount: ScenarioSample[] = []

  for (const count of counts) {
    // Scale warmups for large counts to ensure JIT is fully warm
    const effectiveWarmups = count >= 10000 ? Math.max(warmups, 2) : warmups

    for (let warmupIndex = 0; warmupIndex < effectiveWarmups; warmupIndex += 1) {
      onProgress?.(`count=${count} warmup ${warmupIndex + 1}/${effectiveWarmups}`)
      await renderFixture({
        version,
        count: 0,
        renderMode,
      })
      await nextFrame()
      await renderFixture({
        version,
        count,
        renderMode,
      })
      await waitUntil(
        () => document.querySelectorAll('[data-tooltip-id]').length === count,
        timeoutMs,
      )
      await nextFrame()
      await unmountFixture()
      await nextFrame()
    }

    for (let repeatIndex = 0; repeatIndex < repeats; repeatIndex += 1) {
      onProgress?.(`count=${count} repeat ${repeatIndex + 1}/${repeats}`)
      await renderFixture({
        version,
        count: 0,
        renderMode,
      })
      await nextFrame()

      // Settle memory before mount measurement
      await collectGarbage()
      const mountMemoryBefore = readUsedHeapBytes()
      const mountStartedAt = window.performance.now()

      await renderFixture({
        version,
        count,
        renderMode,
      })

      const mountReady = await waitUntil(() => {
        return document.querySelectorAll('[data-tooltip-id]').length === count
      }, timeoutMs)

      const mountEndedAt = window.performance.now()

      // Settle memory after mount, outside timing window
      await nextFrame()
      await collectGarbage()
      const mountMemoryAfter = readUsedHeapBytes()

      // --- Update measurement: change `place` prop to trigger a re-render cycle ---
      const updateStartedAt = window.performance.now()

      await renderFixture({
        version,
        count,
        renderMode,
        place: 'bottom',
      })
      await nextFrame()

      const updateEndedAt = window.performance.now()

      // Restore original place for a clean unmount
      await renderFixture({
        version,
        count,
        renderMode,
      })
      await nextFrame()

      const unmountMemoryBefore = mountMemoryAfter
      const unmountStartedAt = window.performance.now()

      await unmountFixture()

      const unmountReady = await waitUntil(() => {
        return document.querySelectorAll('[data-tooltip-id]').length === 0
      }, timeoutMs)

      const unmountEndedAt = window.performance.now()

      await nextFrame()
      await collectGarbage()
      const unmountMemoryAfter = readUsedHeapBytes()

      samplesByCount.push({
        count,
        mountDurationMs: mountReady ? mountEndedAt - mountStartedAt : null,
        unmountDurationMs: unmountReady ? unmountEndedAt - unmountStartedAt : null,
        updateDurationMs: mountReady ? updateEndedAt - updateStartedAt : null,
        mountMemoryDeltaBytes:
          mountReady && mountMemoryBefore !== null && mountMemoryAfter !== null
            ? mountMemoryAfter - mountMemoryBefore
            : null,
        unmountMemoryDeltaBytes:
          unmountReady && unmountMemoryBefore !== null && unmountMemoryAfter !== null
            ? unmountMemoryAfter - unmountMemoryBefore
            : null,
        timedOut: !mountReady || !unmountReady,
      })
    }
  }

  return {
    version,
    renderMode,
    samplesByCount,
  }
}

window.__reactTooltipBenchmark = {
  runScalingBenchmark,
}

renderFixture({
  version: 'v6',
  count: 0,
  renderMode: 'shared',
})
