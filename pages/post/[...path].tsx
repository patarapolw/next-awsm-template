import '~/assets/remark42'

import { THEME } from '~/assets/global'
import TitleDescription from '~/components/TitleDesciption'
import { IPost, dbPost, initDatabase } from '~/server/db'
import styles from '~/styles/PostPage.module.css'
import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { createRef, useEffect } from 'react'

const PostPage = (post: IPost) => {
  const remark42Ref = createRef<HTMLDivElement>()

  useEffect(() => {
    if (remark42Ref.current) {
      if (window.remark42Instance) {
        window.remark42Instance.destroy()
      }

      const initRemark42 = () => {
        window.remark42Instance = window.REMARK42.createInstance({
          node: remark42Ref.current,
          host: THEME.comment.remark42.host,
          site_id: THEME.comment.remark42.siteId
        })
      }

      if (window.REMARK42) {
        initRemark42()
      } else {
        window.addEventListener('REMARK42::ready', () => {
          initRemark42()
        })
      }
    }
  }, [remark42Ref.current])

  return (
    <section>
      <Head>
        <title>
          {post.title} - {THEME.title}
        </title>
        <meta property="og:title" content={post.title} />
        <meta property="twitter:title" content={post.title} />

        <meta name="description" content={post.content.substr(0, 140)} />
        <meta property="og:description" content={post.content.substr(0, 140)} />
        <meta property="twitter:title" content={post.content.substr(0, 140)} />

        {post.tag ? (
          <meta name="keywords" content={post.tag.join(',')} />
        ) : null}

        {post.image ? (
          <>
            <meta property="og:image" content={post.image} />
            <meta property="twitter:title" content={post.image} />
          </>
        ) : null}
      </Head>
      <section>
        <h2>{post.title}</h2>

        <TitleDescription date={post.date} />
      </section>

      <section dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {post.tag ? (
        <section className={styles['tags-container']}>
          <span>Tags:</span>
          {post.tag.map((t) => (
            <span key={t}>
              <Link href={`/tag/${t}`}>
                <a>{t}</a>
              </Link>
            </span>
          ))}
        </section>
      ) : null}

      {THEME.comment?.remark42 ? (
        <footer>
          <div ref={remark42Ref}></div>
        </footer>
      ) : null}
    </section>
  )
}

export default PostPage

export const getStaticPaths: GetStaticPaths = async () => {
  await initDatabase()

  return {
    paths: dbPost.find().map(({ path }) => ({
      params: { path: path.split(/\//g).map(encodeURIComponent) }
    })),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  await initDatabase()

  return {
    props: dbPost.findOne({
      path: (ctx.params.path as string[]).join('/')
    })
  }
}
