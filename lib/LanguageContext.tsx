'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Language, defaultLanguage, getTranslation, TranslationKey } from './i18n'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage)

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'tr' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // Translation function
  const t = (key: TranslationKey) => getTranslation(key, language)

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// Hook for components that only need translations
export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}
