import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { spawn } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const nodeDir = dirname(process.execPath)

const env = {
  ...process.env,
  PATH: `${nodeDir}:${process.env.PATH || ''}`,
}

const child = spawn(
  process.execPath,
  [join(__dirname, 'node_modules/next/dist/bin/next'), 'dev', '--port', '3000'],
  { stdio: 'inherit', env, cwd: __dirname }
)
child.on('exit', (code) => process.exit(code || 0))
