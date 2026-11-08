import { getVeyraData } from '@/lib/veyra-data'
export const dynamic = 'force-dynamic'
export async function GET() {
  return Response.json(await getVeyraData(), { headers: {
    'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
  } })
}
