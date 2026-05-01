import { TYPE_META } from '../utils/api'

/**
 * Componente de carta individual.
 * - Estado bloqueado: se puede clickear para iniciar la compra.
 * - Estado adquirido: muestra distintivo "Adquirida" y se ve más vibrante.
 */
const PokemonCard = ({ card, purchased, onSelect, index = 0 }) => {
  const primaryType = card.types[0]
  const typeMeta = TYPE_META[primaryType] || TYPE_META.normal

  return (
    <article
      onClick={() => !purchased && onSelect(card)}
      className={`
        group relative bg-white rounded-2xl overflow-hidden
        border border-ink-100 transition-all duration-300
        ${purchased
          ? 'shadow-card ring-1 ring-emerald-200'
          : 'shadow-card hover:shadow-card-hover hover:-translate-y-1 cursor-pointer hover:ring-1 hover:ring-brand-200'
        }
        animate-slide-up
      `}
      style={{ animationDelay: `${(index % 12) * 40}ms` }}
    >
      {/* Distintivo de adquirida */}
      {purchased && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 shadow-glow">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[10px] font-bold text-white tracking-wide uppercase">Adquirida</span>
        </div>
      )}

      {/* Badge de rareza */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${card.rarity.badge}`}>
          {card.rarity.label}
        </span>
      </div>

      {/* Sección visual de la imagen */}
      <div className={`
        relative aspect-[4/3] flex items-center justify-center overflow-hidden
        ${purchased
          ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50'
          : 'bg-gradient-to-br from-ink-50 via-white to-brand-50/30'
        }
      `}>
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />

        {/* Anillo de rareza */}
        <div className={`absolute inset-4 rounded-full ${card.rarity.ring} ring-1 ring-offset-2 ring-offset-transparent opacity-30`} />

        {/* Imagen del Pokémon — bloqueada en escala de grises hasta comprar */}
        <img
          src={card.image}
          alt={card.name}
          loading="lazy"
          className={`
            relative z-[1] w-3/4 h-3/4 object-contain drop-shadow-lg
            transition-all duration-500 group-hover:scale-105
            ${purchased ? '' : 'group-hover:saturate-100 saturate-[0.85]'}
          `}
        />

        {/* ID flotante — sutil */}
        <span className="absolute bottom-3 right-3 font-display font-bold text-2xl text-ink-300/40">
          #{String(card.id).padStart(3, '0')}
        </span>
      </div>

      {/* Sección de información */}
      <div className="p-4">
        <h3 className="font-display font-bold text-ink-900 capitalize text-lg leading-tight mb-2">
          {card.name}
        </h3>

        {/* Tipos */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {card.types.map(type => {
            const meta = TYPE_META[type] || TYPE_META.normal
            return (
              <span
                key={type}
                className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md ${meta.cls}`}
              >
                {meta.es}
              </span>
            )
          })}
        </div>

        {/* Precio + acción */}
        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <div>
            <span className="text-[10px] text-ink-400 uppercase tracking-wider">Precio</span>
            <div className="font-display font-bold text-xl text-ink-900">
              ${card.price.toFixed(2)}
            </div>
          </div>

          {purchased ? (
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              En tu colección
            </span>
          ) : (
            <span className="text-xs font-medium text-brand-600 flex items-center gap-1 group-hover:gap-2 transition-all">
              Comprar
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export default PokemonCard