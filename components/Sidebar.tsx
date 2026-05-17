'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '🕹️', doodleIcon: '🏠', level: '01', label: 'Home' },
  { name: 'My Notes', href: '/dashboard/notes', icon: '📜', doodleIcon: '📝', level: '02', label: 'Notes' },
  { name: 'Insights', href: '/dashboard/insights', icon: '📊', doodleIcon: '💡', level: '03', label: 'Insights' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLight = mounted && (theme === 'light' || resolvedTheme === 'light')

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleCreateNote = async () => {
    setIsCreating(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Note', content: '' })
      })
      const { data } = await res.json()
      if (data?.id) {
        router.push(`/dashboard/notes/${data.id}`)
      }
    } catch (error) {
      console.error('Failed to create note:', error)
    } finally {
      setIsCreating(false)
    }
  }

  /* ─── LIGHT MODE: DOODLE WORKSHOP SIDEBAR ─── */
  if (isLight) {
    return (
      <aside
        className="w-64 flex flex-col h-screen fixed left-0 top-0 z-50"
        style={{
          background: '#FFFEF7',
          borderRight: '3px solid #2D3748',
          boxShadow: '4px 0 0 #FFD166',
        }}
      >
        {/* LOGO */}
        <Link href="/dashboard" className="p-6 flex items-center gap-3 group" style={{ textDecoration: 'none' }}>
          <div style={{
            width: '44px', height: '44px', background: '#FFD166', border: '2.5px solid #2D3748',
            borderRadius: '4px 14px 10px 14px / 14px 4px 14px 10px',
            boxShadow: '3px 3px 0 #2D3748', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '22px', transform: 'rotate(-3deg)',
          }}>
            ✏️
          </div>
          <div>
            <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '18px', color: '#2D3748', display: 'block', lineHeight: 1 }}>
              Peblo
            </span>
            <span style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#EF476F', display: 'block', fontWeight: 700 }}>
              AI Workshop
            </span>
          </div>
        </Link>

        {/* Separator — hand-drawn line */}
        <div style={{ margin: '0 20px 16px', height: '3px', background: 'repeating-linear-gradient(90deg, #2D3748 0, #2D3748 6px, transparent 6px, transparent 10px)', borderRadius: '2px' }} />

        {/* CREATE NOTE BUTTON */}
        <div className="px-4 mb-6">
          <button
            onClick={handleCreateNote}
            disabled={isCreating}
            style={{
              width: '100%', padding: '12px 16px', fontFamily: "'Permanent Marker', cursive",
              fontSize: '16px', color: '#2D3748', background: '#FFD166',
              border: '2.5px solid #2D3748', borderRadius: '4px 14px 10px 14px / 14px 4px 14px 10px',
              boxShadow: '4px 4px 0 #2D3748', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', transition: 'transform 0.1s, box-shadow 0.1s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #2D3748' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #2D3748' }}
            onMouseDown={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(2px,2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '2px 2px 0 #2D3748' }}
          >
            {isCreating ? '⏳ Creating...' : '✏️ New Note'}
          </button>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '11px', color: '#A0AEC0', textAlign: 'center', marginTop: '6px' }}>
            Start writing something great
          </p>
        </div>

        {/* NAV SECTION LABEL */}
        <div style={{ paddingTop: '16px', paddingRight: '20px', paddingBottom: '8px', paddingLeft: '20px', borderTop: '2px dashed #CBD5E0' }}>
          <p style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#A0AEC0', fontWeight: 700, letterSpacing: '0.05em' }}>
            — Navigate —
          </p>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 12px', textDecoration: 'none',
                  background: isActive ? '#EBF8FF' : 'transparent',
                  border: isActive ? '2px solid #118AB2' : '2px solid transparent',
                  borderRadius: '4px 10px 8px 10px / 10px 4px 10px 8px',
                  boxShadow: isActive ? '3px 3px 0 #118AB2' : 'none',
                  transition: 'all 0.12s',
                }}
                onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = '#F7FAFC'; (e.currentTarget as HTMLElement).style.transform = 'translateX(3px)' } }}
                onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.transform = 'translateX(0)' } }}
              >
                {/* Hand-drawn checkbox */}
                <div style={{
                  width: '18px', height: '18px', border: '2px solid #2D3748', flexShrink: 0,
                  borderRadius: '2px 6px 4px 6px / 6px 2px 6px 4px',
                  background: isActive ? '#FFD166' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {isActive && <span style={{ fontSize: '10px', color: '#2D3748' }}>✓</span>}
                </div>
                <span style={{ fontSize: '18px' }}>{item.doodleIcon}</span>
                <span style={{ fontFamily: "'Kalam', cursive", fontSize: '15px', color: isActive ? '#118AB2' : '#4A5568', fontWeight: 700 }}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        <div style={{ margin: '8px 20px', height: '2px', background: 'repeating-linear-gradient(90deg, #CBD5E0 0, #CBD5E0 6px, transparent 6px, transparent 10px)' }} />

        {/* USER + LOGOUT */}
        <div className="p-4">
          <div style={{ padding: '12px', background: '#FFF0F3', border: '2px solid #EF476F', borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', boxShadow: '3px 3px 0 #EF476F', marginBottom: '10px' }}>
            <p style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#EF476F', fontWeight: 700, marginBottom: '4px' }}>👤 You</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '18px' }}>🎨</span>
              <div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#2D3748', fontWeight: 600 }}>Active Session</p>
                <div style={{ display: 'flex', gap: '3px', marginTop: '2px' }}>
                  {[...Array(3)].map((_, i) => (
                    <span key={i} style={{ color: '#FFD166', fontSize: '10px' }}>★</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: '100%', padding: '10px', fontFamily: "'Kalam', cursive",
              fontSize: '14px', color: '#EF476F', background: 'white',
              border: '2px solid #EF476F', borderRadius: '4px 10px 8px 10px / 10px 4px 10px 8px',
              boxShadow: '3px 3px 0 #EF476F', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontWeight: 700,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FFF0F3'; (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #EF476F' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'white'; (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #EF476F' }}
          >
            🚪 Sign Out
          </button>
        </div>
      </aside>
    )
  }

  /* ─── DARK MODE: ARCADE SIDEBAR ─── */
  return (
    <aside
      className="w-64 flex flex-col h-screen fixed left-0 top-0 z-50"
      style={{
        background: '#000000',
        borderRight: '2px dotted rgba(0,255,255,0.3)',
        boxShadow: '4px 0 20px rgba(0,255,255,0.05)',
      }}
    >
      <Link href="/dashboard" className="p-6 flex items-center gap-3 group">
        <div className="w-10 h-10 flex items-center justify-center text-xl animate-blink"
          style={{ background: '#FFFF00', clipPath: 'polygon(0 4px,4px 4px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 4px,100% 4px,100% calc(100% - 4px),calc(100% - 4px) calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,4px calc(100% - 4px),0 calc(100% - 4px))' }}
        >
          <span style={{ fontSize: '18px' }}>⬤</span>
        </div>
        <div>
          <span className="pixel-font text-white block" style={{ fontSize: '10px', textShadow: '0 0 10px #FFFF00, 0 0 20px #FFFF00' }}>PEBLO</span>
          <span className="pixel-font block" style={{ fontSize: '8px', color: '#FF007F', textShadow: '0 0 8px #FF007F' }}>AI.EXE</span>
        </div>
      </Link>

      <div style={{ borderTop: '2px dotted rgba(0,255,255,0.2)', margin: '0 16px 16px' }} />

      <div className="px-4 mb-6">
        <button onClick={handleCreateNote} disabled={isCreating} className="btn-arcade" style={{ fontSize: '8px' }}>
          {isCreating ? <span className="animate-blink">LOADING...</span> : <><span>🪙</span><span>INSERT COIN</span></>}
        </button>
        <p className="text-center mt-2 pixel-font" style={{ fontSize: '6px', color: 'rgba(255,255,0,0.4)' }}>= NEW NOTE</p>
      </div>

      <div className="px-3 mb-2" style={{ borderTop: '2px dotted rgba(0,255,255,0.15)', paddingTop: '16px' }}>
        <p className="pixel-font px-3 mb-3" style={{ fontSize: '7px', color: 'rgba(0,255,255,0.5)', letterSpacing: '0.1em' }}>— LEVEL SELECT —</p>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href}
              className={cn('flex items-center gap-3 px-3 py-3 transition-all duration-150 relative group')}
              style={{
                background: isActive ? 'rgba(0,0,255,0.15)' : 'transparent',
                border: isActive ? '2px dotted rgba(0,0,255,0.6)' : '2px dotted transparent',
                boxShadow: isActive ? '0 0 15px rgba(0,0,255,0.2), inset 0 0 10px rgba(0,0,255,0.05)' : 'none',
              }}
            >
              {isActive && <span className="absolute -left-2 text-base" style={{ color: '#FFFF00', textShadow: '0 0 10px #FFFF00', fontSize: '14px' }}>▶</span>}
              <span className="text-base">{item.icon}</span>
              <div className="flex-1">
                <span className={cn('pixel-font block')} style={{ fontSize: '8px', color: isActive ? '#0000FF' : '#888', textShadow: isActive ? '0 0 8px #0000FF, 0 0 16px rgba(0,0,255,0.5)' : 'none' }}>
                  {item.name.toUpperCase()}
                </span>
              </div>
              <span className="pixel-font" style={{ fontSize: '6px', color: isActive ? '#00FFFF' : '#333' }}>LV{item.level}</span>
            </Link>
          )
        })}
      </nav>

      <div style={{ borderTop: '2px dotted rgba(0,255,255,0.15)', margin: '8px 16px' }} />

      <div className="p-4">
        <div className="p-3 mb-3" style={{ background: 'rgba(0,0,0,0.8)', border: '2px dotted rgba(255,0,127,0.3)' }}>
          <p className="pixel-font" style={{ fontSize: '7px', color: '#FF007F', textShadow: '0 0 8px #FF007F', marginBottom: '4px' }}>▶ PLAYER 1</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center text-sm"
              style={{ background: '#FF007F', clipPath: 'polygon(0 4px,4px 4px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 4px,100% 4px,100% calc(100% - 4px),calc(100% - 4px) calc(100% - 4px),calc(100% - 4px) 100%,4px 100%,4px calc(100% - 4px),0 calc(100% - 4px))' }}>
              👾
            </div>
            <div>
              <p className="pixel-font" style={{ fontSize: '6px', color: '#fff' }}>ACTIVE</p>
              <div className="flex gap-1 mt-1">{[...Array(3)].map((_, i) => <span key={i} style={{ color: '#FFFF00', fontSize: '10px' }}>♥</span>)}</div>
            </div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 pixel-font group"
          style={{ fontSize: '7px', color: '#FF0000', border: '2px dotted rgba(255,0,0,0.3)', background: 'transparent', cursor: 'pointer', transition: 'all 0.15s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,0,0,0.1)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 0 15px rgba(255,0,0,0.3)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,0,0.8)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,0,0,0.3)' }}
        >
          <span>💀</span><span>GAME OVER</span>
        </button>
      </div>
    </aside>
  )
}
