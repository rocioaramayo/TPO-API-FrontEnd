// src/components/Navigation.jsx
import { Link } from 'react-router-dom';

const AdminNavigation = () => {
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

                    {/* Botón volver */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="bg-leather-800 text-white hover:bg-leather-900 font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Volver a inicio
                        </Link>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default AdminNavigation;
