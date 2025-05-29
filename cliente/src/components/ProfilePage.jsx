import React, { useEffect, useState } from "react";

const ProfilePage = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Estados para cambio de contraseña
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user?.token) {
      fetch("http://127.0.0.1:8080/api/v1/users/me", {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/v1/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      if (!res.ok) throw new Error("Error al actualizar el perfil");
      const data = await res.json();
      setUserInfo(data);
      setEditMode(false);
      alert("Perfil actualizado correctamente.");
    } catch (e) {
      alert("Hubo un error al guardar los cambios.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8080/api/v1/auth/change-password", {
        method: "PUT", // Cambia a POST si tu backend así lo requiere
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          oldPassword,
          newPassword,
        }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al cambiar contraseña");
      }
      alert("¡Contraseña cambiada!");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
    } catch (e) {
      alert(e.message);
    }
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
      <div className="min-h-screen bg-gradient-to-tr from-leather-50 to-leather-100 py-12 flex flex-col items-center">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar simple */}
            <div className="w-16 h-16 rounded-full bg-leather-400 flex items-center justify-center text-3xl text-white font-bold shadow">
              {userInfo.firstName?.charAt(0).toUpperCase() ?? "U"}
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-leather-700">
                {userInfo.firstName} {userInfo.lastName}
              </h2>
              <p className="text-leather-500">{userInfo.email}</p>
              <span className="inline-block mt-1 px-2 py-1 text-xs bg-leather-200 text-leather-800 rounded">
              {userInfo.role}
            </span>
            </div>
          </div>

          <div className="space-y-4">
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
          </div>

          <div className="flex justify-end gap-2 mt-8">
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

        {/* Modal para cambiar contraseña */}
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
