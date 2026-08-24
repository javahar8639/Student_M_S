import { useCallback, useEffect, useRef, useState } from 'react';

// Runs an async fetcher on mount / whenever deps change, exposing
// { data, isLoading, error, refetch } — the standard shape used across pages.
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (id === requestId.current) setData(result);
    } catch (err) {
      if (id === requestId.current) setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      if (id === requestId.current) setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refetch: load, setData };
}
