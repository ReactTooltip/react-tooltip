import React from 'react'
import Layout from '@theme/Layout'
import benchmarkSnapshot from '@site/src/data/benchmark-snapshot'
import styles from './benchmark.module.css'

function formatDeltaMs(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(2)} ms`
}

function formatKiB(value: number) {
  const sign = value > 0 ? '+' : ''
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
                Aggregated performance benchmarks comparing React Tooltip v5 and v6 across mount
                cost, teardown cost, memory retention, and heavier page workloads.
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
              <p className={styles.summaryLabel}>Largest Mount Win</p>
              <strong className={styles.summaryValue}>
                {formatDeltaMs(strongestMountWin.mountDeltaMs)}
              </strong>
              <p className={styles.summaryText}>
                Best observed V6 mount improvement in this snapshot at{' '}
                {strongestMountWin.count.toLocaleString()} anchors.
              </p>
            </article>
            <article className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Largest Count</p>
              <strong className={styles.summaryValue}>{largestRow.count.toLocaleString()}</strong>
              <p className={styles.summaryText}>Highest anchor count included in this snapshot.</p>
            </article>
            <article className={styles.summaryCard}>
              <p className={styles.summaryLabel}>Largest Memory Win</p>
              <strong className={styles.summaryValue}>
                {formatKiB(largestRow.mountMemDeltaKiB)}
              </strong>
              <p className={styles.summaryText}>
                Best mount memory reduction in the published set.
              </p>
            </article>
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.card}>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Summary</h2>
                <p className={styles.cardText}>
                  We measured how v6 behaves compared to v5 in terms of runtime performance.
                </p>
                <p className={styles.cardText}>
                  Anchor count is one variable in this comparison, but not the goal by itself. What
                  matters is running both versions under the same conditions and seeing how they
                  behave as the workload increases
                </p>
                <p className={styles.cardText}>
                  In the current snapshot, the most consistent improvement shows up during setup. v6
                  mounts with lower CPU overhead and retains less memory while doing it. The
                  difference is already there at smaller scales, but becomes more noticeable as the
                  workload increases.
                </p>
                <p className={styles.cardText}>
                  Teardown metrics are included for completeness, but they need to be read more
                  carefully. Unmount behavior is more sensitive to timing variance and browser
                  scheduling, which makes it less reliable as a primary signal. It still adds useful
                  context, but it is not where the main conclusions come from.
                </p>

                <h3 className={styles.cardTitle}>What Changed In V6</h3>
                <p className={styles.cardText}>
                  The improvements in v6 are not about removing features or simplifying behavior.
                  The goal was to keep the same API while making it cheaper to run.
                </p>
                <p className={styles.cardText}>
                  Most of the changes are internal and focus on cutting out repeated work. Anchor
                  discovery and tracking no longer perform the same operations per instance.
                  Instead, that work is shared and centralized. Event handling follows the same
                  direction, moving away from attaching duplicate listeners on every anchor and
                  toward a more delegated approach.
                </p>
                <p className={styles.cardText}>
                  Another key change is reducing per-anchor work in hot paths. This kind of overhead
                  is easy to ignore at small scales, but it adds up quickly as the number of anchors
                  grows. What feels negligible with a few dozen elements can turn into a real cost
                  when you scale into the thousands.
                </p>

                <h3 className={styles.cardTitle}>The Benchmark</h3>
                <p className={styles.cardText}>
                  Each row runs the same scenario against both versions. The only thing that changes
                  is the workload size, controlled by the number of anchors. The comparison is
                  always v5 versus v6 under the same conditions.
                </p>
                <p className={styles.cardText}>The benchmark tracks three metrics:</p>
                <ul className={styles.signalList}>
                  <li>
                    <strong>Mount time</strong>: the cost of initializing tooltip behavior
                  </li>
                  <li>
                    <strong>Unmount time</strong>: the cost of tearing that setup down
                  </li>
                  <li>
                    <strong>Mount memory</strong>: the amount of memory retained during
                    initialization
                  </li>
                </ul>
                <p className={styles.cardText}>
                  These metrics map directly to real-world usage. Mount cost shows up when tooltip
                  behavior is initialized during render, hydration, or large UI updates. Memory
                  retention reflects how much overhead stays in memory once everything is active,
                  which becomes more relevant as the number of anchors grows.
                </p>

                <h3 className={styles.cardTitle}>How To Read The Numbers</h3>
                <p className={styles.cardText}>
                  Start with the raw values for v5 and v6, then use delta and spread to interpret
                  them.
                </p>
                <ul className={styles.signalList}>
                  <li>
                    <strong>Delta</strong> indicates direction. Negative values favor v6, meaning
                    less time or memory used.
                  </li>
                  <li>
                    <strong>Spread</strong> reflects stability across runs. Lower spread suggests
                    more consistent results.
                  </li>
                  <li>
                    <strong>Samples</strong> shows how much data supports each row.
                  </li>
                </ul>

                <p className={styles.cardText}>
                  Across the dataset, the direction is consistent: v6 reduces runtime cost compared
                  to v5, with the most noticeable gains in setup time and memory retention.
                </p>
                <p className={styles.cardText}>
                  At lower anchor counts, the difference is there but still small. Fixed overhead
                  takes up most of the total cost, so the impact of architectural changes is harder
                  to see. As the workload grows, the gap becomes more meaningful, and the effect of
                  reducing per-anchor work starts to show.
                </p>

                <h3 className={styles.cardTitle}>Why Mount Metrics Matter Most</h3>
                <p className={styles.cardText}>
                  It represents the cost of enabling tooltip behavior, which directly impacts
                  rendering and interaction readiness.
                </p>
                <p className={styles.cardText}>
                  In practice, this work happens during page load, hydration, and large UI updates.
                  If setup is expensive, users feel it right away.
                </p>
                <p className={styles.cardText}>
                  Lower mount time reduces blocking work during these phases. Lower memory retention
                  means less overhead once everything is active. Both become more important as
                  interface density increases.
                </p>
                <p className={styles.cardText}>
                  Because of that, mount time and mount memory are better indicators of the
                  improvements than teardown metrics.
                </p>

                <h3 className={styles.cardTitle}>Why Unmount Metrics Need More Care</h3>
                <p className={styles.cardText}>
                  Unmount behavior still matters, but it is easier to misread. Cleanup timing is
                  influenced by factors outside the implementation, such as browser scheduling and
                  memory reclamation.
                </p>
                <p className={styles.cardText}>
                  This makes the results more variable and less predictable. They are useful as
                  supporting data, but should not be the main basis for comparing versions.
                </p>
                <h3 className={styles.cardTitle}>The Memory Metrics</h3>
                <p className={styles.cardText}>
                  The memory metrics show how much state is retained during setup for a given
                  workload. Because the scenario is controlled, these numbers are more useful than
                  general browser memory readings.
                </p>
                <p className={styles.cardText}>
                  In the current data, memory usage consistently trends lower in v6. It not only
                  does less work during initialization, but also keeps less state alive while doing
                  it.
                </p>
                <p className={styles.cardText}>
                  The impact of that difference grows with scale. At low anchor counts it can be
                  easy to ignore, but the same pattern at higher densities becomes more relevant as
                  it starts to affect overall resource usage.
                </p>

                <p className={styles.cardText}>
                  For a system that needs to keep the same features while handling denser
                  interfaces, this is where the changes start to matter.
                </p>
              </div>
            </section>

            <section className={styles.card}>
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle}>Snapshot Table</h2>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Count</th>
                        <th>V5 Mount</th>
                        <th>V6 Mount</th>
                        <th>Mount Delta</th>
                        <th>Mount Spread</th>
                        <th>V5 Unmount</th>
                        <th>V6 Unmount</th>
                        <th>Unmount Delta</th>
                        <th>Unmount Spread</th>
                        <th>V5 Mount Mem</th>
                        <th>V6 Mount Mem</th>
                        <th>Mount Mem Delta</th>
                        <th>Mount Mem Spread</th>
                        <th>Samples</th>
                      </tr>
                    </thead>
                    <tbody>
                      {benchmarkSnapshot.rows.map((row) => (
                        <tr key={row.count}>
                          <td>{row.count.toLocaleString()}</td>
                          <td>{row.v5MountMs.toFixed(2)} ms</td>
                          <td>{row.v6MountMs.toFixed(2)} ms</td>
                          <td className={getDeltaClass(row.mountDeltaMs)}>
                            {formatDeltaMs(row.mountDeltaMs)}
                          </td>
                          <td>{formatPercent(row.mountSpreadPercent)}</td>
                          <td>{row.v5UnmountMs.toFixed(2)} ms</td>
                          <td>{row.v6UnmountMs.toFixed(2)} ms</td>
                          <td className={getDeltaClass(row.unmountDeltaMs)}>
                            {formatDeltaMs(row.unmountDeltaMs)}
                          </td>
                          <td>{formatPercent(row.unmountSpreadPercent)}</td>
                          <td>{row.v5MountMemKiB.toFixed(1)} KiB</td>
                          <td>{row.v6MountMemKiB.toFixed(1)} KiB</td>
                          <td className={getDeltaClass(row.mountMemDeltaKiB)}>
                            {formatKiB(row.mountMemDeltaKiB)}
                          </td>
                          <td>{formatPercent(row.mountMemSpreadPercent)}</td>
                          <td>{row.samples}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={styles.cardText}>
                  Each row summarizes {benchmarkSnapshot.inputFiles} benchmark runs for the same
                  scenario. It shows the aggregated result for v5 and v6 at that workload size,
                  along with the delta between versions and the spread across runs.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </Layout>
  )
}
