/**
 * Footer minimalista con créditos y enlaces a las APIs usadas.
 */
const Footer = () => {
  return (
    <footer className="mt-20 py-10 border-t border-ink-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2 text-ink-500">
            <span>Construido con</span>
            <a href="https://pokeapi.co/" target="_blank" rel="noopener noreferrer" className="text-ink-700 hover:text-brand-600 font-medium transition">
              PokéAPI
            </a>
            <span>·</span>
            <a href="https://developer.paypal.com/" target="_blank" rel="noopener noreferrer" className="text-ink-700 hover:text-brand-600 font-medium transition">
              PayPal Sandbox
            </a>
          </div>
          <p className="text-ink-400 text-xs">
            PokéCards Market · Proyecto educativo · {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer