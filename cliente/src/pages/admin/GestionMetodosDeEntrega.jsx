import React, { useEffect, useState } from "react";

const GestionMetodosDeEntrega = ({ user }) => {
  const [metodos, setMetodos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    costoBase: 0,
    tiempoEstimadoDias: 0,
    requiereDireccion: false,
    requierePuntoRetiro: false,
    activo: true,
  });
  const [editandoId, setEditandoId] = useState(null);
  const [errores, setErrores] = useState({});

  const fetchMetodos = () => {
    fetch("http://localhost:8080/entregas/metodos", {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then(setMetodos)
      .catch((err) => console.error("Error al obtener métodos:", err));
  };

  useEffect(() => {
    fetchMetodos();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
    if (!formulario.descripcion.trim()) nuevosErrores.descripcion = "La descripción es obligatoria.";
    if (formulario.costoBase < 0) nuevosErrores.costoBase = "El costo no puede ser negativo.";
    if (formulario.tiempoEstimadoDias < 0) nuevosErrores.tiempoEstimadoDias = "El tiempo debe ser 0 o mayor.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validar()) return;

    const url = editandoId
      ? `http://localhost:8080/entregas/metodos/${editandoId}`
      : "http://localhost:8080/entregas/metodos";
    const method = editandoId ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(formulario),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al guardar");
        return res.json();
      })
      .then(() => {
        setFormulario({
          nombre: "",
          descripcion: "",
          costoBase: 0,
          tiempoEstimadoDias: 0,
          requiereDireccion: false,
          requierePuntoRetiro: false,
          activo: true,
        });
        setErrores({});
        setModoEdicion(false);
        setEditandoId(null);
        fetchMetodos();
      })
      .catch((err) => alert(err.message));
  };

  const handleEditar = (metodo) => {
    setFormulario({
      nombre: metodo.nombre,
      descripcion: metodo.descripcion,
      costoBase: metodo.costoBase,
      tiempoEstimadoDias: metodo.tiempoEstimadoDias,
      requiereDireccion: metodo.requiereDireccion,
      requierePuntoRetiro: metodo.requierePuntoRetiro,
      activo: metodo.activo,
    });
    setErrores({});
    setEditandoId(metodo.id);
    setModoEdicion(true);
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este método?")) return;
    fetch(`http://localhost:8080/entregas/metodos/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(() => fetchMetodos())
      .catch((err) => alert("Error al eliminar"));
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Gestión de Métodos de Entrega</h2>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label className="block font-semibold">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formulario.nombre}
            onChange={handleChange}
            placeholder="Ej: Envío a domicilio"
            className="border p-2 rounded w-full"
          />
          {errores.nombre && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
        </div>
        <div>
          <label className="block font-semibold">Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            placeholder="Ej: Entrega en la dirección del cliente"
            className="border p-2 rounded w-full"
          />
          {errores.descripcion && <p className="text-red-600 text-sm mt-1">{errores.descripcion}</p>}
        </div>
        <div>
          <label className="block font-semibold">Costo base:</label>
          <input
            type="number"
            name="costoBase"
            value={formulario.costoBase}
            onChange={handleChange}
            placeholder="Ej: 1500"
            className="border p-2 rounded w-full"
          />
          {errores.costoBase && <p className="text-red-600 text-sm mt-1">{errores.costoBase}</p>}
        </div>
        <div>
          <label className="block font-semibold">Tiempo estimado (días):</label>
          <input
            type="number"
            name="tiempoEstimadoDias"
            value={formulario.tiempoEstimadoDias}
            onChange={handleChange}
            placeholder="Ej: 3"
            className="border p-2 rounded w-full"
          />
          {errores.tiempoEstimadoDias && <p className="text-red-600 text-sm mt-1">{errores.tiempoEstimadoDias}</p>}
        </div>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="requiereDireccion"
              checked={formulario.requiereDireccion}
              onChange={handleChange}
            />
            Requiere dirección
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="requierePuntoRetiro"
              checked={formulario.requierePuntoRetiro}
              onChange={handleChange}
            />
            Requiere punto de retiro
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={formulario.activo}
              onChange={handleChange}
            />
            Activo
          </label>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {modoEdicion ? "Actualizar" : "Crear"}
        </button>
        {modoEdicion && (
          <button
            type="button"
            onClick={() => {
              setModoEdicion(false);
              setEditandoId(null);
              setFormulario({
                nombre: "",
                descripcion: "",
                costoBase: 0,
                tiempoEstimadoDias: 0,
                requiereDireccion: false,
                requierePuntoRetiro: false,
                activo: true,
              });
              setErrores({});
            }}
            className="ml-2 text-gray-600 underline"
          >
            Cancelar edición
          </button>
        )}
      </form>

      <ul className="divide-y">
        {metodos.map((metodo) => (
          <li key={metodo.id} className="py-2 flex justify-between items-center">
            <div>
              <p className="font-semibold">{metodo.nombre}</p>
              <p className="text-sm text-gray-600">
                Estado: {metodo.activo ? "Activo" : "Inactivo"}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditar(metodo)}
                className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
              >
                Editar
              </button>
              <button
                onClick={() => handleEliminar(metodo.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionMetodosDeEntrega;
