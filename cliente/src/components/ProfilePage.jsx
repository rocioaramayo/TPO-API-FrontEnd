import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DetalleCompra from "./DetalleCompra";
import DireccionesPanel from "./DireccionesPanel";
import { FaUser, FaMapMarkedAlt, FaShoppingCart } from "react-icons/fa";
import Footer from '../components/Footer';

const ProfilePage = () => {
  const user = useSelector((state) => state.users.user);
  const [activeTab, setActiveTab] = useState("perfil");
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [misCompras, setMisCompras] = useState([]);
  const [compraDetalle, setCompraDetalle] = useState(null);
  const [compraAbiertaId, setCompraAbiertaId] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  useEffect(() => {
    if (user?.token) {
      fetch("http://localhost:8080/compras/mias", {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then(setMisCompras)
        .catch(console.error);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const verDetalleCompra = (id) => {
    if (compraAbiertaId === id) {
      setCompraAbiertaId(null);
      setCompraDetalle(null);
      return;
    }
    setLoadingDetalle(true);
    fetch(`http://localhost:8080/compras/${id}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((detalle) => {
        setCompraDetalle(detalle);
        setCompraAbiertaId(id);
        setLoadingDetalle(false);
      })
      .catch((err) => {
        alert("Error al cargar detalle: " + err.message);
        setLoadingDetalle(false);
      });
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
    fetch(`http://localhost:8080/api/v1/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName }),
    })
      .then((res) => res.json())
      .then(() => setEditMode(false))
      .catch(() => alert("Error al guardar los cambios"));
  };

  const handleChangePassword = () => {
    fetch(`http://localhost:8080/api/v1/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
      .then((res) => res.ok ? res : res.json().then(err => { throw new Error(err.message); }))
      .then(() => {
        alert("¡Contraseña cambiada!");
        setShowPasswordModal(false);
        setOldPassword("");
        setNewPassword("");
      })
      .catch((e) => alert(e.message));
  };

  if (!user)
    return <div className="min-h-screen flex items-center justify-center text-orange-800 text-xl">Cargando perfil...</div>;

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-100 min-h-screen flex flex-col justify-between">
      <div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-12">
            <aside className="w-full md:w-64 bg-white/90 shadow-xl rounded-xl p-6 space-y-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-orange-300 text-white text-3xl rounded-full flex items-center justify-center font-bold shadow-inner">
                  {user.firstName?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <div className="mt-2 text-sm text-orange-950">{user.email}</div>
              </div>
              <nav className="space-y-2">
                <button onClick={() => setActiveTab("perfil")} className={`w-full text-left px-4 py-2 rounded transition text-orange-950 ${activeTab === "perfil" ? "bg-orange-100 font-light" : "hover:bg-orange-50"}`}><FaUser className="inline mr-2" /> Perfil</button>
                <button onClick={() => setActiveTab("compras")} className={`w-full text-left px-4 py-2 rounded transition text-orange-950 ${activeTab === "compras" ? "bg-orange-100 font-light" : "hover:bg-orange-50"}`}><FaShoppingCart className="inline mr-2" /> Mis Compras</button>
                <button onClick={() => setActiveTab("envios")} className={`w-full text-left px-4 py-2 rounded transition text-orange-950 ${activeTab === "envios" ? "bg-orange-100 font-light" : "hover:bg-orange-50"}`}><FaMapMarkedAlt className="inline mr-2" /> Direcciones</button>
              </nav>
            </aside>

            <main className="flex-1 space-y-8">
              {activeTab === "perfil" && (
                <div className="bg-white/90 shadow-xl rounded-xl p-8 animate-fade-in">
                  <h2 className="text-2xl font-light text-orange-900 mb-6">Perfil de Usuario</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-orange-700">Nombre:</span>
                      {editMode ? <input name="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="border p-1 rounded ml-2" /> : <span className="ml-2">{user.firstName}</span>}
                    </div>
                    <div>
                      <span className="text-orange-700">Apellido:</span>
                      {editMode ? <input name="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="border p-1 rounded ml-2" /> : <span className="ml-2">{user.lastName}</span>}
                    </div>
                    <div className="col-span-2">
                      <span className="text-orange-700">Email:</span>
                      <span className="ml-2">{user.email}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-4">
                    {!editMode ? (
                      <>
                        <button onClick={() => setShowPasswordModal(true)} className="px-4 py-2 bg-[#2C1810] text-[#F7F3E9] rounded hover:bg-[#3d2417] transition-all duration-300 shadow">Cambiar contraseña</button>
                        <button onClick={() => setEditMode(true)} className="px-4 py-2 bg-[#2C1810] text-[#F7F3E9] rounded hover:bg-[#3d2417] transition-all duration-300 shadow">Editar perfil</button>
                      </>
                    ) : (
                      <button onClick={handleSave} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300 shadow">Guardar</button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "compras" && (
                <div className="bg-white/90 shadow-xl rounded-xl p-8 animate-fade-in">
                  <h3 className="text-xl font-light text-orange-950 mb-4">Historial de Compras</h3>
                  {misCompras.length === 0 ? (
                    <p className="text-orange-500">No tenés compras registradas.</p>
                  ) : (
                    <div className="space-y-4">
                      {misCompras.map((compra, i) => (
                        <div key={i} className="border p-4 rounded-lg bg-orange-50 shadow-sm">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-light text-orange-800">Compra #{compra.id}</p>
                              <p className="text-sm text-orange-600">{new Date(compra.fecha).toLocaleString()}</p>
                            </div>
                            <button onClick={() => verDetalleCompra(compra.id)} className="text-sm text-orange-700 underline">
                              {compraAbiertaId === compra.id ? "Ocultar detalle" : "Ver detalle"}
                            </button>
                          </div>
                          <p className="text-orange-700 text-sm mt-2">Entrega: {mostrarInfoEntrega(compra)}</p>
                          <p className="text-orange-700 text-sm">Pago: {formatearMetodoPago(compra.metodoDePago)}</p>
                          <p className="text-orange-700 text-sm">Total: ${compra.total?.toLocaleString()}</p>
                          {compraAbiertaId === compra.id && compraDetalle && (
                            <div className="mt-4">
                              <DetalleCompra compra={compraDetalle} />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "envios" && <DireccionesPanel token={user.token} />}
            </main>
          </div>
        </div>

        {showPasswordModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
              <h3 className="text-lg font-light text-orange-900 mb-4">Cambiar Contraseña</h3>
              <input type="password" placeholder="Contraseña actual" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full border p-2 mb-3 rounded" />
              <input type="password" placeholder="Nueva contraseña" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border p-2 mb-4 rounded" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowPasswordModal(false)} className="text-sm text-orange-600">Cancelar</button>
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
