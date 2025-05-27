// ProfilePage.jsx
import React from "react";

const ProfilePage = ({ user }) => {
    if (!user) return <p>No hay usuario logueado.</p>;

    return (
        <div style={{ padding: "1rem" }}>
            <h2>Perfil de Usuario</h2>
            <p><strong>Nombre de usuario:</strong> {user.username || user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
            <p><strong>Estado:</strong> {user.activo ? "Activo" : "Inactivo"}</p>
            <p><strong>Cuenta creada:</strong> {new Date(user.createdAt || user.createdAT).toLocaleDateString()}</p>
        </div>
    );
};

export default ProfilePage;
