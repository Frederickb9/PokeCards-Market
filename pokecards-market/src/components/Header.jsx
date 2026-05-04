import React from 'react';
// Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import logoPng from '../assets/poke_logo.png'; 

/**
 * Header: PokéCards Market
 * UI/UX Senior Refactor: Glassmorphism, Premium Typography & Gold Gradients.
 */
const Header = ({ view, onViewChange, collectionCount }) => {
  return (
    <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-amber-100/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Branding Section */}
        <div className="flex items-center gap-4">
          {/* Logo Container con efecto de profundidad */}
          <div className="relative w-14 h-14 flex items-center justify-center group">
            <div className="absolute inset-0 bg-amber-400/20 rounded-full blur-md group-hover:bg-amber-400/30 transition-colors" />
            <img 
              src={logoPng} 
              alt="PokéCards Market Logo" 
              className="relative w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Text Stack - Refined Hierarchy */}
          <div className="hidden sm:block">
            <h1 className="font-display font-black text-2xl leading-none tracking-tight 
                           bg-clip-text text-transparent bg-gradient-to-r 
                           from-yellow-600 via-amber-500 to-yellow-600 
                           drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
              PokéCards Market
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-[1px] w-4 bg-amber-600/40" /> 
              <p className="text-[10px] font-bold text-amber-800/70 tracking-[0.25em] uppercase">
                Colección digital premium
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex items-center gap-1.5 bg-gray-100/80 p-1.5 rounded-2xl border border-gray-200/50">
          <NavButton
            active={view === 'market'}
            onClick={() => onViewChange('market')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4M3 7v10l9 4 9-4V7M3 7l9 4m0 0l9-4m-9 4v10" />
              </svg>
            }
            label="Mercado"
          />
          <NavButton
            active={view === 'collection'}
            onClick={() => onViewChange('collection')}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
            label="Mi Colección"
            badge={collectionCount}
          />
        </nav>
      </div>
    </header>
  );
};

/**
 * NavButton: Componente interno para los items de navegación
 */
const NavButton = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`
      relative px-4 py-2.5 rounded-xl text-sm font-bold
      flex items-center gap-2.5 transition-all duration-300 ease-out
      ${active
        ? 'bg-white text-amber-600 shadow-md transform scale-105'
        : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
      }
    `}
  >
    <span className={active ? 'text-amber-500' : 'text-gray-400'}>
      {icon}
    </span>
    <span className="hidden md:inline">{label}</span>
    
    {typeof badge === 'number' && badge > 0 && (
      <span className={`
        flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-black
        ${active ? 'bg-amber-500 text-white' : 'bg-gray-300 text-gray-600'}
      `}>
        {badge}
      </span>
    )}
  </button>
);

export default Header;