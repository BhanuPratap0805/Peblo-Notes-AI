'use client'

import { useEffect, useState } from 'react'
import { Search, Filter, Grid2X2, List as ListIcon, Plus, StickyNote, MoreVertical, Calendar, Tag, Sparkles, Trash2, Share2, Archive } from 'lucide-react'
import { formatDate, cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function NotesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notes, setNotes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showArchived, setShowArchived] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await fetch(`/api/notes?search=${encodeURIComponent(search)}&archived=${showArchived}`)
        const { data } = await res.json()
        if (data) setNotes(data)
        setLoading(false)
      } catch {
        setLoading(false)
      }
    }
    const timer = setTimeout(fetchNotes, 300)
    return () => clearTimeout(timer)
  }, [search, showArchived])

  const handleCreateNote = async () => {
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Note', content: '' })
      })
      const { data } = await res.json()
      if (data?.id) router.push(`/dashboard/notes/${data.id}`)
    } catch { /* noop */ }
  }

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await fetch(`/api/notes/${id}`, { method: 'DELETE' })
        setNotes(notes.filter((n) => n.id !== id))
      } catch { /* noop */ }
    }
  }

  const handleShare = async (e: React.MouseEvent, id: string) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/notes/${id}/share`, { method: 'POST' })
      const { data } = await res.json()
      if (data?.shareId) {
        const url = `${window.location.origin}/shared/${data.shareId}`
        await navigator.clipboard.writeText(url)
        alert('Share link copied to clipboard!')
      }
    } catch { /* noop */ }
  }

  const isLight = mounted && (theme === 'light' || resolvedTheme === 'light')
  
  if (!mounted) return null;

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     LIGHT MODE â€” DOODLE WORKSHOP
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  if (isLight) {
    const highlightColors = ['#FFD166', '#EF476F', '#118AB2', '#06D6A0', '#FF6B6B']

    return (
      <div className="space-y-8 pb-20">
        {/* HEADER */}
        <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#718096', marginBottom: '6px', letterSpacing: '0.05em' }}>
              ðŸ“ Notes / My Repository
            </p>
            <h1 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '40px', color: '#2D3748', lineHeight: 1.1, transform: 'rotate(-0.5deg)', display: 'inline-block' }}>
              My <span style={{ color: '#118AB2', WebkitTextStroke: '1.5px #2D3748' }}>Notes</span>
            </h1>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: '#718096', marginTop: '8px', fontStyle: 'italic' }}>
              Manage and organize your intellectual capital.
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* View Toggle */}
            <div style={{ display: 'flex', background: '#F7FAFC', border: '2px solid #2D3748', borderRadius: '4px 10px 8px 10px / 10px 4px 10px 8px', padding: '4px', gap: '4px', boxShadow: '3px 3px 0 #2D3748' }}>
              <button onClick={() => setView('grid')}
                style={{ padding: '8px', background: view === 'grid' ? '#FFD166' : 'transparent', border: view === 'grid' ? '2px solid #2D3748' : '2px solid transparent', borderRadius: '4px 8px 6px 8px / 8px 4px 8px 6px', cursor: 'pointer', transition: 'all 0.12s', color: '#2D3748' }}>
                <Grid2X2 size={16} />
              </button>
              <button onClick={() => setView('list')}
                style={{ padding: '8px', background: view === 'list' ? '#FFD166' : 'transparent', border: view === 'list' ? '2px solid #2D3748' : '2px solid transparent', borderRadius: '4px 8px 6px 8px / 8px 4px 8px 6px', cursor: 'pointer', transition: 'all 0.12s', color: '#2D3748' }}>
                <ListIcon size={16} />
              </button>
            </div>
            {/* Create Button */}
            <button onClick={handleCreateNote}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontFamily: "'Permanent Marker', cursive", fontSize: '16px', color: '#2D3748', background: '#FFD166', border: '2.5px solid #2D3748', borderRadius: '4px 14px 10px 14px / 14px 4px 14px 10px', boxShadow: '4px 4px 0 #2D3748', cursor: 'pointer', transition: 'transform 0.1s, box-shadow 0.1s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0 #2D3748' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = '4px 4px 0 #2D3748' }}
            >
              <Plus size={18} /> Create New
            </button>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#A0AEC0' }} />
            <input
              type="text"
              placeholder="Search within titles, content, or #tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingTop: '12px', paddingRight: '16px', paddingBottom: '12px', paddingLeft: '40px', fontFamily: "'DM Sans', sans-serif", fontSize: '14px', background: 'white', color: '#2D3748', border: '2px solid #2D3748', borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', boxShadow: '3px 3px 0 #CBD5E0', outline: 'none' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowArchived(!showArchived)} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', paddingRight: '20px', paddingBottom: '12px', paddingLeft: '20px', fontFamily: "'Kalam', cursive", fontSize: '15px', color: showArchived ? '#FFF' : '#2D3748', background: showArchived ? '#2D3748' : 'white', border: '2px solid #2D3748', borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', boxShadow: '3px 3px 0 #2D3748', cursor: 'pointer', fontWeight: 700 }}>
              <Archive size={16} /> {showArchived ? 'Archived' : 'Active'}
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '12px', paddingRight: '20px', paddingBottom: '12px', paddingLeft: '20px', fontFamily: "'Kalam', cursive", fontSize: '15px', color: '#2D3748', background: 'white', border: '2px solid #2D3748', borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', boxShadow: '3px 3px 0 #2D3748', cursor: 'pointer', fontWeight: 700 }}>
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* NOTES GRID / LIST */}
        {loading ? (
          <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ height: '220px', background: '#F7FAFC', border: '2px solid #E2E8F0', borderRadius: '8px', boxShadow: '4px 4px 0 #E2E8F0', animation: 'pulse 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <>
            {view === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note, idx) => {
                  const accent = highlightColors[idx % highlightColors.length]
                  return (
                    <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                      className="group"
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '240px', background: 'white', border: '2.5px solid #2D3748', borderRadius: '4px 16px 12px 16px / 16px 4px 16px 12px', boxShadow: `5px 5px 0 ${accent}`, textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'transform 0.12s, box-shadow 0.12s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-3px,-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `8px 8px 0 ${accent}` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${accent}` }}
                    >
                      {/* Hover Actions */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10">
                        <button onClick={(e) => handleArchiveToggle(e, note.id, note.isArchived)} style={{ padding: '6px', background: note.isArchived ? '#FFF0F3' : '#FEF3C7', border: note.isArchived ? '1.5px solid #EF476F' : '1.5px solid #F59E0B', borderRadius: '8px', color: note.isArchived ? '#EF476F' : '#F59E0B', cursor: 'pointer', boxShadow: note.isArchived ? '2px 2px 0 #EF476F' : '2px 2px 0 #F59E0B' }} title={note.isArchived ? "Unarchive" : "Archive"}><Archive size={14} /></button>
                        <button onClick={(e) => handleShare(e, note.id)} style={{ padding: '6px', background: '#F7FAFC', border: '1.5px solid #2D3748', borderRadius: '8px', color: '#2D3748', cursor: 'pointer', boxShadow: '2px 2px 0 #2D3748' }}><Share2 size={14} /></button>
                        <button onClick={(e) => handleDelete(e, note.id)} style={{ padding: '6px', background: '#FFF0F3', border: '1.5px solid #EF476F', borderRadius: '8px', color: '#EF476F', cursor: 'pointer', boxShadow: '2px 2px 0 #EF476F' }}><Trash2 size={14} /></button>
                      </div>
                      {/* Tape strip */}
                      <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', width: '48px', height: '18px', background: 'rgba(255,209,102,0.55)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: '2px' }} />
                      {/* Top row */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div style={{ width: '36px', height: '36px', background: '#F7FAFC', border: '2px solid #E2E8F0', borderRadius: '4px 8px 6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <StickyNote size={18} color="#718096" />
                          </div>
                          {note.aiUsageCount > 0 && (
                            <span style={{ fontFamily: "'Kalam', cursive", fontSize: '11px', color: '#EF476F', background: '#FFF0F3', border: '1.5px solid #EF476F', borderRadius: '4px 10px 8px 10px', paddingTop: '2px', paddingRight: '8px', paddingBottom: '2px', paddingLeft: '8px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                              <Sparkles size={10} /> AI Enhanced
                            </span>
                          )}
                        </div>
                        <h3 style={{ fontFamily: "'Kalam', cursive", fontSize: '18px', color: '#2D3748', fontWeight: 700, marginBottom: '8px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                          {note.title || 'Untitled Note'}
                        </h3>
                        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '13px', color: '#718096', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {note.content || 'Click to begin writing...'}
                        </p>
                      </div>
                      {/* Footer */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '2px dashed #E2E8F0', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}>
                          <Calendar size={12} /> {formatDate(note.updatedAt)}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {note.tags.slice(0, 2).map((tag: string) => (
                            <span key={tag} style={{ fontFamily: "'Kalam', cursive", fontSize: '11px', color: accent, background: 'white', border: `1.5px solid ${accent}`, borderRadius: '4px 8px 6px 8px', paddingTop: '2px', paddingRight: '6px', paddingBottom: '2px', paddingLeft: '6px', fontWeight: 700 }}>#{tag}</span>
                          ))}
                          {note.tags.length > 2 && <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#A0AEC0' }}>+{note.tags.length - 2}</span>}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notes.map((note, idx) => {
                  const accent = highlightColors[idx % highlightColors.length]
                  return (
                    <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                      className="group"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', border: '2.5px solid #2D3748', borderRadius: '4px 10px 8px 10px / 10px 4px 10px 8px', boxShadow: `4px 4px 0 ${accent}`, textDecoration: 'none', transition: 'transform 0.12s, box-shadow 0.12s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `6px 6px 0 ${accent}` }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = `4px 4px 0 ${accent}` }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#F7FAFC', border: '2px solid #E2E8F0', borderRadius: '4px 8px 6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <StickyNote size={18} color="#718096" />
                        </div>
                        <div>
                          <h3 style={{ fontFamily: "'Kalam', cursive", fontSize: '16px', color: '#2D3748', fontWeight: 700 }}>{note.title || 'Untitled Note'}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}><Calendar size={11} /> {formatDate(note.updatedAt)}</span>
                            {note.tags.length > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: "'DM Sans', sans-serif", fontSize: '11px', color: '#A0AEC0', fontWeight: 600 }}><Tag size={11} /> {note.tags.length} tags</span>}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 mr-2">
                          <button onClick={(e) => handleArchiveToggle(e, note.id, note.isArchived)} style={{ padding: '4px', background: note.isArchived ? '#FFF0F3' : '#FEF3C7', border: note.isArchived ? '1.5px solid #EF476F' : '1.5px solid #F59E0B', borderRadius: '6px', color: note.isArchived ? '#EF476F' : '#F59E0B', cursor: 'pointer' }} title={note.isArchived ? "Unarchive" : "Archive"}><Archive size={14} /></button>
                          <button onClick={(e) => handleShare(e, note.id)} style={{ padding: '4px', background: '#F7FAFC', border: '1.5px solid #2D3748', borderRadius: '6px', color: '#2D3748', cursor: 'pointer' }}><Share2 size={14} /></button>
                          <button onClick={(e) => handleDelete(e, note.id)} style={{ padding: '4px', background: '#FFF0F3', border: '1.5px solid #EF476F', borderRadius: '6px', color: '#EF476F', cursor: 'pointer' }}><Trash2 size={14} /></button>
                        </div>
                        {note.aiUsageCount > 0 && <Sparkles size={14} color="#EF476F" />}
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            {notes.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px 40px', background: 'white', border: '2.5px dashed #CBD5E0', borderRadius: '16px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>ðŸ“­</div>
                <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '26px', color: '#2D3748', marginBottom: '8px' }}>Nothing here yet!</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', color: '#A0AEC0' }}>
                  {search ? 'No notes match your search.' : 'Create your first note to get started.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     DARK MODE â€” ARCADE
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  const arcadeColors = [
    { border: 'rgba(0,0,255,0.5)', glow: 'rgba(0,0,255,0.25)', badge: '#0000FF', bg: 'rgba(0,0,40,0.85)' },
    { border: 'rgba(255,0,127,0.5)', glow: 'rgba(255,0,127,0.25)', badge: '#FF007F', bg: 'rgba(40,0,20,0.85)' },
    { border: 'rgba(0,255,255,0.4)', glow: 'rgba(0,255,255,0.2)', badge: '#00FFFF', bg: 'rgba(0,20,30,0.85)' },
    { border: 'rgba(0,255,0,0.4)', glow: 'rgba(0,255,0,0.2)', badge: '#00FF00', bg: 'rgba(0,25,0,0.85)' },
    { border: 'rgba(255,255,0,0.4)', glow: 'rgba(255,255,0,0.2)', badge: '#FFFF00', bg: 'rgba(25,25,0,0.85)' },
    { border: 'rgba(255,140,0,0.4)', glow: 'rgba(255,140,0,0.2)', badge: '#FF8C00', bg: 'rgba(30,15,0,0.85)' },
  ]

  return (
    <div className="space-y-10 pb-20 animate-fade-in">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <p className="pixel-font mb-2" style={{ fontSize: '7px', color: '#00FFFF', letterSpacing: '0.2em' }}>â–¶ FILE SYSTEM / KNOWLEDGE BASE</p>
          <h1 className="pixel-font mb-3" style={{ fontSize: '20px', lineHeight: 1.8 }}>
            <span style={{ color: '#FFFFFF' }}>MY </span>
            <span style={{ color: '#FFFF00', textShadow: '0 0 15px #FFFF00, 0 0 30px #FFFF00' }}>REPOSITORY</span>
          </h1>
          <p className="mono-font" style={{ fontSize: '12px', color: '#555', borderLeft: '3px solid #FFFF00', paddingLeft: '12px' }}>
            &gt; Manage and organize your intellectual capital.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowArchived(!showArchived)} className="pixel-font" style={{ padding: '8px 12px', background: showArchived ? 'rgba(255,255,0,0.2)' : 'rgba(0,0,0,0.8)', border: '2px dotted rgba(255,255,0,0.5)', color: showArchived ? '#FFFF00' : '#888', cursor: 'pointer', fontSize: '10px' }}>
            📦 {showArchived ? 'ARCHIVED' : 'ACTIVE'}
          </button>
          {/* View Toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.8)', border: '2px dotted rgba(0,255,255,0.3)', padding: '4px', gap: '4px' }}>
            <button onClick={() => setView('grid')}
              style={{ padding: '8px 12px', background: view === 'grid' ? 'rgba(0,255,255,0.15)' : 'transparent', border: view === 'grid' ? '1px solid rgba(0,255,255,0.6)' : '1px solid transparent', cursor: 'pointer', color: view === 'grid' ? '#00FFFF' : '#444', transition: 'all 0.15s' }}>
              <Grid2X2 size={16} />
            </button>
            <button onClick={() => setView('list')}
              style={{ padding: '8px 12px', background: view === 'list' ? 'rgba(0,255,255,0.15)' : 'transparent', border: view === 'list' ? '1px solid rgba(0,255,255,0.6)' : '1px solid transparent', cursor: 'pointer', color: view === 'list' ? '#00FFFF' : '#444', transition: 'all 0.15s' }}>
              <ListIcon size={16} />
            </button>
          </div>
          {/* Create Button */}
          <button onClick={handleCreateNote} className="btn-arcade" style={{ fontSize: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>ðŸª™</span><span>NEW FILE</span>
          </button>
        </div>
      </header>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#00FFFF' }} />
          <input type="text" placeholder="SEARCH FILES..." value={search} onChange={e => setSearch(e.target.value)}
            className="pixel-font w-full"
            style={{ paddingTop: '12px', paddingRight: '16px', paddingBottom: '12px', paddingLeft: '40px', fontSize: '7px', background: 'rgba(0,0,0,0.8)', color: '#00FFFF', border: '2px dotted rgba(0,255,255,0.35)', outline: 'none', letterSpacing: '0.08em' }}
          />
        </div>
        <button className="pixel-font flex items-center gap-2 px-4"
          style={{ fontSize: '7px', color: '#FFFF00', background: 'transparent', border: '2px dotted rgba(255,255,0,0.35)', cursor: 'pointer' }}>
          <Filter size={12} /><span>FILTERS</span>
        </button>
      </div>

      {/* NOTES */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} style={{ height: '220px', background: 'rgba(0,0,20,0.6)', border: '2px dotted rgba(0,255,255,0.15)', animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note, idx) => {
                const ac = arcadeColors[idx % arcadeColors.length]
                return (
                  <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                    className="group"
                    style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', height: '240px', background: ac.bg, border: `2px dotted ${ac.border}`, boxShadow: `0 0 20px ${ac.glow}`, textDecoration: 'none', position: 'relative', overflow: 'hidden', transition: 'all 0.15s steps(2)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${ac.glow}` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${ac.glow}` }}
                  >
                    {/* Hover Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 z-10">
                      <button onClick={(e) => handleArchiveToggle(e, note.id, note.isArchived)} style={{ padding: '4px', background: note.isArchived ? '#FF0000' : 'rgba(255,255,0,0.2)', border: note.isArchived ? '1px dotted #FF0000' : '1px dotted #FFFF00', color: note.isArchived ? '#FFF' : '#FFFF00', cursor: 'pointer' }} title={note.isArchived ? "Unarchive" : "Archive"}><Archive size={12} /></button>
                      <button onClick={(e) => handleShare(e, note.id)} style={{ padding: '4px', background: '#0000FF', border: '1px dotted #00FFFF', color: '#FFF', cursor: 'pointer' }}><Share2 size={12} /></button>
                      <button onClick={(e) => handleDelete(e, note.id)} style={{ padding: '4px', background: '#FF007F', border: '1px dotted #FF007F', color: '#FFF', cursor: 'pointer' }}><Trash2 size={12} /></button>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div style={{ width: '32px', height: '32px', background: `${ac.glow}`, border: `1px dotted ${ac.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <StickyNote size={16} color={ac.badge} />
                        </div>
                        {note.aiUsageCount > 0 && (
                          <span className="pixel-font retro-badge" style={{ fontSize: '5px', color: '#FF007F', borderColor: '#FF007F', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Sparkles size={8} /> AI POWER
                          </span>
                        )}
                      </div>
                      <h3 className="mono-font font-bold mb-2 line-clamp-1" style={{ fontSize: '14px', color: '#fff', letterSpacing: '0.02em' }}>
                        {note.title || 'Untitled Note'}
                      </h3>
                      <p className="mono-font line-clamp-2" style={{ fontSize: '11px', color: '#444', lineHeight: 1.6 }}>
                        {note.content || 'Click to begin writing...'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: `1px dotted ${ac.border}` }}>
                      <span className="pixel-font flex items-center gap-2" style={{ fontSize: '5px', color: '#444' }}>
                        <Calendar size={10} color="#444" /> {formatDate(note.updatedAt)}
                      </span>
                      <div className="flex gap-2">
                        {note.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="pixel-font" style={{ fontSize: '5px', color: ac.badge, border: `1px dotted ${ac.border}`, paddingTop: '2px', paddingRight: '6px', paddingBottom: '2px', paddingLeft: '6px' }}>#{tag}</span>
                        ))}
                        {note.tags.length > 2 && <span className="pixel-font" style={{ fontSize: '5px', color: '#444' }}>+{note.tags.length - 2}</span>}
                      </div>
                    </div>
                    {/* Scanline overlay */}
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.08) 2px,rgba(0,0,0,0.08) 4px)', pointerEvents: 'none' }} />
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note, idx) => {
                const ac = arcadeColors[idx % arcadeColors.length]
                return (
                  <Link key={note.id} href={`/dashboard/notes/${note.id}`}
                    className="flex items-center justify-between p-5 group"
                    style={{ background: ac.bg, border: `2px dotted ${ac.border}`, textDecoration: 'none', transition: 'all 0.15s steps(2)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${ac.glow}` }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
                  >
                    <div className="flex items-center gap-4">
                      <span className="pixel-font" style={{ fontSize: '8px', color: ac.badge, textShadow: `0 0 8px ${ac.badge}`, minWidth: '24px' }}>{String(idx+1).padStart(2,'0')}.</span>
                      <div style={{ width: '32px', height: '32px', background: `${ac.glow}`, border: `1px dotted ${ac.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <StickyNote size={14} color={ac.badge} />
                      </div>
                      <div>
                        <p className="mono-font font-bold" style={{ fontSize: '14px', color: '#fff' }}>{note.title || 'Untitled Note'}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="pixel-font flex items-center gap-1" style={{ fontSize: '5px', color: '#444' }}><Calendar size={9} color="#444" /> {formatDate(note.updatedAt)}</span>
                          {note.tags.length > 0 && <span className="pixel-font flex items-center gap-1" style={{ fontSize: '5px', color: '#444' }}><Tag size={9} color="#444" /> {note.tags.length} TAGS</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 z-10">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2 mr-2">
                        <button onClick={(e) => handleArchiveToggle(e, note.id, note.isArchived)} style={{ padding: '2px', background: note.isArchived ? '#FF0000' : 'rgba(255,255,0,0.2)', border: note.isArchived ? '1px dotted #FF0000' : '1px dotted #FFFF00', color: note.isArchived ? '#FFF' : '#FFFF00', cursor: 'pointer' }} title={note.isArchived ? "Unarchive" : "Archive"}><Archive size={12} /></button>
                        <button onClick={(e) => handleShare(e, note.id)} style={{ padding: '2px', background: '#0000FF', border: '1px dotted #00FFFF', color: '#FFF', cursor: 'pointer' }}><Share2 size={12} /></button>
                        <button onClick={(e) => handleDelete(e, note.id)} style={{ padding: '2px', background: '#FF007F', border: '1px dotted #FF007F', color: '#FFF', cursor: 'pointer' }}><Trash2 size={12} /></button>
                      </div>
                      {note.aiUsageCount > 0 && <Sparkles size={14} color="#FF007F" />}
                      <span style={{ color: ac.badge, fontSize: '14px', textShadow: `0 0 8px ${ac.badge}` }}>▶</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          {notes.length === 0 && (
            <div className="text-center py-40" style={{ border: '2px dotted rgba(0,255,255,0.15)', background: 'rgba(0,0,0,0.6)' }}>
              <div className="text-4xl mb-4 animate-float">ðŸ‘»</div>
              <p className="pixel-font mb-2" style={{ fontSize: '10px', color: '#00FFFF', textShadow: '0 0 10px #00FFFF' }}>NO FILES FOUND</p>
              <p className="mono-font" style={{ fontSize: '12px', color: '#333' }}>
                {search ? '> No matches. Try a different query.' : '> INSERT COIN TO CREATE YOUR FIRST NOTE.'}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
