import { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaBoxOpen, FaCreditCard, FaSignOutAlt } from "react-icons/fa";

const ProfilePage = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState("perfil");

    if (!user) return <p className="text-center mt-10 text-gray-600">Cargando datos del usuario...</p>;

    // Contenido que cambia según la pestaña activa
    const renderContent = () => {
        switch (activeTab) {
            case "perfil":
                return (
                    <div>
                        <h2 className="text-2xl font-semibold mb-6 text-leather-800">Perfil de Usuario</h2>
                        <div className="space-y-4 text-leather-700">
                            <div>
                                <h3 className="text-lg font-medium">Nombre de usuario</h3>
                                <p className="text-gray-800">{user.username}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Email</h3>
                                <p className="text-gray-800">{user.email}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Nombre Completo</h3>
                                <p className="text-gray-800">{user.firstName} {user.lastName}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Rol</h3>
                                <p className="text-gray-800 capitalize">{user.role}</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Estado</h3>
                                <p className={`font-semibold ${user.activo ? "text-green-600" : "text-red-600"}`}>
                                    {user.activo ? "Activo" : "Inactivo"}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Cuenta creada</h3>
                                <p className="text-gray-800">{new Date(user.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                );

            case "direcciones":
                return <p>Aquí puedes gestionar tus direcciones (próximamente)</p>;
            case "pedidos":
                return <p>Aquí puedes ver tus pedidos (próximamente)</p>;
            case "tarjetas":
                return <p>Aquí puedes gestionar tus tarjetas de crédito (próximamente)</p>;
            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <aside className="md:w-1/4 border-r border-gray-200 pr-6">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-leather-800 flex items-center justify-center text-white text-4xl font-bold shadow-md">
                        {user.firstName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <p className="mt-4 text-lg font-semibold">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                <nav className="flex flex-col space-y-3">
                    <button
                        onClick={() => setActiveTab("perfil")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium w-full
              ${activeTab === "perfil" ? "bg-leather-800 text-white" : "text-leather-800 hover:bg-leather-100"}`}
                    >
                        <FaUser /> Perfil
                    </button>

                    <button
                        onClick={() => setActiveTab("direcciones")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium w-full
              ${activeTab === "direcciones" ? "bg-leather-800 text-white" : "text-leather-800 hover:bg-leather-100"}`}
                    >
                        <FaMapMarkerAlt /> Direcciones
                    </button>

                    <button
                        onClick={() => setActiveTab("pedidos")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium w-full
              ${activeTab === "pedidos" ? "bg-leather-800 text-white" : "text-leather-800 hover:bg-leather-100"}`}
                    >
                        <FaBoxOpen /> Pedidos
                    </button>

                    <button
                        onClick={() => setActiveTab("tarjetas")}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium w-full
              ${activeTab === "tarjetas" ? "bg-leather-800 text-white" : "text-leather-800 hover:bg-leather-100"}`}
                    >
                        <FaCreditCard /> Tarjetas de crédito
                    </button>

                    <button
                        onClick={onLogout}
                        className="flex items-center gap-3 px-4 py-2 rounded-md font-medium w-full text-red-600 hover:bg-red-100"
                    >
                        <FaSignOutAlt /> Salir
                    </button>
                </nav>
            </aside>

            {/* Main content */}
            <main className="md:w-3/4">{renderContent()}</main>
        </div>
    );
};

export default ProfilePage;
