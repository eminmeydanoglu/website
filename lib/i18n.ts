// Simple i18n system for the website
export type Language = 'tr' | 'en'

export const defaultLanguage: Language = 'en'

export const languages: Language[] = ['tr', 'en']

export const languageNames = {
  tr: 'Türkçe',
  en: 'English',
}

// Translation keys and their values
export type TranslationKey = keyof typeof translations.tr

export const translations = {
  tr: {
    // Navigation
    'nav.home': 'Ana Sayfa',
    'nav.writings': 'yazılar',
    'nav.projects': 'projeler',
    'nav.cv': 'özgeçmiş',
    'nav.check-my-mind': 'zihnime göz at',

    // Site metadata
    'site.title': 'Emin Meydanoğlu',
    'site.description': 'Bir başka web sitesi',
    'site.author': 'Emin Meydanoğlu',

    // Author profile
    'author.greeting': 'Merhaba!',
    'author.intro':
      "Ben **Emin Meydanoğlu**, İstanbul Teknik Üniversitesi'nde **Matematik Mühendisliği (Uygulamalı Matematik)** okuyan bir öğrenciyim. **Yapay zeka** konusundaki en derin tutkumun yanı sıra, **fizik, felsefe ve iyi ve bilgece bir yaşam sürme yolu** konularıyla da büyülenirim.",
    'author.site-description':
      'Bu site, çalışmalarımı, düşüncelerimi ve devam eden projelerimi sizinle paylaştığım yer. Web sitesinde yazıları ve mühendislik proje günlüklerini bulabilirsiniz.',
    'author.also': 'Ayrıca,',
    'author.brain-description':
      '**Beynimin** önemli bir kısmını yayınlıyorum (çok kişisel olmayan her şey):',
    'author.youtube-description':
      'Çoğunlukla felsefeye adanmış bir YouTube kanalım var (neredeyse tüm videolar Türkçe):',

    // Common UI elements
    'ui.read-more': 'tamamını oku',
    'ui.back': 'Geri',
    'ui.next': 'İleri',
    'ui.previous': 'Önceki',
    'ui.tags': 'Etiketler',
    'ui.all-posts': 'Tüm yazılar',
    'ui.no-posts': 'Yazı bulunamadı.',
    'ui.search': 'Ara',
    'ui.search-placeholder': 'Yazı ara...',

    // Pages
    'page.blog': 'Yazılar',
    'page.projects': 'Projeler',
    'page.cv': 'Özgeçmiş',
    'page.tags': 'Etiketler',

    // Footer
    'footer.built-with': 'ile yapılmıştır',
    'footer.and': 've',

    // Dates
    'date.published-on': 'Yayınlama tarihi',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.writings': 'writings',
    'nav.projects': 'projects',
    'nav.cv': 'cv',
    'nav.check-my-mind': 'check my mind',

    // Site metadata
    'site.title': 'Emin Meydanoğlu',
    'site.description': 'Another website',
    'site.author': 'Emin Meydanoğlu',

    // Author profile
    'author.greeting': 'Hello!',
    'author.intro':
      "I'm **Emin Meydanoğlu**, an undergraduate at Istanbul Technical University, studying **Mathematical Engineering (Applied Mathematics)**. Apart from my deepest passion for **artificial intelligence**, I am also fascinated by **physics, philosophy, and the path toward living a good and wise life**.",
    'author.site-description':
      'This site is where I share my work, thoughts, and ongoing projects with you. You can find writings and engineering project diaries right here on the website.',
    'author.also': 'Also,',
    'author.brain-description':
      "I publish a significant portion of my **brain** (everything that isn't too personal):",
    'author.youtube-description':
      'I have a YouTube channel, mostly dedicated to philosophy (almost all videos in Turkish):',

    // Common UI elements
    'ui.read-more': 'Read all',
    'ui.back': 'Back',
    'ui.next': 'Next',
    'ui.previous': 'Previous',
    'ui.tags': 'Tags',
    'ui.all-posts': 'All posts',
    'ui.no-posts': 'No posts found.',
    'ui.search': 'Search',
    'ui.search-placeholder': 'Search articles...',

    // Pages
    'page.blog': 'Blog',
    'page.projects': 'Projects',
    'page.cv': 'CV',
    'page.tags': 'Tags',

    // Footer
    'footer.built-with': 'Built with',
    'footer.and': 'and',

    // Dates
    'date.published-on': 'Published on',
  },
}

// Helper function to get translation
export function getTranslation(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations[defaultLanguage][key] || key
}
