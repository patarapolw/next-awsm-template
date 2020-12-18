/* eslint-disable import/no-mutable-exports */

import Loki, { Collection } from 'lokijs'
import lunr from 'lunr'
import * as z from 'zod'

import { buildPath } from './dir'

const _zMatter = {
  priority: z.number().optional(),
  title: z.string(),
  image: z.string().optional(),
  tag: z.array(z.string()).optional(),
  category: z.array(z.string()).optional()
}

export const zMatter = z.object({
  ..._zMatter,
  date: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
})

export type IMatter = z.infer<typeof zMatter>

const zMatterSerialized = z.object({
  ..._zMatter,
  date: z.number().optional(),
  createdAt: z.number().optional(),
  updatedAt: z.number().optional()
})

export type IMatterSerialized = z.infer<typeof zMatterSerialized>

export const zPost = z
  .object({
    path: z.string(),
    content: z.string(),
    excerptHtml: z.string(),
    contentHtml: z.string()
  })
  .merge(zMatterSerialized)

export type IPost = z.infer<typeof zPost>

export interface IPostSearch {
  path: string
  title: string
  tag?: string[]
  category?: string[]
  /**
   * Cleaned and jieba-separated markdown
   */
  content: string
}

export let db: Loki

export let dbPost: Collection<IPost>

let idx: lunr.Index

export async function getLunr () {
  return idx || lunr.Index.load(require('../build/idx.json'))
}

export async function initDatabase () {
  if (db) {
    return
  }

  return new Promise<void>((resolve) => {
    db = new Loki(buildPath('data.loki'), {
      autoload: true,
      autoloadCallback: () => {
        dbPost = db.getCollection('post')

        if (!dbPost) {
          dbPost = db.addCollection('post', {
            unique: ['path'],
            indices: [
              'date',
              'createdAt',
              'updatedAt',
              'priority',
              'tag',
              'category'
            ]
          })
        }

        resolve()
      }
    })
  })
}
