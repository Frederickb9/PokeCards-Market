/**
 * Sección hero con stats del mercado.
 * Comunica valor y propósito de la plataforma de forma visualmente atractiva.
 */
const Hero = ({ totalCards, ownedCount }) => {
  const completionPct = totalCards > 0 ? Math.round((ownedCount / totalCards) * 100) : 0

  return (
    <section className="relative overflow-hidden mb-10 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bloque principal */}
        <div className="lg:col-span-2 relative bg-ink-900 rounded-3xl p-8 lg:p-10 overflow-hidden">
          {/* Gradiente decorativo */}
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-10 w-60 h-60 bg-gold-500/20 rounded-full blur-3xl" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-white/90 tracking-wide">PokéAPI conectada · {totalCards} cartas</span>
            </div>

            <h2 className="font-display font-bold text-3xl lg:text-5xl text-white text-balance leading-[1.1] mb-4">
              Cartas digitales <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                con valor real
              </span>
            </h2>
            <p className="text-ink-300 text-base lg:text-lg max-w-lg leading-relaxed">
              Explora, selecciona y desbloquea cartas únicas. Cada compra se procesa
              de forma segura mediante PayPal Sandbox.
            </p>

            <div className="flex items-center gap-6 mt-8">
              <a href="#market" className="group inline-flex items-center gap-2 text-white font-medium">
                Explorar mercado
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition group-hover:translate-x-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Card de progreso */}
        <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-card border border-ink-100">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-ink-500">Tu progreso</span>
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>

          <div className="mb-2">
            <span className="font-display font-bold text-5xl text-ink-900">{ownedCount}</span>
            <span className="font-display font-bold text-2xl text-ink-300"> / {totalCards}</span>
          </div>
          <p className="text-sm text-ink-500 mb-6">cartas en tu colección</p>

          {/* Barra de progreso */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-ink-600">Completado</span>
              <span className="text-brand-600">{completionPct}%</span>
            </div>
            <div className="h-2 bg-ink-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full transition-all duration-700"
                style={{ width: `${completionPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero