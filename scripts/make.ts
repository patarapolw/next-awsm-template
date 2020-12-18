import fg from 'fast-glob'
import fs from 'fs-extra'
import yaml from 'js-yaml'
import lunr from 'lunr'
import rimraf from 'rimraf'

import { IPost, db, dbPost, initDatabase, zMatter, zPost } from '../server/db'
import { buildPath, dstMediaPath } from '../server/dir'
import { THEME_FILENAME } from '../server/theme'
import { srcPath } from './dir'
import { MakeHtml } from './make-html'

async function main () {
  rimraf.sync(dstMediaPath())
  rimraf.sync(buildPath())

  await fs.copy(srcPath('_media'), dstMediaPath()).catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e)
  })
  await fs.ensureDir(buildPath())

  await fs.writeFile(
    buildPath('theme.json'),
    JSON.stringify(
      yaml.safeLoad(await fs.readFile(srcPath(THEME_FILENAME), 'utf8'))
    )
  )

  const files = await fg('**/*.md', {
    cwd: srcPath('_post')
  })

  const makeHtml = new MakeHtml()
  const rawJson: IPost[] = []

  await initDatabase()

  await Promise.all(
    files.map(async (f) => {
      const header = zMatter.parse(
        yaml.safeLoad(
          fs.readFileSync(srcPath('_post', f), 'utf-8').split(/\n---\n/)[0]
        )
      )

      const { html, text } = await makeHtml.parse(srcPath('_post', f))

      const p: IPost = {
        ...header,
        date: header.date ? header.date.getTime() : undefined,
        createdAt: header.createdAt ? header.createdAt.getTime() : undefined,
        updatedAt: header.updatedAt ? header.updatedAt.getTime() : undefined,
        path: f.replace(/\.mdx?$/, ''),
        excerptHtml: html.split(/<!-- excerpt(?:_separator)? -->/)[0],
        contentHtml: html,
        content: text
      }

      dbPost.insert(zPost.parse(p))
      rawJson.push(p)
    })
  )

  db.save()

  fs.writeFileSync(
    buildPath('idx.json'),
    JSON.stringify(
      lunr(function () {
        this.ref('path')
        this.field('title', { boost: 5 })
        this.field('tag', { boost: 5 })
        this.field('category', { boost: 5 })
        this.field('content')

        rawJson.map((doc) => {
          return this.add(doc)
        })
      })
    )
  )
}

if (require.main === module) {
  main()
}
