import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GestionComprasAdmin = ({ user }) => {
    const [compras, setCompras] = useState([]);
    const [error, setError] = useState(null);
    const [compraDetalleId, setCompraDetalleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/compras/admin/compras", {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error("Error al obtener compras");
                return res.json();
            })
            .then(setCompras)
            .catch((err) => setError(err.message));
    }, [user]);

    return (
        <div className="p-6">
            <div className='flex justify-between items-center mb-6'>
                <h2 className="text-2xl font-bold mb-4 text-leather-700">Todas las Compras</h2>
                <button className="py-2 text-leather-800 hover:underline" onClick={() => navigate('/admin')}>Volver al dashboard</button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="space-y-4">
                {compras.map((compra) => (
                    <li key={compra.id} className="border p-6 rounded-xl shadow bg-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-lg font-semibold text-leather-800">Compra #{compra.id}</p>
                                <p className="text-sm text-leather-600">{new Date(compra.fecha).toLocaleString()}</p>
                                <p className="text-sm text-leather-600">Usuario: {compra.nombreUsuario} ({compra.emailUsuario})</p>
                                <p className="text-sm text-leather-600">Total: ${compra.total}</p>
                            </div>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => setCompraDetalleId(compraDetalleId === compra.id ? null : compra.id)}
                            >
                                {compraDetalleId === compra.id ? "Ocultar detalle" : "Ver detalle"}
                            </button>
                        </div>

                        {compraDetalleId === compra.id && (
                            <div className="mt-4 text-sm text-leather-700 space-y-1">
                                <p><strong>Método de Pago:</strong> {compra.metodoDePago} ({compra.cuotas} cuotas)</p>
                                <p><strong>Entrega:</strong> {compra.metodoEntrega || compra.puntoRetiro || "A domicilio"}</p>

                                {compra.direccionEntrega && (
                                    <div>
                                        <p><strong>Dirección:</strong> {compra.direccionEntrega.calle} {compra.direccionEntrega.numero}, {compra.direccionEntrega.localidad}, {compra.direccionEntrega.provincia} (CP {compra.direccionEntrega.codigoPostal})</p>
                                        <p><strong>Teléfono:</strong> {compra.direccionEntrega.telefonoContacto}</p>
                                    </div>
                                )}

                                <div className="mt-2">
                                    <h4 className="font-semibold">Items:</h4>
                                    <ul className="list-disc list-inside ml-4">
                                        {compra.items.map((item, idx) => (
                                            <li key={idx}>
                                                {item.nombreProducto} x{item.cantidad} - ${item.precioUnitario} c/u = ${item.subtotal}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {compra.codigoDescuento && (
                                    <p><strong>Descuento:</strong> {compra.codigoDescuento} ({compra.porcentajeDescuento}%) = ${compra.montoDescuento}</p>
                                )}

                                <p><strong>Subtotal:</strong> ${compra.subtotal}</p>
                                <p><strong>Costo de Envío:</strong> ${compra.costoEnvio}</p>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GestionComprasAdmin;