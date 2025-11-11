# Benchmarking Troubleshooting

## Common Issues and Solutions

### Issue: "Build failed for one or both versions"

**Cause**: Dependencies might not install correctly, especially on different Node versions.

**Solutions**:
1. Try with `--legacy-peer-deps`:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Manual build approach:
   ```bash
   # Build BEFORE version
   git checkout 8e34a51
   npm install --legacy-peer-deps
   npm run build
   cp dist/react-tooltip.min.js benchmark/react-tooltip-before.js
   
   # Build AFTER version
   git checkout 69a6e09
   npm install --legacy-peer-deps
   npm run build
   cp dist/react-tooltip.min.js benchmark/react-tooltip-after.js
   ```

3. If build still fails, you can test with CDN versions instead by modifying the HTML files.

### Issue: "Memory stats show N/A"

**Cause**: `performance.memory` API is not available or not precise.

**Solutions**:
1. Make sure you're using Chrome (not Firefox/Safari)
2. Start Chrome with the flag:
   ```bash
   chrome --enable-precise-memory-info
   ```

3. Even without memory stats, you can still compare DOM node counts.

### Issue: "GC button doesn't work"

**Cause**: Garbage collection is not exposed in the browser.

**Solution**:
Start Chrome with the GC flag:
```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --js-flags="--expose-gc"

# Linux  
google-chrome --js-flags="--expose-gc"

# Windows
chrome.exe --js-flags="--expose-gc"
```

### Issue: "Test runs but I don't see any difference"

**Expected behavior**: For static tooltips with normal usage, you likely won't see a significant difference!

**To see the impact**:
1. Run the full test (1000 cycles) multiple times in a row
2. Check the heap snapshots for detached DOM nodes
3. Try the dynamic content scenario (see ANALYSIS.md for examples)

### Issue: "The automated script doesn't work"

**Alternative manual approach**:

1. Don't use the script, build versions manually (see above)
2. Create simple test files using the template in `memory-leak-test.html`
3. Include the built JS files in your test HTML
4. Run the tests manually in the browser

### Issue: "I can't reproduce the memory leak"

**This is actually expected!** The original issue reported DOM nodes "rising", which could be:
1. A very specific use case with dynamic content
2. An edge case that only appears after extended use
3. Fixed by other changes since v5.28.0

The fixes are **preventive** - they address potential leaks that could occur in edge cases, even if they're not always measurable.

## Interpreting Results

### "No measurable difference" - Is this okay?

**YES!** This is actually expected for:
- Static tooltips
- Normal usage patterns
- Short test durations

The fixes provide:
- ✅ Better safety against edge cases
- ✅ React best practices (promise checks)
- ✅ Proper cleanup patterns
- ✅ Zero cost in normal usage

### "Small difference (< 1MB)" - Is this significant?

**It depends:**
- For a stress test, this is **positive** - it shows proper cleanup
- For normal usage, this is **expected** - the fixes prevent accumulation
- The key metric is **consistency** - memory should stabilize, not grow indefinitely

### "Large difference (> 5MB)" - What does this mean?

**Investigate further:**
- Check if there are other factors (browser extensions, etc.)
- Run the test multiple times to confirm
- Take heap snapshots to see what's being retained
- This could indicate a different issue

## Getting Help

If you're stuck:

1. Check the BENCHMARK_GUIDE.md for detailed instructions
2. Review the ANALYSIS.md to understand what we're testing
3. See DECISION_GUIDE.md for the TL;DR version

## Alternative Testing Approaches

### Approach 1: Visual Testing
Just hover rapidly over tooltips and watch DevTools Memory timeline. Even without precise numbers, you can see if memory keeps growing or stabilizes.

### Approach 2: Production Testing  
Deploy both versions to a staging environment and monitor real-world usage with performance monitoring tools.

### Approach 3: Simplified Test
Create a minimal test case with just one tooltip and 100 rapid show/hide cycles. This reduces variables.

## Expected Benchmark Results

Based on the analysis, here's what you should expect:

| Scenario | DOM Growth | Memory Impact | Result |
|----------|-----------|---------------|--------|
| Static tooltip, 100 cycles | +0-5 nodes | < 0.5 MB | ✅ No leak |
| Static tooltip, 1000 cycles | +5-15 nodes | < 1 MB | ✅ Minor improvement |
| Dynamic content, 100 cycles | +10-30 nodes | 1-3 MB | ✅ Measurable improvement |
| Dynamic content, 1000 cycles | +30-100 nodes | 3-10 MB | ✅ Significant improvement |

**Key indicator**: After forcing GC, node count should return to baseline ±10 nodes.

## Still Can't Get It Working?

That's okay! The benchmark tools are optional. The fixes themselves are:
1. Following React best practices
2. Adding proper cleanup that should exist anyway
3. Minimal code changes with zero runtime cost

Even without benchmark numbers, the changes are valid improvements to code quality.
