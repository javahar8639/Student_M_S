import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchApi } from '../api/search.js';
import { SearchIcon } from './icons.jsx';

export default function GlobalSearch() {
  const [term, setTerm] = useState('');
  const [results, setResults] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!term.trim()) {
      setResults(null);
      return;
    }
    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const data = await searchApi.query(term.trim());
        setResults(data);
      } catch {
        setResults({ courses: [], lessons: [], assignments: [] });
      } finally {
        setIsLoading(false);
      }
    }, 250);
    return () => clearTimeout(timeout);
  }, [term]);

  const hasResults = results && (results.courses.length || results.lessons.length || results.assignments.length);

  function goTo(path) {
    setIsOpen(false);
    setTerm('');
    setResults(null);
    navigate(path);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search courses, lessons, assignments…"
          aria-label="Global search"
          className="input pl-10"
        />
      </div>

      {isOpen && term.trim() && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-96 overflow-y-auto rounded-lg border border-border-soft bg-surface shadow-modal animate-fadeSlideUp">
          {isLoading && <div className="p-4 text-sm text-ink-soft">Searching…</div>}

          {!isLoading && !hasResults && (
            <div className="p-4 text-sm text-ink-soft">
              No results found.
              <br />
              Try searching for a course, lesson, or assignment.
            </div>
          )}

          {!isLoading && hasResults && (
            <div className="divide-y divide-border-soft">
              <ResultGroup label="Courses">
                {results.courses.map((c) => (
                  <ResultItem key={`c-${c.id}`} title={c.title} subtitle={c.instructor} onClick={() => goTo(`/courses/${c.id}`)} />
                ))}
              </ResultGroup>
              <ResultGroup label="Lessons">
                {results.lessons.map((l) => (
                  <ResultItem key={`l-${l.id}`} title={l.title} subtitle={l.courseTitle} onClick={() => goTo(`/courses/${l.courseId}`)} />
                ))}
              </ResultGroup>
              <ResultGroup label="Assignments">
                {results.assignments.map((a) => (
                  <ResultItem key={`a-${a.id}`} title={a.title} subtitle={a.courseTitle} onClick={() => goTo('/assignments')} />
                ))}
              </ResultGroup>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, children }) {
  if (!children || children.length === 0) return null;
  return (
    <div className="p-2">
      <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">{label}</p>
      {children}
    </div>
  );
}

function ResultItem({ title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full flex-col items-start rounded-DEFAULT px-2 py-2 text-left transition-colors hover:bg-black/[0.03]"
    >
      <span className="text-sm font-medium text-ink">{title}</span>
      {subtitle && <span className="text-xs text-ink-soft">{subtitle}</span>}
    </button>
  );
}
