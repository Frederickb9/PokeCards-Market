import { useEffect } from 'react'

const STAT_CONFIG = {
  hp:               { label: 'HP',      color: 'bg-red-400',    icon: '♥' },
  attack:           { label: 'ATQ',     color: 'bg-orange-400', icon: '⚔' },
  defense:          { label: 'DEF',     color: 'bg-yellow-400', icon: '🛡' },
  'special-attack': { label: 'ATQ ESP', color: 'bg-blue-400',   icon: '✦' },
  'special-defense':{ label: 'DEF ESP', color: 'bg-green-400',  icon: '◈' },
  speed:            { label: 'VEL',     color: 'bg-pink-400',   icon: '⚡' },
}

const TYPE_COLORS = {
  normal: 'bg-zinc-400',   fire:     'bg-orange-500',
  water:  'bg-sky-500',    grass:    'bg-emerald-500',
  electric:'bg-yellow-400',ice:      'bg-cyan-400',
  fighting:'bg-red-600',   poison:   'bg-purple-500',
  ground: 'bg-yellow-600', flying:   'bg-indigo-400',
  psychic:'bg-pink-500',   bug:      'bg-lime-500',
  rock:   'bg-stone-500',  ghost:    'bg-violet-600',
  dragon: 'bg-blue-700',   dark:     'bg-zinc-700',
  steel:  'bg-slate-400',  fairy:    'bg-rose-400',
}

const RARITY_GRADIENT = {
  common:    'from-zinc-700 to-zinc-900',
  uncommon:  'from-emerald-700 to-emerald-900',
  rare:      'from-sky-700 to-sky-900',
  epic:      'from-indigo-700 to-indigo-900',
  legendary: 'from-amber-600 to-amber-900',
}

const RARITY_ACCENT = {
  common:    'border-zinc-400 text-zinc-300',
  uncommon:  'border-emerald-400 text-emerald-300',
  rare:      'border-sky-400 text-sky-300',
  epic:      'border-indigo-400 text-indigo-300',
  legendary: 'border-amber-400 text-amber-300',
}

const MOVES_BY_TYPE = {
  fire:     ['Lanzallamas', 'Colmillo Ígneo', 'Envite Ígneo', 'Rueda Fuego'],
  water:    ['Surf', 'Hidrobomba', 'Acua Jet', 'Burbuja Aura'],
  grass:    ['Látigo Cepa', 'Rayo Solar', 'Hoja Aguda', 'Hierba Lazo'],
  electric: ['Impactrueno', 'Rayo', 'Trueno', 'Chispa'],
  psychic:  ['Psíquico', 'Premonición', 'Psicocorte', 'Bola Sombra'],
  ice:      ['Ventisca', 'Rayo Hielo', 'Nieve Polvo', 'Granizo'],
  fighting: ['Puño Fuego', 'A Bocajarro', 'Patada Salto', 'Golpe Karate'],
  poison:   ['Lanzamiento', 'Colmillo Ven.', 'Ácido', 'Bola Tóxica'],
  ground:   ['Terremoto', 'Excavar', 'Puas Tóxicas', 'Golpe Roca'],
  flying:   ['Vuelo', 'Ataque Ala', 'Tornado', 'Picado'],
  ghost:    ['Bola Sombra', 'Puño Sombra', 'Maldición', 'Tinieblas'],
  dragon:   ['Cometa Draco', 'Pulso Dragón', 'Garra Dragón', 'Enfado'],
  dark:     ['Acoso', 'Mordisco', 'Golpe Bajo', 'Triturar'],
  steel:    ['Cabezazo Fér.', 'Puño Meteoro', 'Giro Bola', 'Flash Cañón'],
  fairy:    ['Voz Cautiv.', 'Beso Drenaje', 'Brillo Mágico', 'Encanto'],
  bug:      ['Zumbido', 'Tijera X', 'Vuelo Germen', 'Picadura'],
  rock:     ['Avalancha', 'Lanzarrocas', 'Filo Roca', 'Tumba Rocas'],
  normal:   ['Placaje', 'Golpe Cuerpo', 'Hiper Rayo', 'Doble Filo'],
}

const getMovesForCard = (types = []) => {
  const primary = types[0] || 'normal'
  const secondary = types[1]
  const primaryMoves = MOVES_BY_TYPE[primary] || MOVES_BY_TYPE.normal
  const secondaryMoves = secondary ? (MOVES_BY_TYPE[secondary] || []) : []
  return [
    primaryMoves[0],
    primaryMoves[1],
    secondaryMoves[0] || primaryMoves[2],
    primaryMoves[3]
  ]
}

