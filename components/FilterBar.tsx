'use client'

import { useState, useCallback } from 'react'
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
  const hasFilters = selectedCategory !== '' || searchQuery !== ''

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <div className="relative">
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

      {/* Category pills + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            Tümü
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as 'date-desc' | 'date-asc' | 'title')}
          className="focus:border-primary-500 focus:ring-primary-500 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:ring-1 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
        >
          <option value="date-desc">En yeni</option>
          <option value="date-asc">En eski</option>
          <option value="title">A-Z</option>
        </select>
      </div>

      {/* Clear filters */}
      {hasFilters && (
        <button
          onClick={onClear}
          className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 text-sm"
        >
          ✕ Filtreleri temizle
        </button>
      )}
    </div>
  )
}

export default FilterBar
