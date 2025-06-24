import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, adminChangeUserPassword } from "../../store/slices/usersSlice";
import AdminAlertaInfo from './AdminAlertaInfo';

const GestionUsuarios = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const usuarios = useSelector((state) => state.users.items);
    const { error } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [emailTarget, setEmailTarget] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');

    useEffect(() => {
        if (!user || !user.token) return;
        dispatch(fetchUsers(user.token));
    }, [dispatch, user]);

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
                setAlerta({ tipo: 'success', mensaje: data.mensaje });
                dispatch(fetchUsers(user.token));
            })
            .catch((err) => setAlerta({ tipo: 'error', mensaje: "Error al deshabilitar usuario: " + err.message }));
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
                setAlerta({ tipo: 'success', mensaje: data.mensaje });
                dispatch(fetchUsers(user.token));
            })
            .catch((err) => setAlerta({ tipo: 'error', mensaje: "Error al habilitar usuario: " + err.message }));
    };

    const cambiarPasswordUsuario = (email) => {
        setEmailTarget(email);
        setModalAbierto(true);
    };

    const confirmarCambioPassword = () => {
        dispatch(adminChangeUserPassword({
            token: user.token,
            email: emailTarget,
            newPassword: nuevaPassword
        }))
        .unwrap()
        .then(() => {
            setAlerta({ tipo: 'success', mensaje: 'Contraseña actualizada correctamente.' });
        })
        .catch((err) => {
            console.error("ERROR RESPUESTA:", err);
            setAlerta({ tipo: 'error', mensaje: 'Error al cambiar contraseña: ' + (err?.response?.data?.message || err) });
        })
        .finally(() => {
            setModalAbierto(false);
            setNuevaPassword('');
        });
    };

    return (
        <div className="px-6 py-4 font-sans">
            {alerta && (
                <AdminAlertaInfo
                    tipo={alerta.tipo}
                    mensaje={alerta.mensaje}
                    onClose={() => setAlerta(null)}
                />
            )}

            {modalAbierto && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2" onClick={() => setModalAbierto(false)}>
                    <div
                        className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Cambiar contraseña</h2>
                        <p className="text-sm text-gray-600 mb-2">Usuario: <strong>{emailTarget}</strong></p>

                        <input
  type="password"
  placeholder="Nueva contraseña"
  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:ring focus:ring-[rgb(146_107_64)] focus:ring-opacity-40 focus:border-[rgb(146_107_64)] focus:outline-none"
  value={nuevaPassword}
  onChange={(e) => setNuevaPassword(e.target.value)}
/>


                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setModalAbierto(false);
                                    setNuevaPassword('');
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
  onClick={confirmarCambioPassword}
  className="text-white text-sm px-4 py-2 rounded"
  style={{
    backgroundColor: 'rgb(146 107 64)',
    transition: 'background-color 0.2s',
  }}
>
  Confirmar
</button>

                        </div>
                    </div>
                </div>
            )}

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
