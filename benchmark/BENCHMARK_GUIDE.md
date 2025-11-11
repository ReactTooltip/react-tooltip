# Memory Leak Benchmark Guide

This guide will help you benchmark the performance impact of the memory leak fixes in PR #XXXX.

## Overview

The changes fix three potential memory leak sources:
1. **ResizeObserver timeout accumulation** - Tracking all setTimeout IDs in ResizeObserver callbacks
2. **Untracked handleShow timeouts** - Clearing the 10ms setTimeout in handleShow function  
3. **Async promise state updates** - Checking mounted state before updating from async promises

## Quick Start

### Prerequisites

1. Clone the repository
2. Install dependencies: `npm install` (or `yarn install`)
3. Build both versions for comparison

### Testing Approach

We'll compare two builds:
- **Before fix**: Commit `8e34a51` (before the fixes)
- **After fix**: Commit `3a644de` (with all fixes applied)

## Method 1: Automated Node.js Test

Run the automated benchmark test:

```bash
cd benchmark
npm install
node memory-benchmark.js
```

This will:
1. Build both versions
2. Run automated memory tests
3. Generate a comparison report

## Method 2: Manual Browser Testing

### Step 1: Build the "Before" Version

```bash
git checkout 8e34a51
npm install
npm run build
cp dist/react-tooltip.min.js benchmark/react-tooltip-before.js
```

### Step 2: Build the "After" Version

```bash
git checkout 3a644de
npm install  
npm run build
cp dist/react-tooltip.min.js benchmark/react-tooltip-after.js
```

### Step 3: Run Browser Tests

1. Open Chrome with garbage collection exposed:
   ```bash
   # macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --js-flags="--expose-gc" --enable-precise-memory-info
   
   # Linux
   google-chrome --js-flags="--expose-gc" --enable-precise-memory-info
   
   # Windows
   chrome.exe --js-flags="--expose-gc" --enable-precise-memory-info
   ```

2. Open DevTools (F12) → Performance/Memory tab

3. Test the "Before" version:
   - Open `benchmark/test-before.html`
   - Click "Start Rapid Test"
   - Monitor memory usage
   - Take heap snapshot after test completes
   - Note the final DOM node count and memory usage

4. Test the "After" version:
   - Close the previous tab
   - Open `benchmark/test-after.html`  
   - Click "Start Rapid Test"
   - Monitor memory usage
   - Take heap snapshot after test completes
   - Note the final DOM node count and memory usage

### Step 4: Compare Results

Compare the following metrics:

1. **DOM Node Growth**: 
   - Before: Final DOM node count - Initial count
   - After: Final DOM node count - Initial count
   - Expected: After should have similar or fewer nodes

2. **Memory Growth**:
   - Before: Final heap size - Initial heap size
   - After: Final heap size - Initial heap size
   - Expected: After should have similar or less memory growth

3. **Retained Objects** (from heap snapshot):
   - Look for detached DOM nodes
   - Look for orphaned timers/callbacks
   - Expected: After should have fewer detached elements

## Method 3: Chrome DevTools Performance Recording

1. Open Chrome DevTools → Performance tab
2. Enable "Memory" checkbox in settings
3. Click Record
4. Run the rapid test (1000 cycles)
5. Stop recording
6. Analyze:
   - JS Heap timeline (should be stable, not continuously growing)
   - DOM Nodes timeline (should return to baseline after GC)
   - Event listeners count (should not accumulate)

## What to Look For

### Signs of Memory Leak (Bad):
- ❌ Continuously increasing DOM node count
- ❌ JS heap size that doesn't return to baseline after GC
- ❌ Detached DOM trees in heap snapshots
- ❌ Growing number of event listeners
- ❌ Accumulating timers/callbacks

### Healthy Behavior (Good):
- ✅ DOM nodes return to baseline (±10 nodes)
- ✅ Memory usage stabilizes after initial growth
- ✅ Heap snapshots show no detached DOM trees
- ✅ Event listener count remains constant
- ✅ No accumulating timers

## Expected Results

### Theory

The fixes address very fast timeouts (10ms and 0ms) that should normally clear themselves. However:

1. **ResizeObserver fix**: In rapid show/hide scenarios (>100 times/second), multiple resize events could queue multiple 0ms timeouts before any complete. The Set-based tracking ensures ALL timeouts are cleared, not just the last one.

2. **handleShow fix**: The 10ms timeout in handleShow can accumulate if the function is called more frequently than every 10ms. With rapid hover events, this is possible.

3. **Promise fix**: While less likely to cause visible leaks, preventing state updates on unmounted components is a best practice that prevents potential issues.

### Measurable Impact

The impact will be most visible in:
- **Extreme rapid testing** (1000+ hover cycles in quick succession)
- **Memory profiling** showing fewer pending timers
- **Edge cases** with very fast user interactions

In normal usage patterns, the fixes provide:
- ✅ **Better safety** against edge case leaks
- ✅ **Cleaner code** with proper cleanup patterns
- ✅ **Best practices** for React component lifecycle

## Benchmark Results Template

```
## Benchmark Results

### Test Environment
- Browser: Chrome XXX
- OS: macOS/Linux/Windows
- Test: 1000 rapid hover cycles

### Before Fix (Commit 8e34a51)
- Initial DOM Nodes: XXX
- Final DOM Nodes: XXX
- DOM Node Growth: XXX
- Initial Memory: XX MB
- Final Memory: XX MB
- Memory Growth: XX MB
- Detached DOM Nodes: XXX

### After Fix (Commit 3a644de)
- Initial DOM Nodes: XXX
- Final DOM Nodes: XXX
- DOM Node Growth: XXX
- Initial Memory: XX MB
- Final Memory: XX MB
- Memory Growth: XX MB
- Detached DOM Nodes: XXX

### Analysis
[Your observations here]

### Conclusion
[Impact assessment: Significant/Moderate/Minimal/No measurable difference]
```

## Notes

- The fixes are **preventive** and follow React best practices
- Impact may be minimal in normal usage but significant in stress tests
- Even without measurable impact, the fixes improve code quality and safety
- The changes have zero performance overhead and no breaking changes
