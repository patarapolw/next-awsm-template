import { IPost } from '~/server/db'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import PostTeaser from './PostTeaser'

const PostQuery = ({
  defaults
}: {
  defaults: {
    posts: IPost[]
    count: number
  }
}) => {
  const router = useRouter()

  const page = parseInt(router.query.page as string) || 1
  const makePageUrl = (p: number) => {
    let pathname = router.pathname
      .replace(/\/$/, '')
      .replace(/\d+$/, '')
      .replace(/\/$/, '')
    if (pathname !== '/tag' && pathname !== '/blog') {
      pathname = '/blog'
    }

    if (p > 1) {
      pathname += '/' + p
    }

    if (router.query.q) {
      pathname += `?q=${encodeURIComponent(router.query.q as string)}`
    }

    return pathname
  }

  const [posts, setPosts] = useState([] as IPost[])
  const [count, setCount] = useState(0)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    if (router.query.q) {
      const querystrings: string[] = []
      for (const [k, v] of Object.entries({
        q: router.query.q,
        page: router.query.page,
        tag: router.query.tag
      })) {
        if (v) {
          querystrings.push(`${k}=${encodeURIComponent(v as string)}`)
        }
      }

      fetch(`/api/q${querystrings.length ? `?${querystrings.join('&')}` : ''}`)
        .then((r) => r.json())
        .then(({ result, count }) => {
          setPosts(result)
          setCount(count)
        })
    } else {
      setPosts(defaults.posts)
      setCount(defaults.count)
    }

    setLoading(false)
  }, [router.query.q, router.query.page, router.query.tag])

  const totalPages = Math.ceil(count / 5)

  return (
    <article>
      {isLoading ? null : posts.length ? (
        posts.map((p) => <PostTeaser post={p} key={p.path} />)
      ) : (
        <p>No posts found.</p>
      )}

      {count > 5 ? (
        <nav>
          <ul>
            {page > 1 ? (
              <li>
                <Link href={makePageUrl(1)}>
                  <a aria-label="page 1">1</a>
                </Link>
              </li>
            ) : null}

            {page > 3 ? (
              <li>
                <span> &hellip; </span>
              </li>
            ) : null}

            {page > 2 ? (
              <li>
                <Link href={makePageUrl(page - 1)}>
                  <a aria-label={`page ${page - 1}`}>{page - 1}</a>
                </Link>
              </li>
            ) : null}

            <li>
              <span>{page}</span>
            </li>

            {page < totalPages - 1 ? (
              <li>
                <Link href={makePageUrl(page + 1)}>
                  <a aria-label={`page ${page + 1}`}>{page + 1}</a>
                </Link>
              </li>
            ) : null}

            {page < totalPages - 2 ? (
              <li>
                <span> &hellip; </span>
              </li>
            ) : null}

            {page < totalPages ? (
              <li>
                <Link href={makePageUrl(totalPages)}>
                  <a aria-label={`page ${totalPages}`}>{totalPages}</a>
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </article>
  )
}

export default PostQuery
