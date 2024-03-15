import { join } from 'node:path'
import { globby } from 'globby'

// const generatedPath = join(import.meta.dir, '../test/contracts/generated.ts')
// Bun.write(generatedPath, '')

// const generated = Bun.file(generatedPath)
// const writer = generated.writer()

const CONTRACT_FILTER = [
  'IMangrove',
  'AbstractRouter',
  'RouterProxy',
  'RouterProxyFactory',
  'SmartRouter',
  'AbstractRoutingLogic',
  'MangroveOffer',
  'MangroveOrder',
  'RenegingForwarder',
  'Direct',
  'MgvReader',
  'MgvOracle',
]

const paths = (
  await globby([join(import.meta.dir, '../contracts/out/**/*.json')])
).filter((path) =>
  CONTRACT_FILTER.some((contract) => path.endsWith(`${contract}.json`)),
)

await Promise.all([
  ...paths.map(async (path) => {
    const fileName = path.split('/').pop()?.replace('.json', '')
    const json = await Bun.file(path, { type: 'application/json' }).json()
    const generatedPath = join(import.meta.dir, '../src/abis', `${fileName}.ts`)
    Bun.write(generatedPath, '')

    const generated = Bun.file(generatedPath)
    const writer = generated.writer()

    writer.write(
      `export const ${fileName} = ${JSON.stringify(
        json.abi,
        null,
        2,
      )} as const;\n\n`,
    )

    writer.end()
  }),
  (async () => {
    const generatedPath = join(import.meta.dir, '../src/abis/index.ts')
    Bun.write(generatedPath, '')

    const generated = Bun.file(generatedPath)
    const writer = generated.writer()

    writer.write(
      paths
        .map((path) => {
          const fileName = path.split('/').pop()?.replace('.json', '')
          return `export {${fileName}} from './${fileName}.js';`
        })
        .join('\n'),
    )

    writer.end()
  })(),
])
