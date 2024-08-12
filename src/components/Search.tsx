import { useEffect, useState } from "preact/hooks";
import classnames from './Search.module.css';
import Icon from './Icon.astro';

type Props = {
  path: string;
  placeholder?: string;
}

export default function Search({ path, placeholder }: Props) {
  const [query, setQuery] = useState<string>();
  const [results, setResults] = useState<PagefindSearchFragment[]>([]);
  const [loading, setLoading] = useState(false);

  async function initialize() {
    if (globalThis.pagefind) return;
    globalThis.pagefind = await import(/* @vite-ignore */ path);
    globalThis.pagefind?.init();
  }

  async function onFocus() {
    await initialize();
  }

  useEffect(() => {
    const runSearch = async () => {
      if(!query) return;
      setLoading(true);
      const records = await globalThis.pagefind?.debouncedSearch(query);
      if (records?.results) {
        // Load the first 5 results
        setResults(await Promise.all(records.results.slice(0, 5).map(r => r.data())));
      } else {
        setResults([]);
      }
      setLoading(false);
    }
    runSearch();
  }, [query]);

  return (
    <div className={classnames.search}>
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onFocus={onFocus}
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
      {loading && <p>Searching...</p>}
      <ul>
        {results.map((r) => (
          <li key={r.url}>
            <a href={r.url}>
              <strong>{r.meta.title}: </strong>
              <p dangerouslySetInnerHTML={{__html: r.excerpt}}></p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
