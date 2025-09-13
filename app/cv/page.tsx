import { genPageMetadata } from 'app/seo'
import PDFViewer from '@/components/PDFViewer'

export const metadata = genPageMetadata({ title: 'CV' })

export default function CV() {
  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      <div className="space-y-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14 dark:text-gray-100">
          CV
        </h1>
      </div>
      <div className="container py-12">
        <div className="flex justify-center">
          <PDFViewer pdfUrl="/static/cv.pdf" className="w-full max-w-4xl" />
        </div>
      </div>
    </div>
  )
}
