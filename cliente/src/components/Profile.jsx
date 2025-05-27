import { useUser } from "../context/UserContext";

const Profile = () => {
    const { user } = useUser();

    if (!user) return <p>No hay usuario logueado.</p>;

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
