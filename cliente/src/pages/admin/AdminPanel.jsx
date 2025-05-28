import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DescuentosAdminPanel from '../../components/DescuentosAdminPanel';
import Dashboard from './Dashboard';
import AdminNavigation from './AdminNavigation';
import GestionProductos from './GestionProductos';
import FormCrearProducto from './FormCrearProducto';
import FormEditarProducto from './FormEditarProducto';

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
        <Route path='/' element={
          <Dashboard user={user}/>
        }/>
        <Route path='/productos' element={
          <GestionProductos user={user}/>
        }/>
        <Route path='/productos/crear' element={
          <FormCrearProducto user={user}/>
        }/>
        <Route path='/productos/editar/*' element={
          <FormEditarProducto user={user}/>
        }/>
        <Route path='/descuentos' element={<DescuentosAdminPanel user={user} fullPage={true} visible={true} onClose={() => navigate('/admin')} />} />
      </Routes>
    </>
  );
};

export default AdminPanel; 