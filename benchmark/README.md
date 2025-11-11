# React Tooltip Memory Leak Benchmarks

This directory contains tools to benchmark and validate the memory leak fixes implemented in PR #XXXX.

## Quick Start

```bash
cd benchmark
node memory-benchmark.js
```

This will build both versions (before and after the fixes) and create test HTML files for comparison.

## Files

- **`BENCHMARK_GUIDE.md`** - Comprehensive guide for running benchmarks
- **`ANALYSIS.md`** - Detailed analysis of the fixes and their impact
- **`memory-benchmark.js`** - Automated script to build and prepare tests
- **`test-before.html`** - Test page for version WITHOUT fixes (generated)
- **`test-after.html`** - Test page for version WITH fixes (generated)
- **`memory-leak-test.html`** - Standalone HTML test template

## Testing Process

1. Run `node memory-benchmark.js` to build both versions
2. Open Chrome with: `chrome --js-flags="--expose-gc" --enable-precise-memory-info`
3. Test both versions and compare:
   - DOM node growth
   - Memory usage
   - Detached DOM nodes

See `BENCHMARK_GUIDE.md` for detailed instructions.

## What's Being Tested

The fixes address three potential memory leak sources:

1. **ResizeObserver timeout accumulation** - Multiple setTimeout calls in ResizeObserver callbacks
2. **handleShow timeout leaks** - Untracked 10ms setTimeout in handleShow function
3. **Async promise updates** - State updates from promises after component unmounts

## Expected Results

**Normal usage**: Minimal to no measurable difference
**Stress tests (1000+ cycles)**: Small but measurable improvement in timeout cleanup
**Dynamic content**: More significant improvement when tooltip content updates frequently

See `ANALYSIS.md` for detailed cost-benefit analysis.

## Contributing

If you run benchmarks, please share your results:

```markdown
## Benchmark Results

**Environment**: Chrome 120, macOS 14.0
**Test**: 1000 rapid hover cycles

### Before Fix
- DOM Node Growth: +15
- Memory Growth: 2.3 MB
- Detached Nodes: 0

### After Fix  
- DOM Node Growth: +12
- Memory Growth: 1.8 MB
- Detached Nodes: 0

**Conclusion**: Minimal but positive improvement
```
