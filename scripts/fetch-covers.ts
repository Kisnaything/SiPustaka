import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const isbnList = [
  { isbn: '9786020633176', judul: 'Atomic Habits' },
  { isbn: '9780857197689', judul: 'The Psychology of Money' },
  { isbn: '9781949759228', judul: 'The Mountain Is You' },
  { isbn: '9780143130727', judul: 'Ikigai' },
  { isbn: '9780062457714', judul: 'The Subtle Art of Not Giving a F*ck' },
  { isbn: '9781534467637', judul: 'Better Than the Movies' },
  { isbn: '9780593334836', judul: 'Book Lovers' },
  { isbn: '9780593441275', judul: 'Happy Place' },
  { isbn: '9780593438534', judul: 'Every Summer After' },
  { isbn: '9780593638859', judul: 'Love, Theoretically' },
  { isbn: '9781649374042', judul: 'Fourth Wing' },
  { isbn: '9781649374172', judul: 'Iron Flame' },
  { isbn: '9781635575569', judul: 'A Court of Thorns and Roses' },
  { isbn: '9781619630345', judul: 'Throne of Glass' },
  { isbn: '9780063021426', judul: 'Babel' },
  { isbn: '9781803144382', judul: 'The Housemaid' },
  { isbn: '9781982179007', judul: 'None of This Is True' },
  { isbn: '9781250301697', judul: 'The Silent Patient' },
  { isbn: '9780593356159', judul: 'The Maid' },
  { isbn: '9780008514181', judul: 'The Paris Apartment' },
  { isbn: '9781368052405', judul: 'The Inheritance Games' },
  { isbn: '9781524714680', judul: 'One of Us Is Lying' },
  { isbn: '9780385741262', judul: 'We Were Liars' },
  { isbn: '9781250857439', judul: 'Divine Rivals' },
  { isbn: '9781402277825', judul: 'If He Had Been with Me' },
  { isbn: '9781612681139', judul: 'Rich Dad Poor Dad' },
  { isbn: '9780060555665', judul: 'The Intelligent Investor' },
  { isbn: '9780307887894', judul: 'The Lean Startup' },
  { isbn: '9780804139298', judul: 'Zero to One' },
  { isbn: '9780857197689-2', judul: 'Psychology of Money' },
  { isbn: '9780593716717', judul: 'Co-Intelligence' },
  { isbn: '9781098166304', judul: 'AI Engineering' },
  { isbn: '9781101946596', judul: 'Life 3.0' },
  { isbn: '9780393635829', judul: 'The Alignment Problem' },
  { isbn: '9780525558613', judul: 'Human Compatible' },
  { isbn: '9780374533557', judul: 'Thinking, Fast and Slow' },
  { isbn: '9781250179944', judul: 'Surrounded by Idiots' },
  { isbn: '9780143127741', judul: 'The Body Keeps the Score' },
  { isbn: '9780553383713', judul: 'Emotional Intelligence' },
  { isbn: '9781585429134', judul: 'Attached' },
  { isbn: '9781455586691', judul: 'Deep Work' },
  { isbn: '9780804137386', judul: 'Essentialism' },
  { isbn: '9780143126560', judul: 'Getting Things Done' },
  { isbn: '9781626569416', judul: 'Eat That Frog!' },
  { isbn: '9780525572428', judul: 'Make Time' },
  { isbn: '9780441172719', judul: 'Dune' },
  { isbn: '9780593135204', judul: 'Project Hail Mary' },
  { isbn: '9780765377067', judul: 'The Three-Body Problem' },
  { isbn: '9781101904220', judul: 'Dark Matter' },
  { isbn: '9780307887443', judul: 'Ready Player One' },
]

async function getCoverUrl(isbn: string): Promise<string | null> {
  const cleanIsbn = isbn.replace(/-.*$/, '')
  const lookupIsbn = cleanIsbn
  try {
    const apiUrl = `https://openlibrary.org/api/books?bibkeys=ISBN:${lookupIsbn}&format=json&jscmd=data`
    const res = await fetch(apiUrl, { signal: AbortSignal.timeout(8000) })
    const data = await res.json()
    const bookData = data[`ISBN:${lookupIsbn}`]
    if (bookData?.cover?.large) {
      return bookData.cover.large
    }
    if (bookData?.cover?.medium) {
      return bookData.cover.medium
    }
    if (bookData?.cover?.small) {
      return bookData.cover.small
    }
  } catch {
    return null
  }

  return null
}

async function fetchCovers() {
  let success = 0
  let failed = 0
  let skipped = 0

  for (const { isbn, judul } of isbnList) {
    let searchIsbn = isbn

    const { data: books, error: fetchError } = await adminClient
      .from('buku')
      .select('id, judul, cover')
      .or(`isbn.eq.${searchIsbn},judul.ilike.%${judul.slice(0, 20)}%`)

    if (fetchError || !books || books.length === 0) {
      console.log(`  [SKIP] ${judul} — tidak ditemukan di database`)
      skipped++
      continue
    }

    const book = books[0]

    if (book.cover) {
      console.log(`  [SKIP] ${judul} — sudah punya cover`)
      skipped++
      continue
    }

    const coverUrl = await getCoverUrl(searchIsbn)

    if (!coverUrl) {
      console.log(`  [FAIL] ${judul} — cover tidak ditemukan`)
      failed++
      continue
    }

    const { error: updateError } = await adminClient
      .from('buku')
      .update({ cover: coverUrl })
      .eq('id', book.id)

    if (updateError) {
      console.log(`  [FAIL] ${judul} — gagal update: ${updateError.message}`)
      failed++
    } else {
      console.log(`  [OK]   ${judul}`)
      success++
    }

    await new Promise((r) => setTimeout(r, 100))
  }

  console.log(`\nSelesai! ${success} berhasil, ${failed} gagal, ${skipped} skip`)
}

fetchCovers()
