"use client";

import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { InsightCard } from "@/components/insights/InsightCard";
import type { InsightSummary } from "@/models/insight";
import type { PageResult } from "@/models/query";
import { useInsightListViewModel } from "@/viewmodels/useInsightListViewModel";

interface InsightListProps {
  initialResult: PageResult<InsightSummary>;
  initialSearch: string;
}

export function InsightList({ initialResult, initialSearch }: InsightListProps) {
  const vm = useInsightListViewModel(initialResult, initialSearch);
  const { items, total, page, totalPages } = vm.result;

  return (
    <div id="insight-list">
      <div className="filter-bar">
        <label className="search-field">
          <span className="visually-hidden">Search insights</span>
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            value={vm.search}
            placeholder="Search insights"
            onChange={(event) => vm.onSearchChange(event.target.value)}
          />
        </label>
        <p className="list-status" aria-live="polite">
          {vm.error || (vm.loading ? "Loading…" : `${total} article${total === 1 ? "" : "s"}`)}
        </p>
      </div>

      {items.length ? (
        <div className={`insight-grid${vm.loading ? " is-loading" : ""}`}>
          {items.map((insight) => (
            <InsightCard key={insight.slug} insight={insight} showExcerpt headingLevel="h2" />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No insights match “{vm.search}”.</p>
          <button type="button" className="text-link" onClick={() => vm.onSearchChange("")}>
            Clear search
          </button>
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="pagination" aria-label="Insights pages">
          <button
            type="button"
            className="pagination__button"
            onClick={() => vm.goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              className="pagination__button"
              aria-current={number === page ? "page" : undefined}
              onClick={() => vm.goToPage(number)}
            >
              {number}
            </button>
          ))}
          <button
            type="button"
            className="pagination__button"
            onClick={() => vm.goToPage(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </nav>
      ) : null}
    </div>
  );
}
