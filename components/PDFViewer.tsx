'use client'

import { useState, useEffect } from 'react'

interface PDFViewerProps {
  pdfUrl: string
  className?: string
}

export default function PDFViewer({ pdfUrl, className = '' }: PDFViewerProps) {
  const [isSupported, setIsSupported] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Check if browser supports PDF viewing
    const supportsInlineViewing = () => {
      // Most modern browsers support iframe PDF viewing
      return true
    }

    setIsSupported(supportsInlineViewing())
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="border-primary-600 h-8 w-8 animate-spin rounded-full border-b-2"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading PDF...</span>
      </div>
    )
  }

  if (!isSupported) {
    return (
      <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Your browser does not support inline PDF viewing. Please download the PDF to view it.
          </p>
          <a
            href={pdfUrl}
            className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-500 dark:hover:bg-primary-600 inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none"
            download
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download PDF
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-800">
        <object data={pdfUrl} type="application/pdf" className="h-[800px] w-full" title="CV PDF">
          <iframe src={pdfUrl} className="h-[800px] w-full border-0" title="CV PDF (fallback)">
            <p className="p-8 text-center text-gray-600 dark:text-gray-400">
              Your browser does not support PDF viewing. Please{' '}
              <a
                href={pdfUrl}
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline"
                download
              >
                download the PDF
              </a>{' '}
              to view it.
            </p>
          </iframe>
        </object>
      </div>

      <div className="mt-4">
        <a
          href={pdfUrl}
          className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
          download
        >
          <svg
            className="mr-2 h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download PDF
        </a>
      </div>
    </div>
  )
}
