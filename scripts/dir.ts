import fs from 'fs'
import path from 'path'

import dotenv from 'dotenv'

import { THEME_FILENAME } from '../server/theme'

dotenv.config({ path: '../../.env' })
dotenv.config()

export const CONTENT_PATH = path.resolve(
  process.env.CONTENT_PATH ||
    (fs.existsSync('../../_post') ? '../..' : 'content')
)

export const srcPath = (
  root: '_post' | '_media' | typeof THEME_FILENAME,
  ...ps: string[]
): string => path.join(CONTENT_PATH, root, ...ps)
