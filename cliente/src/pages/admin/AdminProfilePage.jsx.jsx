import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";

const AdminProfilePage = () => {
  const user = useSelector((state) => state.users.user);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const API_BASE = "http://localhost:8080";

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
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
      .then(() => {
        setEditMode(false);
        alert("Perfil actualizado correctamente.");
      })
      .catch(() => {
        alert("Hubo un error al guardar los cambios.");
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-800 text-xl">
        <span className="animate-spin border-4 border-orange-200 border-t-orange-800 rounded-full w-12 h-12 mr-4"></span>
        Cargando perfil...
      </div>
    );
  }

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
                                <button className={`w-full text-left px-4 py-2 rounded transition text-orange-950 bg-orange-100 font-light`}><FaUser className="inline mr-2" /> Perfil</button>

              </nav>
            </aside>

            <main className="flex-1 space-y-8">
              <div className="bg-white/90 shadow-xl rounded-xl p-8 animate-fade-in">
                <h2 className="text-2xl font-light text-orange-900 mb-6">Perfil de Administrador</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-orange-700">Nombre:</span>
                    {editMode ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border p-1 rounded ml-2"
                      />
                    ) : (
                      <span className="ml-2">{user.firstName}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-orange-700">Apellido:</span>
                    {editMode ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border p-1 rounded ml-2"
                      />
                    ) : (
                      <span className="ml-2">{user.lastName}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-orange-700">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-orange-700">Rol:</span>
                    <span className="ml-2 text-orange-800">{user.role}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-4 justify-end">
                  {!editMode ? (
                    <>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-orange-200 text-orange-900 rounded hover:bg-orange-300 transition shadow"
                      >
                        Cambiar contraseña
                      </button>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-[#2C1810] text-[#F7F3E9] rounded hover:bg-[#3d2417] transition shadow"
                      >
                        Editar perfil
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition shadow"
                    >
                      Guardar
                    </button>
                  )}
                </div>
              </div>
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
    </div>
  );
};

export default AdminProfilePage;
