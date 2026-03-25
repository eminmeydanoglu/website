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
            className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400"
          />
          <svg
            className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-gray-400"
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
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
            <div className="absolute top-full left-0 z-10 mt-1 max-h-72 w-64 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => {
                  selectedTags.forEach((tag) => onTagToggle(tag))
                  setTagOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedTags.length === 0
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
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
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      active
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
                          active
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-gray-300 text-transparent dark:border-gray-600'
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
          className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="date-desc">En yeni</option>
          <option value="date-asc">En eski</option>
          <option value="title">A-Z</option>
        </select>

        {hasFilters && (
          <button
            onClick={onClear}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
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
              className="bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
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
