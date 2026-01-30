import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  wide?: boolean
}

export default function SectionContainer({ children, wide = false }: Props) {
  return (
    <section
      className={`mx-auto px-4 sm:px-6 xl:px-8 ${
        wide ? 'max-w-7xl' : 'max-w-3xl xl:max-w-5xl xl:px-0'
      }`}
    >
      {children}
    </section>
  )
}
