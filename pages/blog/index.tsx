import PostQuery from '~/components/PostQuery'
import { doSearch } from '~/server'
import { IPost } from '~/server/db'
import { GetStaticProps } from 'next'

const BlogPage = ({ count, result }: { count: number; result: IPost[] }) => {
  return (
    <PostQuery
      defaults={{
        posts: result,
        count
      }}
    ></PostQuery>
  )
}

export default BlogPage

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: await doSearch({})
  }
}
