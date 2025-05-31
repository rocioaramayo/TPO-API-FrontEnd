import React, { useEffect, useState } from "react";

const GestionUsuarios = ({ user }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/users", {
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
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
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Gestión de Usuarios</h2>
            {error && <p className="text-red-500">{error}</p>}
            <table className="min-w-full bg-white border">
                <thead>
                <tr>
                    <th className="border px-4 py-2">ID</th>
                    <th className="border px-4 py-2">Username</th>
                    <th className="border px-4 py-2">Email</th>
                    <th className="border px-4 py-2">Nombre</th>
                    <th className="border px-4 py-2">Apellido</th>
                    <th className="border px-4 py-2">Rol</th>
                    <th className="border px-4 py-2">Activo</th>
                    <th className="border px-4 py-2">Acciones</th>
                </tr>
                </thead>
                <tbody>
                {usuarios.map((u) => (
                    <tr key={u.id}>
                        <td className="border px-4 py-2">{u.id}</td>
                        <td className="border px-4 py-2">{u.username}</td>
                        <td className="border px-4 py-2">{u.email}</td>
                        <td className="border px-4 py-2">{u.firstName}</td>
                        <td className="border px-4 py-2">{u.lastName}</td>
                        <td className="border px-4 py-2">{u.role}</td>
                        <td className="border px-4 py-2">{u.activo ? "Sí" : "No"}</td>
                        <td className="border px-4 py-2 space-x-2">
                            {u.role !== "ADMIN" && user?.role === "ADMIN" && (
                                <>
                                    {u.activo ? (
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded"
                                            onClick={() => deshabilitarUsuario(u.id)}
                                        >
                                            Deshabilitar
                                        </button>
                                    ) : (
                                        <button
                                            className="bg-green-500 text-white px-2 py-1 rounded"
                                            onClick={() => habilitarUsuario(u.id)}
                                        >
                                            Habilitar
                                        </button>
                                    )}
                                    <button
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
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
    );
};

export default GestionUsuarios;
