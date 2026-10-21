import {
  groupWebSources,
  type WebSource,
  type WebStatus,
  webStageLabel,
} from "@/lib/web/sources";
import styles from "./WebSources.module.css";

export function WebProgress({ status }: { status: WebStatus }) {
  return (
    <div className={styles.progress} role="status" aria-live="polite">
      <span className={styles.pulse} aria-hidden="true" />
      {webStageLabel(status.stage)}
    </div>
  );
}
export default function WebSources({ sources }: { sources: WebSource[] }) {
  if (!sources.length) return null;
  const groups = groupWebSources(sources);
  return (
    <section className={styles.section} aria-label="Web sources">
      <div className={styles.heading}>
        <span>
          Web sources <span className={styles.count}>{groups.length}</span>
        </span>
      </div>
      <details className={styles.help}>
        <summary aria-label="Information about web sources">
          ⓘ About website reading
        </summary>
        <div className={styles.explanation}>
          Paste a public link into your message and tell GPTiti what to read.
          When browser access is available, it can read rendered pages and
          follow supported links within the provided site. It does not sign in,
          make purchases or submit arbitrary forms.
          <br />
          <br />
          Sources below are pages observed during this response, not every page
          on the site. Repeat visits are grouped. “Partially read” means some
          content was omitted or unavailable; it does not mean the whole page
          was reviewed. Login walls, blocked resources and reading limits can
          restrict access. Model calls during browsing contribute to the
          request’s TITI usage.
        </div>
      </details>
      <ul className={styles.list}>
        {groups.map(({ source, visits, partial, ready }) => {
          const url = source.url ?? source.requestedUrl;
          const domain = new URL(url).hostname;
          return (
            <li key={url} className={styles.card}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                <span className={styles.globe} aria-hidden="true">
                  ↗
                </span>
                <span className={styles.text}>
                  <strong>{source.title?.trim() || domain}</strong>
                  <span className={styles.domain}>{domain}</span>
                </span>
              </a>
              <div className={styles.meta}>
                <span
                  className={!ready || partial ? styles.warning : styles.read}
                >
                  {!ready
                    ? "Could not read"
                    : partial
                      ? "Partially read"
                      : "Page text read"}
                </span>
                {visits > 1 && <span>{visits} observations</span>}
              </div>
              {!ready && (
                <p className={styles.failure}>
                  The response may not include this page. You can open the link
                  directly.
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
