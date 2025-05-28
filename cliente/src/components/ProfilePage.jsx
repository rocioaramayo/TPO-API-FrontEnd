import React, { useEffect, useState } from "react";

const ProfilePage = ({ user }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

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

  const handleSave = () => {
    // Si querés que esto haga un PUT a la API, avisame y te lo armo.
    setUserInfo({ ...userInfo, ...formData });
    setEditMode(false);
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">
        Cargando datos del perfil...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
      <div className="max-w-3xl w-full border rounded-lg p-6 shadow-sm bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-leather-800">Mi Perfil</h2>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-leather-600 text-white rounded-lg hover:bg-leather-700 transition"
            >
              Editar
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Guardar
            </button>
          )}
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
            {editMode ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-1 rounded ml-2"
              />
            ) : (
              userInfo.email
            )}
          </div>
          <div>
            <span className="font-semibold text-leather-700">Rol:</span>{" "}
            {userInfo.role}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
