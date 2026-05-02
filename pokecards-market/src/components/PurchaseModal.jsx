import { useState, useEffect, useRef } from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import { TYPE_META } from '../utils/api'
import { captureOrder, getOrderDetails } from '../utils/paypal'

const PurchaseModal = ({ card, onClose, onSuccess, onError }) => {
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState(null)
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer()
  const isCapturing = useRef(false)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape' && !isCapturing.current && status !== 'processing') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, status])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleBackdropClick = () => {
    if (!isCapturing.current && status !== 'processing' && status !== 'success') onClose()
  }

  const processPayment = async (orderID) => {
    isCapturing.current = true
    setStatus('processing')
    setErrorMsg(null)

    try {
      const details = await captureOrder(orderID)
      console.log('✅ Pago capturado:', details)

      if (details.status === 'COMPLETED') {
        isCapturing.current = false
        setStatus('success')
        setTimeout(() => onSuccess(card, details), 1000)
        return
      }

      throw new Error(`Estado inesperado: ${details.status}`)

    } catch (captureErr) {
      console.warn('Capture falló, verificando estado...', captureErr)
      try {
        const order = await getOrderDetails(orderID)
        console.log('Estado de orden:', order.status)

        if (order.status === 'COMPLETED') {
          isCapturing.current = false
          setStatus('success')
          setTimeout(() => onSuccess(card, order), 1000)
          return
        }

        isCapturing.current = false
        setStatus('error')
        setErrorMsg(`Pago no completado (estado: ${order.status}). Intenta de nuevo.`)

      } catch (verifyErr) {
        console.error('Error verificando orden:', verifyErr)
        isCapturing.current = false
        setStatus('error')
        setErrorMsg('No se pudo verificar el pago. Intenta de nuevo.')
        onError?.(verifyErr)
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-md" />

      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <div>
            <h2 className="font-display font-bold text-xl text-ink-900">Confirmar compra</h2>
            <p className="text-xs text-ink-500 mt-0.5">Procesa tu pago de forma segura con PayPal</p>
          </div>
          {status !== 'processing' && status !== 'success' && (
            <button onClick={onClose} className="w-9 h-9 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-500 transition">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-65px)]">
          <div className="grid md:grid-cols-2 gap-0">

            <div className="bg-gradient-to-br from-ink-50 via-white to-brand-50/30 p-6 md:p-8">
              <div className="aspect-[3/4] max-w-sm mx-auto rounded-2xl bg-white border border-ink-100 p-6 flex flex-col shadow-card">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${card.rarity.badge}`}>
                    {card.rarity.label}
                  </span>
                  <span className="font-display font-bold text-lg text-ink-300">
                    #{String(card.id).padStart(3, '0')}
                  </span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <img src={card.image} alt={card.name} className="w-full h-full object-contain drop-shadow-2xl animate-float" />
                </div>
                <div className="text-center pt-3 border-t border-ink-100">
                  <h3 className="font-display font-bold text-xl capitalize text-ink-900">{card.name}</h3>
                  <div className="flex justify-center gap-1 mt-1 flex-wrap">
                    {card.types.map(type => {
                      const meta = TYPE_META[type] || TYPE_META.normal
                      return (
                        <span key={type} className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${meta.cls}`}>
                          {meta.es}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col">

              <div className="space-y-3 mb-5">
                <h4 className="font-display font-bold text-ink-900">Resumen de la orden</h4>
                <div className="bg-ink-50 rounded-xl p-4 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-ink-500">Carta digital</span>
                    <span className="text-ink-900 capitalize font-medium">{card.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">Rareza</span>
                    <span className="text-ink-900 font-medium">{card.rarity.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-500">Stats totales</span>
                    <span className="text-ink-900 font-medium">{card.statsTotal}</span>
                  </div>
                  <div className="border-t border-ink-200 pt-2.5 flex justify-between items-center">
                    <span className="text-ink-700 font-semibold">Total a pagar</span>
                    <span className="font-display font-bold text-2xl text-ink-900">
                      ${card.price.toFixed(2)}{' '}
                      <span className="text-sm text-ink-400">USD</span>
                    </span>
                  </div>
                </div>
              </div>

              {isPending && (
                <div className="flex items-center gap-2 text-ink-500 text-sm mb-4 px-4 py-3 bg-ink-50 rounded-xl">
                  <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Cargando métodos de pago...</span>
                </div>
              )}

              {isRejected && (
                <div className="mb-4 px-4 py-3 rounded-xl border bg-red-50 border-red-200 text-red-800">
                  <p className="font-semibold text-sm">No se pudo cargar PayPal</p>
                  <p className="text-xs mt-0.5 opacity-90">Verifica tu conexión o el Client ID.</p>
                </div>
              )}

              {status === 'processing' && (
                <div className="mb-4 px-4 py-4 rounded-xl border bg-brand-50 border-brand-200 text-brand-800 flex items-center gap-3">
                  <svg className="w-5 h-5 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">Procesando cobro en PayPal...</p>
                    <p className="text-xs mt-0.5 opacity-90">No cierres esta ventana.</p>
                  </div>
                </div>
              )}

              {status === 'success' && (
                <div className="mb-4 px-4 py-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-800 flex items-center gap-3">
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">¡Cobro realizado con éxito!</p>
                    <p className="text-xs mt-0.5 opacity-90">Desbloqueando tu carta...</p>
                  </div>
                </div>
              )}

              {status === 'error' && (
                <div className="mb-4 px-4 py-3 rounded-xl border bg-red-50 border-red-200 text-red-800">
                  <p className="font-semibold text-sm">Error en el pago</p>
                  <p className="text-xs mt-1 opacity-90">{errorMsg}</p>
                  <button
                    onClick={() => { setStatus('idle'); setErrorMsg(null) }}
                    className="mt-2 text-xs font-semibold underline"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              )}

              <div className={`mt-auto space-y-3 ${isResolved && status !== 'success' ? 'block' : 'hidden'}`}>
                <PayPalButtons
                  style={{
                    layout: 'vertical',
                    shape: 'rect',
                    color: 'gold',
                    label: 'pay',
                    height: 48
                  }}
                  forceReRender={[card.id, card.price]}

                  createOrder={(data, actions) =>
                    actions.order.create({
                      purchase_units: [{
                        description: `PokéCard: ${card.name} (${card.rarity.label})`,
                        amount: {
                          value: card.price.toFixed(2),
                          currency_code: 'USD'
                        }
                      }],
                      application_context: {
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW',
                        brand_name: 'PokéCards Market'
                      }
                    })
                  }

                  onApprove={(data) => {
                    processPayment(data.orderID)
                  }}

                  onError={(err) => {
                    console.error('PayPal SDK error:', err)
                    setStatus('error')
                    setErrorMsg('Error de PayPal. Intenta de nuevo.')
                    onError?.(err)
                  }}

                  onCancel={() => {
                    setStatus('error')
                    setErrorMsg('Cerraste la ventana sin pagar. La carta sigue bloqueada.')
                  }}
                />

                <p className="text-[11px] text-ink-400 text-center leading-relaxed">
                  🔒 Entorno <strong>PayPal Sandbox</strong> · No se realizan cobros reales
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseModal