'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { 
  Sparkles, 
  Calendar, 
  User,
  FileText,
  ListChecks,
  ExternalLink
} from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function SharedNotePage() {
  const { shareId } = useParams()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [note, setNote] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/shared/${shareId}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) setNote(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [shareId])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] gap-4">
      <Sparkles className="w-10 h-10 animate-spin text-indigo-500" />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Decrypting Shared Content</span>
    </div>
  )
  
  if (!note) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="glass p-16 text-center max-w-xl rounded-[3rem] border-red-500/10">
        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <ExternalLink className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-3xl font-black mb-4 text-white">Document Restricted</h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-8">
          This secure link has either expired, been revoked by the owner, or is no longer part of the public repository.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="btn-secondary px-8"
        >
          Return to Home
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 p-8 md:p-16 lg:p-32 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/[0.03] blur-[150px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-500/[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-16 animate-fade-in relative z-10">
        {/* Header Section */}
        <header className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-black text-xl tracking-tighter text-white">PEBLO <span className="text-indigo-400">SHARE</span></span>
                <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Secure Viewport</div>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.05] text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Verified Source Mode
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl font-black text-white tracking-tighter leading-[1.1]">
              {note.aiTitle || note.title || 'Secure Document'}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                   <User className="w-4 h-4 text-indigo-400" />
                </div>
                <span className="text-slate-300">{note.user.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4.5 h-4.5" />
                <span>Published {formatDate(note.updatedAt)}</span>
              </div>
              <div className="flex gap-3">
                {note.tags.map((tag: string) => (
                  <span key={tag} className="text-indigo-400/70">#{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Intelligent Highlights */}
        {(note.aiSummary || note.aiItems?.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {note.aiSummary && (
              <div className="glass p-10 space-y-6 border-indigo-500/10 rounded-[2.5rem]">
                <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                  <FileText className="w-4 h-4" />
                  Executive Summary
                </div>
                <p className="text-slate-300 text-lg leading-relaxed font-medium italic">
                  &quot;{note.aiSummary}&quot;
                </p>
              </div>
            )}
            {note.aiItems?.length > 0 && (
              <div className="glass p-10 space-y-6 border-purple-500/10 rounded-[2.5rem]">
                <div className="flex items-center gap-3 text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">
                  <ListChecks className="w-4 h-4" />
                  Core Extraction
                </div>
                <ul className="space-y-4">
                  {note.aiItems.map((item: string, i: number) => (
                    <li key={i} className="flex gap-4 text-slate-300 font-medium">
                      <span className="text-purple-500 font-black mt-1">/</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Primary Document Body */}
        <article className="glass p-16 text-2xl leading-[1.6] text-slate-300 whitespace-pre-wrap min-h-[500px] rounded-[3rem] border-white/[0.03] shadow-inner font-medium">
          {note.content || <span className="text-slate-700 italic">No document content available.</span>}
        </article>

        {/* Conversion Footer */}
        <footer className="text-center pt-24 pb-12">
          <div className="max-w-md mx-auto space-y-8">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <p className="text-slate-500 font-medium leading-relaxed">
              This document was generated and secured using Peblo AI Intelligence. 
              Want to organize your thoughts with the same precision?
            </p>
            <button 
              onClick={() => window.location.href = '/signup'}
              className="btn-primary w-full py-4 text-xl rounded-2xl shadow-[0_0_40px_rgba(99,102,241,0.2)]"
            >
              Start Building with Peblo
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
