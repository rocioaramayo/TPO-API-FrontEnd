import React, { useEffect, useState } from "react";

const DireccionesPanel = ({ token }) => {
    const [direcciones, setDirecciones] = useState([]);
    const [nuevaDireccion, setNuevaDireccion] = useState({
        calle: "",
        numero: "",
        piso: "",
        departamento: "",
        localidad: "",
        provincia: "",
        codigoPostal: "",
        telefonoContacto: "",
    });

    useEffect(() => {
        if (token) {
            fetch("http://127.0.0.1:8080/direcciones/mias", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then(setDirecciones)
                .catch((err) => console.error("Error al cargar direcciones:", err));
        }
    }, [token]);

    const handleGuardar = () => {
        fetch("http://127.0.0.1:8080/direcciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaDireccion),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al guardar dirección");
                return res;
            })
            .then(() => {
                alert("Dirección guardada correctamente");
                setNuevaDireccion({
                    calle: "",
                    numero: "",
                    piso: "",
                    departamento: "",
                    localidad: "",
                    provincia: "",
                    codigoPostal: "",
                    telefonoContacto: "",
                });

                return fetch("http://127.0.0.1:8080/direcciones/mias", {
                    headers: { Authorization: `Bearer ${token}` },
                });
            })
            .then((res) => res.json())
            .then(setDirecciones)
            .catch((err) => alert(err.message));
    };

    return (
        <div className="bg-white p-8 rounded shadow">
            <h2 className="text-xl font-bold text-leather-700">Mis Direcciones</h2>

            {direcciones.length === 0 ? (
                <p className="mt-4 text-leather-500">No tenés direcciones guardadas.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {direcciones.map((dir) => (
                        <li key={dir.id} className="border p-4 rounded bg-leather-50 text-sm">
                            <p><strong>Dirección:</strong> {dir.calle} {dir.numero}, Piso {dir.piso} Dpto {dir.departamento}</p>
                            <p><strong>Localidad:</strong> {dir.localidad}</p>
                            <p><strong>Provincia:</strong> {dir.provincia}</p>
                            <p><strong>Código Postal:</strong> {dir.codigoPostal}</p>
                            <p><strong>Teléfono:</strong> {dir.telefonoContacto}</p>
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">Agregar nueva dirección</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        "calle",
                        "numero",
                        "piso",
                        "departamento",
                        "localidad",
                        "provincia",
                        "codigoPostal",
                        "telefonoContacto",
                    ].map((campo) => (
                        <input
                            key={campo}
                            placeholder={campo[0].toUpperCase() + campo.slice(1).replace("codigoPostal", "Código Postal").replace("telefonoContacto", "Teléfono")}
                            value={nuevaDireccion[campo]}
                            onChange={(e) =>
                                setNuevaDireccion({ ...nuevaDireccion, [campo]: e.target.value })
                            }
                            className="border p-2 rounded"
                        />
                    ))}
                </div>

                <button
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={handleGuardar}
                >
                    Guardar dirección
                </button>
            </div>
        </div>
    );
};

export default DireccionesPanel;

