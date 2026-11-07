import { supabase } from '../supabase'
import { DEFAULT_QUESTIONS } from './defaultQuestions'

const LOCAL_STORAGE_KEY = 'simulasi_tka_soal_local'
const HASIL_STORAGE_KEY = 'simulasi_tka_hasil_ujian'

// Helper to convert File to Base64 (fallback if Storage bucket is not ready)
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

// Upload file to Supabase storage with fallback to base64
export const uploadGambarSoal = async (file) => {
  if (!file) return null

  try {
    const fileExt = file.name.split('.').pop()
    const cleanFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('gambar_soal')
      .upload(cleanFileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.warn('Storage upload warning, using local base64 fallback:', error.message)
      return await fileToBase64(file)
    }

    const { data: publicUrlData } = supabase.storage
      .from('gambar_soal')
      .getPublicUrl(cleanFileName)

    return publicUrlData.publicUrl
  } catch (err) {
    console.warn('Exception during image upload, using fallback:', err)
    return await fileToBase64(file)
  }
}

// Get local cached questions
export const getLocalSoal = () => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (e) {
    return []
  }
}

// Save local cached questions
export const setLocalSoal = (list) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

// Get questions matching filters (or all if omitted)
export const getSoalTKA = async (filter = {}) => {
  const { tingkat, mata_pelajaran, paket } = filter
  let remoteData = []
  let remoteSuccess = false

  try {
    let query = supabase.from('soal_tka').select('*').order('created_at', { ascending: true })

    if (tingkat && tingkat !== 'SEMUA') query = query.eq('tingkat', tingkat)
    if (mata_pelajaran && mata_pelajaran !== 'SEMUA') query = query.eq('mata_pelajaran', mata_pelajaran)
    if (paket && paket !== 'SEMUA') query = query.eq('paket', paket)

    const { data, error } = await query

    if (!error && Array.isArray(data)) {
      remoteData = data
      remoteSuccess = true
    } else if (error) {
      console.warn('Supabase fetch notice (check RLS policies if needed):', error.message)
    }
  } catch (e) {
    console.warn('Supabase network error, fallback enabled:', e)
  }

  // Merge with local storage questions and default seed questions
  const localItems = getLocalSoal()
  let combined = [...remoteData]

  // Add local items not already in remoteData
  for (const item of localItems) {
    if (!combined.some(c => c.id === item.id)) {
      combined.push(item)
    }
  }

  // If no questions found at all, incorporate default seed questions
  if (combined.length === 0) {
    let defaultList = [...DEFAULT_QUESTIONS]
    if (tingkat && tingkat !== 'SEMUA') defaultList = defaultList.filter(q => q.tingkat === tingkat)
    if (mata_pelajaran && mata_pelajaran !== 'SEMUA') defaultList = defaultList.filter(q => q.mata_pelajaran === mata_pelajaran)
    if (paket && paket !== 'SEMUA') defaultList = defaultList.filter(q => q.paket === paket)
    combined = defaultList
  }

  return {
    data: combined,
    isRemote: remoteSuccess
  }
}

// Insert new question
export const simpanSoalTKA = async (payload) => {
  const newId = payload.id || crypto.randomUUID()
  const questionToSave = {
    ...payload,
    id: newId,
    created_at: new Date().toISOString()
  }

  let remoteSuccess = false
  let remoteError = null

  try {
    const { data, error } = await supabase.from('soal_tka').insert([questionToSave]).select()
    if (!error) {
      remoteSuccess = true
    } else {
      remoteError = error
      console.warn('Supabase insert notice:', error.message)
    }
  } catch (e) {
    remoteError = e
    console.warn('Supabase insert exception:', e)
  }

  // Always keep a copy in localStorage as well
  const localList = getLocalSoal()
  localList.unshift(questionToSave)
  setLocalSoal(localList)

  return {
    success: true,
    remoteSuccess,
    remoteError,
    data: questionToSave
  }
}

// Delete question
export const hapusSoalTKA = async (id) => {
  try {
    await supabase.from('soal_tka').delete().eq('id', id)
  } catch (e) {
    console.warn('Delete remote error:', e)
  }

  const localList = getLocalSoal().filter(q => q.id !== id)
  setLocalSoal(localList)
  return true
}

// Save student exam results
export const simpanHasilUjian = async (resultData) => {
  const record = {
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    ...resultData
  }

  try {
    await supabase.from('hasil_ujian').insert([record])
  } catch (e) {
    console.warn('Simpan hasil remote notice:', e)
  }

  try {
    const local = JSON.parse(localStorage.getItem(HASIL_STORAGE_KEY) || '[]')
    local.unshift(record)
    localStorage.setItem(HASIL_STORAGE_KEY, JSON.stringify(local.slice(0, 100)))
  } catch (e) {
    console.error('Local save error:', e)
  }

  return record
}

// Get all exam results
export const getHasilUjian = async () => {
  let list = []
  try {
    const { data, error } = await supabase.from('hasil_ujian').select('*').order('created_at', { ascending: false })
    if (!error && Array.isArray(data) && data.length > 0) {
      return data
    }
  } catch (e) {
    // fallback
  }

  try {
    list = JSON.parse(localStorage.getItem(HASIL_STORAGE_KEY) || '[]')
  } catch (e) {
    list = []
  }

  return list
}
