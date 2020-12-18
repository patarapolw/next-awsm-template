import fs from 'fs'

import yaml from 'js-yaml'
import * as z from 'zod'

import { buildPath } from './dir'

export const THEME_FILENAME = 'theme.yml'

export const zTheme = z
  .object({
    title: z.string(),
    awsm: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    nav: z
      .array(
        z
          .object({
            name: z.string(),
            to: z.string(),
            href: z.undefined()
          })
          .or(
            z.object({
              name: z.string(),
              href: z.string(),
              to: z.undefined()
            })
          )
      )
      .optional(),
    author: z
      .object({
        url: z.string().optional(),
        email: z.string().optional(),
        name: z.string()
      })
      .nonstrict(),
    analytics: z
      .object({
        plausible: z.string().optional()
      })
      .optional(),
    comment: z
      .object({
        remark42: z
          .object({
            host: z.string(),
            siteId: z.string()
          })
          .optional()
      })
      .optional()
  })
  .nonstrict()

export type ITheme = z.infer<typeof zTheme>

export function getTheme () {
  return zTheme.parse(
    yaml.safeLoad(fs.readFileSync(buildPath(THEME_FILENAME), 'utf-8'))
  )
}
