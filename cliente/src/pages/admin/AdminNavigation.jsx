import { Link } from 'react-router-dom';
import { useState } from 'react';

const AdminNavigation = () => {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <nav className="bg-white shadow-sm border-b border-leather-200 sticky top-0 z-50" role="navigation" aria-label="Navegación de administrador">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo y texto */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center group" aria-label="Ir al inicio">
                            <div className="flex items-center justify-center bg-white">
                                <img
                                    src="/foto-toro-logo.png"
                                    alt="Logo Cuero Argentino"
                                    className="w-12 h-12 mr-2 object-contain"
                                />
                            </div>
                            <div className="hidden sm:block leading-tight">
                                <h1 className="text-xl font-serif font-bold text-leather-900 group-hover:text-leather-700 transition-colors duration-200">
                                    Cuero Argentino
                                </h1>
                                <p className="text-xs text-leather-600 -mt-1">
                                    Artesanía Premium
                                </p>
                            </div>
                        </Link>
                    </div>

                    {/* Botón volver y hamburguesa */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="hidden lg:inline-block bg-leather-800 text-white hover:bg-leather-900 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Volver a inicio
                        </Link>

                        {/* Botón hamburguesa (mobile) */}
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="lg:hidden p-2 rounded hover:bg-gray-100"
                        >
                            <svg className="w-6 h-6 text-leather-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {showMenu ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú desplegable solo visible en mobile */}
            {showMenu && (
                <div className="lg:hidden border-t border-leather-100 bg-white shadow-md z-40">
                    <div className="px-4 py-4 space-y-2">
                        <Link to="/admin" onClick={() => setShowMenu(false)} className="block text-leather-800 hover:text-leather-900">
                            Panel Admin
                        </Link>
                        <Link to="/" onClick={() => setShowMenu(false)} className="block text-leather-800 hover:text-leather-900">
                            Volver a inicio
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default AdminNavigation;
