function guessMimeType(foto) {
  if (!foto || !foto.file) return "image/jpeg";
  const base64 = foto.file;
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBOR")) return "image/png";
  if (base64.startsWith("R0lGOD")) return "image/gif";
  if (base64.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
}


const DetalleCompra = ({ compra, onClose }) => {
    if (!compra) return null;

    console.log("DetalleCompra recibió:", compra); // Debug

    return (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-leather-200">
            <h3 className="text-2xl font-bold text-leather-700 mb-4">
                Detalle de la Compra #{compra.id}
            </h3>

            <div className="mb-4 text-leather-600 space-y-2">
                <p>
                    <span className="font-semibold">Fecha:</span>{" "}
                    {compra.fecha ? new Date(compra.fecha).toLocaleString() : "-"}
                </p>
                <p>
                    <span className="font-semibold">Método de entrega:</span>{" "}
                    {compra.metodoEntrega || "-"}
                </p>
                
                {/* Información de dirección - Compatible con ambas estructuras */}
                {compra.direccionEntrega && (
                    <div className="bg-gray-50 p-3 rounded border">
                        <p className="font-semibold text-leather-700 mb-1">Dirección de envío:</p>
                        {typeof compra.direccionEntrega === 'object' ? (
                            // Nueva estructura: direccionEntrega es un objeto
                            <>
                                <p>{compra.direccionEntrega.calle} {compra.direccionEntrega.numero}</p>
                                {(compra.direccionEntrega.piso || compra.direccionEntrega.departamento) && (
                                    <p>
                                        {compra.direccionEntrega.piso && `Piso ${compra.direccionEntrega.piso}`}
                                        {compra.direccionEntrega.piso && compra.direccionEntrega.departamento && ", "}
                                        {compra.direccionEntrega.departamento && `Depto ${compra.direccionEntrega.departamento}`}
                                    </p>
                                )}
                                <p>{compra.direccionEntrega.localidad}, {compra.direccionEntrega.provincia}</p>
                                <p>CP: {compra.direccionEntrega.codigoPostal}</p>
                                {compra.direccionEntrega.telefonoContacto && (
                                    <p>Tel: {compra.direccionEntrega.telefonoContacto}</p>
                                )}
                            </>
                        ) : (
                            // Estructura antigua: direccionEntrega es string
                            <>
                                <p>{compra.direccionEntrega}</p>
                                {compra.localidadEntrega && (
                                    <p>{compra.localidadEntrega}, {compra.provinciaEntrega}</p>
                                )}
                                {compra.codigoPostalEntrega && (
                                    <p>CP: {compra.codigoPostalEntrega}</p>
                                )}
                                {compra.telefonoContacto && (
                                    <p>Tel: {compra.telefonoContacto}</p>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Información de punto de retiro */}
                {compra.puntoRetiro && (
                <div className="bg-gray-50 p-3 rounded border">
                    <p className="font-semibold text-leather-700 mb-1">Punto de retiro:</p>
                    {typeof compra.puntoRetiro === "object" ? (
                    <>
                        <div><b>{compra.puntoRetiro.nombre}</b></div>
                        <div>{compra.puntoRetiro.direccion}</div>
                        <div>{compra.puntoRetiro.localidad}, {compra.puntoRetiro.provincia} (CP: {compra.puntoRetiro.codigoPostal})</div>
                        <div>Horario: {compra.puntoRetiro.horarioAtencion}</div>
                        <div>Teléfono: {compra.puntoRetiro.telefono}</div>
                        <div>Email: {compra.puntoRetiro.email}</div>
                    </>
                    ) : (
                    <p>{compra.puntoRetiro}</p>
                    )}
                </div>
                )}
                {/* Costo de envío */}
                {compra.costoEnvio && compra.costoEnvio > 0 && (
                    <p>
                        <span className="font-semibold">Costo de envío:</span>{" "}
                        ${compra.costoEnvio.toFixed(2)}
                    </p>
                )}

                {/* Método de pago */}
                {compra.metodoDePago && (
                    <p>
                        <span className="font-semibold">Método de pago:</span>{" "}
                        {formatearMetodoPago(compra.metodoDePago)}
                        {compra.cuotas && compra.cuotas > 1 && ` (${compra.cuotas} cuotas)`}
                    </p>
                )}
            </div>

            <h4 className="text-lg font-semibold text-leather-700 mb-2">Ítems comprados</h4>
            {compra.items && compra.items.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border">
                        <thead className="bg-leather-100 text-leather-700">
                        <tr>
                            <th className="p-2 border">Producto</th>
                            <th className="p-2 border">Cantidad</th>
                            <th className="p-2 border">Precio unitario</th>
                            <th className="p-2 border">Subtotal</th>
                        </tr>
                        </thead>
                        <tbody>
                            {compra.items.map((item, index) => (
                                <tr key={index} className="border-t">
                                {/* ⬇️ Cambia esta línea ⬇️ */}
                                <td className="p-2 border align-middle">
                                    {item.fotos && item.fotos.length > 0 && (
                                    <img
                                        src={`data:${guessMimeType(item.fotos[0])};base64,${item.fotos[0].file}`}
                                        alt={`Foto de ${item.nombreProducto}`}
                                        className="w-12 h-12 object-cover rounded shadow border inline-block mr-2 align-middle"
                                        style={{ minWidth: 48 }}
                                    />
                                    )}
                                    {item.nombreProducto || "Producto sin nombre"}
                                </td>
                                {/* Las otras columnas igual */}
                                <td className="p-2 border">{item.cantidad || 0}</td>
                                <td className="p-2 border">
                                    ${(item.precioUnitario || 0).toFixed(2)}
                                </td>
                                <td className="p-2 border">
                                    ${(item.subtotal || 0).toFixed(2)}
                                </td>
                                </tr>
                            ))}
                            </tbody>

                    </table>
                </div>
            ) : (
                <p className="text-gray-500 italic">No hay ítems para mostrar</p>
            )}

            <div className="mt-4 text-right text-leather-800 space-y-1">
                <p>
                    <span className="font-semibold">Subtotal:</span>{" "}
                    ${(compra.subtotal || 0).toFixed(2)}
                </p>
                {compra.montoDescuento && compra.montoDescuento > 0 && (
                    <>
                        <p className="text-green-600">
                            <span className="font-semibold">Descuento:</span> -$
                            {(compra.montoDescuento || 0).toFixed(2)}
                            {compra.porcentajeDescuento && ` (${compra.porcentajeDescuento}%)`}
                        </p>
                        {compra.codigoDescuento && (
                            <p className="text-green-600">
                                <span className="font-semibold">Código aplicado:</span>{" "}
                                {compra.codigoDescuento}
                            </p>
                        )}
                    </>
                )}
                {compra.costoEnvio && compra.costoEnvio > 0 && (
                    <p>
                        <span className="font-semibold">Envío:</span>{" "}
                        ${compra.costoEnvio.toFixed(2)}
                    </p>
                )}
                <p className="border-t pt-2">
                    <span className="font-bold text-lg">Total:</span>{" "}
                    ${(compra.total || 0).toFixed(2)}
                </p>
            </div>

            <button
                className="mt-6 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                onClick={onClose}
            >
                Cerrar detalle
            </button>
        </div>
    );
};

// Función helper para formatear método de pago
const formatearMetodoPago = (metodo) => {
    const metodos = {
        'EFECTIVO': 'Efectivo',
        'TARJETA_CREDITO': 'Tarjeta de Crédito',
        'TARJETA_DEBITO': 'Tarjeta de Débito',
        'MERCADO_PAGO': 'Mercado Pago',
        'TRANSFERENCIA': 'Transferencia Bancaria'
    };
    return metodos[metodo] || metodo;
};

export default DetalleCompra;