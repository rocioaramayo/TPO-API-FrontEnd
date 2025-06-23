// src/pages/admin/AdminPanel.jsx
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DescuentosAdminPanel from './DescuentosAdminPanel';
import Dashboard from './Dashboard';
import GestionProductos from './GestionProductos';
import GestionUsuarios from './GestionUsuarios';
import GestionComprasAdmin from './GestionComprasAdmin';
import GestionCategorias from './GestionCategorias';
import GestionEntregas from './GestionEntregas';

const AdminPanel = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || user?.role?.toLowerCase() !== 'admin') {
      navigate('/');
    }
  }, [user, isAuthenticated, navigate]);

  return (
    <>
      <Routes>
        <Route path='/' element={ <Dashboard/>} />
        <Route path='/productos' element={<GestionProductos />} />
        <Route path='/usuarios' element={<GestionUsuarios />} />
        {/* <Route path='/productos/crear' element={<FormCrearProducto />} /> */}
        {/* <Route path='/productos/editar/*' element={<FormEditarProducto />} /> */}
        <Route path='/descuentos' element={
          <DescuentosAdminPanel fullPage={true} visible={true} onClose={() => navigate('/admin')} />
        } />
        <Route path='/entregas' element={<GestionEntregas />} />
        {/* <Route path='/entregas/crearMetodo' element={<FormCrearMetodoEntrega />} /> */}
        {/* <Route path='/entregas/crearPunto' element={<FormCrearPuntoEntrega />} /> */}

        <Route path="/compras" element={<GestionComprasAdmin />} />
        <Route path='/categorias' element={<GestionCategorias />} />

      </Routes>
    </>
  );
};

export default AdminPanel;
