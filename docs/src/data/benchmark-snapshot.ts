export type BenchmarkRow = {
  count: number
  v5MountMs: number
  v6MountMs: number
  mountDeltaMs: number
  mountSpreadPercent: number
  v5UnmountMs: number
  v6UnmountMs: number
  unmountDeltaMs: number
  unmountSpreadPercent: number
  v5UpdateMs: number
  v6UpdateMs: number
  updateDeltaMs: number
  updateSpreadPercent: number
  v5MountMemKiB: number
  v6MountMemKiB: number
  mountMemDeltaKiB: number
  mountMemSpreadPercent: number
  v5UnmountMemKiB: number
  v6UnmountMemKiB: number
  unmountMemDeltaKiB: number
  unmountMemSpreadPercent: number
  samples: number
}

export const benchmarkSnapshot = {
  title: 'React Tooltip V5 vs V6 Benchmark Snapshot',
  timestamp: '2026-04-22T19:46:38.491Z',
  versions: {
    v5: '5.30.1',
    v6: '6.0.0',
  },
  inputFiles: 100,
  selection: 'latest 100 scaling runs',
  generationFilter: 'all benchmark generations',
  counts: [50, 100, 500, 2000, 5000, 10000],
  rows: [
    {
      count: 50,
      v5MountMs: 0.7,
      v6MountMs: 0.6,
      mountDeltaMs: -0.1,
      mountSpreadPercent: 0.0,
      v5UnmountMs: 0.2,
      v6UnmountMs: 0.2,
      unmountDeltaMs: 0.0,
      unmountSpreadPercent: 0.0,
      v5UpdateMs: 8.3,
      v6UpdateMs: 8.4,
      updateDeltaMs: 0.1,
      updateSpreadPercent: 4.8,
      v5MountMemKiB: 60.0,
      v6MountMemKiB: 41.5,
      mountMemDeltaKiB: -18.5,
      mountMemSpreadPercent: 5.3,
      v5UnmountMemKiB: -43.5,
      v6UnmountMemKiB: -18.6,
      unmountMemDeltaKiB: 24.9,
      unmountMemSpreadPercent: 9.8,
      samples: 100,
    },
    {
      count: 100,
      v5MountMs: 0.9,
      v6MountMs: 0.7,
      mountDeltaMs: -0.2,
      mountSpreadPercent: 14.3,
      v5UnmountMs: 0.2,
      v6UnmountMs: 0.2,
      unmountDeltaMs: 0.0,
      unmountSpreadPercent: 0.0,
      v5UpdateMs: 8.3,
      v6UpdateMs: 8.3,
      updateDeltaMs: 0.0,
      updateSpreadPercent: 6.0,
      v5MountMemKiB: 87.4,
      v6MountMemKiB: 72.3,
      mountMemDeltaKiB: -15.0,
      mountMemSpreadPercent: 3.4,
      v5UnmountMemKiB: -96.4,
      v6UnmountMemKiB: -90.7,
      unmountMemDeltaKiB: 5.8,
      unmountMemSpreadPercent: 0.8,
      samples: 100,
    },
    {
      count: 500,
      v5MountMs: 3.0,
      v6MountMs: 2.6,
      mountDeltaMs: -0.4,
      mountSpreadPercent: 6.7,
      v5UnmountMs: 0.5,
      v6UnmountMs: 0.4,
      unmountDeltaMs: -0.1,
      unmountSpreadPercent: 20.0,
      v5UpdateMs: 8.3,
      v6UpdateMs: 8.3,
      updateDeltaMs: 0.0,
      updateSpreadPercent: 1.2,
      v5MountMemKiB: 391.4,
      v6MountMemKiB: 358.3,
      mountMemDeltaKiB: -33.2,
      mountMemSpreadPercent: 0.0,
      v5UnmountMemKiB: -401.7,
      v6UnmountMemKiB: -377.0,
      unmountMemDeltaKiB: 24.7,
      unmountMemSpreadPercent: 17.5,
      samples: 100,
    },
    {
      count: 2000,
      v5MountMs: 15.6,
      v6MountMs: 14.9,
      mountDeltaMs: -0.7,
      mountSpreadPercent: 6.0,
      v5UnmountMs: 1.6,
      v6UnmountMs: 1.0,
      unmountDeltaMs: -0.6,
      unmountSpreadPercent: 20.0,
      v5UpdateMs: 7.6,
      v6UpdateMs: 8.3,
      updateDeltaMs: 0.7,
      updateSpreadPercent: 15.8,
      v5MountMemKiB: 1464.5,
      v6MountMemKiB: 1429.8,
      mountMemDeltaKiB: -34.7,
      mountMemSpreadPercent: 14.0,
      v5UnmountMemKiB: -1388.2,
      v6UnmountMemKiB: -1453.8,
      unmountMemDeltaKiB: -65.6,
      unmountMemSpreadPercent: 6.2,
      samples: 100,
    },
    {
      count: 5000,
      v5MountMs: 91.55,
      v6MountMs: 87.25,
      mountDeltaMs: -4.3,
      mountSpreadPercent: 21.9,
      v5UnmountMs: 4.1,
      v6UnmountMs: 2.4,
      unmountDeltaMs: -1.7,
      unmountSpreadPercent: 16.7,
      v5UpdateMs: 16.8,
      v6UpdateMs: 13.3,
      updateDeltaMs: -3.5,
      updateSpreadPercent: 19.0,
      v5MountMemKiB: 4288.0,
      v6MountMemKiB: 3568.4,
      mountMemDeltaKiB: -719.6,
      mountMemSpreadPercent: 0.0,
      v5UnmountMemKiB: -4306.7,
      v6UnmountMemKiB: -3584.0,
      unmountMemDeltaKiB: 722.7,
      unmountMemSpreadPercent: 0.2,
      samples: 100,
    },
    {
      count: 10000,
      v5MountMs: 381.2,
      v6MountMs: 364.75,
      mountDeltaMs: -16.45,
      mountSpreadPercent: 13.0,
      v5UnmountMs: 8.4,
      v6UnmountMs: 4.9,
      unmountDeltaMs: -3.5,
      unmountSpreadPercent: 10.7,
      v5UpdateMs: 33.5,
      v6UpdateMs: 26.2,
      updateDeltaMs: -7.3,
      updateSpreadPercent: 10.3,
      v5MountMemKiB: 8453.1,
      v6MountMemKiB: 7123.1,
      mountMemDeltaKiB: -1330.1,
      mountMemSpreadPercent: 0.0,
      v5UnmountMemKiB: -8476.6,
      v6UnmountMemKiB: -7143.3,
      unmountMemDeltaKiB: 1333.3,
      unmountMemSpreadPercent: 0.1,
      samples: 100,
    },
  ] as BenchmarkRow[],
}

export default benchmarkSnapshot
