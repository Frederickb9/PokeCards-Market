const Hero = ({ totalCards, ownedCount }) => {
  const completionPct = totalCards > 0 ? Math.round((ownedCount / totalCards) * 100) : 0
  const remaining = totalCards - ownedCount
  const motivMsg = remaining > 0 ? 'Solo te faltan ' + remaining + ' para completar tu Pokédex Digital' : 'Coleccion completada'

  return (
    <section className="relative overflow-hidden mb-10 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-5">

        <div className="lg:col-span-2 relative bg-ink-900 rounded-3xl p-8 lg:p-10 overflow-hidden min-h-[220px] flex flex-col justify-between">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/80 tracking-wide">PokéAPI conectada · {totalCards} cartas</span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-white leading-[1.1] mb-3">
              Colecciona cartas <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">únicas y digitales</span>
            </h2>
            <p className="text-ink-400 text-sm lg:text-base max-w-md leading-relaxed">
              Explora el mercado, elige tu carta y págala con PayPal Sandbox.
            </p>
          </div>

          <a href="#market" className="relative mt-6 self-start inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium rounded-xl transition-all duration-200 hover:gap-3">
            Explorar mercado
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-card border border-ink-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-ink-400">Tu progreso</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <svg className="w-4 h-4 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>

          <div>
            <div className="mb-1">
              <span className="font-display font-bold text-5xl text-ink-900">{ownedCount}</span>
              <span className="font-display font-bold text-2xl text-ink-300"> / {totalCards}</span>
            </div>
            <p className="text-xs text-ink-500 mb-5">cartas en tu colección</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-ink-500">Completado</span>
                <span className="text-brand-600 font-bold">{completionPct}%</span>
              </div>
              <div className="h-2.5 bg-ink-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full transition-all duration-700" style={{ width: Math.max(completionPct, 2) + '%' }} />
              </div>
            </div>
          </div>

          <p className="text-[11px] text-ink-400 mt-4 leading-relaxed">{motivMsg}</p>
        </div>

      </div>
    </section>
  )
}

export default Hero