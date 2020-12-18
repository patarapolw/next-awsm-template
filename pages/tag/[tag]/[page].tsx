import PostQuery from '~/components/PostQuery'
import { doSearch } from '~/server'
import { IPost, dbPost, initDatabase } from '~/server/db'
import { GetStaticPaths, GetStaticProps } from 'next'

const TagPagePaged = ({
  count,
  result
}: {
  count: number
  result: IPost[]
}) => {
  return (
    <PostQuery
      defaults={{
        posts: result,
        count
      }}
    ></PostQuery>
  )
}

export default TagPagePaged

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: await doSearch({
      page: parseInt(ctx.params.page as string),
      tag: ctx.params.tag as string
    })
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  await initDatabase()
  const tMap = new Map<string, number>()

  dbPost.find().map(({ tag = [] }) => {
    return tag.map((t) => {
      return tMap.set(t, (tMap.get(t) || 0) + 1)
    })
  })

  return {
    paths: Array.from(tMap).flatMap(([t, n]) =>
      Array(Math.ceil(n / 5) - 1)
        .fill(null)
        .map((_, i) => ({
          params: {
            tag: t,
            page: (i + 2).toString()
          }
        }))
    ),
    fallback: false
  }
}
