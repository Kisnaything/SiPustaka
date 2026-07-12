import { addNotifikasi } from './notifikasi'
import { getBookById, updateBook } from './buku'

export interface Peminjaman {
  id: string
  kode_peminjaman: string
  anggota_id: string
  anggota_nama: string
  buku_id: string
  buku_judul: string
  buku_cover: string | null
  tanggal_reservasi: string
  tanggal_pinjam: string | null
  jatuh_tempo: string | null
  status: 'Menunggu Konfirmasi' | 'Aktif' | 'Selesai' | 'Dibatalkan'
  denda: number
  hari_terlambat: number
  status_denda: 'Belum Lunas' | 'Menunggu Verifikasi' | 'Lunas' | 'Ditolak' | null
  tanggal_selesai: string | null
  pesan_ditolak: string | null
  bukti_bayar: string | null
}

const DURASI_PINJAM_HARI = 5

async function api<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    console.error('API error:', json.error)
    throw new Error(json.error)
  }
  return json.data as T
}

export async function getPeminjaman(): Promise<Peminjaman[]> {
  try {
    const list = await api<Peminjaman[]>({
      table: 'peminjaman',
      operation: 'select',
      params: { select: '*', order: { column: 'tanggal_reservasi', ascending: false } },
    })
    return await attachCovers(list)
  } catch {
    return []
  }
}

async function attachCovers(list: Peminjaman[]): Promise<Peminjaman[]> {
  if (list.length === 0) return list
  const ids = [...new Set(list.map((p) => p.buku_id))]
  const covers = await api<{ id: string; cover: string | null }[]>({
    table: 'buku',
    operation: 'select',
    params: { select: 'id,cover', in: { column: 'id', values: ids } },
  }).catch(() => [])
  const map = new Map(covers.map((c) => [c.id, c.cover]))
  return list.map((p) => ({ ...p, buku_cover: map.get(p.buku_id) || null }))
}

export async function getPeminjamanById(id: string): Promise<Peminjaman | null> {
  try {
    return await api<Peminjaman>({
      table: 'peminjaman',
      operation: 'select',
      params: { select: '*', eq: { column: 'id', value: id }, single: true },
    })
  } catch {
    return null
  }
}

export async function getPeminjamanByKode(kode: string): Promise<Peminjaman | null> {
  try {
    const list = await api<Peminjaman[]>({
      table: 'peminjaman',
      operation: 'select',
      params: { select: '*', eq: { column: 'kode_peminjaman', value: kode } },
    })
    return list[0] || null
  } catch {
    return null
  }
}

export async function getPeminjamanMenunggu(): Promise<Peminjaman[]> {
  const all = await getPeminjaman()
  return all.filter((p) => p.status === 'Menunggu Konfirmasi')
}

export async function getPeminjamanAktif(): Promise<Peminjaman[]> {
  const all = await getPeminjaman()
  return all.filter((p) => p.status === 'Aktif')
}

export async function getPeminjamanByAnggota(anggotaId: string): Promise<Peminjaman[]> {
  try {
    const list = await api<Peminjaman[]>({
      table: 'peminjaman',
      operation: 'select',
      params: {
        select: '*',
        eq: { column: 'anggota_id', value: anggotaId },
        order: { column: 'tanggal_reservasi', ascending: false },
      },
    })
    return await attachCovers(list)
  } catch {
    return []
  }
}

