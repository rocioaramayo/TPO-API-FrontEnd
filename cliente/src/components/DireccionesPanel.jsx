import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { fetchDirecciones, crearDireccion, desactivarDireccion, limpiarEstadoDireccion } from '../store/slices/direccionSlice';
import { FaTrash } from "react-icons/fa";

const DireccionesPanel = () => {
    const dispatch = useDispatch();
    const token = useSelector((state) => state.users.user?.token);
    const direcciones = useSelector((state) => state.direccion.items);
    const loading = useSelector((state) => state.direccion.loading);
    const error = useSelector((state) => state.direccion.error);
    const loadingDesactivar = useSelector((state) => state.direccion.loadingDesactivar);
    const errorDesactivar = useSelector((state) => state.direccion.errorDesactivar);
    const success = useSelector((state) => state.direccion.success);
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
    const [submitIntentado, setSubmitIntentado] = useState(false);
    const [mensaje, setMensaje] = useState(null);
    const [mostrarModalBorrar, setMostrarModalBorrar] = useState(false);
    const [direccionAEliminar, setDireccionAEliminar] = useState(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchDirecciones(token));
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (success) {
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
            dispatch(fetchDirecciones(token));
            dispatch(limpiarEstadoDireccion());
        }
    }, [success, dispatch, token]);

    const handleBorrar = (id) => {
        dispatch(desactivarDireccion({ token, id }))
            .unwrap()
            .then(() => setMensaje({ tipo: "success", texto: "Dirección borrada correctamente" }))
            .catch((err) => setMensaje({ tipo: "error", texto: "Error al borrar dirección: " + err }));
    };

    const handleGuardar = () => {
        setSubmitIntentado(true);
        const camposObligatorios = ["calle", "numero", "localidad", "provincia", "codigoPostal"];
        const faltantes = camposObligatorios.filter(campo => !nuevaDireccion[campo]?.trim());
        if (faltantes.length > 0) {
            setMensaje({
                tipo: "error",
                texto: "Completá los campos obligatorios: " + faltantes.join(", "),
            });
            return;
        }
        dispatch(crearDireccion({ token, data: nuevaDireccion }))
            .unwrap()
            .catch((err) => setMensaje({ tipo: "error", texto: err }));
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
    <div className="bg-white p-6 rounded-lg shadow-lg border border-leather-200 max-w-2xl mx-auto">
      <h2 className="text-xl font-extrabold text-leather-800 mb-4 tracking-tight">Mis Direcciones</h2>

      {mensaje && (
        <div
          className={`mt-2 p-2 rounded-lg border-l-4 shadow ${
            mensaje.tipo === "error"
              ? "bg-red-100 border-red-500 text-red-700"
              : "bg-green-100 border-green-500 text-green-700"
          } flex justify-between items-center text-sm`}
        >
          <span className="font-medium">{mensaje.texto}</span>
          <button
            className="text-xs text-gray-600 hover:underline ml-4"
            onClick={() => setMensaje(null)}
          >
            Cerrar
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded-lg font-medium text-sm">
          Error: {error}
        </div>
      )}

      {direcciones.length === 0 ? (
        <p className="mt-4 text-leather-400 italic text-sm">No tenés direcciones guardadas.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {direcciones.map((dir) => (
            <li key={dir.id} className="border-0 p-0">
              <div className="flex flex-row items-start justify-between bg-leather-50 rounded-lg shadow px-4 py-3 gap-2 text-sm">
                <div className="text-leather-900 leading-relaxed">
                  <p className="mb-1"><span className="font-bold">Dirección:</span> {dir.calle} {dir.numero}{dir.piso && `, Piso ${dir.piso}`}{dir.departamento && ` Dpto ${dir.departamento}`}</p>
                  <p><span className="font-semibold">Localidad:</span> {dir.localidad}</p>
                  <p><span className="font-semibold">Provincia:</span> {dir.provincia}</p>
                  <p><span className="font-semibold">Código Postal:</span> {dir.codigoPostal}</p>
                  {dir.telefonoContacto && (
                    <p><span className="font-semibold">Teléfono:</span> {dir.telefonoContacto}</p>
                  )}
                </div>
                <button
                  className="flex items-center gap-1 px-2 py-1 bg-leather-800 text-white rounded hover:bg-leather-900 text-xs shadow transition-all duration-200 font-semibold ml-2"
                  onClick={() => handleBorrar(dir.id)}
                  title="Borrar dirección"
                >
                  <FaTrash className="text-xs" />
                  Borrar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8">
        <h3 className="text-base font-bold mb-2 text-leather-800">Agregar nueva dirección</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {["calle", "numero", "localidad", "provincia", "codigoPostal"].map((campo) => (
            <input
              key={campo}
              placeholder={`${campo.charAt(0).toUpperCase() + campo.slice(1)} *`}
              value={nuevaDireccion[campo]}
              onChange={(e) =>
                setNuevaDireccion({ ...nuevaDireccion, [campo]: e.target.value })
              }
              className={`border border-leather-200 bg-leather-50 p-2 rounded-md focus:ring-2 focus:ring-leather-400 placeholder-gray-400 text-leather-900 font-medium text-sm ${submitIntentado && !nuevaDireccion[campo] ? "border-red-500" : ""}`}
            />
          ))}
          <input
            placeholder="Piso (opcional)"
            value={nuevaDireccion.piso}
            inputMode="numeric"
            onChange={(e) =>
              setNuevaDireccion({ ...nuevaDireccion, piso: e.target.value.replace(/\D/g, "") })
            }
            className="border border-leather-200 bg-leather-50 p-2 rounded-md focus:ring-2 focus:ring-leather-400 placeholder-gray-400 text-leather-900 font-medium text-sm"
          />
          <input
            placeholder="Departamento (opcional)"
            value={nuevaDireccion.departamento}
            onChange={(e) =>
              setNuevaDireccion({ ...nuevaDireccion, departamento: e.target.value })
            }
            className="border border-leather-200 bg-leather-50 p-2 rounded-md focus:ring-2 focus:ring-leather-400 placeholder-gray-400 text-leather-900 font-medium text-sm"
          />
          <input
            placeholder="Teléfono (opcional)"
            value={nuevaDireccion.telefonoContacto}
            inputMode="numeric"
            onChange={(e) =>
              setNuevaDireccion({ ...nuevaDireccion, telefonoContacto: e.target.value.replace(/\D/g, "") })
            }
            className="border border-leather-200 bg-leather-50 p-2 rounded-md focus:ring-2 focus:ring-leather-400 placeholder-gray-400 text-leather-900 font-medium text-sm"
          />
        </div>

        <button
          className="mt-6 w-full px-4 py-2 bg-leather-800 text-white rounded-md hover:bg-leather-900 font-bold shadow text-base transition-all duration-200"
          onClick={handleGuardar}
        >
          Guardar dirección
        </button>
      </div>

      {/* Modal de confirmación de borrado */}
      {mostrarModalBorrar && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full text-center">
            <p className="mb-4 text-orange-900 text-base font-semibold">
              ¿Estás seguro de que querés borrar esta dirección?
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={confirmarBorrado}
                className="px-4 py-2 bg-leather-800 text-white rounded-md hover:bg-leather-900 font-bold text-sm"
              >
                Sí, borrar
              </button>
              <button
                onClick={cancelarBorrado}
                className="px-4 py-2 bg-gray-200 text-leather-800 rounded-md hover:bg-gray-300 font-bold text-sm"
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
