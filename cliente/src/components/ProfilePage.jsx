import React, { useEffect, useState } from "react";
import DetalleCompra from "./DetalleCompra"; 
import DireccionesPanel from "./DireccionesPanel";

import {
  FaUser,
  FaMapMarkedAlt,
  FaShoppingCart,
  FaCreditCard,
  FaSignOutAlt,
} from "react-icons/fa";

const ProfilePage = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [misCompras, setMisCompras] = useState([]);
  const [activeTab, setActiveTab] = useState("perfil");
  const [compraDetalle, setCompraDetalle] = useState(null);
  const [compraAbiertaId, setCompraAbiertaId] = useState(null);
  const [loadingDetalle, setLoadingDetalle] = useState(false);

  // URL base consistente
  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    if (user?.token) {
      fetch(`${API_BASE}/api/v1/users/me`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
          .then((res) => res.json())
          .then((data) => {
            setUserInfo(data);
            setFormData({
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
            });
          })
          .catch(() => setUserInfo(null));
    }
  }, [user]);

  useEffect(() => {
    if (user?.token) {
      fetch(`${API_BASE}/compras/mias`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
          .then((res) => {
            if (!res.ok) throw new Error("Error al obtener compras");
            return res.json();
          })
          .then((data) => {
            console.log("Compras cargadas:", data); // Debug
            setMisCompras(data);
          })
          .catch((err) => {
            console.error("Error al cargar mis compras:", err);
          });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    fetch(`${API_BASE}/api/v1/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
      }),
    })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Error al actualizar el perfil");
          }
          return res.json();
        })
        .then((data) => {
          setUserInfo(data);
          setEditMode(false);
          alert("Perfil actualizado correctamente.");
        })
        .catch(() => {
          alert("Hubo un error al guardar los cambios.");
        });
  };

  const verDetalleCompra = (id) => {
    if (compraAbiertaId === id) {
        setCompraAbiertaId(null);
        setCompraDetalle(null);
        return;
    }

    setLoadingDetalle(true);
    console.log(`Cargando detalle de compra ${id}...`); // Debug

    fetch(`${API_BASE}/compras/${id}`, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    })
        .then((res) => {
            console.log("Response status:", res.status); // Debug
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}: Error al obtener el detalle de la compra`);
            }
            return res.json();
        })
        .then((detalle) => {
            console.log("Detalle de compra recibido:", detalle); // Debug
            setCompraDetalle(detalle);
            setCompraAbiertaId(id);
            setLoadingDetalle(false);
        })
        .catch((err) => {
            console.error("Error completo:", err); // Debug
            alert(`Error al cargar detalle: ${err.message}`);
            setLoadingDetalle(false);
        });
  };

  const handleChangePassword = () => {
    fetch(`${API_BASE}/api/v1/auth/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })
        .then((res) => {
          if (!res.ok) {
            return res.json().then((errData) => {
              throw new Error(errData.message || "Error al cambiar contraseña");
            });
          }
          return res;
        })
        .then(() => {
          alert("¡Contraseña cambiada!");
          setShowPasswordModal(false);
          setOldPassword("");
          setNewPassword("");
        })
        .catch((e) => {
          alert(e.message);
        });
  };

  // Función helper para mostrar información de dirección/entrega de forma resumida
const mostrarInfoEntrega = (compra) => {
  if (compra.direccionEntrega) {
    if (typeof compra.direccionEntrega === 'object') {
      return `${compra.direccionEntrega.calle} ${compra.direccionEntrega.numero}, ${compra.direccionEntrega.localidad}`;
    }
    return compra.direccionEntrega;
  }
  if (compra.puntoRetiro) {
    if (typeof compra.puntoRetiro === 'object') {
      // Mostrar los datos principales del punto de retiro
      return `${compra.puntoRetiro.nombre} - ${compra.puntoRetiro.direccion}, ${compra.puntoRetiro.localidad}`;
    }
    return compra.puntoRetiro;
  }
  return compra.metodoEntrega || "Sin información de entrega";
};


  // Función helper para formatear método de pago
  const formatearMetodoPago = (metodo) => {
    const metodos = {
      'EFECTIVO': 'Efectivo',
      'TARJETA_CREDITO': 'Tarjeta de Crédito',
      'TARJETA_DEBITO': 'Tarjeta de Débito',
      'MERCADO_PAGO': 'Mercado Pago',
      'TRANSFERENCIA': 'Transferencia Bancaria'
    };
    return metodos[metodo] || metodo;
  };

  if (!userInfo) {
    return (
        <div className="min-h-screen flex items-center justify-center text-leather-700 text-xl">
          <span className="animate-spin border-4 border-leather-300 border-t-leather-700 rounded-full w-12 h-12 mr-4"></span>
          Cargando perfil...
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-leather-50 flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-full bg-leather-400 flex items-center justify-center text-white text-2xl font-bold shadow">
                {userInfo.firstName?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <p className="mt-2 text-leather-700 text-sm">{userInfo.email}</p>
            </div>
            <nav className="flex flex-col gap-4">
              <button
                  className={`flex items-center gap-2 text-leather-700 font-semibold ${activeTab === "perfil" ? "underline" : ""}`}
                  onClick={() => setActiveTab("perfil")}
              >
                <FaUser /> Perfil
              </button>
              <button
                  className={`flex items-center gap-2 text-leather-700 ${activeTab === "compras" ? "underline" : ""}`}
                  onClick={() => setActiveTab("compras")}
              >
                <FaShoppingCart /> Mis Compras
              </button>
              <button
                  className={`flex items-center gap-2 text-leather-700 ${activeTab === "envios" ? "underline" : ""}`}
                  onClick={() => setActiveTab("envios")}
              >
                <FaMapMarkedAlt /> Direcciones
              </button>
            </nav>
          </div>
          <button className="flex items-center gap-2 text-red-600 font-semibold mt-8">
            <FaSignOutAlt /> Salir
          </button>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-12">
          {activeTab === "perfil" && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-2xl font-bold text-leather-700 mb-4">Perfil de Usuario</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold text-leather-700">Nombre:</span>{" "}
                    {editMode ? (
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="border p-1 rounded ml-2"
                        />
                    ) : (
                        userInfo.firstName
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-leather-700">Apellido:</span>{" "}
                    {editMode ? (
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="border p-1 rounded ml-2"
                        />
                    ) : (
                        userInfo.lastName
                    )}
                  </div>
                  <div>
                    <span className="font-semibold text-leather-700">Email:</span>{" "}
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        className="border p-1 rounded ml-2 bg-gray-100"
                        disabled
                    />
                  </div>
                  <div>
                    <span className="font-semibold text-leather-700">Rol:</span>{" "}
                    {userInfo.role}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  {!editMode ? (
                      <>
                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="px-4 py-2 bg-leather-200 text-leather-800 rounded-lg hover:bg-leather-300 transition"
                        >
                          Cambiar contraseña
                        </button>
                        <button
                            onClick={() => setEditMode(true)}
                            className="px-4 py-2 bg-leather-600 text-white rounded-lg hover:bg-leather-700 transition"
                        >
                          Editar perfil
                        </button>
                      </>
                  ) : (
                      <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        Guardar
                      </button>
                  )}
                </div>
              </div>
          )}

          {activeTab === "compras" && (
              <div className="bg-white rounded-2xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-leather-700 mb-4">Mis Compras</h3>
                  {misCompras.length === 0 ? (
                      <p className="text-leather-500">No tenés compras registradas.</p>
                  ) : (
                      <ul className="space-y-3">
                          {misCompras.map((compra, i) => (
                              <li key={i} className="border rounded-lg p-4 bg-leather-50 shadow-sm">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {/* Información básica de la compra */}
                                      <div>
                                          <p className="font-semibold text-leather-800 text-lg">Compra #{compra.id}</p>
                                          <p className="text-sm text-leather-600">
                                              <span className="font-semibold">Fecha:</span>{" "}
                                              {new Date(compra.fecha).toLocaleDateString()} -{" "}
                                              {new Date(compra.fecha).toLocaleTimeString()}
                                          </p>
                                          <p className="text-sm text-leather-600">
                                              <span className="font-semibold">Total:</span> ${compra.total?.toLocaleString()}
                                          </p>
                                      </div>
                                      
                                      {/* Información de entrega y pago */}
                                      <div>
                                          <p className="text-sm text-leather-600">
                                              <span className="font-semibold">Entrega:</span>{" "}
                                              {mostrarInfoEntrega(compra)}
                                          </p>
                                          {compra.metodoDePago && (
                                              <p className="text-sm text-leather-600">
                                                  <span className="font-semibold">Pago:</span>{" "}
                                                  {formatearMetodoPago(compra.metodoDePago)}
                                                  {compra.cuotas && compra.cuotas > 1 && ` (${compra.cuotas} cuotas)`}
                                              </p>
                                          )}
                                          <p className="text-sm text-leather-600">
                                              <span className="font-semibold">Productos:</span>{" "}
                                              {compra.items?.length || 0} item{compra.items?.length !== 1 ? 's' : ''}
                                          </p>
                                      </div>
                                  </div>

                                  {/* Mostrar primer producto como preview */}
                                  {compra.items && compra.items.length > 0 && (
                                      <div className="mt-2 text-sm text-leather-500">
                                          {compra.items[0].nombreProducto}
                                          {compra.items.length > 1 && ` y ${compra.items.length - 1} más`}
                                      </div>
                                  )}

                                  <button
                                      className="mt-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                                      onClick={() => verDetalleCompra(compra.id)}
                                      disabled={loadingDetalle}
                                  >
                                      {loadingDetalle ? (
                                          "Cargando..."
                                      ) : compraAbiertaId === compra.id ? (
                                          "Ocultar detalle"
                                      ) : (
                                          "Ver detalle"
                                      )}
                                  </button>

                                  {/* Detalle de esa compra */}
                                  {compraAbiertaId === compra.id && compraDetalle && (
                                      <div className="mt-4">
                                          <DetalleCompra
                                              compra={compraDetalle}
                                              onClose={() => {
                                                  setCompraDetalle(null);
                                                  setCompraAbiertaId(null);
                                              }}
                                          />
                                      </div>
                                  )}
                              </li>
                          ))}
                      </ul>
                  )}
              </div>
          )}

          {activeTab === "pagos" && (
              <div className="bg-white p-8 rounded shadow">
                <h2 className="text-xl font-bold">Métodos de Pago</h2>
                <p className="mt-2 text-gray-600">Acá irían los métodos de pago del usuario.</p>
              </div>
          )}

          {activeTab === "envios" && (
              <DireccionesPanel token={user.token} />
          )}

        </main>

        {/* Modal contraseña */}
        {showPasswordModal && (
            <div className="fixed inset-0 flex items-center justify-center z-40 bg-black bg-opacity-30">
              <div className="bg-white rounded-xl shadow-xl p-8 min-w-[320px] flex flex-col gap-4">
                <h3 className="font-bold text-lg text-leather-700 mb-2">
                  Cambiar contraseña
                </h3>
                <input
                    type="password"
                    placeholder="Contraseña actual"
                    className="border p-2 rounded"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    className="border p-2 rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                    onClick={handleChangePassword}
                    className="bg-leather-600 text-white rounded-lg py-2 hover:bg-leather-700 transition mt-2"
                >
                  Guardar cambio
                </button>
                <button
                    onClick={() => {
                      setShowPasswordModal(false);
                      setOldPassword("");
                      setNewPassword("");
                    }}
                    className="text-leather-700 underline text-xs mt-1"
                >
                  Cancelar
                </button>
              </div>
            </div>
        )}
      </div>
  );
};

export default ProfilePage;