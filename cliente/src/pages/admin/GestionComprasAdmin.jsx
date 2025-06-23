import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from "../../store/slices/ordersSlice";

const GestionComprasAdmin = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.users);
    const compras = useSelector((state) => state.orders.items)
    const { error } = useSelector((state) => state.orders)
    const [compraDetalleId, setCompraDetalleId] = useState(null);
    const [ordenarPor, setOrdenarPor] = useState("fecha-desc"); // por defecto: fecha descendente
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || !user.token) return;
        dispatch(fetchOrders(user.token))
    }, [dispatch]);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 text-leather-700">Todas las Compras</h2>
                <button className="py-2 text-leather-800 hover:underline" onClick={() => navigate('/admin')}>
                    Volver al dashboard
                </button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {compras.length === 0 ? (
                <div className="bg-leather-50 border border-leather-200 text-leather-700 text-center p-6 rounded-lg shadow mt-8">
                    No hay compras registradas por el momento.
                </div>
            ) : (
                <>
                <div className="flex justify-end mb-4">
                  <label className="mr-2 font-semibold">Ordenar por:</label>
                  <select
                    value={ordenarPor}
                    onChange={e => setOrdenarPor(e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option value="fecha-desc">Fecha (más nuevo primero)</option>
                    <option value="fecha-asc">Fecha (más viejo primero)</option>
                    <option value="precio-desc">Mayor precio</option>
                    <option value="precio-asc">Menor precio</option>
                    <option value="cantidad-desc">Cantidad de productos (más a menos)</option>
                    <option value="cantidad-asc">Cantidad de productos (menos a más)</option>
                  </select>
                </div>
                <ul className="space-y-4">
                    {[...compras]
                      .sort((a, b) => {
                        switch (ordenarPor) {
                          case "precio-desc":
                            return (b.total || 0) - (a.total || 0);
                          case "precio-asc":
                            return (a.total || 0) - (b.total || 0);
                          case "cantidad-desc":
                            return (b.items?.length || 0) - (a.items?.length || 0);
                          case "cantidad-asc":
                            return (a.items?.length || 0) - (b.items?.length || 0);
                          case "fecha-asc":
                            return new Date(a.fecha) - new Date(b.fecha);
                          case "fecha-desc":
                          default:
                            return new Date(b.fecha) - new Date(a.fecha);
                        }
                      })
                      .map((compra) => (
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
                                                <li key={idx} className="flex items-center gap-3 mb-2">
                                                    {item.fotos && item.fotos.length > 0 && (
                                                        <img
                                                            src={`data:image/jpeg;base64,${item.fotos[0].file}`}
                                                            alt="Foto producto"
                                                            className="w-12 h-12 object-cover rounded shadow border"
                                                        />
                                                    )}
                                                    <span>
                                                        {item.nombreProducto} x{item.cantidad} - ${item.precioUnitario} c/u = ${item.subtotal}
                                                    </span>
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
                </>
            )}
        </div>
    );
};

export default GestionComprasAdmin;
