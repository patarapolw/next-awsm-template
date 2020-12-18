import { dbPost, getLunr, initDatabase } from './db'

export async function doSearch ({
  q,
  tag,
  page = 1
}: {
  q?: string
  tag?: string
  page?: number
}) {
  await initDatabase()
  const idx = await getLunr()

  const perPage = 5
  const offset = (page - 1) * perPage

  let cond = dbPost.chain().find({
    date: { $exists: true } as any
  })

  if (q) {
    cond = cond.find({
      path: { $in: idx.search(q).map(({ ref }) => ref) }
    })
  }

  if (tag) {
    cond = cond.find({
      tag: { $contains: tag }
    })
  }

  cond = cond.simplesort('date', { desc: true })

  const count = cond.branch().count()
  const result = cond.offset(offset).limit(perPage).data()

  return {
    count,
    result
  }
}
