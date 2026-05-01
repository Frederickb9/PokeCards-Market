/**
 * Vista de la colección personal del usuario.
 * Muestra todas las cartas adquiridas con metadatos de compra.
 */
const MyCollection = ({ purchased, onClearAll }) => {
  if (purchased.length === 0) {
    return (
      <section className="text-center py-20 animate-fade-in">
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-100 to-brand-200 rotate-6" />
          <div className="absolute inset-0 w-24 h-24 rounded-3xl bg-white -rotate-3 flex items-center justify-center">
            <svg className="w-10 h-10 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>
        <h2 className="font-display font-bold text-2xl text-ink-900 mb-2">
          Tu colección está vacía
        </h2>
        <p className="text-ink-500 max-w-sm mx-auto">
          Visita el mercado y compra tu primera carta para comenzar tu colección digital.
        </p>
      </section>
    )
  }

  // Cálculo del total invertido — útil como dato visual
  const totalInvested = purchased.reduce((sum, c) => sum + c.price, 0)

  return (
    <section className="animate-fade-in">
      {/* Encabezado de la colección */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink-900">
            Mi colección
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {purchased.length} carta{purchased.length !== 1 ? 's' : ''} adquirida{purchased.length !== 1 ? 's' : ''} ·
            Total invertido: <strong className="text-ink-700">${totalInvested.toFixed(2)} USD</strong>
          </p>
        </div>
        {purchased.length > 0 && (
          <button
            onClick={() => {
              if (confirm('¿Eliminar todo el historial de compras?')) onClearAll()
            }}
            className="text-xs text-ink-500 hover:text-red-600 transition"
          >
            Limpiar colección
          </button>
        )}
      </div>

      {/* Grid de cartas adquiridas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {purchased.map((card, i) => (
          <article
            key={card.id}
            className="bg-white rounded-2xl overflow-hidden border border-ink-100 shadow-card hover:shadow-card-hover transition animate-slide-up"
            style={{ animationDelay: `${(i % 8) * 60}ms` }}
          >
            <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 flex items-center justify-center">
              <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-[10px] font-bold text-white uppercase tracking-wide">Tuya</span>
              </div>
              <div className="absolute top-3 left-3 z-10">
                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${card.rarity.badge}`}>
                  {card.rarity.label}
                </span>
              </div>
              <img
                src={card.image}
                alt={card.name}
                className="w-3/4 h-3/4 object-contain drop-shadow-lg"
              />
            </div>
            <div className="p-4">
              <h3 className="font-display font-bold text-ink-900 capitalize text-lg leading-tight">
                {card.name}
              </h3>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-ink-100 text-xs">
                <span className="text-ink-500">
                  Adquirida el {new Date(card.purchasedAt).toLocaleDateString('es-SV', {
                    day: '2-digit', month: 'short', year: 'numeric'
                  })}
                </span>
                <span className="font-semibold text-ink-900">${card.price.toFixed(2)}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MyCollection