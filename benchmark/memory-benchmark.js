const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Automated Memory Leak Benchmark Script
 * 
 * This script builds and tests both versions (before and after fixes)
 * to compare memory usage and DOM node behavior.
 */

const BEFORE_COMMIT = '8e34a51';
const AFTER_COMMIT = '3a644de';
const REPO_ROOT = path.join(__dirname, '..');

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║   React Tooltip Memory Leak Benchmark                     ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

/**
 * Execute a command and return output
 */
function exec(command, options = {}) {
  try {
    return execSync(command, {
      cwd: REPO_ROOT,
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options
    });
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    if (!options.ignoreError) {
      process.exit(1);
    }
    return null;
  }
}

/**
 * Build a specific version
 */
function buildVersion(commit, label) {
  console.log(`\n📦 Building ${label} version (${commit})...`);
  
  // Stash any changes
  exec('git stash', { silent: true, ignoreError: true });
  
  // Checkout commit
  exec(`git checkout ${commit}`, { silent: true });
  
  // Build
  console.log('   Installing dependencies...');
  exec('npm install --legacy-peer-deps', { silent: true, ignoreError: true });
  
  console.log('   Building...');
  const buildOutput = exec('npm run build', { silent: true, ignoreError: true });
  
  // Copy built file
  const builtFile = path.join(REPO_ROOT, 'dist', 'react-tooltip.min.js');
  const targetFile = path.join(__dirname, `react-tooltip-${label}.js`);
  
  if (fs.existsSync(builtFile)) {
    fs.copyFileSync(builtFile, targetFile);
    console.log(`   ✅ Built and saved to: react-tooltip-${label}.js`);
    return true;
  } else {
    console.log(`   ⚠️  Build file not found, skipping copy`);
    return false;
  }
}

/**
 * Create test HTML files
 */
