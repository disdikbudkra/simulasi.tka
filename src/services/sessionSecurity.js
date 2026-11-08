/**
 * sessionSecurity.js
 * Utilitas keamanan sesi untuk Simulasi TKA Disdikbud Karanganyar
 * - Inactivity Idle Auto Logout (Default 30 Menit)
 * - Countdown Warning Modal (60 Detik Sebelum Logout)
 * - Cross-Tab Session Synchronization (BroadcastChannel & Storage Event)
 * - Brute Force Protection (Rate Limiting Percobaan Login)
 */

const CHANNEL_NAME = 'simulasi_tka_session_channel'

// 1. BroadcastChannel / Storage Event untuk Multi-Tab Sync
let broadcastChannel = null
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(CHANNEL_NAME)
  }
} catch (e) {
  console.warn('BroadcastChannel not supported, falling back to storage events', e)
}

/**
 * Kirim sinyal logout ke seluruh tab yang sedang terbuka
 */
export function broadcastSessionLogout(scope = 'all') {
  const payload = { type: 'LOGOUT', scope, timestamp: Date.now() }
  if (broadcastChannel) {
    broadcastChannel.postMessage(payload)
  }
  try {
    localStorage.setItem('simulasi_tka_logout_event', JSON.stringify(payload))
  } catch (e) {
    // Ignore storage quota errors
  }
}

/**
 * Pasang listener agar tab ini ikut logout jika ada tab lain yang logout
 */
export function listenCrossTabLogout(callback) {
  if (typeof window === 'undefined') return () => {}

  const handleMessage = (event) => {
    if (event && event.data && event.data.type === 'LOGOUT') {
      callback(event.data)
    }
  }

  const handleStorage = (event) => {
    if (event.key === 'simulasi_tka_logout_event' && event.newValue) {
      try {
        const data = JSON.parse(event.newValue)
        if (data && data.type === 'LOGOUT') {
          callback(data)
        }
      } catch (e) {
        // Ignore JSON error
      }
    }
  }

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleMessage)
  }
  window.addEventListener('storage', handleStorage)

  return () => {
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleMessage)
    }
    window.removeEventListener('storage', handleStorage)
  }
}

/**
 * 2. Inactivity Idle Tracker (Default 30 Menit = 1800000 ms)
 * Parameter:
 * - timeoutMs: Durasi idle sebelum logout (default 30 menit)
 * - warningMs: Durasi peringatan sebelum timeout (default 60 detik)
 * - onWarning(remainingSec): Dipanggil setiap detik selama masa peringatan
 * - onTimeout(): Dipanggil saat waktu habis (eksekusi logout)
 * - onResume(): Dipanggil saat user kembali aktif dan membatalkan status peringatan
 */
export function createIdleTimer({
  timeoutMs = 30 * 60 * 1000, // 30 Menit
  warningMs = 60 * 1000,      // 60 Detik
  onWarning = () => {},
  onTimeout = () => {},
  onResume = () => {}
}) {
  let lastActivityTime = Date.now()
  let checkInterval = null
  let isWarningActive = false
  let isStopped = false

  const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll']

  // Throttle aktivitas agar tidak membebani CPU
  let lastEventRecorded = 0
  const recordActivity = () => {
    const now = Date.now()
    if (now - lastEventRecorded > 1000) {
      lastEventRecorded = now
      lastActivityTime = now
      if (isWarningActive) {
        isWarningActive = false
        onResume()
      }
    }
  }

  const start = () => {
    isStopped = false
    lastActivityTime = Date.now()
    isWarningActive = false

    activityEvents.forEach(evt => {
      window.addEventListener(evt, recordActivity, { passive: true })
    })

    if (checkInterval) clearInterval(checkInterval)

    checkInterval = setInterval(() => {
      if (isStopped) return

      const idleDuration = Date.now() - lastActivityTime
      const remainingTotal = timeoutMs - idleDuration

      if (remainingTotal <= 0) {
        // Waktu habis!
        isStopped = true
        clearInterval(checkInterval)
        onTimeout()
      } else if (remainingTotal <= warningMs) {
        // Masuk masa peringatan (60 detik terakhir)
        isWarningActive = true
        const remainingSec = Math.max(1, Math.ceil(remainingTotal / 1000))
        onWarning(remainingSec)
      } else {
        if (isWarningActive) {
          isWarningActive = false
          onResume()
        }
      }
    }, 1000)
  }

  const reset = () => {
    lastActivityTime = Date.now()
    if (isWarningActive) {
      isWarningActive = false
      onResume()
    }
  }

  const stop = () => {
    isStopped = true
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
    activityEvents.forEach(evt => {
      window.removeEventListener(evt, recordActivity)
    })
  }

  return {
    start,
    reset,
    stop
  }
}

/**
 * 3. Brute Force Protection (Login Rate Limiter)
 * Menyimpan riwayat percobaan login gagal di sessionStorage
 * Maksimal 5x gagal -> Kunci 60 detik
 */
const LOGIN_ATTEMPTS_KEY = 'tka_login_attempts_'

export function checkLoginRateLimit(prefix = 'penulis') {
  try {
    const key = LOGIN_ATTEMPTS_KEY + prefix
    const raw = sessionStorage.getItem(key)
    if (!raw) return { allowed: true, remainingCooldown: 0, attempts: 0 }

    const data = JSON.parse(raw)
    const now = Date.now()

    if (data.lockedUntil && now < data.lockedUntil) {
      const remainingCooldown = Math.ceil((data.lockedUntil - now) / 1000)
      return { allowed: false, remainingCooldown, attempts: data.attempts || 5 }
    }

    // Jika masa lock sudah lewat, reset
    if (data.lockedUntil && now >= data.lockedUntil) {
      sessionStorage.removeItem(key)
      return { allowed: true, remainingCooldown: 0, attempts: 0 }
    }

    return { allowed: true, remainingCooldown: 0, attempts: data.attempts || 0 }
  } catch (e) {
    return { allowed: true, remainingCooldown: 0, attempts: 0 }
  }
}

export function recordFailedLogin(prefix = 'penulis') {
  try {
    const key = LOGIN_ATTEMPTS_KEY + prefix
    const raw = sessionStorage.getItem(key)
    let data = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: null }

    data.attempts = (data.attempts || 0) + 1

    if (data.attempts >= 5) {
      // Kunci selama 60 detik
      data.lockedUntil = Date.now() + 60 * 1000
    }

    sessionStorage.setItem(key, JSON.stringify(data))
    return checkLoginRateLimit(prefix)
  } catch (e) {
    return { allowed: true, remainingCooldown: 0, attempts: 1 }
  }
}

export function resetLoginAttempts(prefix = 'penulis') {
  try {
    sessionStorage.removeItem(LOGIN_ATTEMPTS_KEY + prefix)
  } catch (e) {
    // Ignore error
  }
}
