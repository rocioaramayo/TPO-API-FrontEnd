import { useEffect, useState } from "react";

const GestionUsuarios = ({ user }) => {
    if (!user) return <p className="p-4 text-red-500">Usuario no autenticado</p>;

    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/users", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener usuarios");
                return res.json();
            })
            .then((data) => setUsuarios(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [user]);

    const cambiarEstado = (userId) => {
        fetch(`http://localhost:8080/api/v1/users/${userId}/toggle-estado`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cambiar estado");
                return res.json();
            })
            .then((updatedUser) => {
                setUsuarios((prev) =>
                    prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
                );
            })
            .catch((err) => alert(err.message));
    };

    const cambiarRol = (userId) => {
        fetch(`http://localhost:8080/api/v1/users/${userId}/toggle-rol`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al cambiar rol");
                return res.json();
            })
            .then((updatedUser) => {
                setUsuarios((prev) =>
                    prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
                );
            })
            .catch((err) => alert(err.message));
    };

    if (loading) return <p className="p-4">Cargando usuarios...</p>;
    if (error) return <p className="p-4 text-red-500">{error}</p>;

    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-6 text-leather-800">Gestión de Usuarios</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border border-gray-300">
                    <thead className="bg-leather-100">
                    <tr>
                        <th className="p-2 text-left">ID</th>
                        <th className="p-2 text-left">Nombre</th>
                        <th className="p-2 text-left">Apellido</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Rol</th>
                        <th className="p-2 text-left">Estado</th>
                        <th className="p-2 text-left">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {usuarios.map((u) => (
                        <tr key={u.id} className="border-t border-gray-200">
                            <td className="p-2">{u.id}</td>
                            <td className="p-2">{u.firstName}</td>
                            <td className="p-2">{u.lastName}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.role}</td>
                            <td className="p-2">{u.activo ? "Activo" : "Inactivo"}</td>
                            <td className="p-2 space-x-2">
                                <button
                                    onClick={() => cambiarEstado(u.id)}
                                    className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                >
                                    Cambiar estado
                                </button>
                                <button
                                    onClick={() => cambiarRol(u.id)}
                                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Cambiar rol
                                </button>
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
