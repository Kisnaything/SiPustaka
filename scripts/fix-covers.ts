import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const books = [
  { id: 'e9a9e5f8-cf2a-4783-9540-f1d918c9948e', isbn: '9780593638859' },
  { id: '781760eb-2d29-4ae1-90ce-23d6fc7a17c6', isbn: '9780008514181' },
  { id: '205bec52-b0e9-445b-8a24-5a4b00da9c49', isbn: '9780804139298' },
  { id: 'cd64e740-b061-4411-a2d2-db6497999776', isbn: '9780374533557' },
]

async function main() {
  for (const b of books) {
    try {
      const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${b.isbn}&format=json&jscmd=data`
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
      const data: any = await res.json()
      const info = data[`ISBN:${b.isbn}`]

      if (info?.cover?.large) {
        await adminClient.from('buku').update({ cover: info.cover.large }).eq('id', b.id)
        console.log(`OK ${b.isbn} -> large: ${info.cover.large}`)
      } else if (info?.cover?.medium) {
        await adminClient.from('buku').update({ cover: info.cover.medium }).eq('id', b.id)
        console.log(`OK ${b.isbn} -> medium: ${info.cover.medium}`)
      } else if (info?.cover?.small) {
        await adminClient.from('buku').update({ cover: info.cover.small }).eq('id', b.id)
        console.log(`OK ${b.isbn} -> small: ${info.cover.small}`)
      } else {
        console.log(`NO COVER for ${b.isbn} — trying direct...`)
        const direct = `https://covers.openlibrary.org/b/isbn/${b.isbn}-L.jpg`
        console.log(`  Trying: ${direct}`)
        const h = await fetch(direct, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
        if (h.ok) {
          await adminClient.from('buku').update({ cover: direct }).eq('id', b.id)
          console.log(`OK ${b.isbn} -> direct L`)
        } else {
          const med = `https://covers.openlibrary.org/b/isbn/${b.isbn}-M.jpg`
          const h2 = await fetch(med, { method: 'HEAD', signal: AbortSignal.timeout(5000) })
          if (h2.ok) {
            await adminClient.from('buku').update({ cover: med }).eq('id', b.id)
            console.log(`OK ${b.isbn} -> direct M`)
          } else {
            console.log(`FAIL ${b.isbn} — no cover found`)
          }
        }
      }
    } catch (e: any) {
      console.log(`ERROR ${b.isbn} -> ${e.message}`)
    }
  }
  process.exit(0)
}

main()
