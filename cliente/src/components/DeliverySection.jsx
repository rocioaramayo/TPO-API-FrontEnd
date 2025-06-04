import React from "react";

const DeliverySection = ({
  metodosEntrega,
  metodoEntrega,
  setMetodoEntrega,
  metodoSeleccionado,
  direcciones,
  direccionSeleccionada,
  setDireccionSeleccionada,
  mostrarFormNuevaDireccion,
  setMostrarFormNuevaDireccion,
  nuevaDireccion,
  setNuevaDireccion,
  loadingDirecciones,
  errorDirecciones,
  handleCrearNuevaDireccion,
  puntosRetiro,
  puntoRetiroId,
  setPuntoRetiroId
}) => {
  
  return (
    <div className="pt-0">
      <h3 className="font-semibold text-leather-700 mb-2">Entrega</h3>
      
      {/* Métodos de entrega */}
      <div className="flex flex-col gap-2">
        {metodosEntrega.map(metodo => (
          <label key={metodo.id} className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="metodoEntrega"
              value={metodo.id}
              checked={String(metodoEntrega) === String(metodo.id)}
              onChange={e => setMetodoEntrega(e.target.value)}
            />
            {metodo.nombre}
          </label>
        ))}
      </div>
      
      {/* Sección de direcciones */}
      {metodoSeleccionado?.requiereDireccion && (
        <DireccionesSection
          direcciones={direcciones}
          direccionSeleccionada={direccionSeleccionada}
          setDireccionSeleccionada={setDireccionSeleccionada}
          mostrarFormNuevaDireccion={mostrarFormNuevaDireccion}
          setMostrarFormNuevaDireccion={setMostrarFormNuevaDireccion}
          nuevaDireccion={nuevaDireccion}
          setNuevaDireccion={setNuevaDireccion}
          loadingDirecciones={loadingDirecciones}
          errorDirecciones={errorDirecciones}
          handleCrearNuevaDireccion={handleCrearNuevaDireccion}
        />
      )}

      {/* Sección de puntos de retiro */}
      {metodoSeleccionado?.requierePuntoRetiro && (
        <PuntosRetiroSection
          puntosRetiro={puntosRetiro}
          puntoRetiroId={puntoRetiroId}
          setPuntoRetiroId={setPuntoRetiroId}
        />
      )}
    </div>
  );
};

