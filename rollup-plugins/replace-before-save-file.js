/* eslint-disable no-await-in-loop */
import { readFile, writeFile } from 'node:fs/promises'

const cssMinifier = (css) =>
  css
    .replace(/([^0-9a-zA-Z.#])\s+/g, '$1')
    .replace(/\s([^0-9a-zA-Z.#]+)/g, '$1')
    .replace(/;}/g, '}')
    .replace(/\/\*.*?\*\//g, '')

/* eslint-disable no-param-reassign */
/**
 * This plugin is very similar to the `replace`, but instead of only
 * check for strings, this plugin check for everything that matches the query.
 * expected input: { 'lorem:': 'ipsum' }
 * or
 * expected input: { 'lorem:': 'file:myfile.css' }
 */
export default function replaceBeforeSaveFile(replaceObject = {}) {
  return {
    // this name will show up in warnings and errors of rollup execution
    name: 'modify-generated-files',
    /**
     * This write bundle is executed after the files being written.
     * Docs: https://rollupjs.org/plugin-development/#writebundle
     */
    async writeBundle(options, bundle) {
      const replaceKeys = Object.keys(replaceObject)
      if (replaceKeys.length > 0) {
        const files = Object.keys(bundle)

        let file = null
        let key = null
        let regex = null
        for (let index = 0; index < files.length; index += 1) {
          file = files[index]

          if (file && bundle[file].code) {
            for (let indexKeys = 0; indexKeys < replaceKeys.length; indexKeys += 1) {
              key = replaceKeys[indexKeys]
              regex = new RegExp(key, 'g')

              if (bundle[file].code.includes(key)) {
                if (key.includes('css') && replaceObject[key].includes('file:')) {
                  const [, fileName] = replaceObject[key].split(':')
                  const fileContent = await readFile(`./dist/${fileName}`, 'utf8')

                  const splittedCSSContent = fileContent.split('/** end - core styles **/')

                  if (key.includes('core-css')) {
                    if (options.file.includes('.min')) {
                      bundle[file].code = bundle[file].code.replace(
                        regex,
                        `\`${cssMinifier(splittedCSSContent[0])}\``,
                      )
                    } else {
                      bundle[file].code = bundle[file].code.replace(
                        regex,
                        `\`${splittedCSSContent[0]}\``,
                      )
                    }
                  } else if (!key.includes('core-css')) {
                    if (options.file.includes('.min')) {
                      bundle[file].code = bundle[file].code.replace(
                        regex,
                        `\`${cssMinifier(splittedCSSContent[1])}\``,
                      )
                    } else {
                      bundle[file].code = bundle[file].code.replace(
                        regex,
                        `\`${splittedCSSContent[1]}\``,
                      )
                    }
                  }
                } else {
                  bundle[file].code = bundle[file].code.replace(regex, replaceObject[key])
                }

                await writeFile(options.file, bundle[file].code)
              }
            }
          }
        }
      }
    },
  }
}
