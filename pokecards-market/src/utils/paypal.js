const PAYPAL_API = 'https://api-m.sandbox.paypal.com'
const CLIENT_ID = 'ATIHBO70DKmOQ-SO-izQqPHE-D3fGk08flk8LHFBCjHiEiaMl7ErjnRYw9v4NTzw1yo_T-PeupxvKZcK'
const CLIENT_SECRET = 'EAupiPfgRYNLjO1NLFwHDDyEMlALmvWwnYPu4y3NtSKIe-J2psMJ-NnYcccNZETh-OrUeJBKaSxaQxgG'

const getAccessToken = async () => {
  const auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })
  if (!response.ok) throw new Error(`OAuth failed: ${response.status}`)
  const data = await response.json()
  return data.access_token
}

export const captureOrder = async (orderID) => {
  const accessToken = await getAccessToken()
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`)
  return data
}

export const getOrderDetails = async (orderID) => {
  const accessToken = await getAccessToken()
  const response = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderID}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}