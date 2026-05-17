'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { cn, debounce } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { Sparkles, Save, Share2, Trash2, ArrowLeft, Plus, X, Copy, Tag as TagIcon, Check, Archive } from 'lucide-react'

export default function NoteEditorPage() {
  const { id } = useParams()
  const router = useRouter()
  const { theme, resolvedTheme } = useTheme()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [isAiSidebarOpen, setIsAiSidebarOpen] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResult, setAiResult] = useState('')
  const [newTag, setNewTag] = useState('')
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    fetch(`/api/notes/${id}`)
      .then(res => res.json())
      .then(res => { if (res.data) setNote(res.data); setLoading(false) })
      .catch(() => router.push('/dashboard/notes'))
  }, [id, router])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const debouncedSave = useCallback(
    debounce(async (updatedFields: any) => {
      setSaving(true)
      try {
        await fetch(`/api/notes/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFields)
        })
        setLastSaved(new Date())
      } finally {
        setSaving(false)
      }
    }, 1200),
    [id]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdate = (updates: any) => {
    const newNote = { ...note, ...updates }
    setNote(newNote)
    debouncedSave(updates)
  }

  const generateAI = async (type: 'summary' | 'actions' | 'title') => {
    setAiLoading(true)
    setAiResult('')
    setIsAiSidebarOpen(true)
    setCopied(false)
    try {
      const res = await fetch(`/api/notes/${id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => null)
        setAiResult(`⚠ ${errBody?.error || `Error (${res.status})`}`)
        setAiLoading(false)
        return
      }
      const reader = res.body?.getReader()
      if (!reader) return
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setAiResult(prev => prev + decoder.decode(value))
      }
    } catch (err) {
      console.error(err)
      setAiResult('⚠ Network error. Check your connection.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const currentTags = note.tags || []
      if (!currentTags.includes(newTag.trim())) {
        handleUpdate({ tags: [...currentTags, newTag.trim()] })
      }
      setNewTag('')
    }
  }

  const handleShare = async () => {
    try {
      if (note.isPublic) {
        await fetch(`/api/notes/${id}/share`, { method: 'DELETE' })
        handleUpdate({ isPublic: false, shareId: null })
      } else {
        const res = await fetch(`/api/notes/${id}/share`, { method: 'POST' })
        const { data } = await res.json()
        if (data?.shareId) handleUpdate({ isPublic: true, shareId: data.shareId })
      }
    } catch (err) { console.error(err) }
  }

  const handleArchive = async () => {
    try {
      const newArchivedState = !note.isArchived
      await fetch(`/api/notes/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: newArchivedState })
      })
      setNote({ ...note, isArchived: newArchivedState })
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      await fetch(`/api/notes/${id}`, { method: 'DELETE' })
      router.push('/dashboard/notes')
    }
  }

  const isLight = mounted && (theme === 'light' || resolvedTheme === 'light')

  if (!mounted) return null;

  if (loading) {
    return isLight ? (
      <div className="flex flex-col items-center justify-center h-64 gap-6">
        <div style={{ fontSize: '48px' }}>📝</div>
        <p style={{ fontFamily: "'Kalam', cursive", fontSize: '20px', color: '#2D3748' }}>Opening notebook...</p>
        <div className="doodle-loader" />
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-96 gap-6">
        <div className="pixel-font animate-blink" style={{ fontSize: '14px', color: '#FFFF00', textShadow: '0 0 15px #FFFF00' }}>
          ◖◗ LOADING NOTE...
        </div>
      </div>
    )
  }

  if (!note) return null

  /* ══════════════════════════════════════════
     LIGHT MODE — DOODLE WORKSHOP
  ══════════════════════════════════════════ */
  if (isLight) {
    return (
      <div className="flex h-[calc(100vh-6rem)] gap-6 overflow-hidden pb-6">
        {/* MAIN EDITOR */}
        <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
          
          {/* TOOLBAR */}
          <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'space-between', padding: '16px 20px', background: 'white', border: '2.5px solid #2D3748', borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', boxShadow: '4px 4px 0 #2D3748', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/dashboard/notes"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Kalam', cursive", fontSize: '15px', color: '#718096', textDecoration: 'none', transition: 'color 0.1s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#2D3748'}
                onMouseLeave={e => e.currentTarget.style.color = '#718096'}
              >
                <ArrowLeft size={18} /> Back
              </Link>
              <div style={{ width: '2px', height: '24px', background: '#E2E8F0', transform: 'rotate(10deg)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Kalam', cursive", fontSize: '14px', color: saving ? '#EF476F' : '#06D6A0', fontWeight: 600 }}>
                {saving ? <><Save size={14} className="animate-pulse" /> Saving sketch...</> : <><Check size={14} /> Saved {lastSaved && lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</>}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={handleShare}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Kalam', cursive", fontSize: '14px', color: note.isPublic ? '#2D3748' : '#718096', background: note.isPublic ? '#06D6A0' : 'transparent', border: '2px solid', borderColor: note.isPublic ? '#2D3748' : '#E2E8F0', borderRadius: '4px 8px 6px 8px', padding: '6px 12px', cursor: 'pointer', fontWeight: 700, boxShadow: note.isPublic ? '2px 2px 0 #2D3748' : 'none' }}
              >
                <Share2 size={14} /> {note.isPublic ? 'Public' : 'Share'}
              </button>
              <button onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Permanent Marker', cursive", fontSize: '13px', color: '#2D3748', background: isAiSidebarOpen ? '#FFD166' : '#FFF0F3', border: '2.5px solid #2D3748', borderRadius: '4px 8px 6px 8px', padding: '6px 12px', cursor: 'pointer', boxShadow: isAiSidebarOpen ? 'none' : '3px 3px 0 #2D3748', transform: isAiSidebarOpen ? 'translate(3px, 3px)' : 'none', transition: 'all 0.1s' }}
              >
                <Sparkles size={14} /> AI Intel
              </button>
              <button onClick={handleArchive}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: note.isArchived ? '#FFF0F3' : 'transparent', border: '2px solid transparent', color: note.isArchived ? '#EF476F' : '#F59E0B', cursor: 'pointer', borderRadius: '4px 8px 6px 8px', transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FEF3C7'; e.currentTarget.style.borderColor = '#F59E0B' }}
                onMouseLeave={e => { e.currentTarget.style.background = note.isArchived ? '#FEF3C7' : 'transparent'; e.currentTarget.style.borderColor = note.isArchived ? '#F59E0B' : 'transparent' }}
                title={note.isArchived ? "Unarchive" : "Archive"}
              >
                <Archive size={16} />
              </button>
              <button onClick={handleDelete}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', background: 'transparent', border: '2px solid transparent', color: '#EF476F', cursor: 'pointer', borderRadius: '4px 8px 6px 8px', transition: 'background 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF0F3'; e.currentTarget.style.borderColor = '#EF476F' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'transparent' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {/* EDITOR AREA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#FFFEF7', border: '2.5px solid #2D3748', borderRadius: '4px 16px 12px 16px / 16px 4px 16px 12px', boxShadow: '5px 5px 0 #2D3748', padding: '40px', overflowY: 'auto' }}>
            <input
              type="text"
              placeholder="Title your masterpiece..."
              value={note.title}
              onChange={e => handleUpdate({ title: e.target.value })}
              style={{ width: '100%', border: 'none', background: 'transparent', fontFamily: "'Permanent Marker', cursive", fontSize: '36px', color: '#2D3748', outline: 'none', marginBottom: '24px' }}
            />

            {/* Tags area */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
              {note.tags?.map((tag: string) => (
                <span key={tag} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#118AB2', background: '#EBF8FF', border: '2px solid #118AB2', borderRadius: '4px 10px 8px 10px', padding: '2px 10px', fontWeight: 700 }}>
                  <TagIcon size={12} /> {tag}
                  <button onClick={() => handleUpdate({ tags: note.tags.filter((t: string) => t !== tag) })} style={{ background: 'none', border: 'none', color: '#EF476F', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={12} /></button>
                </span>
              ))}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Plus size={12} style={{ position: 'absolute', left: '8px', color: '#A0AEC0' }} />
                <input
                  type="text"
                  placeholder="add tag..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  style={{ width: '120px', padding: '4px 8px 4px 24px', fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#2D3748', background: 'transparent', border: '2px dashed #CBD5E0', borderRadius: '4px 10px 8px 10px', outline: 'none' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#118AB2'}
                  onBlur={e => e.currentTarget.style.borderColor = '#CBD5E0'}
                />
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '3px', width: '100px', background: '#FFD166', borderRadius: '2px', marginBottom: '32px', transform: 'rotate(-1deg)' }} />

            {/* Editor */}
            <textarea
              placeholder="Start sketching your thoughts..."
              value={note.content}
              onChange={e => handleUpdate({ content: e.target.value })}
              style={{ flex: 1, width: '100%', minHeight: '400px', border: 'none', background: 'transparent', fontFamily: "'Kalam', cursive", fontSize: '20px', lineHeight: 1.6, color: '#2D3748', resize: 'none', outline: 'none' }}
            />
          </div>
        </div>

        {/* AI COPILOT SIDEBAR */}
        {isAiSidebarOpen && (
          <aside style={{ width: '340px', display: 'flex', flexDirection: 'column', background: 'white', border: '2.5px solid #2D3748', borderRadius: '4px 16px 12px 16px / 16px 4px 16px 12px', boxShadow: '5px 5px 0 #2D3748', padding: '24px', overflowY: 'auto', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>🧠</span>
                <h3 style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '20px', color: '#2D3748' }}>AI Co-Pilot</h3>
              </div>
              <button onClick={() => setIsAiSidebarOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0AEC0' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
              {[
                { type: 'summary' as const, icon: '📋', label: 'Summarize', color: '#118AB2', bg: '#EBF8FF' },
                { type: 'actions' as const, icon: '☑️', label: 'Extract Actions', color: '#06D6A0', bg: '#F0FFF4' },
                { type: 'title' as const, icon: '✨', label: 'Suggest Title', color: '#EF476F', bg: '#FFF0F3' },
              ].map(action => (
                <button key={action.type} onClick={() => generateAI(action.type)}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: action.bg, border: `2.5px solid ${action.color}`, borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', cursor: 'pointer', fontFamily: "'Kalam', cursive", fontSize: '16px', color: '#2D3748', fontWeight: 700, boxShadow: `3px 3px 0 ${action.color}`, transition: 'transform 0.1s, box-shadow 0.1s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(-2px,-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `5px 5px 0 ${action.color}` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translate(0,0)'; (e.currentTarget as HTMLElement).style.boxShadow = `3px 3px 0 ${action.color}` }}
                >
                  <span style={{ fontSize: '18px' }}>{action.icon}</span> {action.label}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontFamily: "'Kalam', cursive", fontSize: '15px', color: '#718096', fontWeight: 700 }}>Results</h4>
                {aiLoading && <div className="doodle-loader" style={{ width: '20px', height: '20px', margin: 0 }} />}
              </div>
              <div style={{ flex: 1, background: '#F7FAFC', border: '2.5px solid #2D3748', borderRadius: '4px 12px 8px 12px / 12px 4px 12px 8px', padding: '16px', position: 'relative' }}>
                {/* Tape strip */}
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '40px', height: '20px', background: 'rgba(255,209,102,0.6)', border: '1px solid rgba(0,0,0,0.15)', borderRadius: '2px' }} />
                
                {aiResult ? (
                  <>
                    <p style={{ fontFamily: "'Kalam', cursive", fontSize: '16px', lineHeight: 1.5, color: '#2D3748', whiteSpace: 'pre-wrap' }}>{aiResult}</p>
                    {!aiLoading && (
                      <button onClick={() => { navigator.clipboard.writeText(aiResult); setCopied(true) }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '6px 12px', background: 'white', border: '2px solid #2D3748', borderRadius: '4px 8px 6px 8px', fontFamily: "'Kalam', cursive", fontSize: '13px', color: '#2D3748', cursor: 'pointer', fontWeight: 700 }}
                      >
                        {copied ? <Check size={14} color="#06D6A0" /> : <Copy size={14} />} {copied ? 'Copied!' : 'Copy Text'}
                      </button>
                    )}
                  </>
                ) : (
                  <p style={{ fontFamily: "'Kalam', cursive", fontSize: '15px', color: '#A0AEC0', textAlign: 'center', marginTop: '40px' }}>
                    Select an action above to see AI magic here.
                  </p>
                )}
              </div>
            </div>
          </aside>
        )}

        {/* SHARE BANNER */}
        {note.isPublic && (
          <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '20px', background: '#06D6A0', border: '2.5px solid #2D3748', borderRadius: '4px 12px 8px 12px', padding: '16px 24px', boxShadow: '5px 5px 0 #2D3748', zIndex: 100, animation: 'fade-in 0.3s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Permanent Marker', cursive", fontSize: '16px', color: '#2D3748' }}>
              <Share2 size={18} /> Shared Publicly
            </div>
            <code style={{ background: 'white', border: '2px solid #2D3748', borderRadius: '4px 6px 4px 6px', padding: '4px 12px', fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#2D3748', fontWeight: 600 }}>
              {`${window.location.origin}/shared/${note.shareId}`}
            </code>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/shared/${note.shareId}`); alert('Link copied!') }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', border: '2px solid #2D3748', borderRadius: '4px 8px 6px 8px', padding: '6px 12px', fontFamily: "'Kalam', cursive", fontSize: '14px', color: '#2D3748', cursor: 'pointer', fontWeight: 700, boxShadow: '2px 2px 0 #2D3748' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '3px 3px 0 #2D3748' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translate(0,0)'; e.currentTarget.style.boxShadow = '2px 2px 0 #2D3748' }}
            >
              <Copy size={14} /> Copy
            </button>
          </div>
        )}
      </div>
    )
  }

  /* ══════════════════════════════════════════
     DARK MODE — ARCADE
  ══════════════════════════════════════════ */
  return (
    <div className="flex h-[calc(100vh-6rem)] gap-4 animate-fade-in overflow-hidden">
      {/* MAIN EDITOR */}
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
        {/* TOOLBAR */}
        <div className="flex items-center justify-between mb-6 px-4 py-3" style={{ background: 'rgba(0,0,20,0.9)', border: '2px dotted rgba(0,255,255,0.25)' }}>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/notes" className="pixel-font flex items-center gap-2" style={{ fontSize: '8px', color: '#00FFFF', textShadow: '0 0 8px #00FFFF', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.color = '#FFFFFF'} onMouseLeave={e => e.currentTarget.style.color = '#00FFFF'}>
              ◀ BACK
            </Link>
            <div className="pixel-font px-3 py-1.5 flex items-center gap-2" style={{ fontSize: '7px', color: saving ? '#FFFF00' : '#00FF00', border: `1px dotted ${saving ? '#FFFF00' : '#00FF00'}`, background: saving ? 'rgba(255,255,0,0.05)' : 'rgba(0,255,0,0.05)', textShadow: saving ? '0 0 8px #FFFF00' : '0 0 8px #00FF00' }}>
              <span className={saving ? 'animate-blink' : ''}>{saving ? '⟳ SAVING...' : '✓ SAVED'}</span>
              {lastSaved && !saving && <span style={{ color: '#444' }}>{lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className="pixel-font px-4 py-2" style={{ fontSize: '7px', color: note.isPublic ? '#000' : '#00FFFF', background: note.isPublic ? '#00FFFF' : 'transparent', border: `2px dotted ${note.isPublic ? '#00FFFF' : 'rgba(0,255,255,0.4)'}`, cursor: 'pointer', boxShadow: note.isPublic ? '0 0 15px rgba(0,255,255,0.5)' : 'none' }} onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(0,255,255,0.4)' }} onMouseLeave={e => { if (!note.isPublic) e.currentTarget.style.boxShadow = 'none' }}>
              {note.isPublic ? '🌐 PUBLIC' : '🔒 PRIVATE'}
            </button>
            <button onClick={() => setIsAiSidebarOpen(!isAiSidebarOpen)} className="pixel-font px-4 py-2" style={{ fontSize: '7px', color: isAiSidebarOpen ? '#000' : '#FF007F', background: isAiSidebarOpen ? '#FF007F' : 'transparent', border: `2px dotted rgba(255,0,127,${isAiSidebarOpen ? '1' : '0.5'})`, cursor: 'pointer', boxShadow: isAiSidebarOpen ? '0 0 15px rgba(255,0,127,0.5)' : 'none', animation: 'pulse-pink 2s infinite' }}>
              ⚡ INTEL
            </button>
            <button onClick={handleArchive} className="pixel-font px-3 py-2" style={{ fontSize: '10px', color: note.isArchived ? '#FF0000' : '#FFFF00', border: note.isArchived ? '2px dotted rgba(255,255,0,1)' : '2px dotted rgba(255,255,0,0.4)', background: note.isArchived ? 'rgba(255,255,0,0.1)' : 'transparent', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,0,0.1)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255,255,0,0.3)' }} onMouseLeave={e => { e.currentTarget.style.background = note.isArchived ? 'rgba(255,255,0,0.1)' : 'transparent'; e.currentTarget.style.boxShadow = note.isArchived ? '0 0 15px rgba(255,255,0,0.3)' : 'none' }}>
              📦
            </button>
            <button onClick={handleDelete} className="pixel-font px-3 py-2" style={{ fontSize: '8px', color: '#FF0000', border: '2px dotted rgba(255,0,0,0.4)', background: 'transparent', cursor: 'pointer' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,0,0.1)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(255,0,0,0.3)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none' }}>
              💀
            </button>
          </div>
        </div>

        {/* EDITOR BODY */}
        <div className="flex-1 flex flex-col overflow-y-auto p-8 space-y-6" style={{ background: 'rgba(0,0,10,0.95)', border: '2px dotted rgba(0,255,255,0.2)' }}>
          <input type="text" placeholder="DOCUMENT TITLE..." className="bg-transparent border-none w-full focus:outline-none caret-yellow-400 pixel-font" style={{ fontSize: '22px', color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.3)', letterSpacing: '0.05em', lineHeight: '1.8' }} value={note.title} onChange={e => handleUpdate({ title: e.target.value })} />
          
          <div className="flex flex-wrap items-center gap-2">
            {note.tags?.map((tag: string) => (
              <span key={tag} className="flex items-center gap-2 px-3 py-1.5 pixel-font" style={{ fontSize: '7px', color: '#00FFFF', border: '1px dotted rgba(0,255,255,0.5)', background: 'rgba(0,255,255,0.05)' }}>
                #{tag}
                <button onClick={() => handleUpdate({ tags: note.tags.filter((t: string) => t !== tag) })} style={{ color: '#FF0000', background: 'none', border: 'none', cursor: 'pointer', padding: 0, lineHeight: 1 }}>✕</button>
              </span>
            ))}
            <div className="relative flex items-center">
              <span className="absolute left-2 mono-font" style={{ fontSize: '12px', color: '#00FFFF' }}>+</span>
              <input type="text" placeholder="add tag..." className="mono-font pl-6 pr-3 py-1.5 focus:outline-none" style={{ fontSize: '12px', width: '100px', background: 'rgba(0,255,255,0.03)', border: '1px dotted rgba(0,255,255,0.2)', color: '#00FFFF' }} value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={handleAddTag} onFocus={e => { e.currentTarget.style.width = '140px'; e.currentTarget.style.borderColor = 'rgba(0,255,255,0.6)' }} onBlur={e => { e.currentTarget.style.width = '100px'; e.currentTarget.style.borderColor = 'rgba(0,255,255,0.2)' }} />
            </div>
          </div>

          <div style={{ borderTop: '1px dotted rgba(0,255,255,0.15)' }} />

          <textarea placeholder="> Begin writing your note..." className="bg-transparent border-none w-full flex-1 resize-none focus:outline-none mono-font caret-yellow-400" style={{ fontSize: '15px', lineHeight: '1.9', color: '#cccccc', minHeight: '300px' }} value={note.content} onChange={e => handleUpdate({ content: e.target.value })} />
        </div>
      </div>

      {/* AI COPILOT SIDEBAR */}
      <aside className={cn('flex flex-col overflow-y-auto transition-all duration-300 shrink-0', isAiSidebarOpen ? 'w-[340px] opacity-100' : 'w-0 opacity-0 pointer-events-none overflow-hidden')} style={{ background: 'rgba(0,0,20,0.98)', border: isAiSidebarOpen ? '2px dotted rgba(255,0,127,0.5)' : 'none', boxShadow: '0 0 40px rgba(255,0,127,0.15), inset 0 0 40px rgba(0,0,0,0.5)' }}>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="pixel-font" style={{ fontSize: '12px', color: '#FF007F', textShadow: '0 0 10px #FF007F' }}>⚡ COPILOT</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="power-pellet" style={{ background: '#00FF00' }} />
                <span className="pixel-font" style={{ fontSize: '6px', color: '#00FF00' }}>ACTIVE INTELLIGENCE</span>
              </div>
            </div>
            <button onClick={() => setIsAiSidebarOpen(false)} style={{ background: 'transparent', border: '1px dotted rgba(255,0,127,0.4)', color: '#FF007F', cursor: 'pointer', padding: '6px 10px', fontSize: '12px' }} onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,0,127,0.1)' }} onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}>✕</button>
          </div>
          <div style={{ borderTop: '1px dotted rgba(255,0,127,0.2)' }} />
          <div className="space-y-3">
            <p className="pixel-font" style={{ fontSize: '6px', color: '#888', letterSpacing: '0.15em' }}>— CONTEXTUAL ACTIONS —</p>
            {[
              { type: 'summary' as const, icon: '📄', label: 'SUMMARIZE', color: '#0000FF' },
              { type: 'actions' as const, icon: '☑️', label: 'ACTION ITEMS', color: '#FF007F' },
              { type: 'title' as const, icon: '🔤', label: 'SUGGEST TITLE', color: '#00FF00' },
            ].map(action => (
              <button key={action.type} onClick={() => generateAI(action.type)} className="w-full flex items-center justify-between p-4" style={{ background: 'rgba(0,0,0,0.6)', border: `2px dotted ${action.color}40`, cursor: 'pointer', transition: 'all 0.15s steps(2)', color: '#fff' }} onMouseEnter={e => { e.currentTarget.style.borderColor = action.color; e.currentTarget.style.background = `${action.color}10`; e.currentTarget.style.boxShadow = `0 0 15px ${action.color}40` }} onMouseLeave={e => { e.currentTarget.style.borderColor = `${action.color}40`; e.currentTarget.style.background = 'rgba(0,0,0,0.6)'; e.currentTarget.style.boxShadow = 'none' }}>
                <div className="flex items-center gap-4">
                  <span className="text-xl">{action.icon}</span>
                  <span className="pixel-font" style={{ fontSize: '8px', color: action.color, textShadow: `0 0 8px ${action.color}` }}>{action.label}</span>
                </div>
                <span style={{ color: action.color, fontSize: '14px' }}>▶</span>
              </button>
            ))}
          </div>
          <div style={{ borderTop: '1px dotted rgba(255,0,127,0.15)' }} />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="pixel-font" style={{ fontSize: '6px', color: '#888', letterSpacing: '0.15em' }}>— INFERENCE OUTPUT —</p>
              {aiLoading && <span className="pixel-font animate-blink" style={{ fontSize: '6px', color: '#FF007F' }}>PROCESSING...</span>}
            </div>
            <div className="p-5 min-h-48 relative" style={{ background: '#000510', border: '1px dotted rgba(0,255,255,0.2)', minHeight: '200px' }}>
              {aiResult ? (
                <>
                  <p className="mono-font" style={{ fontSize: '13px', lineHeight: '1.8', color: '#ccc', whiteSpace: 'pre-wrap' }}>{aiResult}</p>
                  {!aiLoading && (
                    <button onClick={() => { navigator.clipboard.writeText(aiResult); setCopied(true); setTimeout(() => setCopied(false), 2000) }} className="mt-4 pixel-font px-3 py-2" style={{ fontSize: '6px', color: copied ? '#00FF00' : '#0000FF', border: `1px dotted ${copied ? '#00FF00' : 'rgba(0,0,255,0.5)'}`, background: copied ? 'rgba(0,255,0,0.05)' : 'rgba(0,0,255,0.05)', cursor: 'pointer' }}>
                      {copied ? '✓ COPIED!' : '📋 COPY'}
                    </button>
                  )}
                </>
              ) : (
                <p className="mono-font" style={{ fontSize: '12px', color: '#333' }}>
                  &gt; Select an action above to generate output...<span className="animate-blink">_</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* SHARE BANNER */}
      {note.isPublic && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-8 py-4 animate-fade-in" style={{ background: '#000', border: '2px dotted rgba(0,255,255,0.6)', boxShadow: '0 0 30px rgba(0,255,255,0.3)' }}>
          <div className="flex items-center gap-2">
            <div className="power-pellet" style={{ background: '#00FF00' }} />
            <span className="pixel-font" style={{ fontSize: '7px', color: '#00FF00' }}>BROADCAST ENABLED</span>
          </div>
          <code className="mono-font" style={{ fontSize: '11px', color: '#00FFFF' }}>{`${window.location.origin}/shared/${note.shareId}`}</code>
          <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/shared/${note.shareId}`); alert('Link copied!') }} className="pixel-font px-3 py-2" style={{ fontSize: '7px', color: '#000', background: '#00FFFF', border: 'none', cursor: 'pointer' }}>COPY</button>
        </div>
      )}
    </div>
  )
}
