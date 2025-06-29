// src/pages/admin/AdminPanel.jsx
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Dashboard from './Dashboard';
import GestionProductos from './GestionProductos';
import GestionUsuarios from './GestionUsuarios';
import GestionComprasAdmin from './GestionComprasAdmin';
import GestionCategorias from './GestionCategorias';
import GestionEntregas from './GestionEntregas';
import DescuentosAdminPanel from './DescuentosAdminPanel';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.users);

  useEffect(() => {
    const esAdmin = user?.role?.toLowerCase() === 'admin';
    if (!isAuthenticated || !esAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, user, navigate]);

  return (
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/productos" element={<GestionProductos />} />
        <Route path="/usuarios" element={<GestionUsuarios />} />
        <Route path="/descuentos" element={
          <DescuentosAdminPanel fullPage={true} visible={true} onClose={() => navigate('/admin')} />
        } />
        <Route path="/entregas" element={<GestionEntregas />} />
        <Route path="/compras" element={<GestionComprasAdmin />} />
        <Route path="/categorias" element={<GestionCategorias />} />

        {/* Rutas futuras que podés descomentar cuando estén listas */}
        {/*
        <Route path="/productos/crear" element={<FormCrearProducto />} />
        <Route path="/productos/editar/*" element={<FormEditarProducto />} />
        <Route path="/entregas/crearMetodo" element={<FormCrearMetodoEntrega />} />
        <Route path="/entregas/crearPunto" element={<FormCrearPuntoEntrega />} />
      */}

        {/* Fallback: si no matchea ninguna ruta */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
  );
};

export default AdminPanel;
