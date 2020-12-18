import PostQuery from '~/components/PostQuery'
import { doSearch } from '~/server'
import { IPost, dbPost, initDatabase } from '~/server/db'
import { GetStaticPaths, GetStaticProps } from 'next'

const TagPage = ({ count, result }: { count: number; result: IPost[] }) => {
  return (
    <PostQuery
      defaults={{
        posts: result,
        count
      }}
    ></PostQuery>
  )
}

export default TagPage

export const getStaticPaths: GetStaticPaths = async () => {
  await initDatabase()
  const tMap = new Map<string, number>()

  dbPost.find().map(({ tag = [] }) => {
    return tag.map((t) => {
      return tMap.set(t, (tMap.get(t) || 0) + 1)
    })
  })

  return {
    paths: Array.from(tMap).map(([t]) => ({
      params: {
        tag: t
      }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: await doSearch({
      tag: ctx.params.tag as string
    })
  }
}
