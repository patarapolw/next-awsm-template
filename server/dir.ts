import path from 'path'

export const buildPath = (...ps: string[]): string =>
  path.resolve(process.cwd(), 'build', ...ps)

export const dstMediaPath = (...ps: string[]): string =>
  path.resolve(process.cwd(), 'public/media', ...ps)