// Componente para manejar direcciones
const DireccionesSection = ({
  direcciones,
  direccionSeleccionada,
  setDireccionSeleccionada,
  mostrarFormNuevaDireccion,
  setMostrarFormNuevaDireccion,
  nuevaDireccion,
  setNuevaDireccion,
  loadingDirecciones,
  errorDirecciones,
  handleCrearNuevaDireccion
}) => {
  
  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className="block font-semibold text-leather-700 mb-2">
          Seleccionar dirección de envío
        </label>
        
        {/* Mostrar errores de direcciones */}
        {errorDirecciones && (
          <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {errorDirecciones}
          </div>
        )}

        {/* Loading state */}
        {loadingDirecciones && (
          <div className="mb-3 flex items-center gap-2 text-leather-600">
            <span className="animate-spin border-2 border-leather-300 border-t-leather-700 rounded-full w-4 h-4"></span>
            <span>Cargando direcciones...</span>
          </div>
        )}
        
        {/* Lista de direcciones existentes */}
        {!loadingDirecciones && direcciones.length > 0 && (
          <div className="space-y-2 mb-4">
            {direcciones.map(dir => (
              <label key={dir.id} className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="direccionEnvio"
                  value={dir.id}
                  checked={direccionSeleccionada === dir.id.toString()}
                  onChange={e => setDireccionSeleccionada(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium">
                    {dir.calle} {dir.numero}
                    {dir.piso && `, Piso ${dir.piso}`}
                    {dir.departamento && `, Depto ${dir.departamento}`}
                  </div>
                  <div className="text-sm text-gray-600">
                    {dir.localidad}, {dir.provincia} - CP: {dir.codigoPostal}
                  </div>
                  {dir.telefonoContacto && (
                    <div className="text-sm text-gray-600">
                      Tel: {dir.telefonoContacto}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        {/* Botón para agregar nueva dirección */}
        <button
          type="button"
          onClick={() => setMostrarFormNuevaDireccion(!mostrarFormNuevaDireccion)}
          className="text-leather-700 hover:underline text-sm font-medium"
          disabled={loadingDirecciones}
        >
          {direcciones.length === 0 ? "Agregar dirección" : "+ Agregar nueva dirección"}
        </button>

        {/* Formulario para nueva dirección */}
        {mostrarFormNuevaDireccion && (
          <FormNuevaDireccion
            nuevaDireccion={nuevaDireccion}
            setNuevaDireccion={setNuevaDireccion}
            setMostrarFormNuevaDireccion={setMostrarFormNuevaDireccion}
            handleCrearNuevaDireccion={handleCrearNuevaDireccion}
            loadingDirecciones={loadingDirecciones}
          />
        )}
      </div>
    </div>
  );
};

// Componente para el formulario de nueva dirección
const FormNuevaDireccion = ({
  nuevaDireccion,
  setNuevaDireccion,
  setMostrarFormNuevaDireccion,
  handleCrearNuevaDireccion,
  loadingDirecciones
}) => {
  
  return (
    <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Calle *"
          value={nuevaDireccion.calle}
          onChange={e => setNuevaDireccion({...nuevaDireccion, calle: e.target.value})}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          type="text"
          placeholder="Número *"
          value={nuevaDireccion.numero}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={e => setNuevaDireccion({ ...nuevaDireccion, numero: e.target.value.replace(/\D/g, "") })}
          className="border rounded px-3 py-2 w-24"
          required
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Piso (opcional)"
          value={nuevaDireccion.piso}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={e => setNuevaDireccion({ ...nuevaDireccion, piso: e.target.value.replace(/\D/g, "") })}
          className="border rounded px-3 py-2 flex-1"
        />
        <input
          type="text"
          placeholder="Depto (opcional)"
          value={nuevaDireccion.departamento}
          onChange={e => setNuevaDireccion({...nuevaDireccion, departamento: e.target.value})}
          className="border rounded px-3 py-2 flex-1"
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Localidad *"
          value={nuevaDireccion.localidad}
          onChange={e => setNuevaDireccion({...nuevaDireccion, localidad: e.target.value})}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          type="text"
          placeholder="Provincia *"
          value={nuevaDireccion.provincia}
          onChange={e => setNuevaDireccion({...nuevaDireccion, provincia: e.target.value})}
          className="border rounded px-3 py-2 flex-1"
          required
        />
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Código Postal *"
          value={nuevaDireccion.codigoPostal}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={e => setNuevaDireccion({ ...nuevaDireccion, codigoPostal: e.target.value.replace(/\D/g, "") })}
          className="border rounded px-3 py-2 flex-1"
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={nuevaDireccion.telefonoContacto}
          inputMode="numeric"
          pattern="[0-9]*"
          onChange={e => setNuevaDireccion({ ...nuevaDireccion, telefonoContacto: e.target.value.replace(/\D/g, "") })}
          className="border rounded px-3 py-2 flex-1"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setMostrarFormNuevaDireccion(false)}
          className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          disabled={loadingDirecciones}
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleCrearNuevaDireccion}
          className="px-4 py-2 bg-leather-700 text-white rounded hover:bg-leather-800 disabled:opacity-50"
          disabled={loadingDirecciones || !nuevaDireccion.calle || !nuevaDireccion.numero || !nuevaDireccion.localidad}
        >
          {loadingDirecciones ? "Guardando..." : "Guardar dirección"}
        </button>
      </div>
    </div>
  );
};

// Componente para puntos de retiro
const PuntosRetiroSection = ({ puntosRetiro, puntoRetiroId, setPuntoRetiroId }) => {
  const puntoSeleccionado = puntosRetiro.find(p => String(p.id) === String(puntoRetiroId));
  return (
    <div className="mt-4 space-y-2">
      <select
        value={puntoRetiroId}
        onChange={e => setPuntoRetiroId(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Seleccionar punto de retiro</option>
        {puntosRetiro.map(p => (
          <option key={p.id} value={p.id}>
            {p.nombre} - {p.direccion}
          </option>
        ))}
      </select>
      {puntoSeleccionado && (
        <div className="border rounded p-3 bg-gray-50">
          <div className="font-bold mb-1">{puntoSeleccionado.nombre}</div>
          <div classNamuhe="text-sm"><span className="font-semibold">Dirección:</span> {puntoSeleccionado.direccion}</div>
          <div className="text-sm"><span className="font-semibold">Localidad:</span> {puntoSeleccionado.localidad}</div>
          <div className="text-sm"><span className="font-semibold">Provincia:</span> {puntoSeleccionado.provincia}</div>
          <div className="text-sm"><span className="font-semibold">Código postal:</span> {puntoSeleccionado.codigoPostal}</div>
          <div className="text-sm"><span className="font-semibold">Horario:</span> {puntoSeleccionado.horarioAtencion || puntoSeleccionado.horario}</div>
          <div className="text-sm"><span className="font-semibold">Teléfono:</span> {puntoSeleccionado.telefono}</div>
          <div className="text-sm"><span className="font-semibold">Email:</span> {puntoSeleccionado.email}</div>
        </div>
      )}
    </div>
  );
};

export default DeliverySection;