import { useState } from 'react'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import Header from './components/Header'
import Hero from './components/Hero'
import CardGrid from './components/CardGrid'
import MyCollection from './components/MyCollection'
import PurchaseModal from './components/PurchaseModal'
import Toast from './components/Toast'
import Footer from './components/Footer'
import { usePokemonCards, usePurchasedCards } from './hooks/usePokemon'

/**
 * 🔑 Client ID de PayPal Sandbox.
 * Para pruebas inmediatas se puede usar 'test', pero PayPal recomienda
 * crear tu propia app sandbox en https://developer.paypal.com/dashboard/applications/sandbox
 * y reemplazar este valor por tu Client ID real.
 */
const PAYPAL_CLIENT_ID = 'ATIHBO70DKmOQ-SO-izQqPHE-D3fGk08flk8LHFBCjHiEiaMl7ErjnRYw9v4NTzw1yo_T-PeupxvKZcK'

function App() {
  const { cards, loading, error, reload } = usePokemonCards(30)
  const { purchased, addPurchase, isPurchased, clearAll } = usePurchasedCards()
  const [view, setView] = useState('market')
  const [selectedCard, setSelectedCard] = useState(null)
  const [toast, setToast] = useState(null)

  const handleCardSelect = (card) => {
    if (isPurchased(card.id)) return
    setSelectedCard(card)
  }

  /* Pago aprobado y validado correctamente */
  const handlePurchaseSuccess = (card, paypalDetails) => {
    addPurchase(card)
    setSelectedCard(null)
    setToast({
      type: 'success',
      message: `¡Felicidades! Has desbloqueado a ${card.name.charAt(0).toUpperCase() + card.name.slice(1)}.`
    })
  }

  /* Error o cancelación */
  const handlePurchaseError = () => {
    setToast({
      type: 'error',
      message: 'El pago no se completó. La carta sigue bloqueada.'
    })
  }

  return (
    <PayPalScriptProvider
      options={{
        'client-id': PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
        components: 'buttons'
      }}
    >
      <div className="relative z-10 min-h-screen flex flex-col">
        <Header
          view={view}
          onViewChange={setView}
          collectionCount={purchased.length}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-8 lg:py-12">
          {view === 'market' && (
            <>
              <Hero totalCards={cards.length} ownedCount={purchased.length} />
              <CardGrid
                cards={cards}
                loading={loading}
                error={error}
                isPurchased={isPurchased}
                onCardSelect={handleCardSelect}
                onReload={reload}
              />
            </>
          )}

          {view === 'collection' && (
            <MyCollection
              purchased={purchased}
              onClearAll={clearAll}
            />
          )}
        </main>

        <Footer />

        {selectedCard && (
          <PurchaseModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
            onSuccess={handlePurchaseSuccess}
            onError={handlePurchaseError}
          />
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </PayPalScriptProvider>
  )
}

export default App