function createTestFiles() {
  console.log('\n📝 Creating test HTML files...');
  
  const testTemplate = (version, scriptFile) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Benchmark Test - ${version}</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="${scriptFile}"></script>
    <link rel="stylesheet" href="https://unpkg.com/react-tooltip@latest/dist/react-tooltip.css" />
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 1000px; margin: 0 auto; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
        .version { font-size: 24px; font-weight: bold; color: #007bff; }
        .controls { margin: 20px 0; }
        button { padding: 10px 20px; margin: 5px; font-size: 14px; cursor: pointer; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 10px; margin: 20px 0; }
        .stat { background: white; border: 2px solid #ddd; padding: 15px; border-radius: 5px; }
        .stat-label { font-size: 11px; color: #666; text-transform: uppercase; }
        .stat-value { font-size: 20px; font-weight: bold; margin-top: 5px; }
        .test-area { border: 2px dashed #ccc; padding: 20px; min-height: 200px; }
        .anchor { display: inline-block; margin: 10px; padding: 10px 15px; background: #007bff; color: white; border-radius: 4px; cursor: pointer; }
        .log { margin-top: 20px; padding: 10px; background: #f9f9f9; border: 1px solid #ddd; max-height: 200px; overflow-y: auto; font-family: monospace; font-size: 11px; }
        .warning { color: #ff6b00; }
        .error { color: #dc3545; }
        .success { color: #28a745; }
    </style>
</head>
<body>
    <div class="header">
        <div class="version">Testing: ${version}</div>
        <div>Rapidly hover tooltips to test for memory leaks</div>
    </div>

    <div class="controls">
        <button onclick="startTest(100)">Quick Test (100 cycles)</button>
        <button onclick="startTest(1000)">Full Test (1000 cycles)</button>
        <button onclick="stopTest()">Stop</button>
        <button onclick="forceGC()">Force GC</button>
        <button onclick="resetStats()">Reset</button>
    </div>

    <div class="stats">
        <div class="stat"><div class="stat-label">Cycles</div><div class="stat-value" id="cycles">0</div></div>
        <div class="stat"><div class="stat-label">DOM Nodes</div><div class="stat-value" id="nodes">0</div></div>
        <div class="stat"><div class="stat-label">Tooltips</div><div class="stat-value" id="tooltips">0</div></div>
        <div class="stat"><div class="stat-label">Memory (MB)</div><div class="stat-value" id="memory">N/A</div></div>
    </div>

    <div id="root"></div>

    <div class="log" id="log"></div>

    <script>
        const { createElement: h } = React;
        const { createRoot } = ReactDOM;
        const { Tooltip } = ReactTooltip;

        let running = false;
        let cycles = 0;
        let root;

        function log(msg, type = 'info') {
            const el = document.getElementById('log');
            const entry = document.createElement('div');
            entry.className = type;
            entry.textContent = \`[\${new Date().toLocaleTimeString()}] \${msg}\`;
            el.insertBefore(entry, el.firstChild);
            while (el.children.length > 50) el.removeChild(el.lastChild);
        }

        function updateStats() {
            document.getElementById('cycles').textContent = cycles;
            document.getElementById('nodes').textContent = document.getElementsByTagName('*').length;
            document.getElementById('tooltips').textContent = document.querySelectorAll('[role="tooltip"]').length;
            if (performance.memory) {
                document.getElementById('memory').textContent = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
            }
        }

        function App() {
            return h('div', { className: 'test-area' },
                h('span', { className: 'anchor', 'data-tooltip-id': 'test' }, 'Hover 1'),
                h('span', { className: 'anchor', 'data-tooltip-id': 'test' }, 'Hover 2'),
                h('span', { className: 'anchor', 'data-tooltip-id': 'test' }, 'Hover 3'),
                h(Tooltip, { id: 'test' },
                    h('div', null,
                        h('h3', null, 'Complex Tooltip'),
                        h('p', null, 'With nested children'),
                        h('ul', null,
                            h('li', null, 'Item 1'),
                            h('li', null, 'Item 2'),
                            h('li', null, 'Item 3')
                        )
                    )
                )
            );
        }

        async function simulateHover(el) {
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, cancelable: true }));
            await new Promise(r => setTimeout(r, 15));
            el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, cancelable: true }));
            await new Promise(r => setTimeout(r, 5));
        }

        async function startTest(total) {
            if (running) return;
            running = true;
            cycles = 0;

            if (!root) {
                root = createRoot(document.getElementById('root'));
                root.render(h(App));
                await new Promise(r => setTimeout(r, 100));
            }

            const startNodes = document.getElementsByTagName('*').length;
            const startMem = performance.memory ? performance.memory.usedJSHeapSize : 0;

            log(\`Starting test: \${total} cycles\`, 'success');

            for (let i = 0; i < total && running; i++) {
                cycles = i + 1;
                const anchors = document.querySelectorAll('.anchor');
                for (const anchor of anchors) {
                    if (!running) break;
                    await simulateHover(anchor);
                }

                if (i % 50 === 0) {
                    updateStats();
                }

                if (i % 100 === 0) {
                    await new Promise(r => setTimeout(r, 10));
                }
            }

            const endNodes = document.getElementsByTagName('*').length;
            const endMem = performance.memory ? performance.memory.usedJSHeapSize : 0;
            const nodeDelta = endNodes - startNodes;
            const memDelta = ((endMem - startMem) / 1048576).toFixed(2);

            log(\`Completed \${cycles} cycles\`, 'success');
            log(\`DOM nodes: \${nodeDelta > 0 ? '+' : ''}\${nodeDelta}\`, nodeDelta > 50 ? 'error' : 'success');
            log(\`Memory: \${memDelta} MB\`, 'info');

            running = false;
            updateStats();
        }

        function stopTest() {
            running = false;
            log('Test stopped', 'warning');
        }

        function forceGC() {
            if (window.gc) {
                window.gc();
                log('GC triggered', 'success');
                setTimeout(updateStats, 100);
            } else {
                log('GC not available. Start Chrome with --js-flags="--expose-gc"', 'error');
            }
        }

        function resetStats() {
            cycles = 0;
            updateStats();
        }

        setInterval(updateStats, 2000);
        updateStats();
        log('Ready to test ${version}', 'info');
    </script>
</body>
</html>`;

  fs.writeFileSync(
    path.join(__dirname, 'test-before.html'),
    testTemplate('BEFORE FIX', 'react-tooltip-before.js')
  );
  
  fs.writeFileSync(
    path.join(__dirname, 'test-after.html'),
    testTemplate('AFTER FIX', 'react-tooltip-after.js')
  );

  console.log('   ✅ Created test-before.html');
  console.log('   ✅ Created test-after.html');
}

/**
 * Main execution
 */
async function main() {
  console.log('This script will:');
  console.log('1. Build the version BEFORE the fixes');
  console.log('2. Build the version AFTER the fixes');
  console.log('3. Create test HTML files for manual comparison\n');

  // Build both versions
  const beforeBuilt = buildVersion(BEFORE_COMMIT, 'before');
  const afterBuilt = buildVersion(AFTER_COMMIT, 'after');

  // Return to the after commit
  exec(`git checkout ${AFTER_COMMIT}`, { silent: true });

  if (beforeBuilt && afterBuilt) {
    createTestFiles();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ Build Complete!                                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

    console.log('📖 Next Steps:\n');
    console.log('1. Open Chrome with GC enabled:');
    console.log('   chrome --js-flags="--expose-gc" --enable-precise-memory-info\n');
    console.log('2. Open DevTools → Memory tab\n');
    console.log('3. Test BEFORE version:');
    console.log('   - Open: benchmark/test-before.html');
    console.log('   - Run full test (1000 cycles)');
    console.log('   - Note final DOM nodes and memory\n');
    console.log('4. Test AFTER version:');
    console.log('   - Close previous tab');
    console.log('   - Open: benchmark/test-after.html');
    console.log('   - Run full test (1000 cycles)');
    console.log('   - Note final DOM nodes and memory\n');
    console.log('5. Compare results and take heap snapshots\n');
    console.log('See benchmark/BENCHMARK_GUIDE.md for detailed instructions.\n');
  } else {
    console.log('\n⚠️  Build failed for one or both versions.');
    console.log('You may need to build manually. See BENCHMARK_GUIDE.md for instructions.\n');
  }
}

main().catch(console.error);
