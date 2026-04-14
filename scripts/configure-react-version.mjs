import { execSync } from 'node:child_process'

const reactVersion = process.argv[2]

const configs = {
  '16.14': {
    react: '16.14.0',
    reactDom: '16.14.0',
    typesReact: '^16.14.0',
    typesReactDom: '^16.9.0',
    testingLibraryReact: '12.1.5',
  },
  '17': {
    react: '17.0.2',
    reactDom: '17.0.2',
    typesReact: '^17.0.0',
    typesReactDom: '^17.0.0',
    testingLibraryReact: '12.1.5',
  },
  '18': {
    react: '18.2.0',
    reactDom: '18.2.0',
    typesReact: '^18.0.0',
    typesReactDom: '^18.0.0',
    testingLibraryReact: '14.3.1',
  },
  '19': {
    react: '19.0.0',
    reactDom: '19.0.0',
    typesReact: '^19.0.0',
    typesReactDom: '^19.0.0',
    testingLibraryReact: '16.3.0',
  },
}

const selected = configs[reactVersion]

if (!selected) {
  throw new Error(`Unsupported React version "${reactVersion}".`)
}

const packages = [
  `react@${selected.react}`,
  `react-dom@${selected.reactDom}`,
  `@types/react@${selected.typesReact}`,
  `@types/react-dom@${selected.typesReactDom}`,
  `@testing-library/react@${selected.testingLibraryReact}`,
]

execSync(`yarn add --dev --ignore-scripts --no-lockfile ${packages.join(' ')}`, {
  stdio: 'inherit',
})
