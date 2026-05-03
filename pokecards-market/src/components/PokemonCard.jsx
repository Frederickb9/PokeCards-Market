import { useRef } from 'react'
import { TYPE_META } from '../utils/api'

/* Identidad visual única por rareza */
const RARITY_STYLES = {
  common: {
    border: 'border-ink-200',
    topBar: 'bg-ink-200',
    imageArea: 'from-ink-50 via-white to-ink-50/50',
    glow: '',
    ring: '',
    btn: 'bg-ink-900 hover:bg-ink-700 text-white',
  },
  uncommon: {
    border: 'border-emerald-200',
    topBar: 'bg-gradient-to-r from-emerald-300 to-emerald-500',
    imageArea: 'from-emerald-50 via-white to-emerald-50/30',
    glow: '',
    ring: '',
    btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  rare: {
    border: 'border-sky-300',
    topBar: 'bg-gradient-to-r from-sky-300 to-sky-500',
    imageArea: 'from-sky-50 via-white to-sky-50/30',
    glow: 'shadow-[0_0_20px_-4px_rgb(56_189_248_/_0.30)]',
    ring: 'ring-1 ring-sky-200',
    btn: 'bg-sky-500 hover:bg-sky-600 text-white',
  },
  epic: {
    border: 'border-brand-300',
    topBar: 'bg-gradient-to-r from-brand-400 to-brand-600',
    imageArea: 'from-brand-50 via-white to-brand-50/20',
    glow: 'shadow-[0_0_28px_-4px_rgb(99_102_241_/_0.35)]',
    ring: 'ring-1 ring-brand-200',
    btn: 'bg-brand-500 hover:bg-brand-600 text-white',
  },
  legendary: {
    border: 'border-gold-400',
    topBar: 'bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300',
    imageArea: 'from-gold-50 via-amber-50/40 to-gold-50/20',
    glow: 'shadow-[0_0_36px_-4px_rgb(251_191_36_/_0.45)]',
    ring: 'ring-2 ring-gold-300',
    btn: 'bg-gold-400 hover:bg-gold-500 text-ink-900',
  },
}

const PokemonCard = ({ card, purchased, onSelect, index = 0 }) => {
  const style = RARITY_STYLES[card.rarity.key] || RARITY_STYLES.common
  const cardRef = useRef(null)

  /* Efecto de tactilidad 3D */
  const handleMouseMove = (e) => {
    if (!cardRef.current || purchased) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -14
    cardRef.current.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) translateY(-4px)`
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    cardRef.current.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0)'
  }

  return (
    <article
      ref={cardRef}
      onClick={() => !purchased && onSelect(card)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        animationDelay: `${(index % 12) * 40}ms`,
        transition: 'transform 0.15s ease',
      }}
      className={`
        group relative bg-white rounded-2xl overflow-hidden border-2
        animate-slide-up
        ${style.border} ${style.ring} ${style.glow}
        ${purchased
          ? 'opacity-60 saturate-50 cursor-default'
          : 'cursor-pointer'
        }
      `}
    >
      {/* Franja superior de rareza */}
      <div className={`h-1.5 w-full ${style.topBar}`} />

      {/* Badge adquirida */}
      {purchased && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-[10px] font-bold text-white tracking-wide uppercase">Adquirida</span>
        </div>
      )}

      {/* Badge rareza */}
      <div className="absolute top-3 left-3 z-10">
        <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${card.rarity.badge}`}>
          {card.rarity.label}
        </span>
      </div>

      {/* Área imagen */}
      <div className={`
        relative aspect-[4/3] flex items-center justify-center overflow-hidden
        bg-gradient-to-br ${style.imageArea}
      `}>
        {/* Patrón de puntos */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }} />

        {/* Destellos para legendarias */}
        {card.rarity.key === 'legendary' && (
          <>
            <div className="absolute top-2 right-4 w-1 h-1 rounded-full bg-gold-400 animate-pulse" />
            <div className="absolute bottom-3 left-5 w-0.5 h-0.5 rounded-full bg-gold-300 animate-pulse" style={{ animationDelay: '0.7s' }} />
            <span className="absolute top-3 left-8 text-gold-300/50 text-xs" style={{ animation: 'spin 6s linear infinite' }}>✦</span>
          </>
        )}

        {/* Círculo decorativo de rareza */}
        <div className={`absolute inset-4 rounded-full opacity-20 ring-1 ${card.rarity.ring} ring-offset-2 ring-offset-transparent`} />

        <img
          src={card.image}
          alt={card.name}
          loading="lazy"
          className="relative z-10 w-3/4 h-3/4 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-110"
        />

        <span className="absolute bottom-3 right-3 font-display font-bold text-2xl text-ink-300/40">
          #{String(card.id).padStart(3, '0')}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-display font-bold text-ink-900 capitalize text-lg leading-tight mb-3">
          {card.name}
        </h3>

        {/* Tipos */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {card.types.map(type => {
            const meta = TYPE_META[type] || TYPE_META.normal
            return (
              <span key={type} className={`text-[10px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md ${meta.cls}`}>
                {meta.es}
              </span>
            )
          })}
        </div>

        {/* Precio + botón */}
        <div className="flex items-center justify-between pt-3 border-t border-ink-100">
          <div>
            <span className="text-[10px] text-ink-400 uppercase tracking-wider block mb-0.5">Precio</span>
            <span className="font-display font-bold text-xl text-ink-900">${card.price.toFixed(2)}</span>
          </div>

          {purchased ? (
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              En tu colección
            </span>
          ) : (
            <button className={`
              px-4 py-2 rounded-xl text-xs font-bold tracking-wide
              transition-all duration-200 active:scale-95
              ${style.btn}
            `}>
              Comprar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default PokemonCard