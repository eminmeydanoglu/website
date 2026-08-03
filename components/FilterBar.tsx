'use client'

import { useState } from 'react'
import { formatTagLabel } from '@/lib/post-tags'

interface FilterTag {
  value: string
  label: string
  count: number
}

interface FilterBarProps {
  availableTags: FilterTag[]
  selectedTags: string[]
  searchQuery: string
  sortBy: 'date-desc' | 'date-asc' | 'title'
  onTagToggle: (tag: string) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: 'date-desc' | 'date-asc' | 'title') => void
  onClear: () => void
}

const FilterBar = ({
  availableTags,
  selectedTags,
  searchQuery,
  sortBy,
  onTagToggle,
  onSearchChange,
  onSortChange,
  onClear,
}: FilterBarProps) => {
  const [tagOpen, setTagOpen] = useState(false)
  const hasFilters = selectedTags.length > 0 || searchQuery !== ''

  const selectedTagLabels = selectedTags
    .map((selectedTag) => availableTags.find((tag) => tag.value === selectedTag)?.label)
    .filter((tag): tag is string => Boolean(tag))
    .map((tag) => formatTagLabel(tag))

  const selectedTagLabel =
    selectedTagLabels.length === 0
      ? 'Tümü'
      : selectedTagLabels.length === 1
        ? selectedTagLabels[0]
        : `${selectedTagLabels[0]} +${selectedTagLabels.length - 1}`

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <input
            type="text"
            placeholder="Yazılarda ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border-ink/40 text-ink focus:border-primary-500 focus:ring-primary-500 dark:border-ink-dark/40 dark:text-ink-dark w-full rounded-none border bg-transparent px-4 py-2.5 pl-10 font-mono text-xs tracking-wide placeholder-gray-500 focus:ring-1 dark:placeholder-gray-400"
          />
          <svg
            className="text-ink/50 dark:text-ink-dark/50 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="relative">
          <button
            onClick={() => setTagOpen(!tagOpen)}
            className="border-ink/40 text-ink hover:bg-ink/5 dark:border-ink-dark/40 dark:text-ink-dark dark:hover:bg-ink-dark/10 flex items-center gap-2 rounded-none border bg-transparent px-4 py-2.5 font-mono text-xs tracking-wide"
          >
            <span>Etiketler: {selectedTagLabel}</span>
            <svg
              className={`h-4 w-4 transition-transform ${tagOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {tagOpen && (
            <div className="border-ink/40 bg-paper dark:border-ink-dark/40 dark:bg-paper-dark absolute top-full left-0 z-10 mt-1 max-h-72 w-64 overflow-y-auto rounded-none border py-1 shadow-lg">
              <button
                onClick={() => {
                  selectedTags.forEach((tag) => onTagToggle(tag))
                  setTagOpen(false)
                }}
                className={`hover:bg-ink/5 dark:hover:bg-ink-dark/10 w-full px-4 py-2 text-left font-mono text-xs tracking-wide ${
                  selectedTags.length === 0
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-ink dark:text-ink-dark'
                }`}
              >
                Tüm etiketler
              </button>
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag.value)
                return (
                  <button
                    key={tag.value}
                    onClick={() => {
                      onTagToggle(tag.value)
                    }}
                    className={`hover:bg-ink/5 dark:hover:bg-ink-dark/10 flex w-full items-center justify-between gap-3 px-4 py-2 text-left font-mono text-xs tracking-wide ${
                      active
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-ink dark:text-ink-dark'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center border text-[10px] ${
                          active
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-ink/40 dark:border-ink-dark/40 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                      <span>{formatTagLabel(tag.label)}</span>
                    </span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{tag.count}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date-desc' | 'date-asc' | 'title')}
          className="border-ink/40 text-ink focus:border-primary-500 focus:ring-primary-500 dark:border-ink-dark/40 dark:bg-paper-dark dark:text-ink-dark rounded-none border bg-transparent px-4 py-2.5 font-mono text-xs tracking-wide focus:ring-1"
        >
          <option value="date-desc">En yeni</option>
          <option value="date-asc">En eski</option>
          <option value="title">A-Z</option>
        </select>

        {hasFilters && (
          <button
            onClick={onClear}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-mono text-xs tracking-wide"
          >
            ✕ Temizle
          </button>
        )}
      </div>

      {selectedTagLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTagLabels.map((label, index) => (
            <button
              key={selectedTags[index]}
              onClick={() => onTagToggle(selectedTags[index])}
              className="border-ink/40 bg-primary-50 text-primary-700 dark:border-ink-dark/40 dark:bg-primary-900/20 dark:text-primary-300 inline-flex items-center border px-3 py-1 font-mono text-xs tracking-wide"
            >
              {label}
              <span className="ml-2 text-[10px]">✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FilterBar
