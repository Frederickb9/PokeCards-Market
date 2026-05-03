import { useState, useEffect } from 'react'
import { fetchPokemonCards } from '../utils/api'

/**
 * Hook personalizado que encapsula la lógica de carga de cartas.
 * - Maneja estados de carga, error y datos.
 * - Permite recargar manualmente con `reload()`.
 */
export const usePokemonCards = (count = 30) => {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchPokemonCards(count)
      setCards(data)
    } catch (err) {
      console.error('Error al cargar cartas:', err)
      setError('No se pudieron cargar las cartas. Verifica tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return { cards, loading, error, reload: load }
}

/**
 * Hook de persistencia en localStorage para el estado de cartas compradas.
 * Sincroniza automáticamente cualquier cambio con el almacenamiento del navegador.
 */
export const usePurchasedCards = () => {
  const STORAGE_KEY = 'pokecards-market:purchased'

  const [purchased, setPurchased] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(purchased))
  }, [purchased])

  const addPurchase = (card) => {
  setPurchased(prev => {
    if (prev.some(p => p.id === card.id)) return prev
    return [...prev, {
      id: card.id,
      name: card.name,
      image: card.image,
      price: card.price,
      rarity: card.rarity,
      types: card.types || [],
      stats: card.stats || [],
      height: card.height || 0,
      weight: card.weight || 0,
      statsTotal: card.statsTotal || 0,
      purchasedAt: new Date().toISOString()
    }]
  })
}

  const isPurchased = (cardId) => purchased.some(p => p.id === cardId)

  const clearAll = () => setPurchased([])

  return { purchased, addPurchase, isPurchased, clearAll }
}