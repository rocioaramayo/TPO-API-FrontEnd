import React from "react";

const DetalleCompra = ({ compra, onClose }) => {
    if (!compra) return null;

    return (
        <div className="mt-6 bg-white rounded-xl shadow-md p-6 border border-leather-200">
            <h3 className="text-2xl font-bold text-leather-700 mb-4">
                Detalle de la Compra #{compra.id}
            </h3>

            <div className="mb-4 text-leather-600">
                <p>
                    <span className="font-semibold">Fecha:</span>{" "}
                    {compra.fecha ? new Date(compra.fecha).toLocaleString() : "-"}
                </p>
                <p>
                    <span className="font-semibold">Método de entrega:</span>{" "}
                    {compra.metodoEntrega || "-"}
                </p>
                <p>
                    <span className="font-semibold">Dirección:</span>{" "}
                    {compra.direccionEntrega || compra.puntoRetiro || "-"}
                </p>
                <p>
                    <span className="font-semibold">Teléfono de contacto:</span>{" "}
                    {compra.telefonoContacto || "-"}
                </p>
            </div>

            <h4 className="text-lg font-semibold text-leather-700 mb-2">Ítems comprados</h4>
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
                {compra.items?.map((item, index) => (
                    <tr key={index} className="border-t">
                        <td className="p-2 border">{item.nombreProducto}</td>
                        <td className="p-2 border">{item.cantidad}</td>
                        <td className="p-2 border">
                            ${item.precioUnitario?.toFixed(2) ?? 0}
                        </td>
                        <td className="p-2 border">${item.subtotal?.toFixed(2) ?? 0}</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="mt-4 text-right text-leather-800">
                <p>
                    <span className="font-semibold">Subtotal:</span>{" "}
                    ${(compra.subtotal ?? 0).toFixed(2)}
                </p>
                {compra.montoDescuento > 0 && (
                    <>
                        <p>
                            <span className="font-semibold">Descuento:</span> -$
                            {(compra.montoDescuento ?? 0).toFixed(2)} (
                            {compra.porcentajeDescuento}%)
                        </p>
                        <p>
                            <span className="font-semibold">Código aplicado:</span>{" "}
                            {compra.codigoDescuento}
                        </p>
                    </>
                )}
                <p>
                    <span className="font-bold text-lg">Total:</span>{" "}
                    ${(compra.total ?? 0).toFixed(2)}
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

export default DetalleCompra;
