import PostQuery from '~/components/PostQuery'
import { doSearch } from '~/server'
import { IPost, dbPost, initDatabase } from '~/server/db'
import { GetStaticPaths, GetStaticProps } from 'next'

const BlogPagePaged = ({
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

export default BlogPagePaged

export const getStaticPaths: GetStaticPaths = async () => {
  await initDatabase()

  return {
    paths: Array(
      Math.ceil(
        dbPost.find({
          date: { $lt: new Date().getTime() }
        }).length / 5
      ) - 1
    )
      .fill(null)
      .map((_, i) => ({
        params: {
          page: (i + 2).toString()
        }
      })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: await doSearch({
      page: parseInt(ctx.params.page as string)
    })
  }
}
