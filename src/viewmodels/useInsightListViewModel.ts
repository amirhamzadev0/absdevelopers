"use client";

import { useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import type { InsightSummary } from "@/models/insight";
import type { PageResult } from "@/models/query";
import { apiRequest } from "@/utils/http-client";

/** Search (debounced) + pagination over /api/getInsightList, mirrored into the URL. */
export function useInsightListViewModel(
  initialResult: PageResult<InsightSummary>,
  initialSearch: string,
) {
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialResult.page);
  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 300);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    setError("");
    apiRequest<PageResult<InsightSummary>>("getInsightList", {
      query: { search: debouncedSearch, page, pageSize: initialResult.pageSize },
      signal: controller.signal,
    })
      .then((next) => {
        setResult(next);
        const params = new URLSearchParams();
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (next.page > 1) params.set("page", String(next.page));
        const query = params.toString();
        window.history.replaceState(
          null,
          "",
          `${window.location.pathname}${query ? `?${query}` : ""}`,
        );
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted)
          setError(reason instanceof Error ? reason.message : "Failed to load.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [debouncedSearch, page, initialResult.pageSize]);

  return {
    search,
    result,
    loading,
    error,
    onSearchChange: (value: string) => {
      setSearch(value);
      setPage(1);
    },
    goToPage: (next: number) => {
      setPage(Math.min(Math.max(1, next), result.totalPages));
      document.getElementById("insight-list")?.scrollIntoView({ block: "start" });
    },
  };
}
