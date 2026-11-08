import type { Metadata } from 'next'
import { getVeyraData } from '@/lib/veyra-data'
import Dashboard from './dashboard'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Veyra | AIBitsAndBots', robots: { index: false, follow: false } }
export default async function VeyraPage() {
  return <Dashboard initial={await getVeyraData()} />
}
