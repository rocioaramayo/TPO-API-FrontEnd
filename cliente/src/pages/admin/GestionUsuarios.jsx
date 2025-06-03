import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GestionUsuarios = ({ user }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/users", {
            headers: { Authorization: `Bearer ${user?.token}` },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener usuarios");
                return res.json();
            })
            .then(setUsuarios)
            .catch((err) => setError(err.message));
    }, [user]);

    const deshabilitarUsuario = (id) => {
        fetch(`http://localhost:8080/api/v1/users/${id}/deshabilitar`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.mensaje);
                setUsuarios((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, activo: false } : u))
                );
            })
            .catch((err) => alert("Error al deshabilitar usuario: " + err.message));
    };

    const habilitarUsuario = (id) => {
        fetch(`http://localhost:8080/api/v1/users/${id}/habilitar`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.mensaje);
                setUsuarios((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, activo: true } : u))
                );
            })
            .catch((err) => alert("Error al habilitar usuario: " + err.message));
    };

    const cambiarPasswordUsuario = (email) => {
        const nuevaPassword = prompt("Ingrese la nueva contraseña:");
        if (!nuevaPassword) return;

        fetch("http://localhost:8080/api/v1/auth/admin/change-password", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, newPassword: nuevaPassword }),
        })
            .then((res) => res.json())
            .then((data) => alert(data.message || "Contraseña actualizada"))
            .catch((err) => alert("Error al cambiar contraseña: " + err.message));
    };

    return (
        <div className="px-6 py-4 font-sans">
            <div className="flex justify-between items-center mb-6">
  <div>
    <h2 className="text-2xl font-bold text-leather-800">Gestión de Usuarios</h2>
    <p className="text-leather-600">Administrá los usuarios registrados del sistema</p>
  </div>
  <div className="flex gap-3">
    <button
      onClick={() => navigate('/admin')}
      className="bg-gray-100 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-200 transition-colors"
    >
      Volver al Dashboard
    </button>
  </div>
</div>


            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white border text-sm text-left text-gray-700">
                    <thead className="bg-leather-100 text-leather-700 font-semibold">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Username</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Nombre</th>
                            <th className="px-4 py-2 border">Apellido</th>
                            <th className="px-4 py-2 border">Rol</th>
                            <th className="px-4 py-2 border">Activo</th>
                            <th className="px-4 py-2 border">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id} className="hover:bg-leather-50">
                                <td className="px-4 py-2 border">{u.id}</td>
                                <td className="px-4 py-2 border">{u.username}</td>
                                <td className="px-4 py-2 border">{u.email}</td>
                                <td className="px-4 py-2 border">{u.firstName}</td>
                                <td className="px-4 py-2 border">{u.lastName}</td>
                                <td className="px-4 py-2 border">{u.role}</td>
                                <td className="px-4 py-2 border">{u.activo ? "Sí" : "No"}</td>
                                <td className="px-4 py-2 border space-x-2">
                                    {u.role !== "ADMIN" && user?.role === "ADMIN" && (
                                        <>
                                            <button
                                                className={`px-3 py-1 rounded text-white transition ${u.activo ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                                                onClick={() =>
                                                    u.activo ? deshabilitarUsuario(u.id) : habilitarUsuario(u.id)
                                                }
                                            >
                                                {u.activo ? "Deshabilitar" : "Habilitar"}
                                            </button>
                                            <button
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                onClick={() => cambiarPasswordUsuario(u.email)}
                                            >
                                                Cambiar Contraseña
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GestionUsuarios;
