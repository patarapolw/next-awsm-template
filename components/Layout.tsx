import { THEME } from '~/assets/global'
import MagnifyingGlass from '~/assets/svg/magnifying-glass-svgrepo-com.svg'
import styles from '~/styles/Layout.module.css'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'

const Layout = ({ children }: { children: ReactNode | ReactNode[] }) => {
  const router = useRouter()
  const [q, setQ] = useState(router.query.q as string)

  return (
    <main>
      <header className={styles.Header}>
        <h1>{THEME.title}</h1>

        <nav className={styles.Nav}>
          <ul>
            <li>
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>

            {(THEME.nav || []).map((n) => (
              <li key={n.name}>
                {n.to ? (
                  <Link href={n.to}>
                    <a>{n.name}</a>
                  </Link>
                ) : (
                  <a href={n.href} target="_blank" rel="noopener noreferrer">
                    {n.name}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <form
            className={styles.Form}
            onSubmit={(ev) => {
              if (router.pathname.startsWith('/post/')) {
                ev.preventDefault()
                router.push(`/blog?q=${encodeURIComponent(q)}`)
              }
            }}
          >
            <input
              name="q"
              type="search"
              placeholder="Search..."
              value={q}
              onInput={(ev) => setQ((ev.target as HTMLInputElement).value)}
            />
            <div className={styles.icon}>
              <MagnifyingGlass />
            </div>
          </form>
        </nav>
      </header>

      {children}
    </main>
  )
}

export default Layout
