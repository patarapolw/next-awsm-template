import { THEME } from '~/assets/global'
import styles from '~/styles/TitleDescription.module.css'

const TitleDescription = ({ date }: { date?: number }) => {
  return (
    <small className={styles.Small}>
      <span>
        by&nbsp;
        {THEME.author.url ? (
          <a href={THEME.author.url} target="_blank" rel="noopener noreferrer">
            {THEME.author.name}
          </a>
        ) : (
          <span>{THEME.author.name}</span>
        )}
      </span>

      {date ? (
        <span className={styles.date}>
          {new Date(date).toLocaleDateString([], {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
          })}
        </span>
      ) : null}
    </small>
  )
}

export default TitleDescription
