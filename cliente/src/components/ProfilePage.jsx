import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DetalleCompra from "./DetalleCompra";
import DireccionesPanel from "./DireccionesPanel";
import { FaUser, FaMapMarkedAlt, FaShoppingCart } from "react-icons/fa";
import Footer from '../components/Footer';
import { fetchMyOrders, fetchOrderDetail } from "../store/slices/ordersSlice";
import { useLocation } from 'react-router-dom';
import { updateProfile, changePassword, clearUpdateProfileStatus, clearChangePasswordStatus } from '../store/slices/usersSlice';

const ProfilePage = () => {
  const user = useSelector((state) => state.users.user);
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("perfil");
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [compraAbiertaId, setCompraAbiertaId] = useState(null);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Redux selectors para compras y detalle
  const misCompras = useSelector((state) => state.orders.myOrders);
  const loadingMisCompras = useSelector((state) => state.orders.loadingMyOrders);
  const errorMisCompras = useSelector((state) => state.orders.errorMyOrders);
  const compraDetalle = useSelector((state) => state.orders.orderDetail);
  const loadingDetalle = useSelector((state) => state.orders.loadingOrderDetail);
  const errorDetalle = useSelector((state) => state.orders.errorOrderDetail);

  const updateProfileLoading = useSelector((state) => state.users.updateProfileLoading);
  const updateProfileError = useSelector((state) => state.users.updateProfileError);
  const updateProfileSuccess = useSelector((state) => state.users.updateProfileSuccess);
  const changePasswordLoading = useSelector((state) => state.users.changePasswordLoading);
  const changePasswordError = useSelector((state) => state.users.changePasswordError);
  const changePasswordSuccess = useSelector((state) => state.users.changePasswordSuccess);

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchMyOrders(user.token));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (location.state && location.state.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const verDetalleCompra = (id) => {
    if (compraAbiertaId === id) {
      setCompraAbiertaId(null);
      return;
    }
    setCompraAbiertaId(id);
    dispatch(fetchOrderDetail({ token: user.token, id }));
  };

  const mostrarInfoEntrega = (compra) => {
    if (compra.direccionEntrega)
      return `${compra.direccionEntrega?.calle ?? ""} ${compra.direccionEntrega?.numero ?? ""}, ${compra.direccionEntrega?.localidad ?? ""}`;
    if (compra.puntoRetiro)
      return `${compra.puntoRetiro?.nombre ?? ""} - ${compra.puntoRetiro?.direccion ?? ""}, ${compra.puntoRetiro?.localidad ?? ""}`;
    return compra.metodoEntrega || "Sin información de entrega";
  };

  const formatearMetodoPago = (m) => ({
    EFECTIVO: "Efectivo",
    TARJETA_CREDITO: "Tarjeta de Crédito",
    TARJETA_DEBITO: "Tarjeta de Débito",
    MERCADO_PAGO: "Mercado Pago",
    TRANSFERENCIA: "Transferencia Bancaria",
  }[m] || m);

  const handleSave = () => {
    dispatch(updateProfile({ token: user.token, firstName: formData.firstName, lastName: formData.lastName }));
  };

  useEffect(() => {
    if (updateProfileSuccess) {
      setEditMode(false);
      setProfileMessage("Perfil actualizado correctamente.");
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileMessage(null);
        setProfileSuccess(false);
      }, 2000);
      dispatch(clearUpdateProfileStatus());
    } else if (updateProfileError) {
      setProfileMessage("Hubo un error al guardar los cambios.");
      setProfileSuccess(false);
    }
  }, [updateProfileSuccess, updateProfileError, dispatch]);

  const handleChangePassword = () => {
    dispatch(changePassword({ token: user.token, oldPassword, newPassword }));
  };

  useEffect(() => {
    if (changePasswordSuccess) {
      setPasswordMessage("¡Contraseña cambiada!");
      setPasswordSuccess(true);
      setTimeout(() => {
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
        setPasswordMessage(null);
        setPasswordSuccess(false);
      }, 2000);
      dispatch(clearChangePasswordStatus());
    } else if (changePasswordError) {
      let msg = changePasswordError;
      if (
        msg === "Request failed with status code 400" ||
        msg?.toString().includes("400")
      ) {
        msg = "La contraseña actual es incorrecta.";
      }
      setPasswordMessage(msg || "Error al cambiar contraseña");
      setPasswordSuccess(false);
    }
  }, [changePasswordSuccess, changePasswordError, dispatch]);

  if (!user)
    return <div className="min-h-screen flex items-center justify-center text-orange-800 text-xl">Cargando perfil...</div>;

  return (
    <div className="bg-cream-50 min-h-screen flex flex-col justify-between font-sans">
      <div>
        <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-10">
            <aside className="w-full md:w-64 bg-white/90 shadow-lg rounded-2xl p-6 space-y-6 border border-leather-200">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-leather-200 text-leather-800 text-3xl rounded-full flex items-center justify-center font-bold shadow-inner">
                  {user.firstName?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div className="mt-2 text-xs text-leather-700">{user.email}</div>
              </div>
              <nav className="space-y-2">
                <button onClick={() => setActiveTab("perfil")} className={`w-full text-left px-4 py-2 rounded transition text-leather-800 ${activeTab === "perfil" ? "bg-leather-100 font-bold" : "hover:bg-leather-50"}`}><FaUser className="inline mr-2" /> Perfil</button>
                <button onClick={() => setActiveTab("compras")} className={`w-full text-left px-4 py-2 rounded transition text-leather-800 ${activeTab === "compras" ? "bg-leather-100 font-bold" : "hover:bg-leather-50"}`}><FaShoppingCart className="inline mr-2" /> Mis Compras</button>
                <button onClick={() => setActiveTab("envios")} className={`w-full text-left px-4 py-2 rounded transition text-leather-800 ${activeTab === "envios" ? "bg-leather-100 font-bold" : "hover:bg-leather-50"}`}><FaMapMarkedAlt className="inline mr-2" /> Direcciones</button>
              </nav>
            </aside>

            <main className="flex-1 space-y-8">
              {activeTab === "perfil" && (
                <div className="bg-white/90 shadow-lg rounded-2xl p-8 border border-leather-200 animate-fade-in">
                  <h2 className="text-2xl font-bold text-leather-900 mb-6">Perfil de Usuario</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-leather-700">Nombre:</span>
                      {editMode ? <input name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="border p-1 rounded ml-2 focus:ring-2 focus:ring-leather-400" /> : <span className="ml-2">{user.firstName}</span>}
                    </div>
                    <div>
                      <span className="text-leather-700">Apellido:</span>
                      {editMode ? <input name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="border p-1 rounded ml-2 focus:ring-2 focus:ring-leather-400" /> : <span className="ml-2">{user.lastName}</span>}
                    </div>
                    <div className="col-span-2">
                      <span className="text-leather-700">Email:</span>
                      <span className="ml-2">{user.email}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    {!editMode ? (
                      <>
                        <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-leather-800 text-white rounded hover:bg-leather-900 transition-all duration-300 shadow">Cambiar contraseña</button>
                        <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-leather-800 text-white rounded hover:bg-leather-900 transition-all duration-300 shadow">Editar perfil</button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300 shadow">Guardar</button>
                        {profileMessage && (
                          <div className={`ml-4 inline-block text-sm ${profileSuccess ? "text-green-600" : "text-red-600"}`}>
                            {profileMessage}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "compras" && (
                <div className="bg-white/90 shadow-lg rounded-2xl p-8 border border-leather-200 animate-fade-in">
                  <h3 className="text-xl font-bold text-leather-900 mb-4">Historial de Compras</h3>
                  {loadingMisCompras ? (
                    <p className="text-orange-500">Cargando compras...</p>
                  ) : errorMisCompras ? (
                    <p className="text-red-500">Error: {errorMisCompras}</p>
                  ) : misCompras.length === 0 ? (
                    <p className="text-leather-500">No tenés compras registradas.</p>
                  ) : (
                    <div className="space-y-4">
                      {misCompras.map((compra, i) => (
                        <div key={i} className="border p-4 rounded-lg bg-leather-50 shadow-sm">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold text-leather-800">Compra #{compra.id}</p>
                              <p className="text-sm text-leather-600">{new Date(compra.fecha).toLocaleString()}</p>
                            </div>
                            <button onClick={() => verDetalleCompra(compra.id)} className="text-sm text-leather-700 underline">
                              {compraAbiertaId === compra.id ? "Ocultar detalle" : "Ver detalle"}
                            </button>
                          </div>
                          <p className="text-leather-700 text-sm mt-2">Entrega: {mostrarInfoEntrega(compra)}</p>
                          <p className="text-leather-700 text-sm">Pago: {formatearMetodoPago(compra.metodoDePago)}</p>
                          <p className="text-leather-700 text-sm">Total: ${compra.total?.toLocaleString()}</p>
                          {compraAbiertaId === compra.id && (
                            <div className="mt-4">
                              {loadingDetalle ? (
                                <p className="text-orange-500">Cargando detalle...</p>
                              ) : errorDetalle ? (
                                <p className="text-red-500">Error: {errorDetalle}</p>
                              ) : compraDetalle && compraDetalle.id === compra.id ? (
                                <DetalleCompra compra={compraDetalle} onClose={() => setCompraAbiertaId(null)} />
                              ) : null}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "envios" && <DireccionesPanel />}
            </main>
          </div>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
              <h3 className="text-lg font-light text-leather-900 mb-4">Cambiar Contraseña</h3>
              <input type="password" placeholder="Contraseña actual" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-2 mb-3 rounded focus:ring focus:ring-[rgb(146_107_64)] focus:ring-opacity-40 focus:border-[rgb(146_107_64)] focus:outline-none" />
              <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-300 px-4 py-2 mb-4 rounded focus:ring focus:ring-[rgb(146_107_64)] focus:ring-opacity-40 focus:border-[rgb(146_107_64)] focus:outline-none" />
              {passwordMessage && (
                <div className={`mb-2 text-sm ${passwordSuccess ? "text-green-600" : "text-red-600"}`}>
                  {passwordMessage}
                </div>
              )}
              <div className="flex justify-end gap-2">
                <button onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordMessage(null);
                  setPasswordSuccess(false);
                }} className="text-sm text-leather-700">Cancelar</button>
                <button onClick={handleChangePassword} className="px-3 py-1 bg-[#2C1810] text-[#F7F3E9] rounded hover:bg-[#3d2417] text-sm">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
