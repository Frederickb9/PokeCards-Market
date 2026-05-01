import { useState, useMemo } from 'react'
import PokemonCard from './PokemonCard'
import { RARITY_TIERS } from '../utils/api'

/**
 * Grid de cartas con filtros por rareza y búsqueda.
 * Muestra skeletons durante la carga.
 */
const CardGrid = ({ cards, loading, error, isPurchased, onCardSelect, onReload }) => {
  const [search, setSearch] = useState('')
  const [rarityFilter, setRarityFilter] = useState('all')
  const [sort, setSort] = useState('default')

  const filtered = useMemo(() => {
    let result = [...cards]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c => c.name.toLowerCase().includes(q))
    }

    if (rarityFilter !== 'all') {
      result = result.filter(c => c.rarity.key === rarityFilter)
    }

    if (sort === 'price-asc')   result.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc')  result.sort((a, b) => b.price - a.price)
    if (sort === 'name')        result.sort((a, b) => a.name.localeCompare(b.name))

    return result
  }, [cards, search, rarityFilter, sort])

  // Estado de error
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-red-800 font-medium mb-3">{error}</p>
        <button
          onClick={onReload}
          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <section id="market" className="scroll-mt-20">
      {/* Encabezado de la sección */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display font-bold text-2xl lg:text-3xl text-ink-900">
            Mercado de cartas
          </h2>
          <p className="text-sm text-ink-500 mt-1">
            {loading ? 'Cargando colección...' : `${filtered.length} carta${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Controles de filtrado */}
      <div className="bg-white border border-ink-100 rounded-2xl p-4 mb-8 flex flex-col lg:flex-row gap-3 shadow-soft">
        {/* Buscador */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar carta por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-ink-50 rounded-xl text-sm placeholder:text-ink-400 focus:bg-white focus:ring-2 focus:ring-brand-200 outline-none transition"
          />
        </div>

        {/* Filtro de rareza */}
        <div className="flex flex-wrap gap-1.5">
          <FilterChip active={rarityFilter === 'all'} onClick={() => setRarityFilter('all')}>
            Todas
          </FilterChip>
          {RARITY_TIERS.map(tier => (
            <FilterChip
              key={tier.key}
              active={rarityFilter === tier.key}
              onClick={() => setRarityFilter(tier.key)}
            >
              {tier.label}
            </FilterChip>
          ))}
        </div>

        {/* Ordenamiento */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-3 py-2.5 bg-ink-50 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-brand-200 outline-none transition cursor-pointer"
        >
          <option value="default">Orden por defecto</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
          <option value="name">Nombre A–Z</option>
        </select>
      </div>

      {/* Grid principal */}
      {loading ? (
        <SkeletonGrid />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((card, i) => (
            <PokemonCard
              key={card.id}
              card={card}
              purchased={isPurchased(card.id)}
              onSelect={onCardSelect}
              index={i}
            />
          ))}
        </div>
      )}
    </section>
  )
}

const FilterChip = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`
      px-3 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap
      ${active
        ? 'bg-ink-900 text-white'
        : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
      }
    `}
  >
    {children}
  </button>
)

const SkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
    {Array.from({ length: 12 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden border border-ink-100">
        <div className="aspect-[4/3] skeleton" />
        <div className="p-4 space-y-3">
          <div className="h-5 w-2/3 skeleton" />
          <div className="h-3 w-1/3 skeleton" />
          <div className="h-8 w-full skeleton" />
        </div>
      </div>
    ))}
  </div>
)

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-ink-100 flex items-center justify-center">
      <svg className="w-8 h-8 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    <p className="font-medium text-ink-700">Sin resultados</p>
    <p className="text-sm text-ink-500 mt-1">Prueba con otros filtros</p>
  </div>
)

export default CardGrid