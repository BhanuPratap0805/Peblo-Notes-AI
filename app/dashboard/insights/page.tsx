'use client'

import { useEffect, useState } from 'react'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { useTheme } from 'next-themes'

function AnimatedCounter({ target }: { target: number }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let start = 0
    const step = Math.ceil(target / 20)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 50)
    return () => clearInterval(timer)
  }, [target])
  return <span>{count}</span>
}

export default function InsightsPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    fetch('/api/insights')
      .then(r => r.json())
      .then(r => { if (r.data) setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const isLight = mounted && (theme === 'light' || resolvedTheme === 'light')

  if (loading) {
    return isLight ? (
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div style={{ fontSize: '48px' }}>📊</div>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '20px', color: '#2D3748' }}>Sketching your insights...</p>
        <div className="doodle-loader" />
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="pixel-font animate-blink" style={{ fontSize: '14px', color: '#FF007F', textShadow: '0 0 15px #FF007F' }}>◖◗ PROCESSING...</div>
      </div>
    )
  }

  if (!data) return (
    <div className="flex items-center justify-center h-64">
      <p style={{ fontFamily: "'Kalam', cursive", fontSize: '18px', color: '#EF476F' }}>Failed to load. Try refreshing.</p>
    </div>
  )

  const maxActivity = Math.max(...data.weeklyActivity.map((d: any) => d.count), 1)
  const weeklyTotal = data.weeklyActivity.reduce((a: number, b: any) => a + b.count, 0)
  const pelletColors = ['#FFD166', '#EF476F', '#118AB2', '#06D6A0', '#FF6B6B']

  /* ── LIGHT MODE: DOODLE ── */
  if (isLight) {
    const cards = [
      { label: 'Documents', value: data.totalNotes, icon: '📄', color: '#118AB2', bg: '#EBF8FF', badge: 'Total Docs', rotate: '-1deg' },
      { label: 'AI Used', value: data.aiUsageTotal, icon: '🧠', color: '#EF476F', bg: '#FFF0F3', badge: 'Power-Ups', rotate: '0.5deg' },
      { label: 'This Week', value: weeklyTotal, icon: '⚡', color: '#06D6A0', bg: '#F0FFF4', badge: 'Streak', rotate: '-0.8deg' },
    ]

    return (
      <div className="space-y-10 pb-20">
        {/* HEADER */}
        <header>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#718096', marginBottom: '8px', letterSpacing: '0.05em' }}>
            📊 Analytics / Workspace Intel
          </p>
          <h1 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '42px', color: '#2D3748', lineHeight: 1.1, transform: 'rotate(-0.5deg)', display: 'inline-block' }}>
            My <span style={{ color: '#EF476F', WebkitTextStroke: '2px #2D3748' }}>Insights</span>
          </h1>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#718096', marginTop: '12px', borderLeft: '4px solid #EF476F', paddingLeft: '12px', fontStyle: 'italic' }}>
            Track creative velocity, AI usage &amp; document org in real-time.
          </p>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.label} className="p-6 relative cursor-default"
              style={{ background: card.bg, border: '2.5px solid #2D3748', borderRadius: '4px 16px 12px 16px / 16px 4px 16px 12px', boxShadow: '5px 5px 0 #2D3748', transform: `rotate(${card.rotate})`, transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = `rotate(${card.rotate}) translate(-3px,-3px)`; (e.currentTarget as HTMLElement).style.boxShadow = '8px 8px 0 #2D3748' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = `rotate(${card.rotate})`; (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #2D3748' }}
            >
              <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', background: 'rgba(255,209,102,0.6)', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '2px' }} />
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontSize: '28px' }}>{card.icon}</span>
                <span style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: card.color, background: 'white', border: `2px solid ${card.color}`, borderRadius: '4px 10px 8px 10px', padding: '2px 8px' }}>{card.badge}</span>
              </div>
              <div style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '48px', color: card.color, lineHeight: 1 }}>
                <AnimatedCounter target={card.value} />
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '12px', color: '#718096', marginTop: '8px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{card.label}</p>
            </div>
          ))}
        </div>

        {/* ACTIVITY CHART */}
        <section style={{ background: 'white', border: '2.5px solid #2D3748', borderRadius: '4px 16px 12px 16px / 16px 4px 16px 12px', boxShadow: '5px 5px 0 #2D3748', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '22px', color: '#2D3748' }}>📅 7-Day Activity</h2>
            <span style={{ fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#118AB2', background: '#EBF8FF', border: '2px solid #118AB2', borderRadius: '4px 10px 8px 10px', padding: '2px 10px', fontWeight: 700 }}>Power Meter</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '160px' }}>
            {data.weeklyActivity.map((d: any) => {
              const pct = (d.count / maxActivity) * 100
              return (
                <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: '8px', height: '100%' }}>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(pct, d.count > 0 ? 12 : 2)}%`,
                    background: d.count > 0 ? 'linear-gradient(180deg, #FFD166 0%, #F59E0B 100%)' : '#EDF2F7',
                    border: d.count > 0 ? '2px solid #2D3748' : '2px dashed #E2E8F0',
                    borderBottom: 'none',
                    borderRadius: '6px 6px 0 0',
                    position: 'relative',
                    transition: 'height 0.6s ease',
                  }}>
                    {d.count > 0 && (
                      <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', fontFamily: "'Kalam', cursive", fontSize: '13px', fontWeight: 'bold', color: '#2D3748', opacity: 0, transition: 'opacity 0.2s' }} className="group-hover:opacity-100">
                        {d.count}
                      </div>
                    )}
                  </div>
                  <span style={{ fontFamily: "'Kalam', cursive", fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 600 }}>{d.day}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* RECENT + TAGS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '22px', color: '#2D3748' }}>🕐 Recent Activity</h2>
              <Link href="/dashboard/notes" style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#118AB2', fontWeight: 700, borderBottom: '2px solid #118AB2', textDecoration: 'none' }}>View all →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.recent.map((note: any, i: number) => (
                <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'white', border: '2px solid #2D3748', borderRadius: '4px 10px 8px 10px / 10px 4px 10px 8px', boxShadow: '3px 3px 0 #2D3748', textDecoration: 'none', transition: 'transform 0.12s, box-shadow 0.12s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '5px 5px 0 #EF476F' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #2D3748' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#FFD166', background: '#2D3748', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '4px', fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <div>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#2D3748', fontWeight: 600 }}>{note.title || 'Untitled Note'}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#A0AEC0', marginTop: '2px' }}>{formatDate(note.updatedAt)}</p>
                    </div>
                  </div>
                  <span style={{ color: '#118AB2', fontSize: '18px' }}>→</span>
                </Link>
              ))}
              {data.recent.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed #CBD5E0', borderRadius: '8px', background: '#F7FAFC' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                  <p style={{ fontFamily: "'Kalam', cursive", fontSize: '18px', color: '#A0AEC0' }}>No activity yet!</p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '22px', color: '#2D3748', marginBottom: '16px' }}>🏷️ Tag Cloud</h2>
            <div style={{ padding: '24px', background: '#FFFEF7', border: '2px solid #2D3748', borderRadius: '4px 16px 12px 16px / 16px 4px 16px 12px', boxShadow: '5px 5px 0 #2D3748', minHeight: '180px' }}>
              {data.topTags.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {data.topTags.map((tag: any, i: number) => {
                    const c = pelletColors[i % pelletColors.length]
                    return (
                      <div key={tag.name}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'white', border: `2.5px solid ${c}`, borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', boxShadow: `3px 3px 0 ${c}`, cursor: 'pointer', transition: 'transform 0.1s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'}
                      >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c, display: 'inline-block' }} />
                        <span style={{ fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#2D3748', fontWeight: 700 }}>{tag.name}</span>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#A0AEC0' }}>{tag.count}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '140px', gap: '12px' }}>
                  <div style={{ fontSize: '36px' }}>🏷️</div>
                  <p style={{ fontFamily: "'Kalam', cursive", fontSize: '18px', color: '#A0AEC0' }}>Add tags to your notes</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    )
  }

  /* ── DARK MODE: ARCADE ── */
  const statCards = [
    { label: 'VOLUME', sublabel: 'Total Documents', value: data.totalNotes, icon: '📄', color: '#0000FF', glowColor: 'rgba(0,0,255,0.4)', border: 'rgba(0,0,255,0.5)', bg: 'rgba(0,0,60,0.7)', badge: 'HIGH SCORE' },
    { label: 'INTELLIGENCE', sublabel: 'AI Power-Ups Used', value: data.aiUsageTotal, icon: '🧠', color: '#FF007F', glowColor: 'rgba(255,0,127,0.4)', border: 'rgba(255,0,127,0.5)', bg: 'rgba(60,0,30,0.7)', badge: 'AI POWER' },
    { label: 'RECENCY', sublabel: 'Weekly Iterations', value: weeklyTotal, icon: '⏱️', color: '#00FF00', glowColor: 'rgba(0,255,0,0.4)', border: 'rgba(0,255,0,0.5)', bg: 'rgba(0,40,0,0.7)', badge: 'STREAK' },
  ]

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      <header>
        <p className="pixel-font mb-2" style={{ fontSize: '7px', color: '#FF007F', letterSpacing: '0.2em' }}>▶ SYSTEM ANALYTICS / WORKSPACE INTEL</p>
        <h1 className="pixel-font mb-3" style={{ fontSize: '20px', lineHeight: '1.8' }}>
          <span style={{ color: '#FFFFFF' }}>WORKSPACE </span>
          <span style={{ color: '#FF007F', textShadow: '0 0 15px #FF007F, 0 0 30px #FF007F' }}>INSIGHTS</span>
        </h1>
        <p className="mono-font" style={{ fontSize: '12px', color: '#555', borderLeft: '3px solid #FF007F', paddingLeft: '12px' }}>
          &gt; Track creative velocity, AI usage &amp; document org in real-time.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(card => (
          <div key={card.label} className="p-6 relative overflow-hidden cursor-default"
            style={{ background: card.bg, border: `2px dotted ${card.border}`, boxShadow: `0 0 20px ${card.glowColor}`, transition: 'all 0.15s steps(2)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${card.glowColor}` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${card.glowColor}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{card.icon}</span>
              <span className="pixel-font retro-badge" style={{ color: card.color, borderColor: card.color, fontSize: '6px', textShadow: `0 0 8px ${card.color}` }}>{card.badge}</span>
            </div>
            <div className="pixel-font mb-2" style={{ fontSize: '30px', color: card.color, textShadow: `0 0 15px ${card.color}` }}>
              <AnimatedCounter target={card.value} />
            </div>
            <p className="mono-font" style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{card.sublabel}</p>
            <div className="absolute bottom-2 right-2 opacity-5 pointer-events-none text-5xl">{card.icon}</div>
          </div>
        ))}
      </div>

      <section className="p-6" style={{ background: 'rgba(0,0,20,0.9)', border: '2px dotted rgba(0,255,255,0.25)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="pixel-font" style={{ fontSize: '10px', color: '#00FFFF', textShadow: '0 0 10px #00FFFF' }}>▶ 7-DAY ACTIVITY LEVELS</h2>
          <span className="pixel-font retro-badge" style={{ color: '#00FFFF', borderColor: '#00FFFF', fontSize: '6px' }}>POWER METER</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {data.weeklyActivity.map((d: any) => {
            const pct = (d.count / maxActivity) * 100
            return (
              <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-2 group h-full">
                <div 
                  className="w-full relative" 
                  style={{ 
                    height: `${Math.max(pct, d.count > 0 ? 8 : 2)}%`, 
                    background: d.count > 0 ? 'repeating-linear-gradient(0deg,#FFFF00 0px,#FFFF00 6px,transparent 6px,transparent 10px)' : '#1a1a00', 
                    border: d.count > 0 ? '1px solid #FFFF00' : '1px dotted rgba(255,255,0,0.15)',
                    borderBottom: 'none',
                    boxShadow: d.count > 0 ? '0 0 10px rgba(255,255,0,0.5)' : 'none', 
                    transition: 'height 0.8s steps(8)' 
                  }}
                >
                  {d.count > 0 && <span className="absolute -top-6 left-1/2 -translate-x-1/2 pixel-font opacity-0 group-hover:opacity-100" style={{ fontSize: '7px', color: '#FFFF00', whiteSpace: 'nowrap' }}>{d.count}</span>}
                </div>
                <span className="pixel-font" style={{ fontSize: '5px', color: '#444', textTransform: 'uppercase' }}>{d.day}</span>
              </div>
            )
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="pixel-font" style={{ fontSize: '10px', color: '#FFFF00', textShadow: '0 0 10px #FFFF00' }}>▶ RECENT ACTIVITY</h2>
            <div className="flex items-center gap-3">
              <div className="power-pellet" style={{ background: '#00FF00' }} />
              <span className="pixel-font" style={{ fontSize: '6px', color: '#00FF00' }}>LIVE</span>
              <Link href="/dashboard/notes" className="pixel-font" style={{ fontSize: '7px', color: '#0000FF', textShadow: '0 0 8px #0000FF' }}>VIEW ALL &gt;&gt;</Link>
            </div>
          </div>
          <div className="space-y-3">
            {data.recent.map((note: any, i: number) => (
              <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                className="flex items-center justify-between p-4 block"
                style={{ background: 'rgba(0,0,20,0.8)', border: '2px dotted rgba(0,255,255,0.2)', transition: 'all 0.15s steps(2)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(0,0,255,0.8)'; (e.currentTarget as HTMLElement).style.background='rgba(0,0,80,0.8)'; (e.currentTarget as HTMLElement).style.transform='translateX(4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor='rgba(0,255,255,0.2)'; (e.currentTarget as HTMLElement).style.background='rgba(0,0,20,0.8)'; (e.currentTarget as HTMLElement).style.transform='translateX(0)' }}
              >
                <div className="flex items-center gap-4">
                  <span className="pixel-font" style={{ fontSize: '8px', color: '#FFFF00' }}>{String(i+1).padStart(2,'0')}.</span>
                  <div>
                    <p className="mono-font font-bold" style={{ fontSize: '13px', color: '#fff' }}>{note.title || 'Untitled Note'}</p>
                    <p className="pixel-font" style={{ fontSize: '6px', color: '#444', marginTop: '4px' }}>{formatDate(note.updatedAt)}</p>
                  </div>
                </div>
                <span style={{ color: '#0000FF', fontSize: '14px' }}>▶</span>
              </Link>
            ))}
            {data.recent.length === 0 && (
              <div className="text-center py-14" style={{ border: '2px dotted rgba(0,255,255,0.15)', background: 'rgba(0,0,0,0.6)' }}>
                <div className="text-4xl mb-3 animate-float">👻</div>
                <p className="pixel-font" style={{ fontSize: '7px', color: '#444' }}>NO ACTIVITY YET!</p>
              </div>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="pixel-font mb-1" style={{ fontSize: '10px', color: '#00FF00', textShadow: '0 0 10px #00FF00' }}>▶ KNOWLEDGE MAP</h2>
            <p className="mono-font" style={{ fontSize: '11px', color: '#444' }}>&gt; Radar of your most-used tags</p>
          </div>
          <div className="p-6 min-h-48 relative" style={{ background: 'rgba(0,10,0,0.8)', border: '2px dotted rgba(0,255,0,0.3)', backgroundImage: 'radial-gradient(circle,rgba(0,255,0,0.04) 1px,transparent 1px)', backgroundSize: '20px 20px' }}>
            {data.topTags.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {data.topTags.map((tag: any, i: number) => {
                  const c = ['#FFFF00','#FF007F','#00FFFF','#00FF00','#FF8C00'][i % 5]
                  return (
                    <div key={tag.name} className="flex items-center gap-3 px-4 py-3 cursor-pointer"
                      style={{ background: 'rgba(0,0,0,0.7)', border: `2px dotted ${c}40`, transition: 'all 0.15s steps(2)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor=c; (e.currentTarget as HTMLElement).style.boxShadow=`0 0 15px ${c}60` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor=`${c}40`; (e.currentTarget as HTMLElement).style.boxShadow='none' }}
                    >
                      <div className="power-pellet" style={{ background: c, boxShadow: `0 0 8px ${c}` }} />
                      <div>
                        <p className="pixel-font" style={{ fontSize: '7px', color: c }}>{tag.name}</p>
                        <p className="pixel-font" style={{ fontSize: '5px', color: '#444' }}>{tag.count} REFS</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-4">
                <div className="text-5xl animate-float">👻</div>
                <div className="px-4 py-2" style={{ border: '2px dotted rgba(255,0,0,0.4)', background: 'rgba(255,0,0,0.05)' }}>
                  <p className="pixel-font" style={{ fontSize: '7px', color: '#FF0000' }}>&quot;NO TAGS HERE!&quot;</p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
