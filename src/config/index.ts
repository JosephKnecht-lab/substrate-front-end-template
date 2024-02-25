import configCommon from './common.json'
// Using `require` as `import` does not support dynamic loading (yet).
const configEnv = require(`./${process.env.NODE_ENV}.json`)

// Accepting React env vars and aggregating them into `config` object.
const envVarNames: string[] = ['REACT_APP_PROVIDER_SOCKET']
const envVars: { [key: string]: string } = envVarNames.reduce(
  (mem: { [key: string]: string }, n: string) => {
    // Remove the `REACT_APP_` prefix
    const envValue = process.env[n]
    if (envValue !== undefined) mem[n.slice(10)] = envValue
    return mem
  },
  {}
)

const config: { [key: string]: any } = {
  ...configCommon,
  ...configEnv,
  ...envVars,
}
export default config
