import React, { useEffect, useState } from "react";

const Profile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch("/api/usuarios/me", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // o donde guardes el token
            },
        })
            .then((res) => res.json())
            .then((data) => setUser(data))
            .catch((err) => console.error("Error al obtener perfil:", err));
    }, []);

    if (!user) return <p>Cargando datos...</p>;

    return (
        <div>
            <h2>Perfil de Usuario</h2>
            <p><strong>Nombre de usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Nombre:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>Estado:</strong> {user.activo ? "Activo" : "Inactivo"}</p>
            <p><strong>Cuenta creada:</strong> {new Date(user.createdAT).toLocaleDateString()}</p>
        </div>
    );
};

export default Profile;
