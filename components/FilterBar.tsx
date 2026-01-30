'use client'

import { useState } from 'react'
import { CATEGORIES } from '@/data/categories'

interface FilterBarProps {
  selectedCategory: string
  searchQuery: string
  sortBy: 'date-desc' | 'date-asc' | 'title'
  onCategoryChange: (category: string) => void
  onSearchChange: (query: string) => void
  onSortChange: (sort: 'date-desc' | 'date-asc' | 'title') => void
  onClear: () => void
}

const FilterBar = ({
  selectedCategory,
  searchQuery,
  sortBy,
  onCategoryChange,
  onSearchChange,
  onSortChange,
  onClear,
}: FilterBarProps) => {
  const [categoryOpen, setCategoryOpen] = useState(false)
  const hasFilters = selectedCategory !== '' || searchQuery !== ''

  const selectedCategoryLabel = selectedCategory
    ? CATEGORIES.find((c) => c.id === selectedCategory)?.label
    : 'Tümü'

  return (
    <div className="mb-8 space-y-4">
      {/* Search + Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
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

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCategoryOpen(!categoryOpen)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <span>Kategori: {selectedCategoryLabel}</span>
            <svg
              className={`h-4 w-4 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}
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

          {categoryOpen && (
            <div className="absolute top-full left-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
              <button
                onClick={() => {
                  onCategoryChange('')
                  setCategoryOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedCategory === ''
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                Tümü
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onCategoryChange(cat.id)
                    setCategoryOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    selectedCategory === cat.id
                      ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date-desc' | 'date-asc' | 'title')}
          className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="date-desc">En yeni</option>
          <option value="date-asc">En eski</option>
          <option value="title">A-Z</option>
        </select>

        {/* Clear filters */}
        {hasFilters && (
          <button
            onClick={onClear}
            className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
          >
            ✕ Temizle
          </button>
        )}
      </div>
    </div>
  )
}

export default FilterBar
