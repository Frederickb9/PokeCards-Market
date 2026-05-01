/**
 * Header sticky con navegación entre Mercado y Mi Colección.
 * Usa glassmorphism sutil para integrarse con el fondo.
 */
const Header = ({ view, onViewChange, collectionCount }) => {
  return (
    <header className="sticky top-0 z-30 glass border-b border-ink-100/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl rotate-3" />
            <div className="absolute inset-0 bg-gradient-to-br from-gold-300 to-gold-500 rounded-xl -rotate-3 opacity-60" />
            <div className="relative w-full h-full rounded-xl bg-ink-900 flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">P</span>
            </div>
          </div>
          <div className="hidden sm:block">
            <h1 className="font-display font-bold text-ink-900 text-lg leading-tight">
              PokéCards Market
            </h1>
            <p className="text-[11px] text-ink-500 tracking-wide uppercase">
              Colección digital premium
            </p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex items-center gap-1 bg-ink-100/60 p-1 rounded-xl">
          <NavButton
            active={view === 'market'}
            onClick={() => onViewChange('market')}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4m0 0l9-4m-9 4v10" />
              </svg>
            }
            label="Mercado"
          />
          <NavButton
            active={view === 'collection'}
            onClick={() => onViewChange('collection')}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            label="Mi Colección"
            badge={collectionCount}
          />
        </nav>
      </div>
    </header>
  )
}

const NavButton = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`
      relative px-3 sm:px-4 py-2 rounded-lg text-sm font-medium
      flex items-center gap-2 transition-all duration-200
      ${active
        ? 'bg-white text-ink-900 shadow-soft'
        : 'text-ink-600 hover:text-ink-900'
      }
    `}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    {typeof badge === 'number' && badge > 0 && (
      <span className={`
        ml-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold
        ${active ? 'bg-brand-100 text-brand-700' : 'bg-ink-200 text-ink-700'}
      `}>
        {badge}
      </span>
    )}
  </button>
)

export default Header