import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import DescuentosAdminPanel from '../../components/DescuentosAdminPanel';
import Dashboard from './Dashboard';
import AdminNavigation from './AdminNavigation';
import GestionProductos from './GestionProductos';

const AdminPanel = ({ user }) => {
  const navigate = useNavigate();
  const [showDescuentos, setShowDescuentos] = useState(false);

  useEffect(() => {
    // if (!user || user.role?.toLowerCase() !== 'admin') {
    //   navigate('/');
    // }
  }, [user, navigate]);

  return (
    <>
      <AdminNavigation />
      <div className="p-6 font-sans">
        <h1 className="text-2xl font-bold text-leather-800 " >Dashboard</h1>
        <h2 className="text-2l font-bold text-leather-800 ">Bienvenido {user?.name},</h2>
      </div>
      <Routes>
        <Route path='/' element={
          <Dashboard/>
        }/>
        <Route path='/productos' element={
          <GestionProductos/>
        }/>

      </Routes>
      
    </>
    // {/* <div className="min-h-screen bg-cream-50 py-12 px-4 flex items-center justify-center relative">
    //     <h1
    //       className="text-3xl font-bold text-leather-800 cursor-pointer hover:underline hover:text-leather-600 transition-colors duration-200"
    //       onClick={() => setShowDescuentos(true)}
    //     >
    //       Gestionar Descuentos
    //     </h1>
    //     {showDescuentos && (
    //       <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
    //         <DescuentosAdminPanel user={user} visible={true} onClose={() => setShowDescuentos(false)} fullPage={false} />
    //       </div>
    //     )}
    //   </div> */}
  );
};

export default AdminPanel; 