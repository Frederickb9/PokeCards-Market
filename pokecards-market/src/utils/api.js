import axios from 'axios'

const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

/**
 * Sistema de rareza basado en la suma total de stats del Pokémon.
 * Define etiqueta y paleta visual para cada nivel.
 */
export const RARITY_TIERS = [
  { key: 'common',    label: 'Común',       min: 0,   max: 320, ring: 'ring-ink-300',    badge: 'bg-ink-100 text-ink-700' },
  { key: 'uncommon',  label: 'Poco común',  min: 321, max: 410, ring: 'ring-emerald-300', badge: 'bg-emerald-50 text-emerald-700' },
  { key: 'rare',      label: 'Raro',        min: 411, max: 490, ring: 'ring-sky-300',     badge: 'bg-sky-50 text-sky-700' },
  { key: 'epic',      label: 'Épico',       min: 491, max: 570, ring: 'ring-brand-400',   badge: 'bg-brand-50 text-brand-700' },
  { key: 'legendary', label: 'Legendaria',  min: 571, max: 9999, ring: 'ring-gold-400',   badge: 'bg-gold-50 text-gold-600' },
]

export const getRarity = (statsTotal) =>
  RARITY_TIERS.find(t => statsTotal >= t.min && statsTotal <= t.max) || RARITY_TIERS[0]

/**
 * Calcula el precio en USD según la suma total de stats.
 * Genera un valor entre 0.99 y 29.99 — las cartas más fuertes cuestan más.
 */
export const calculatePrice = (statsTotal) => {
  if (statsTotal >= 571) return 29.99
  if (statsTotal >= 491) return 19.99
  if (statsTotal >= 411) return 9.99
  if (statsTotal >= 321) return 4.99
  return 1.99
}

/**
 * Mapeo de tipos de Pokémon en español + paleta suave.
 * Tonos pastel para mantener una estética profesional.
 */
export const TYPE_META = {
  normal:   { es: 'Normal',    cls: 'bg-ink-100 text-ink-700' },
  fire:     { es: 'Fuego',     cls: 'bg-orange-50 text-orange-700' },
  water:    { es: 'Agua',      cls: 'bg-sky-50 text-sky-700' },
  grass:    { es: 'Planta',    cls: 'bg-emerald-50 text-emerald-700' },
  electric: { es: 'Eléctrico', cls: 'bg-amber-50 text-amber-700' },
  ice:      { es: 'Hielo',     cls: 'bg-cyan-50 text-cyan-700' },
  fighting: { es: 'Lucha',     cls: 'bg-red-50 text-red-700' },
  poison:   { es: 'Veneno',    cls: 'bg-purple-50 text-purple-700' },
  ground:   { es: 'Tierra',    cls: 'bg-yellow-50 text-yellow-700' },
  flying:   { es: 'Volador',   cls: 'bg-indigo-50 text-indigo-700' },
  psychic:  { es: 'Psíquico',  cls: 'bg-pink-50 text-pink-700' },
  bug:      { es: 'Bicho',     cls: 'bg-lime-50 text-lime-700' },
  rock:     { es: 'Roca',      cls: 'bg-stone-100 text-stone-700' },
  ghost:    { es: 'Fantasma',  cls: 'bg-violet-50 text-violet-700' },
  dragon:   { es: 'Dragón',    cls: 'bg-blue-50 text-blue-700' },
  dark:     { es: 'Siniestro', cls: 'bg-zinc-100 text-zinc-700' },
  steel:    { es: 'Acero',     cls: 'bg-slate-100 text-slate-700' },
  fairy:    { es: 'Hada',      cls: 'bg-rose-50 text-rose-700' },
}

/**
 * Obtiene una lista de cartas Pokémon desde la PokéAPI.
 * @param {number} count - Cantidad de cartas a obtener (default 30 para superar el mínimo de 25).
 * @returns {Promise<Array>} Lista de cartas con todos sus metadatos.
 */
export const fetchPokemonCards = async (count = 30) => {
  // IDs específicos: primeros 20 + 10 legendarios/icónicos garantizados
  const specificIds = [
    // Starters icónicos
    1, 4, 7, 25, 39, 52, 54, 58, 63, 66,
    // Más populares
    94, 113, 116, 123, 129, 130, 131, 132, 133,
    // Legendarios icónicos
    144, // Articuno
    145, // Zapdos
    146, // Moltres
    147, // Dratini
    148, // Dragonair
    149, // Dragonite
    150, // Mewtwo ⭐
    151, // Mew ⭐
    243, // Raikou
    244, // Entei
    245, // Suicune
    249, // Lugia ⭐
    250, // Ho-Oh ⭐
    384, // Rayquaza ⭐
    483, // Dialga ⭐
    484, // Palkia ⭐
    487, // Giratina ⭐
    643, // Reshiram ⭐
    644, // Zekrom ⭐
    716, // Xerneas ⭐
  ]

  const detailPromises = specificIds.map(id =>
    axios.get(`${POKEAPI_BASE}/pokemon/${id}`)
  )
  const responses = await Promise.all(detailPromises)

  return responses.map(({ data }) => {
    const statsTotal = data.stats.reduce((sum, s) => sum + s.base_stat, 0)
    const rarity = getRarity(statsTotal)
    const price = calculatePrice(statsTotal)

    return {
      id: data.id,
      name: data.name,
      image:
        data.sprites.other?.['official-artwork']?.front_default ||
        data.sprites.front_default,
      types: data.types.map(t => t.type.name),
      stats: data.stats.map(s => ({
        name: s.stat.name,
        value: s.base_stat
      })),
      statsTotal,
      rarity,
      price,
      height: data.height / 10,
      weight: data.weight / 10,
    }
  })
}