const CardDetailModal = ({ card, onClose }) => {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Fallbacks para cartas sin datos completos en localStorage
  const stats   = Array.isArray(card.stats) ? card.stats : []
  const types   = Array.isArray(card.types) ? card.types : ['normal']
  const height  = card.height ?? '?'
  const weight  = card.weight ?? '?'
  const rarityKey = card.rarity?.key || 'common'

  const gradient   = RARITY_GRADIENT[rarityKey] || RARITY_GRADIENT.common
  const accent     = RARITY_ACCENT[rarityKey]   || RARITY_ACCENT.common
  const totalStats = stats.reduce((s, st) => s + (st.value || 0), 0)
  const moves      = getMovesForCard(types)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-sm animate-slide-up overflow-y-auto max-h-[92vh]"
        onClick={e => e.stopPropagation()}
        style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.6))' }}
      >
        <div className={'bg-gradient-to-b ' + gradient + ' rounded-3xl overflow-hidden border border-white/10'}>

          {/* Header rareza + tipos */}
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              {types.map(type => (
                <span key={type} className={(TYPE_COLORS[type] || 'bg-zinc-500') + ' text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full'}>
                  {type}
                </span>
              ))}
            </div>
            <div className={'text-[10px] font-bold uppercase tracking-widest border px-2.5 py-1 rounded-full ' + accent}>
              {card.rarity?.label || 'Común'}
            </div>
          </div>

          {/* Nombre + ID */}
          <div className="px-5 pb-3 flex items-end justify-between">
            <h2 className="font-display font-bold text-white text-3xl capitalize leading-tight">
              {card.name}
            </h2>
            <span className="text-white/30 font-mono font-bold text-lg">
              #{String(card.id).padStart(3, '0')}
            </span>
          </div>

          {/* Imagen */}
          <div
            className="relative mx-5 rounded-2xl flex items-center justify-center"
            style={{ height: '200px', background: 'rgba(255,255,255,0.07)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={'w-40 h-40 rounded-full opacity-20 blur-2xl ' + (
                rarityKey === 'legendary' ? 'bg-amber-400' :
                rarityKey === 'epic'      ? 'bg-indigo-400' :
                rarityKey === 'rare'      ? 'bg-sky-400' : 'bg-white'
              )} />
            </div>

            {rarityKey === 'legendary' && (
              <>
                <span className="absolute top-4 left-8 text-amber-300/60 text-sm animate-pulse">✦</span>
                <span className="absolute bottom-4 right-8 text-amber-300/40 text-xs animate-pulse" style={{ animationDelay: '0.5s' }}>✦</span>
                <span className="absolute top-8 right-12 text-amber-200/50 text-xs animate-pulse" style={{ animationDelay: '1s' }}>★</span>
              </>
            )}

            <img
              src={card.image}
              alt={card.name}
              className="relative z-10 h-48 object-contain drop-shadow-2xl animate-float"
            />
          </div>

          {/* Info física */}
          <div className="mx-5 mt-3 flex justify-around text-center py-2.5 rounded-xl" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div>
              <p className="text-white/40 text-[9px] uppercase tracking-widest">Altura</p>
              <p className="text-white font-bold text-sm">{height} m</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-white/40 text-[9px] uppercase tracking-widest">Peso</p>
              <p className="text-white font-bold text-sm">{weight} kg</p>
            </div>
            <div className="w-px bg-white/10" />
            <div>
              <p className="text-white/40 text-[9px] uppercase tracking-widest">Stats tot.</p>
              <p className="text-white font-bold text-sm">{totalStats || card.statsTotal || '?'}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="px-5 pt-4 pb-2">
            <p className="text-white/50 text-[10px] uppercase tracking-widest mb-3 font-semibold">Estadísticas base</p>
            {stats.length > 0 ? (
              <div className="space-y-2">
                {stats.map(stat => {
                  const cfg = STAT_CONFIG[stat.name] || { label: stat.name, color: 'bg-gray-400', icon: '·' }
                  const pct = Math.round(((stat.value || 0) / 255) * 100)
                  return (
                    <div key={stat.name} className="flex items-center gap-2">
                      <span className="text-white/40 text-[10px] w-4 text-center">{cfg.icon}</span>
                      <span className="text-white/70 text-[10px] uppercase tracking-wide w-14 shrink-0">{cfg.label}</span>
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className={'h-full rounded-full ' + cfg.color} style={{ width: pct + '%' }} />
                      </div>
                      <span className="text-white font-mono text-[11px] font-bold w-7 text-right">{stat.value}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-white/30 text-xs">Vuelve a comprar esta carta para ver sus stats</p>
            )}
          </div>

          {/* Movimientos */}
          <div className="px-5 pt-3 pb-5">
            <p className="text-white/50 text-[10px] uppercase tracking-widest mb-3 font-semibold">Movimientos</p>
            <div className="grid grid-cols-2 gap-2">
              {moves.map((move, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <span className="text-white/40 text-xs">{'ABCD'[i]}</span>
                  <span className="text-white text-[11px] font-medium">{move}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Precio + cerrar */}
          <div className="mx-5 mb-5 flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              <p className="text-white/30 text-[9px] uppercase tracking-widest">Precio pagado</p>
              <p className="text-white font-display font-bold text-2xl">
                ${card.price.toFixed(2)} <span className="text-white/40 text-xs">USD</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition"
            >
              Cerrar
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CardDetailModal