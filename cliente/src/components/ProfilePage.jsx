import { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaBoxOpen, FaCreditCard, FaSignOutAlt } from "react-icons/fa";

const ProfilePage = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState("perfil");

    if (!user) return <p className="text-center mt-10 text-gray-600">Cargando datos del usuario...</p>;

    // Contenido que cambia según la pestaña activa
    const renderContent = () => {
        switch (activeTab) {
            case "perfil":
                const [editMode, setEditMode] = useState(false);
                const [editedUser, setEditedUser] = useState({
                    firstName: user.firstName,
                    lastName: user.lastName,
                });

                const handleInputChange = (e) => {
                    setEditedUser({...editedUser, [e.target.name]: e.target.value});
                };

                const handleSave = () => {
                    /*
                     Aquí podrías hacer una llamada a la API para guardar los cambios
                    */
                    console.log("Datos actualizados:", editedUser);
                    setEditMode(false);
                };

                const handleCancel = () => {
                    setEditedUser({firstName: user.firstName, lastName: user.lastName});
                    setEditMode(false);
                };

                return (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-semibold text-leather-800">Perfil de Usuario</h2>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-leather-800 text-white px-4 py-1.5 rounded hover:bg-leather-700 text-sm"
                                >
                                    Editar
                                </button>
                            )}
                        </div>

                        <div className="space-y-4 text-leather-700">
                            <div>
                                <h3 className="text-lg font-medium">Nombre</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={editedUser.firstName}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                ) : (
                                    <p>{user.firstName}</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Apellido</h3>
                                {editMode ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={editedUser.lastName}
                                        onChange={handleInputChange}
                                        className="w-full border border-gray-300 rounded px-3 py-2"
                                    />
                                ) : (
                                    <p>{user.lastName}</p>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-medium">Email</h3>
                                <p className="text-gray-800">{user.email}</p>
                            </div>

                            {/* Botones al estar en modo edición */}
                            {editMode && (
                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );


        }   return (
        <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md flex flex-col md:flex-row gap-8">
            {/!* Sidebar *!/}
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

            {/!* Main content *!/}
            <main className="md:w-3/4">{renderContent()}</main>
        </div>
    );
};

export default ProfilePage;
