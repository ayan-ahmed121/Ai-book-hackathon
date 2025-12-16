import React from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

interface ChapterNavigationProps {
  previous?: {
    title: string;
    href: string;
  };
  next?: {
    title: string;
    href: string;
  };
}

export default function ChapterNavigation({
  previous,
  next,
}: ChapterNavigationProps): JSX.Element {
  return (
    <nav className={styles.navigation} aria-label="Chapter navigation">
      <div className={styles.navContainer}>
        {previous ? (
          <Link to={previous.href} className={styles.navLink}>
            <span className={styles.navLabel}>Previous</span>
            <span className={styles.navTitle}>← {previous.title}</span>
          </Link>
        ) : (
          <div className={styles.navPlaceholder} />
        )}

        {next ? (
          <Link to={next.href} className={`${styles.navLink} ${styles.navNext}`}>
            <span className={styles.navLabel}>Next</span>
            <span className={styles.navTitle}>{next.title} →</span>
          </Link>
        ) : (
          <div className={styles.navPlaceholder} />
        )}
      </div>
    </nav>
  );
}
