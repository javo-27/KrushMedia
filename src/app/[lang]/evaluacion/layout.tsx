import { Lang } from '@/lib/types'
import { AssessmentProvider } from '@/lib/context/AssessmentContext'
import { Header } from '@/components/layout/Header'

export default async function EvaluacionLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params

  return (
    <AssessmentProvider lang={lang as Lang}>
      <Header lang={lang as Lang} />
      <main className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </main>
    </AssessmentProvider>
  )
}
