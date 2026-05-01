import { useState, useEffect } from 'react'
import { PayPalButtons } from '@paypal/react-paypal-js'
import { TYPE_META } from '../utils/api'

/**
 * Modal de compra con integración de PayPal Sandbox.
 *
 * Flujo de pago:
 *  1. createOrder → crea la orden en PayPal con el precio de la carta.
 *  2. onApprove → captura el pago y valida que el status sea COMPLETED.
 *  3. Si es COMPLETED → desbloquea la carta y dispara onSuccess.
 *  4. Si falla o se cancela → muestra error y mantiene la carta bloqueada.
 */
const PurchaseModal = ({ card, onClose, onSuccess, onError }) => {
  const [status, setStatus] = useState('idle')  // 'idle' | 'processing' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState(null)

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && status !== 'processing' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose, status])

  // Bloquear scroll del body
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={status !== 'processing' ? onClose : undefined}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink-950/60 backdrop-blur-md" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header del modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <div>
            <h2 className="font-display font-bold text-xl text-ink-900">Confirmar compra</h2>
            <p className="text-xs text-ink-500 mt-0.5">Procesa tu pago de forma segura con PayPal</p>
          </div>
          {status !== 'processing' && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-ink-100 flex items-center justify-center text-ink-500 transition"
              aria-label="Cerrar"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="overflow-y-auto max-h-[calc(92vh-65px)]">
          <div className="grid md:grid-cols-2 gap-0">

            {/* Vista previa de la carta */}
            <div className="bg-gradient-to-br from-ink-50 via-white to-brand-50/30 p-6 md:p-8">
              <div className="aspect-[3/4] max-w-sm mx-auto rounded-2xl bg-white border border-ink-100 p-6 flex flex-col">
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
                  <div className="flex justify-center gap-1 mt-1">
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

            {/* Resumen de compra + PayPal */}
            <div className="p-6 md:p-8 flex flex-col">

              {/* Resumen de la orden */}
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
                      ${card.price.toFixed(2)} <span className="text-sm text-ink-400">USD</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Estados visuales */}
              {status === 'processing' && (
                <StatusBlock
                  variant="info"
                  title="Procesando pago..."
                  message="Estamos validando tu transacción con PayPal. No cierres esta ventana."
                />
              )}

              {status === 'error' && (
                <StatusBlock
                  variant="error"
                  title="Error en el pago"
                  message={errorMsg || 'No se pudo completar la transacción. La carta sigue bloqueada.'}
                />
              )}

              {/* Botones de PayPal */}
              {status !== 'processing' && status !== 'success' && (
                <div className="paypal-button-wrapper mt-auto">
                  <PayPalButtons
                    style={{
                      layout: 'vertical',
                      shape: 'rect',
                      color: 'gold',
                      label: 'pay',
                      height: 45
                    }}
                    forceReRender={[card.id, card.price]}
                    /* 1) Crea la orden con el precio de la carta y contexto extra */
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [{
                          description: `PokéCard digital: ${card.name} (${card.rarity.label})`,
                          amount: {
                            value: card.price.toFixed(2),
                            currency_code: 'USD'
                          }
                        }],
                        application_context: {
                          shipping_preference: 'NO_SHIPPING',
                          user_action: 'PAY_NOW',
                          brand_name: 'Pokecards Market'
                        }
                      })
                    }}
                    /* 2) Captura el pago y valida el status, manejando cierres inesperados */
                    onApprove={async (data, actions) => {
                      setStatus('processing')
                      setErrorMsg(null)
                      try {
                        const details = await actions.order.capture()
                        // Validación de éxito: el status debe ser COMPLETED
                        if (details.status === 'COMPLETED') {
                          setStatus('success')
                          // Pequeño delay para que el usuario vea el feedback
                          setTimeout(() => onSuccess(card, details), 800)
                        } else {
                          throw new Error(`Estado inesperado: ${details.status}`)
                        }
                      } catch (err) {
                        // Aquí atrapamos el error "Window closed before response" de la línea 185
                        console.error('Error al capturar:', err)
                        setStatus('error')
                        setErrorMsg('La ventana de pago se cerró o hubo un problema al validar. Intenta de nuevo.')
                        onError?.(err)
                      }
                    }}
                    /* 3) Manejo de errores internos de PayPal */
                    onError={(err) => {
                      console.error('PayPal error:', err)
                      setStatus('error')
                      setErrorMsg('Hubo un problema de conexión con PayPal. La carta sigue bloqueada.')
                      onError?.(err)
                    }}
                    /* 4) Manejo de cancelación intencional por el usuario */
                    onCancel={() => {
                      setStatus('error')
                      setErrorMsg('Cancelaste el proceso de compra. Puedes intentar de nuevo cuando gustes.')
                    }}
                  />
                  <p className="text-[11px] text-ink-400 text-center mt-3 leading-relaxed">
                    🔒 Pago procesado en entorno <strong>Sandbox</strong>. No se realizan cobros reales.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatusBlock = ({ variant, title, message }) => {
  const styles = {
    info:  'bg-brand-50 border-brand-200 text-brand-800',
    error: 'bg-red-50 border-red-200 text-red-800',
  }
  return (
    <div className={`mb-4 px-4 py-3 rounded-xl border ${styles[variant]}`}>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs mt-0.5 opacity-90">{message}</p>
    </div>
  )
}

export default PurchaseModal