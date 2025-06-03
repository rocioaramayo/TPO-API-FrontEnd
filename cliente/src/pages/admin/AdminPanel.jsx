// src/pages/admin/AdminPanel.jsx
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DescuentosAdminPanel from './DescuentosAdminPanel';
import Dashboard from './Dashboard';
import GestionProductos from './GestionProductos';
import FormCrearProducto from './FormCrearProducto';
import FormEditarProducto from './FormEditarProducto';
import GestionUsuarios from './GestionUsuarios';
import GestionComprasAdmin from './GestionComprasAdmin';
import GestionCategorias from './GestionCategorias';
import GestionEntregas from './GestionEntregas';
import FormCrearPuntoEntrega from './FormCrearPuntoEntrega';
import FormCrearMetodoEntrega from './FormCrearMetodoEntrega';

const AdminPanel = ({ user, productos }) => {
  const navigate = useNavigate();
  const [showDescuentos, setShowDescuentos] = useState(false);

  useEffect(() => {
    if (!user || user.role?.toLowerCase() !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard user={user} />} />
        <Route path='/productos' element={<GestionProductos user={user} />} />
        <Route path='/usuarios' element={<GestionUsuarios user={user} />} />
        <Route path='/productos/crear' element={<FormCrearProducto user={user} />} />
        <Route path='/productos/editar/*' element={<FormEditarProducto user={user} />} />
        <Route path='/descuentos' element={
          <DescuentosAdminPanel user={user} fullPage={true} visible={true} onClose={() => navigate('/admin')} />
        } />
        <Route path='/entregas' element={<GestionEntregas />} />
        <Route path='/entregas/crearMetodo' element={<FormCrearMetodoEntrega />} />
        <Route path='/entregas/crearPunto' element={<FormCrearPuntoEntrega />} />

        <Route path="/compras" element={<GestionComprasAdmin user={user} />} />
        <Route path='/categorias' element={<GestionCategorias user={user} />} />

      </Routes>
    </>
  );
};

export default AdminPanel;
