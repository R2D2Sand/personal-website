import 'server-only'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import type { VeyraResponse } from './veyra-types'
import { publicSnapshot } from './veyra-public'

export async function getVeyraData(): Promise<VeyraResponse> {
  try {
    if (process.env.VEYRA_DATA_URL) {
      const url = new URL(process.env.VEYRA_DATA_URL)
      if (url.protocol !== 'https:' || !process.env.VEYRA_DATA_TOKEN) throw new Error('Missing secure data connection')
      const response = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(5000), headers: { Authorization: `Bearer ${process.env.VEYRA_DATA_TOKEN}` } })
      if (!response.ok) throw new Error('Data source unavailable')
      return { snapshot: publicSnapshot(await response.json()), connection: 'remote' }
    }
    const json = await readFile(path.join(process.cwd(), 'data', 'veyra', 'dashboard.json'), 'utf8')
    return { snapshot: publicSnapshot(JSON.parse(json.replace(/^\uFEFF/, ''))), connection: 'snapshot' }
  } catch {
    return { snapshot: null, connection: 'unavailable' }
  }
}