async function generateKodePeminjaman(): Promise<string> {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`

  const all = await getPeminjaman()
  const todayCount = all.filter((p) =>
    p.kode_peminjaman.startsWith(`PMJ-${dateStr}`)
  ).length

  const sequence = String(todayCount + 1).padStart(3, '0')
  return `PMJ-${dateStr}-${sequence}`
}

export async function addPeminjaman(data: {
  anggota_id: string
  anggota_nama: string
  buku_id: string
  buku_judul: string
}): Promise<{ success: boolean; message: string; data?: Peminjaman }> {
  try {
    const semua = await getPeminjamanByAnggota(data.anggota_id)
    const peminjamanBerjalan = semua.filter(
      (p) => p.status === 'Aktif' || p.status === 'Menunggu Konfirmasi'
    )
    const MAKS_PINJAM_ANGGOTA = 3
    if (peminjamanBerjalan.length >= MAKS_PINJAM_ANGGOTA) {
      return {
        success: false,
        message: `Kamu sudah memiliki ${peminjamanBerjalan.length} peminjaman aktif. Maksimal ${MAKS_PINJAM_ANGGOTA} peminjaman aktif per anggota.`,
      }
    }

    const buku = await getBookById(data.buku_id)
    if (!buku || buku.stok <= 0) {
      return { success: false, message: 'Stok buku habis, tidak bisa mengajukan peminjaman' }
    }

    const kode = await generateKodePeminjaman()
    const newPeminjaman = await api<Peminjaman>({
      table: 'peminjaman',
      operation: 'insert',
      params: {
        values: {
          kode_peminjaman: kode,
          anggota_id: data.anggota_id,
          anggota_nama: data.anggota_nama,
          buku_id: data.buku_id,
          buku_judul: data.buku_judul,
          tanggal_reservasi: new Date().toISOString(),
          status: 'Menunggu Konfirmasi',
          denda: 0,
          hari_terlambat: 0,
          status_denda: null,
          pesan_ditolak: null,
        },
        select: true,
        single: true,
      },
    })
    addNotifikasi({
      judul: 'Peminjaman Baru Diajukan',
      pesan: `${data.anggota_nama} mengajukan peminjaman "${data.buku_judul}"`,
      tipe: 'peminjaman_baru',
    })
    return { success: true, message: 'Peminjaman berhasil diajukan', data: newPeminjaman }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Gagal menambah peminjaman' }
  }
}

export async function konfirmasiPengambilan(kode: string): Promise<{
  success: boolean
  message: string
  data?: Peminjaman
}> {
  try {
    const peminjaman = await getPeminjamanByKode(kode)
    if (!peminjaman) return { success: false, message: 'Kode peminjaman tidak ditemukan' }
    if (peminjaman.status !== 'Menunggu Konfirmasi') {
      return { success: false, message: `Status saat ini: ${peminjaman.status}` }
    }

    const reservasiDate = new Date(peminjaman.tanggal_reservasi)
    const now = new Date()
    const diffHours = (now.getTime() - reservasiDate.getTime()) / (1000 * 60 * 60)

    if (diffHours > 24) {
      await batalkanPeminjaman(kode)
      return { success: false, message: 'Waktu pengambilan sudah habis (24 jam). Peminjaman dibatalkan.' }
    }

    const tanggalPinjam = now.toISOString().split('T')[0]
    const jatuhTempo = new Date()
    jatuhTempo.setDate(jatuhTempo.getDate() + DURASI_PINJAM_HARI)

    const updated = await api<Peminjaman>({
      table: 'peminjaman',
      operation: 'update',
      params: {
        values: {
          status: 'Aktif',
          tanggal_pinjam: tanggalPinjam,
          jatuh_tempo: jatuhTempo.toISOString().split('T')[0],
        },
        eq: { column: 'kode_peminjaman', value: kode },
        select: true,
        single: true,
      },
    })
    const bukuConfirm = await getBookById(peminjaman.buku_id)
    if (bukuConfirm && bukuConfirm.stok > 0) {
      await updateBook(peminjaman.buku_id, { stok: bukuConfirm.stok - 1 })
    }
    addNotifikasi({
      judul: 'Peminjaman Dikonfirmasi',
      pesan: `Peminjaman "${peminjaman.buku_judul}" oleh ${peminjaman.anggota_nama} telah dikonfirmasi`,
      tipe: 'info',
    })
    return { success: true, message: 'Peminjaman berhasil dikonfirmasi', data: updated }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Gagal konfirmasi' }
  }
}

export async function batalkanPeminjaman(kode: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    const peminjaman = await getPeminjamanByKode(kode)
    if (!peminjaman) return { success: false, message: 'Kode peminjaman tidak ditemukan' }
    if (peminjaman.status !== 'Menunggu Konfirmasi') {
      return { success: false, message: 'Peminjaman tidak dapat dibatalkan' }
    }

    await api<null>({
      table: 'peminjaman',
      operation: 'update',
      params: {
        values: { status: 'Dibatalkan' },
        eq: { column: 'kode_peminjaman', value: kode },
      },
    })
    return { success: true, message: 'Peminjaman berhasil dibatalkan' }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Gagal membatalkan' }
  }
}

export async function selesaikanPeminjaman(id: string, dendaPerHari = 2000): Promise<{
  success: boolean
  message: string
  denda?: number
}> {
  try {
    const peminjaman = await getPeminjamanById(id)
    if (!peminjaman) return { success: false, message: 'Peminjaman tidak ditemukan' }
    if (peminjaman.status !== 'Aktif') {
      return { success: false, message: 'Hanya peminjaman aktif yang bisa diselesaikan' }
    }

    let denda = 0
    let hariTerlambat = 0
    if (peminjaman.jatuh_tempo) {
      const jatuhTempo = new Date(peminjaman.jatuh_tempo)
      const now = new Date()
      if (now > jatuhTempo) {
        hariTerlambat = Math.ceil(
          (now.getTime() - jatuhTempo.getTime()) / (1000 * 60 * 60 * 24)
        )
        denda = hariTerlambat * dendaPerHari
      }
    }

    await api<null>({
      table: 'peminjaman',
      operation: 'update',
      params: {
        values: {
          status: 'Selesai',
          denda,
          hari_terlambat: hariTerlambat,
          status_denda: denda > 0 ? 'Belum Lunas' : null,
          tanggal_selesai: new Date().toISOString().split('T')[0],
        },
        eq: { column: 'id', value: id },
      },
    })
    const bukuSelesai = await getBookById(peminjaman.buku_id)
    if (bukuSelesai) {
      await updateBook(peminjaman.buku_id, { stok: bukuSelesai.stok + 1 })
    }
    addNotifikasi({
      judul: 'Pengembalian Buku',
      pesan: `${peminjaman.anggota_nama} mengembalikan buku "${peminjaman.buku_judul}"${denda > 0 ? ` dengan denda Rp ${denda.toLocaleString('id-ID')}` : ''}`,
      tipe: 'pengembalian',
    })
    return { success: true, message: 'Pengembalian berhasil', denda }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Gagal menyelesaikan' }
  }
}

export async function updatePeminjaman(
  id: string,
  data: Partial<Peminjaman>
): Promise<Peminjaman | null> {
  try {
    return await api<Peminjaman>({
      table: 'peminjaman',
      operation: 'update',
      params: {
        values: data,
        eq: { column: 'id', value: id },
        select: true,
        single: true,
      },
    })
  } catch {
    return null
  }
}

export async function verifikasiDenda(
  id: string,
  status: 'Lunas' | 'Ditolak',
  pesan?: string
): Promise<{
  success: boolean
  message: string
}> {
  try {
    const peminjaman = await getPeminjamanById(id)
    if (!peminjaman) return { success: false, message: 'Peminjaman tidak ditemukan' }
    if (peminjaman.status !== 'Selesai') {
      return { success: false, message: 'Hanya peminjaman selesai yang memiliki denda' }
    }
    if (status === 'Ditolak' && !pesan) {
      return { success: false, message: 'Alasan penolakan harus diisi' }
    }

    await api<null>({
      table: 'peminjaman',
      operation: 'update',
      params: {
        values: {
          status_denda: status,
          pesan_ditolak: status === 'Ditolak' ? pesan || null : null,
        },
        eq: { column: 'id', value: id },
      },
    })
    if (status === 'Lunas') {
      addNotifikasi({
        judul: 'Denda Lunas',
        pesan: `Denda peminjaman "${peminjaman.buku_judul}" oleh ${peminjaman.anggota_nama} telah dibayar`,
        tipe: 'verifikasi_denda',
      })
    } else if (status === 'Ditolak') {
      addNotifikasi({
        judul: 'Denda Ditolak',
        pesan: `Pembayaran denda "${peminjaman.buku_judul}" oleh ${peminjaman.anggota_nama} ditolak: ${pesan}`,
        tipe: 'verifikasi_denda',
      })
    }
    return { success: true, message: `Denda berhasil diverifikasi sebagai ${status}` }
  } catch (err) {
    return { success: false, message: err instanceof Error ? err.message : 'Gagal verifikasi' }
  }
}
