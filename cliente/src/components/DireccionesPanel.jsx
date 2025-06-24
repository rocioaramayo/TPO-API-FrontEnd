import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DireccionesPanel = () => {
  const token = useSelector((state) => state.users.user?.token);
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
  const [submitIntentado, setSubmitIntentado] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [direccionAEliminar, setDireccionAEliminar] = useState(null);
  const [mostrarModalBorrar, setMostrarModalBorrar] = useState(false);

  const API_BASE = "http://localhost:8080";

  const fetchDirecciones = () => {
    fetch(`${API_BASE}/direcciones/mias`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar direcciones");
        return res.json();
      })
      .then((data) => setDirecciones(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) fetchDirecciones();
  }, [token]);

  const handleBorrar = (id) => {
    setDireccionAEliminar(id);
    setMostrarModalBorrar(true);
  };

  const confirmarBorrado = () => {
    fetch(`${API_BASE}/direcciones/${direccionAEliminar}/desactivar`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo borrar la dirección");
        setMensaje({ tipo: "success", texto: "Dirección borrada con éxito" });
        fetchDirecciones();
      })
      .catch((err) =>
        setMensaje({ tipo: "error", texto: "Error al borrar dirección: " + err.message })
      )
      .finally(() => {
        setMostrarModalBorrar(false);
        setDireccionAEliminar(null);
      });
  };

  const cancelarBorrado = () => {
    setMostrarModalBorrar(false);
    setDireccionAEliminar(null);
  };

  const handleGuardar = () => {
    setSubmitIntentado(true);
    const camposObligatorios = ["calle", "numero", "localidad", "provincia", "codigoPostal"];
    const faltantes = camposObligatorios.filter((campo) => !nuevaDireccion[campo]?.trim());

    if (faltantes.length > 0) {
      setMensaje({
        tipo: "error",
        texto: "Completá los campos obligatorios: " + faltantes.join(", "),
      });
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
        if (!res.ok) throw new Error(`HTTP ${res.status}: Error al guardar dirección`);
        return res;
      })
      .then(() => {
        setMensaje({ tipo: "success", texto: "Dirección guardada correctamente" });
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
        setSubmitIntentado(false);
        fetchDirecciones();
      })
      .catch((err) => {
        console.error("Error:", err);
        setMensaje({ tipo: "error", texto: err.message });
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

      {mensaje && (
        <div
          className={`mt-4 p-3 rounded border-l-4 shadow ${
            mensaje.tipo === "error"
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-green-100 border-green-500 text-green-700"
          } flex justify-between items-center`}
        >
          <span>{mensaje.texto}</span>
          <button
            className="text-xs text-gray-600 hover:underline ml-4"
            onClick={() => setMensaje(null)}
          >
            Cerrar
          </button>
        </div>
      )}

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
              <button
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleBorrar(dir.id)}
              >
                Borrar
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6">
        <h3 className="text-md font-semibold mb-2">Agregar nueva dirección</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Campos del formulario */}
          {["calle", "numero", "localidad", "provincia", "codigoPostal"].map((campo) => (
            <input
              key={campo}
              placeholder={`${campo.charAt(0).toUpperCase() + campo.slice(1)} *`}
              value={nuevaDireccion[campo]}
              onChange={(e) =>
                setNuevaDireccion({ ...nuevaDireccion, [campo]: e.target.value })
              }
              className={`border p-2 rounded ${submitIntentado && !nuevaDireccion[campo] ? "border-red-500" : ""}`}
            />
          ))}
          <input
            placeholder="Piso (opcional)"
            value={nuevaDireccion.piso}
            inputMode="numeric"
            onChange={(e) =>
              setNuevaDireccion({ ...nuevaDireccion, piso: e.target.value.replace(/\D/g, "") })
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
            placeholder="Teléfono (opcional)"
            value={nuevaDireccion.telefonoContacto}
            inputMode="numeric"
            onChange={(e) =>
              setNuevaDireccion({ ...nuevaDireccion, telefonoContacto: e.target.value.replace(/\D/g, "") })
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

      {/* Modal de confirmación de borrado */}
      {mostrarModalBorrar && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <p className="mb-4 text-orange-900 text-lg font-semibold">
              ¿Estás seguro de que querés borrar esta dirección?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmarBorrado}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sí, borrar
              </button>
              <button
                onClick={cancelarBorrado}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DireccionesPanel;
