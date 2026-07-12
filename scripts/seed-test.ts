import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const NAOMI_ID = '34afb897-1454-4650-b8e1-0527719601e9'
const NAOMI_NAMA = 'Naomi'

function today() {
  return new Date().toISOString().split('T')[0]
}

function daysAgo(n: number) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

function daysFromNow(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

async function main() {
  console.log('Menyiapkan data uji untuk Naomi...\n')

  // ── 1. Ambil buku ───────────────────────────────
  const { data: bukuList, error: errBuku } = await supabase
    .from('buku')
    .select('id, judul, stok')
    .limit(3)

  if (errBuku || !bukuList?.length) {
    console.error('Gagal ambil buku:', errBuku?.message)
    process.exit(1)
  }
  console.log(`✓ ${bukuList.length} buku tersedia`)

  // ── 2. Hapus peminjaman uji + reset stok ────────
  const kodeUji = ['TEST-PMJ-001', 'TEST-PMJ-002', 'TEST-PMJ-003']
  await supabase.from('peminjaman').delete().in('kode_peminjaman', kodeUji)

  const { data: allBooks } = await supabase.from('buku').select('id, stok')
  let resetCount = 0
  for (const b of allBooks || []) {
    if (b.stok !== 5) {
      await supabase.from('buku').update({ stok: 5 }).eq('id', b.id)
      resetCount++
    }
  }
  if (resetCount > 0) console.log(`✓ Reset stok ${resetCount} buku ke 5`)

  // ── 3. Insert 3 peminjaman untuk Naomi ──────────
  const pinjamData: Record<string, unknown>[] = [
    // PMJ-001: Aktif, terlambat (jatuh tempo -5 hari) — admin selesaikan → denda
    {
      kode_peminjaman: 'TEST-PMJ-001',
      anggota_id: NAOMI_ID,
      anggota_nama: NAOMI_NAMA,
      buku_id: bukuList[0].id,
      buku_judul: bukuList[0].judul,
      tanggal_reservasi: daysAgo(10),
      tanggal_pinjam: daysAgo(10),
      jatuh_tempo: daysAgo(5),
      status: 'Aktif',
      denda: 0,
      hari_terlambat: 0,
    },
    // PMJ-002: Selesai, denda 15.000 (Belum Lunas) — member upload bukti → admin verifikasi
    {
      kode_peminjaman: 'TEST-PMJ-002',
      anggota_id: NAOMI_ID,
      anggota_nama: NAOMI_NAMA,
      buku_id: bukuList[1].id,
      buku_judul: bukuList[1].judul,
      tanggal_reservasi: daysAgo(20),
      tanggal_pinjam: daysAgo(20),
      jatuh_tempo: daysAgo(15),
      status: 'Selesai',
      denda: 15000,
      hari_terlambat: 4,
      status_denda: 'Belum Lunas',
      tanggal_selesai: daysAgo(5),
    },
    // PMJ-003: Selesai, denda 10.000 (Lunas) — referensi status lunas
    {
      kode_peminjaman: 'TEST-PMJ-003',
      anggota_id: NAOMI_ID,
      anggota_nama: NAOMI_NAMA,
      buku_id: bukuList[2].id,
      buku_judul: bukuList[2].judul,
      tanggal_reservasi: daysAgo(20),
      tanggal_pinjam: daysAgo(20),
      jatuh_tempo: daysAgo(15),
      status: 'Selesai',
      denda: 10000,
      hari_terlambat: 3,
      status_denda: 'Lunas',
      tanggal_selesai: daysAgo(5),
    },
  ]

  let sukses = 0
  for (const p of pinjamData) {
    const { error } = await supabase.from('peminjaman').insert(p)
    if (error) {
      console.error(`  ✗ ${p.kode_peminjaman}: ${error.message}`)
    } else {
      sukses++
    }
  }
  console.log(`\n✓ ${sukses}/${pinjamData.length} peminjaman untuk Naomi`)

  // ── 4. Stok Aktif → -1 ──────────────────────────
  const aktifBukuIds = new Set(
    pinjamData
      .filter((p) => p.status === 'Aktif')
      .map((p) => p.buku_id as string)
  )
  for (const bukuId of aktifBukuIds) {
    const { data: buku } = await supabase
      .from('buku')
      .select('stok')
      .eq('id', bukuId)
      .single()
    if (buku) {
      await supabase.from('buku').update({ stok: buku.stok - 1 }).eq('id', bukuId)
      console.log(`  ✓ Stok "${bukuList.find(b => b.id === bukuId)?.judul}" → ${buku.stok - 1}`)
    }
  }

  // ── 5. Ringkasan ────────────────────────────────
  const { count: totalPinjam } = await supabase
    .from('peminjaman')
    .select('*', { count: 'exact', head: true })

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`  Total peminjaman di DB: ${totalPinjam}`)
  console.log(`  Semua milik: ${NAOMI_NAMA}`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`\nSkenario test denda:`)
  console.log(`  TEST-PMJ-001 → Aktif (terlambat) → Admin selesaikan di Pengembalian`)
  console.log(`  TEST-PMJ-002 → Selesai (Belum Lunas) → Member upload bukti di Denda`)
  console.log(`  TEST-PMJ-003 → Selesai (Lunas) → Referensi status`)
}

main().catch(console.error)
