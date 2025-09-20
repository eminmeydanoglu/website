'use client'

import { useLanguage } from '@/lib/LanguageContext'
import { languages, languageNames, Language } from '@/lib/i18n'

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  return (
    <div className="flex items-center space-x-1">
      {languages.map((lang, index) => (
        <div key={lang} className="flex items-center">
          <button
            onClick={() => handleLanguageChange(lang)}
            className={`px-2 py-1 text-sm font-medium transition-colors duration-200 ${
              language === lang
                ? 'text-primary-500 dark:text-primary-400'
                : 'hover:text-primary-500 dark:hover:text-primary-400 text-gray-700 dark:text-gray-300'
            }`}
            aria-label={`Switch to ${languageNames[lang]}`}
          >
            {lang.toUpperCase()}
          </button>
          {index < languages.length - 1 && (
            <span className="text-gray-400 dark:text-gray-600">|</span>
          )}
        </div>
      ))}
    </div>
  )
}

export default LanguageSwitch
