import { genPageMetadata } from 'app/seo'

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
        <div className="-m-4 flex flex-wrap">
          <iframe src="/static/cv.pdf" width="100%" height="800px" title="CV" />
        </div>
      </div>
    </div>
  )
}
