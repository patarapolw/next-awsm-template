import { IPost } from '~/server/db'
import Link from 'next/link'

import TitleDescription from './TitleDesciption'

const PostTeaser = ({ post }: { post: IPost }) => {
  return (
    <section>
      <h2>
        <Link href={`/post/${post.path}`}>
          <a>{post.title}</a>
        </Link>
      </h2>

      <TitleDescription date={post.date} />
      <article dangerouslySetInnerHTML={{ __html: post.excerptHtml }}></article>
    </section>
  )
}

export default PostTeaser
