import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { fetchOrderDetail } from "../store/slices/ordersSlice";

// Función para deducir tipo mime
function guessMimeType(foto) {
  if (!foto || !foto.file) return "image/jpeg";

  const base64 = foto.file;

  // Detectar JPEG (común en base64 de imágenes)
  if (base64.startsWith("/9j/")) return "image/jpeg";

  // Detectar PNG
  if (base64.startsWith("iVBOR")) return "image/png";

  // Detectar GIF
  if (base64.startsWith("R0lGOD")) return "image/gif";

  // Detectar WebP
  if (base64.startsWith("UklGR")) return "image/webp";

  // Default
  return "image/jpeg";
}

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

const ConfirmacionPedido = () => {
  const { compraId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const isAuthenticated = useSelector((state) => state.users.isAuthenticated);
  const dispatch = useDispatch();

  const compra = useSelector((state) => state.orders.orderDetail);
  const loading = useSelector((state) => state.orders.loadingOrderDetail);
  const error = useSelector((state) => state.orders.errorOrderDetail);

  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      navigate('/login');
      return;
    }
    if (!compraId) {
      // Manejo de error por id inválido
      return;
    }
    dispatch(fetchOrderDetail({ token: user.token, id: compraId }));
  }, [compraId, user, isAuthenticated, navigate, dispatch]);

  // Función para mostrar información de entrega
  const mostrarInfoEntrega = (compra) => {
    if (compra.direccionEntrega) {
      if (typeof compra.direccionEntrega === 'object') {
        return `${compra.direccionEntrega.calle} ${compra.direccionEntrega.numero}, ${compra.direccionEntrega.localidad}`;
      }
      return compra.direccionEntrega;
    }
    if (compra.puntoRetiro) {
      return `Retiro en: ${compra.puntoRetiro}`;
    }
    return compra.metodoEntrega || "Sin información de entrega";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-leather-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-leather-600">Cargando confirmación...</p>
        </div>
      </div>
    );
  }

  if (error || !compra) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 text-red-800 p-6 rounded-lg mb-6">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-2">Error</h3>
            <p>{error || "No se pudo cargar la información de la compra"}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-leather-800 text-white px-6 py-3 rounded-lg hover:bg-leather-900 transition-colors"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header de confirmación */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            ¡Compra realizada con éxito!
          </h1>
          <p className="text-green-700 text-lg mb-4">
            Tu pedido #{compra.id} ha sido confirmado
          </p>
          <p className="text-green-600">
            Recibirás un email de confirmación con todos los detalles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Información de la compra */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Productos comprados */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-leather-900 mb-6">
                Productos comprados
              </h2>
              
              <div className="space-y-4">
                {compra.items && compra.items.map((item, index) => (
                  <div key={index} className="flex items-center border-b border-leather-100 pb-4 last:border-b-0">
                    {/* Imagen del producto */}
                    <div className="w-20 h-20 bg-cream-100 rounded-lg mr-4 flex-shrink-0 overflow-hidden">
                     {item.fotos && item.fotos.length > 0 ? (
                      (() => {
                        const foto = item.fotos[0];
                        const mimeType = guessMimeType(foto);
                        return (
                          <img
                            src={`data:${mimeType};base64,${foto.file}`}
                            alt={item.nombreProducto}
                            className="w-full h-full object-cover"
                          />
                        );
                      })()
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-leather-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    </div>
                    
                    {/* Información del producto */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-leather-900 mb-1">
                        {item.nombreProducto || "Producto sin nombre"}
                      </h3>
                      <div className="text-sm text-leather-600 space-y-1">
                        <p>Cantidad: {item.cantidad || 0}</p>
                        <p>Precio unitario: ${(item.precioUnitario || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-leather-900">
                        ${(item.subtotal || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Información de entrega */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-leather-900 mb-4">
                Información de entrega
              </h2>
              
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-leather-700">Método de entrega:</span>
                  <p className="text-leather-600">{compra.metodoEntrega || "-"}</p>
                </div>
                
                {compra.direccionEntrega && (
                  <div className="bg-leather-50 p-4 rounded-lg">
                    <span className="font-semibold text-leather-700 block mb-2">Dirección de envío:</span>
                    {typeof compra.direccionEntrega === 'object' ? (
                      <div className="text-leather-600 space-y-1">
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
                      </div>
                    ) : (
                      <div className="text-leather-600">
                        <p>{compra.direccionEntrega}</p>
                        {compra.localidadEntrega && (
                          <p>{compra.localidadEntrega}, {compra.provinciaEntrega}</p>
                        )}
                        {compra.codigoPostalEntrega && (
                          <p>CP: {compra.codigoPostalEntrega}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

               {compra.puntoRetiro && (
                <div>
                  <div><b>{compra.puntoRetiro.nombre}</b></div>
                  <div>{compra.puntoRetiro.direccion}</div>
                  <div>{compra.puntoRetiro.localidad}, {compra.puntoRetiro.provincia} (CP: {compra.puntoRetiro.codigoPostal})</div>
                  <div>Horario: {compra.puntoRetiro.horarioAtencion}</div>
                  <div>Teléfono: {compra.puntoRetiro.telefono}</div>
                  <div>Email: {compra.puntoRetiro.email}</div>
                </div>
              )}

              </div>
            </div>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-leather-900 mb-6">
                Resumen del pedido
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-leather-100">
                  <span className="font-semibold text-leather-700">Pedido #</span>
                  <span className="text-leather-900">{compra.id}</span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-leather-100">
                  <span className="font-semibold text-leather-700">Fecha</span>
                  <span className="text-leather-600">
                    {new Date(compra.fecha).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-2 border-b border-leather-100">
                  <span className="font-semibold text-leather-700">Método de pago</span>
                  <div className="text-right">
                    <p className="text-leather-600">
                      {formatearMetodoPago(compra.metodoDePago)}
                    </p>
                    {compra.cuotas && compra.cuotas > 1 && (
                      <p className="text-sm text-leather-500">
                        {compra.cuotas} cuotas
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2 py-2">
                  <div className="flex justify-between">
                    <span className="text-leather-600">Subtotal</span>
                    <span className="text-leather-900">
                      ${(compra.subtotal || 0).toLocaleString()}
                    </span>
                  </div>
                  
                  {compra.montoDescuento && compra.montoDescuento > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>
                          Descuento ({compra.porcentajeDescuento}%)
                        </span>
                        <span>
                          -${(compra.montoDescuento || 0).toLocaleString()}
                        </span>
                      </div>
                      {compra.codigoDescuento && (
                        <div className="text-xs text-green-600">
                          Código: {compra.codigoDescuento}
                        </div>
                      )}
                    </>
                  )}
                  
                  {compra.costoEnvio && compra.costoEnvio > 0 && (
                    <div className="flex justify-between">
                      <span className="text-leather-600">Envío</span>
                      <span className="text-leather-900">
                        ${compra.costoEnvio.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="border-t border-leather-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-leather-900">Total</span>
                    <span className="text-2xl font-bold text-leather-900">
                      ${(compra.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Acciones */}
              <div className="mt-8 space-y-3">
                <button
                  onClick={() => navigate('/perfil', { state: { tab: 'compras' } })}
                  className="w-full bg-leather-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-leather-900 transition-colors"
                >
                  Ver mis compras
                </button>
                <button
                  onClick={() => navigate('/productos')}
                  className="w-full border border-leather-800 text-leather-800 py-3 px-4 rounded-lg font-medium hover:bg-leather-800 hover:text-white transition-colors"
                >
                  Seguir comprando
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full text-leather-600 hover:text-leather-800 py-2 text-center transition-colors"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ConfirmacionPedido;