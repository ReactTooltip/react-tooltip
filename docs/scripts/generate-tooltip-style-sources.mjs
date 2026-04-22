import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const docsRoot = path.resolve(__dirname, '..')
const projectRoot = path.resolve(docsRoot, '..')

const sourceFiles = [
  {
    input: path.join(projectRoot, 'src/components/Tooltip/styles.module.css'),
    output: path.join(docsRoot, 'src/generated/tooltipStylesSource.js'),
    variableName: 'tooltipStylesSource',
  },
  {
    input: path.join(projectRoot, 'src/components/Tooltip/core-styles.module.css'),
    output: path.join(docsRoot, 'src/generated/tooltipCoreStylesSource.js'),
    variableName: 'tooltipCoreStylesSource',
  },
]

await mkdir(path.join(docsRoot, 'src/generated'), { recursive: true })

await Promise.all(
  sourceFiles.map(async ({ input, output, variableName }) => {
    const css = await readFile(input, 'utf8')
    const moduleSource = `const ${variableName} = ${JSON.stringify(css)}\n\nexport default ${variableName}\n`
    await writeFile(output, moduleSource, 'utf8')
  }),
)
