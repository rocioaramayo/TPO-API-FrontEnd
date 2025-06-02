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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // URL base consistente
    const API_BASE = "http://localhost:8080";

    useEffect(() => {
        if (token) {
            setLoading(true);
            fetch(`${API_BASE}/direcciones/mias`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error(`HTTP ${res.status}: Error al cargar direcciones`);
                    }
                    return res.json();
                })
                .then((data) => {
                    console.log("Direcciones cargadas:", data); // Debug
                    setDirecciones(data);
                    setError(null);
                })
                .catch((err) => {
                    console.error("Error al cargar direcciones:", err);
                    setError(err.message);
                    setDirecciones([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [token]);

    const handleGuardar = () => {
        // Validación básica
        if (!nuevaDireccion.calle || !nuevaDireccion.numero || !nuevaDireccion.localidad || 
            !nuevaDireccion.provincia || !nuevaDireccion.codigoPostal) {
            alert("Por favor, completa los campos obligatorios: calle, número, localidad, provincia y código postal.");
            return;
        }

        fetch(`${API_BASE}/direcciones`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(nuevaDireccion),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`HTTP ${res.status}: Error al guardar dirección`);
                }
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

                // Recargar direcciones
                return fetch(`${API_BASE}/direcciones/mias`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            })
            .then((res) => {
                if (!res.ok) throw new Error("Error al recargar direcciones");
                return res.json();
            })
            .then(setDirecciones)
            .catch((err) => {
                console.error("Error:", err);
                alert(`Error: ${err.message}`);
            });
    };

    if (loading) {
        return (
            <div className="bg-white p-8 rounded shadow">
                <div className="flex items-center justify-center">
                    <span className="animate-spin border-4 border-leather-300 border-t-leather-700 rounded-full w-8 h-8 mr-2"></span>
                    <span>Cargando direcciones...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded shadow">
            <h2 className="text-xl font-bold text-leather-700">Mis Direcciones</h2>

            {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    Error: {error}
                </div>
            )}

            {direcciones.length === 0 ? (
                <p className="mt-4 text-leather-500">No tenés direcciones guardadas.</p>
            ) : (
                <ul className="mt-4 space-y-4">
                    {direcciones.map((dir) => (
                        <li key={dir.id} className="border p-4 rounded bg-leather-50 text-sm">
                            <p>
                                <strong>Dirección:</strong> {dir.calle} {dir.numero}
                                {dir.piso && `, Piso ${dir.piso}`}
                                {dir.departamento && ` Dpto ${dir.departamento}`}
                            </p>
                            <p><strong>Localidad:</strong> {dir.localidad}</p>
                            <p><strong>Provincia:</strong> {dir.provincia}</p>
                            <p><strong>Código Postal:</strong> {dir.codigoPostal}</p>
                            {dir.telefonoContacto && (
                                <p><strong>Teléfono:</strong> {dir.telefonoContacto}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <div className="mt-6">
                <h3 className="text-md font-semibold mb-2">Agregar nueva dirección</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                        placeholder="Calle *"
                        value={nuevaDireccion.calle}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, calle: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        placeholder="Número *"
                        value={nuevaDireccion.numero}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        placeholder="Piso (opcional)"
                        value={nuevaDireccion.piso}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, piso: e.target.value })
                        }
                        className="border p-2 rounded"
                    />
                    <input
                        placeholder="Departamento (opcional)"
                        value={nuevaDireccion.departamento}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, departamento: e.target.value })
                        }
                        className="border p-2 rounded"
                    />
                    <input
                        placeholder="Localidad *"
                        value={nuevaDireccion.localidad}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, localidad: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        placeholder="Provincia *"
                        value={nuevaDireccion.provincia}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, provincia: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        placeholder="Código Postal *"
                        value={nuevaDireccion.codigoPostal}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value })
                        }
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        placeholder="Teléfono (opcional)"
                        value={nuevaDireccion.telefonoContacto}
                        onChange={(e) =>
                            setNuevaDireccion({ ...nuevaDireccion, telefonoContacto: e.target.value })
                        }
                        className="border p-2 rounded"
                    />
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