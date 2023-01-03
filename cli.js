const fs = require('fs') // eslint-disable-line @typescript-eslint/no-var-requires
const rimraf = require('rimraf') // eslint-disable-line @typescript-eslint/no-var-requires

const args = process.argv.slice(2)
const parameters = args.reduce((acc, arg) => {
  const [key, value] = arg.split('=')
  acc[key.replace('--', '')] = value
  return acc
}, {})

const bundleFolder = {
  development: './build',
  production: './dist',
}

// Build folder
const dir = bundleFolder[parameters.env]

const log = (message) => console.log(`### ${message} ###`)

log(`Building for env: ${parameters.env}`)

// check if directory exists
if (fs.existsSync(dir)) {
  rimraf(dir, function () {
    fs.mkdirSync(dir)
  })
} else {
  fs.mkdirSync(dir)
}
