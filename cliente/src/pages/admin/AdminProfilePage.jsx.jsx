import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";
import { updateUser, updateProfile, changePassword, clearUpdateProfileStatus, clearChangePasswordStatus } from "../../store/slices/usersSlice";

const AdminProfilePage = () => {
  const dispatch = useDispatch();
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
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Redux selectors para feedback
  const updateProfileSuccess = useSelector((state) => state.users.updateProfileSuccess);
  const updateProfileError = useSelector((state) => state.users.updateProfileError);
  const changePasswordSuccess = useSelector((state) => state.users.changePasswordSuccess);
  const changePasswordError = useSelector((state) => state.users.changePasswordError);

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

  useEffect(() => {
    if (!editMode) {
      setProfileMessage(null);
      setProfileSuccess(false);
    }
  }, [editMode]);

  useEffect(() => {
    if (updateProfileSuccess) {
      setEditMode(false);
      setProfileMessage("Perfil actualizado correctamente.");
      setProfileSuccess(true);
      setTimeout(() => {
        setProfileMessage(null);
        setProfileSuccess(false);
        dispatch(clearUpdateProfileStatus());
      }, 2000);
    } else if (updateProfileError) {
      setProfileMessage("Hubo un error al guardar los cambios.");
      setProfileSuccess(false);
      setTimeout(() => {
        setProfileMessage(null);
        setProfileSuccess(false);
        dispatch(clearUpdateProfileStatus());
      }, 2000);
    }
    // eslint-disable-next-line
  }, [updateProfileSuccess, updateProfileError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    dispatch(updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      token: user.token,
    }));
    // El feedback se maneja en useEffect
  };

  const handleChangePassword = () => {
    dispatch(changePassword({
      oldPassword,
      newPassword,
      token: user.token,
    }));
    // El feedback se maneja en useEffect
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
        dispatch(clearChangePasswordStatus());
      }, 2000);
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
      setTimeout(() => {
        setPasswordMessage(null);
        setPasswordSuccess(false);
        dispatch(clearChangePasswordStatus());
      }, 2000);
    }
    // eslint-disable-next-line
  }, [changePasswordSuccess, changePasswordError]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-orange-800 text-xl">
        <span className="animate-spin border-4 border-orange-200 border-t-orange-800 rounded-full w-12 h-12 mr-4"></span>
        Cargando perfil...
      </div>
    );
  }

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
                <button className="w-full text-left px-4 py-2 rounded transition text-leather-800 bg-leather-100 font-bold">
                  <FaUser className="inline mr-2" /> Perfil
                </button>
              </nav>
            </aside>

            <main className="flex-1 space-y-8">
              <div className="bg-white/90 shadow-lg rounded-2xl p-8 border border-leather-200 animate-fade-in">
                <h2 className="text-2xl font-bold text-leather-900 mb-6">Perfil de Administrador</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-leather-900">
                  <div>
                    <span className="text-leather-700">Nombre:</span>
                    {editMode ? (
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border p-1 rounded ml-2 focus:ring-2 focus:ring-leather-400"
                      />
                    ) : (
                      <span className="ml-2">{user.firstName}</span>
                    )}
                  </div>
                  <div>
                    <span className="text-leather-700">Apellido:</span>
                    {editMode ? (
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border p-1 rounded ml-2 focus:ring-2 focus:ring-leather-400"
                      />
                    ) : (
                      <span className="ml-2">{user.lastName}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    <span className="text-leather-700">Email:</span>
                    <span className="ml-2">{user.email}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-leather-700">Rol:</span>
                    <span className="ml-2 text-leather-800">{user.role}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-4">
                  {!editMode ? (
                    <>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 bg-leather-800 text-white rounded hover:bg-leather-900 transition-all duration-300 shadow"
                      >
                        Cambiar contraseña
                      </button>
                      <button
                        onClick={() => setEditMode(true)}
                        className="px-4 py-2 bg-leather-800 text-white rounded hover:bg-leather-900 transition-all duration-300 shadow"
                      >
                        Editar perfil
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all duration-300 shadow"
                      >
                        Guardar
                      </button>
                      {profileMessage && (
                        <div className={`ml-4 inline-block text-sm ${profileSuccess ? "text-green-600" : "text-red-600"}`}>
                          {profileMessage}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
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
    </div>
  );
};

export default AdminProfilePage;
