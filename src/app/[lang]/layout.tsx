import { Lang } from '@/lib/types'
import { getDictionary } from '@/lib/i18n'

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }]
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  const dict = getDictionary(lang as Lang)
  return {
    title: dict.meta.title,
    description: dict.meta.description,
  }
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  return (
    <div data-lang={lang}>
      {children}
    </div>
  )
}
