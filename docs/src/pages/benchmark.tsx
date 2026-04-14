import React from 'react'
import Layout from '@theme/Layout'
import benchmarkSnapshot from '@site/src/data/benchmark-snapshot'
import styles from './benchmark.module.css'

function formatDeltaMs(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)} ms`
}

function formatMemory(value: number) {
  const sign = value > 0 ? '+' : ''
  const absolute = Math.abs(value)

  if (absolute >= 1024) {
    return `${sign}${(value / 1024).toFixed(2)} MiB`
  }

  return `${sign}${value.toFixed(1)} KiB`
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function getDeltaClass(value: number) {
  if (value < 0) {
    return styles.positive
  }
  if (value > 0) {
    return styles.negative
  }
  return styles.muted
}

export default function BenchmarkPage(): React.JSX.Element {
  const largestRow = benchmarkSnapshot.rows[benchmarkSnapshot.rows.length - 1]
  const strongestMountWin = benchmarkSnapshot.rows.reduce((best, row) =>
    row.mountDeltaMs < best.mountDeltaMs ? row : best,
  )
  const strongestMemoryWin = benchmarkSnapshot.rows.reduce((best, row) =>
    row.mountMemDeltaKiB < best.mountMemDeltaKiB ? row : best,
  )
  const smallestCount = benchmarkSnapshot.rows[0]?.count ?? 0

  return (
    <Layout
      title="Benchmark Results"
      description="Benchmark comparison between React Tooltip V5 and V6."
    >
      <header className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div>
              <p className={styles.eyebrow}>Benchmark</p>
              <h1 className={styles.title}>V5 vs V6</h1>
              <p className={styles.subtitle}>
                A version-to-version benchmark focused on the runtime cost of React Tooltip v6
                relative to v5 under the same workloads.
              </p>
              <div className={styles.meta}>
                <span className={styles.metaBadge}>{benchmarkSnapshot.inputFiles} runs</span>
                <span className={styles.metaBadge}>v{benchmarkSnapshot.versions.v5}</span>
                <span className={styles.metaBadge}>v{benchmarkSnapshot.versions.v6}</span>
                <span className={styles.metaBadge}>
                  {smallestCount.toLocaleString()} to {largestRow.count.toLocaleString()} anchors
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className={styles.page}>
        <div className="container">
          <section className={styles.summaryGrid}>
            <article className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Best Mount Improvement</p>
              <strong className={styles.summaryValue}>
                {formatDeltaMs(strongestMountWin.mountDeltaMs)}
              </strong>
              <p className={styles.summaryText}>
                v6 mounts fastest relative to v5 at {strongestMountWin.count.toLocaleString()}{' '}
                anchors in the current snapshot.
              </p>
            </article>
            <article className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Best Memory Reduction</p>
              <strong className={styles.summaryValue}>
                {formatMemory(strongestMemoryWin.mountMemDeltaKiB)}
              </strong>
              <p className={styles.summaryText}>
                v6 retains less mount-time memory than v5 at{' '}
                {strongestMemoryWin.count.toLocaleString()} anchors.
              </p>
            </article>
            <article className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Highest Tested Workload</p>
              <strong className={styles.summaryValue}>{largestRow.count.toLocaleString()}</strong>
              <p className={styles.summaryText}>
                Largest published scenario in this benchmark snapshot.
              </p>
            </article>
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.card}>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>What Changed In V6</h2>
                <p className={styles.cardText}>
                  The v6 work keeps the existing feature surface while reducing the internal cost of
                  supporting it. Most of the gains come from removing repeated work and making
                  high-frequency runtime paths cheaper.
                </p>
                <ul className={styles.signalList}>
                  <li>
                    <strong>Shared anchor discovery and tracking</strong>: anchor-related state is
                    centralized instead of repeated per tooltip instance.
                  </li>
                  <li>
                    <strong>Delegated event handling</strong>: the implementation avoids attaching
                    redundant listeners across many anchors.
                  </li>
                  <li>
                    <strong>Less per-anchor bookkeeping in hot paths</strong>: costs that used to
                    scale with anchor volume are reduced where they matter most.
                  </li>
                </ul>
                <p className={styles.cardText}>
                  These changes matter most under load. At small counts, repeated work can hide
                  behind fixed overhead. As the workload grows, the cost of duplicated tracking,
                  redundant listeners, and per-anchor work becomes visible.
                </p>

                <h3 className={styles.cardTitle}>What The Benchmark Measures</h3>
                <p className={styles.cardText}>
                  Each row compares the same scenario in v5 and v6. Anchor count is the workload
                  variable, but the benchmark itself is a version-to-version runtime comparison.
                </p>
                <ul className={styles.signalList}>
                  <li>
                    <strong>Mount time</strong>: the cost of initializing tooltip behavior for the
                    scenario.
                  </li>
                  <li>
                    <strong>Unmount time</strong>: the cost of tearing that setup down.
                  </li>
                  <li>
                    <strong>Mount memory</strong>: the memory retained while initialization is
                    happening.
                  </li>
                </ul>
                <p className={styles.cardText}>
                  These metrics map to practical frontend concerns. Mount cost affects render,
                  hydration, and large UI updates. Memory retention matters because tooltip state
                  stays resident after setup, especially when many anchors are active on the same
                  page.
                </p>

                <h3 className={styles.cardTitle}>How To Read The Numbers</h3>
                <p className={styles.cardText}>
                  Read the table in three passes: raw values first, deltas second, spread last.
                </p>
                <ul className={styles.signalList}>
                  <li>
                    <strong>Raw values</strong> show the measured result for each version.
                  </li>
                  <li>
                    <strong>Delta</strong> shows direction. Negative values favor v6 because they
                    mean less time or memory used.
                  </li>
                  <li>
                    <strong>Spread</strong> shows how stable the metric was across repeated runs.
                  </li>
                </ul>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Benchmark Results</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th className={styles.countColumn}>Anchors</th>
                        <th className={styles.mountGroup}>V5 Mount</th>
                        <th className={styles.mountGroup}>V6 Mount</th>
                        <th className={styles.mountGroup}>Mount Delta</th>
                        <th className={styles.mountGroup}>Mount Variation</th>
                        <th className={styles.unmountGroup}>V5 Unmount</th>
                        <th className={styles.unmountGroup}>V6 Unmount</th>
                        <th className={styles.unmountGroup}>Unmount Delta</th>
                        <th className={styles.unmountGroup}>Unmount Variation</th>
                        <th className={styles.memoryGroup}>V5 Mount Mem</th>
                        <th className={styles.memoryGroup}>V6 Mount Mem</th>
                        <th className={styles.memoryGroup}>Mount Mem Delta</th>
                        <th className={styles.memoryGroup}>Mount Mem Variation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarkSnapshot.rows.map((row) => (
                        <tr key={row.count}>
                          <td className={styles.countCell}>{row.count.toLocaleString()}</td>
                          <td className={styles.metricCell}>{row.v5MountMs.toFixed(2)} ms</td>
                          <td className={styles.metricCell}>{row.v6MountMs.toFixed(2)} ms</td>
                          <td className={`${styles.metricCell} ${getDeltaClass(row.mountDeltaMs)}`}>
                            {formatDeltaMs(row.mountDeltaMs)}
                          </td>
                          <td className={styles.metricCell}>
                            {formatPercent(row.mountSpreadPercent)}
                          </td>
                          <td className={styles.metricCell}>{row.v5UnmountMs.toFixed(2)} ms</td>
                          <td className={styles.metricCell}>{row.v6UnmountMs.toFixed(2)} ms</td>
                          <td
                            className={`${styles.metricCell} ${getDeltaClass(row.unmountDeltaMs)}`}
                          >
                            {formatDeltaMs(row.unmountDeltaMs)}
                          </td>
                          <td className={styles.metricCell}>
                            {formatPercent(row.unmountSpreadPercent)}
                          </td>
                          <td className={styles.metricCell}>{formatMemory(row.v5MountMemKiB)}</td>
                          <td className={styles.metricCell}>{formatMemory(row.v6MountMemKiB)}</td>
                          <td
                            className={`${styles.metricCell} ${getDeltaClass(row.mountMemDeltaKiB)}`}
                          >
                            {formatMemory(row.mountMemDeltaKiB)}
                          </td>
                          <td className={styles.metricCell}>
                            {formatPercent(row.mountMemSpreadPercent)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={styles.note}>
                  <strong>Delta</strong> compares v5 and v6 for the same scenario.{' '}
                  <strong>Variation</strong> reflects how much repeated runs moved for that metric
                  across repeated runs of the same scenario.
                </p>
                <p className={styles.cardText}>
                  Each row summarizes {benchmarkSnapshot.inputFiles} benchmark runs for the same
                  scenario. It shows the aggregated result for v5 and v6 at that workload size,
                  along with the delta between versions and the run-to-run variation for each
                  metric.
                </p>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>Why Mount Metrics Matter Most</h3>
                <p className={styles.cardText}>
                  Mount behavior is the most useful signal here because it represents the cost of
                  enabling tooltip behavior in the first place.
                </p>
                <p className={styles.cardText}>
                  That cost shows up during page load, hydration, and large UI updates. If setup is
                  expensive, users pay for it immediately through slower render work and slower
                  interaction readiness.
                </p>
                <p className={styles.cardText}>
                  Lower mount time reduces that blocking work and lower mount memory reduces the
                  steady overhead that remains after initialization.
                </p>

                <h3 className={styles.cardTitle}>Why Unmount Metrics Need More Care</h3>
                <p className={styles.cardText}>
                  Unmount data still matters, but cleanup timing is more sensitive to browser
                  scheduling, deferred work, and memory reclamation behavior.
                </p>
                <p className={styles.cardText}>
                  For that reason, unmount measurements work better as supporting evidence than as
                  the primary basis for declaring one version faster.
                </p>

                <h3 className={styles.cardTitle}>The Memory Metrics</h3>
                <p className={styles.cardText}>
                  In the current snapshot, v6 consistently trends lower on mount memory. That means
                  the implementation is not only doing less work during initialization, but also
                  carrying less state while doing the same job.
                </p>
                <p className={styles.cardText}>
                  The importance of that difference increases with density. Small memory wins at low
                  counts are easy to dismiss. The same pattern at higher counts is much more
                  consequential.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  )
}
