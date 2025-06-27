import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, enableUser, disableUser, adminChangeUserPassword, clearEnableDisableUserStatus, clearChangePasswordStatus } from '../../store/slices/usersSlice';
import AdminAlertaInfo from './AdminAlertaInfo';

const GestionUsuarios = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const usuarios = useSelector((state) => state.users.items);
    const { error, enableUserLoading, enableUserError, enableUserSuccess, disableUserLoading, disableUserError, disableUserSuccess, changePasswordLoading, changePasswordError, changePasswordSuccess } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState(null);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [emailTarget, setEmailTarget] = useState('');
    const [nuevaPassword, setNuevaPassword] = useState('');
    const [modalConfirmarDeshabilitar, setModalConfirmarDeshabilitar] = useState({ abierto: false, userId: null, email: '' });
    const [modalConfirmarPassword, setModalConfirmarPassword] = useState({ abierto: false, email: '' });

    useEffect(() => {
        if (!user || !user.token) return;
        dispatch(fetchUsers(user.token));
    }, [dispatch, user]);

    useEffect(() => {
        if (enableUserSuccess || disableUserSuccess) {
                dispatch(fetchUsers(user.token));
            setTimeout(() => {
                dispatch(clearEnableDisableUserStatus());
            }, 2000);
        }
    }, [enableUserSuccess, disableUserSuccess, dispatch, user]);

    useEffect(() => {
        if (changePasswordSuccess) {
            setModalAbierto(false);
            setNuevaPassword('');
            setTimeout(() => {
                dispatch(clearChangePasswordStatus());
            }, 2000);
        }
    }, [changePasswordSuccess, dispatch]);

    const handleDisableUser = (id, email) => {
        setModalConfirmarDeshabilitar({ abierto: true, userId: id, email });
    };
    const handleEnableUser = (id) => {
        dispatch(enableUser({ token: user.token, id }));
    };
    const confirmarDeshabilitar = () => {
        dispatch(disableUser({ token: user.token, id: modalConfirmarDeshabilitar.userId }));
        setModalConfirmarDeshabilitar({ abierto: false, userId: null, email: '' });
    };
    const cancelarDeshabilitar = () => {
        setModalConfirmarDeshabilitar({ abierto: false, userId: null, email: '' });
    };

    const cambiarPasswordUsuario = (email) => {
        setModalConfirmarPassword({ abierto: true, email });
    };
    const confirmarAbrirModalPassword = () => {
        setEmailTarget(modalConfirmarPassword.email);
        setModalAbierto(true);
        setModalConfirmarPassword({ abierto: false, email: '' });
    };
    const cancelarAbrirModalPassword = () => {
        setModalConfirmarPassword({ abierto: false, email: '' });
    };
    const confirmarCambioPassword = () => {
        dispatch(adminChangeUserPassword({
            token: user.token,
            email: emailTarget,
            newPassword: nuevaPassword
        }));
    };

    return (
        <div className="px-6 py-4 font-sans">
            {/* Feedback global */}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {enableUserError && <p className="text-red-500 mb-4">{enableUserError}</p>}
            {enableUserSuccess && <p className="text-green-600 mb-4">{typeof enableUserSuccess === 'string' ? enableUserSuccess : 'Usuario habilitado correctamente.'}</p>}
            {disableUserError && <p className="text-red-500 mb-4">{disableUserError}</p>}
            {disableUserSuccess && <p className="text-green-600 mb-4">{typeof disableUserSuccess === 'string' ? disableUserSuccess : 'Usuario deshabilitado correctamente.'}</p>}
            {changePasswordError && <p className="text-red-500 mb-4">{changePasswordError}</p>}
            {changePasswordSuccess && <p className="text-green-600 mb-4">Contraseña actualizada correctamente.</p>}

            {/* Modal cambio de contraseña */}
            {modalAbierto && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2" onClick={() => { setModalAbierto(false); setNuevaPassword(''); dispatch(clearChangePasswordStatus()); }}>
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
                                onClick={() => { setModalAbierto(false); setNuevaPassword(''); dispatch(clearChangePasswordStatus()); }}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancelar
                            </button>
                            <button
  onClick={confirmarCambioPassword}
  className="text-white text-sm px-4 py-2 rounded"
                                style={{ backgroundColor: 'rgb(146 107 64)', transition: 'background-color 0.2s' }}
                                disabled={changePasswordLoading}
                            >
                                {changePasswordLoading ? 'Cambiando...' : 'Confirmar'}
</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal confirmar deshabilitar usuario */}
            {modalConfirmarDeshabilitar.abierto && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2" onClick={cancelarDeshabilitar}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Deshabilitar usuario?</h2>
                        <p className="text-sm text-gray-600 mb-4">¿Está seguro que quiere deshabilitar al usuario <strong>{modalConfirmarDeshabilitar.email}</strong>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={cancelarDeshabilitar} className="text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
                            <button onClick={confirmarDeshabilitar} className="text-white text-sm px-4 py-2 rounded bg-red-700 hover:bg-red-800 transition-colors">Deshabilitar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal confirmar cambio de contraseña */}
            {modalConfirmarPassword.abierto && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-2" onClick={cancelarAbrirModalPassword}>
                    <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">¿Cambiar contraseña?</h2>
                        <p className="text-sm text-gray-600 mb-4">¿Está seguro que quiere cambiar la contraseña del usuario <strong>{modalConfirmarPassword.email}</strong>?</p>
                        <div className="flex justify-end gap-2">
                            <button onClick={cancelarAbrirModalPassword} className="text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
                            <button onClick={confirmarAbrirModalPassword} className="text-white text-sm px-4 py-2 rounded bg-leather-800 hover:bg-leather-900 transition-colors">Cambiar</button>
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
                                                className={`px-3 py-1 rounded font-medium transition-colors ${u.activo ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-800 hover:bg-green-200"}`}
                                                onClick={() =>
                                                    u.activo ? handleDisableUser(u.id, u.email) : handleEnableUser(u.id)
                                                }
                                                disabled={enableUserLoading || disableUserLoading}
                                            >
                                                {u.activo ? "Deshabilitar" : "Habilitar"}
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded bg-leather-100 text-leather-800 font-medium hover:bg-leather-200 transition-colors"
                                                onClick={() => cambiarPasswordUsuario(u.email)}
                                                disabled={changePasswordLoading}
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
