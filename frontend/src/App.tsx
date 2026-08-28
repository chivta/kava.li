import { strings } from './strings'

// The single page: heading, gif, contact address.
export default function App() {
  return (
    <main style={styles.main}>
      <h1 style={styles.heading}>{strings.heading}</h1>
      <img src="/under-construction.gif" alt={strings.gifAlt} style={styles.gif} />
      <footer style={styles.footer}>
        {strings.contactLabel}:{' '}
        <a href={`mailto:${strings.contactEmail}`} style={styles.link}>
          {strings.contactEmail}
        </a>
      </footer>
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '1.5rem',
    padding: '2rem',
    boxSizing: 'border-box',
    fontFamily: 'system-ui, sans-serif',
    textAlign: 'center',
  },
  heading: {
    margin: 0,
    fontSize: 'clamp(1.5rem, 5vw, 3rem)',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
  gif: {
    // Bounded on both axes so the page never needs to scroll.
    maxWidth: 'min(100%, 480px)',
    maxHeight: '60dvh',
    height: 'auto',
    objectFit: 'contain',
  },
  footer: {
    fontSize: '0.9rem',
    opacity: 0.7,
  },
  link: {
    color: 'inherit',
  },
}
