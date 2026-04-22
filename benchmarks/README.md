# React Tooltip Scaling Benchmark

Automated benchmark harness comparing V5 and V6 mount/unmount performance across tooltip counts.

## Quick start

```bash
# Single benchmark pass (5 repeats per count)
node benchmarks/run-benchmark.mjs

# Full statistical run (100 passes across 5 workers, then aggregate)
yarn benchmark:scaling:full -r 100 -w 5

# Aggregate the latest N results
node benchmarks/aggregate-benchmarks.mjs --latest 100
```

## Options

| Flag               | Default                      | Description                                                    |
| ------------------ | ---------------------------- | -------------------------------------------------------------- |
| `--counts`         | `50,100,500,2000,5000,10000` | Comma-separated tooltip counts to benchmark                    |
| `--repeats`        | `5`                          | Measurement repeats per count                                  |
| `--warmups`        | `1`                          | Warmup rounds per count (auto-scales to 2 for counts ≥ 10,000) |
| `--timeoutMs`      | `1200`                       | Max time (ms) to wait for render completion                    |
| `--executablePath` | Playwright Chromium          | Path to a Chrome/Chromium binary                               |
| `-r` / `--runs`    | `3`                          | Total benchmark passes (scaling series)                        |
| `-w` / `--workers` | `1`                          | Parallel worker count (scaling series)                         |

## How it works

1. **Build** — Bundles the fixture app with esbuild, embedding both V5 and V6 tooltip builds
2. **Launch** — Opens a headless Chromium instance with `--enable-precise-memory-info` and `--expose-gc`
3. **Isolate** — Each version gets its own browser page to prevent GC/memory cross-contamination
4. **Randomize** — V5/V6 execution order is randomized per run to eliminate ordering bias
5. **Measure** — For each count: warmup rounds, then timed mount/unmount with GC-settled memory snapshots
6. **Trim** — IQR-based outlier removal filters OS scheduling noise from aggregated results

## Latest results (100 runs, April 2026)

| Count  | V5 mount  | V6 mount  | Delta     | Spread | V5 unmount | V6 unmount | Delta    | V5 update | V6 update | Delta    | V6 mount mem | Mem savings |
| ------ | --------- | --------- | --------- | ------ | ---------- | ---------- | -------- | --------- | --------- | -------- | ------------ | ----------- |
| 50     | 0.70 ms   | 0.60 ms   | -0.10 ms  | 0.0%   | 0.20 ms    | 0.20 ms    | 0.00 ms  | 8.30 ms   | 8.40 ms   | +0.10 ms | 41.5 KiB     | -18.5 KiB   |
| 100    | 0.90 ms   | 0.70 ms   | -0.20 ms  | 14.3%  | 0.20 ms    | 0.20 ms    | 0.00 ms  | 8.30 ms   | 8.30 ms   | 0.00 ms  | 72.3 KiB     | -15.0 KiB   |
| 500    | 3.00 ms   | 2.60 ms   | -0.40 ms  | 6.7%   | 0.50 ms    | 0.40 ms    | -0.10 ms | 8.30 ms   | 8.30 ms   | 0.00 ms  | 358.3 KiB    | -33.2 KiB   |
| 2,000  | 15.60 ms  | 14.90 ms  | -0.70 ms  | 6.0%   | 1.60 ms    | 1.00 ms    | -0.60 ms | 7.60 ms   | 8.30 ms   | +0.70 ms | 1,430 KiB    | -34.7 KiB   |
| 5,000  | 91.55 ms  | 87.25 ms  | -4.30 ms  | 21.9%  | 4.10 ms    | 2.40 ms    | -1.70 ms | 16.80 ms  | 13.30 ms  | -3.50 ms | 3,568 KiB    | -719.6 KiB  |
| 10,000 | 381.20 ms | 364.75 ms | -16.45 ms | 13.0%  | 8.40 ms    | 4.90 ms    | -3.50 ms | 33.50 ms  | 26.20 ms  | -7.30 ms | 7,123 KiB    | -1,330 KiB  |

**Key takeaways:**

- V6 is faster on mount and unmount at all tested counts (up to 10k)
- V6 uses less mount memory at every count (2k outlier resolved)
- V6 prop updates are 21% faster at 10k (26.2 ms vs 33.5 ms)
- Zero timeouts at all counts
