import React from "react";

// Deducir tipo mime a partir del nombre del archivo
function guessMimeType(foto) {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  if (foto?.file && foto.file.startsWith("/9j/")) return "image/jpeg";
  return "image/jpeg";
}

const CheckoutSummary = ({
  cartItems,
  cupon,
  setCupon,
  aplicado,
  setAplicado,
  setCuponMsg,
  handleAplicarCupon,
  cuponMsg,
  subtotal,
  subtotalBD,
  descuento,
  montoDescuento,
  totalBD,
  metodoSeleccionado,
  cotizando,
  costoEnvio,
  handleProcederPago,
  procesandoCompra,
  errorCategoria,
}) => {
  
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col h-[650px] min-w-[370px] max-w-[500px]">
      <ProductsHeader />
      <ProductsList cartItems={cartItems} />
      
      <div className="flex flex-col gap-4 mt-6">
        <CouponSection
          cupon={cupon}
          setCupon={setCupon}
          aplicado={aplicado}
          setAplicado={setAplicado}
          setCuponMsg={setCuponMsg}
          handleAplicarCupon={handleAplicarCupon}
          cuponMsg={cuponMsg}
          descuento={descuento}
          montoDescuento={montoDescuento}
          totalBD={totalBD}
          errorCategoria={errorCategoria}
        />
        <OrderSummary
          aplicado={aplicado}
          subtotalBD={subtotalBD}
          subtotal={subtotal}
          descuento={descuento}
          montoDescuento={montoDescuento}
          metodoSeleccionado={metodoSeleccionado}
          cotizando={cotizando}
          costoEnvio={costoEnvio}
          totalBD={totalBD}
        />
        <button
          className="w-full bg-leather-700 hover:bg-leather-800 text-white font-bold py-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleProcederPago}
          disabled={procesandoCompra || cartItems.length === 0}
        >
          {procesandoCompra ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
              Procesando...
            </span>
          ) : (
            "Finalizar pedido"
          )}
        </button>
      </div>
    </div>
  );
};

// Componente del header de productos
const ProductsHeader = () => (
  <div className="bg-white border rounded-lg p-4 mb-0">
    <div className="mb-4 flex font-bold text-leather-700 text-lg">
      <div className="flex-1">Producto</div>
      <div className="w-32 text-center">Precio</div>
      <div className="w-32 text-center">Cantidad</div>
      <div className="w-10"></div>
    </div>
  </div>
);

// Componente de la lista de productos (simplificado)
const ProductsList = ({ cartItems }) => (
  <div className="flex-1 overflow-y-auto">
    {cartItems.length === 0 ? (
      <div className="text-center text-leather-500 my-10">¡Tu carrito está vacío!</div>
    ) : (
      cartItems.map((item, idx) => (
        <ProductItem
          key={idx}
          item={item}
        />
      ))
    )}
  </div>
);

// Componente de un producto individual (simplificado)
const ProductItem = ({ item }) => {
  const foto = item.fotos && item.fotos[0];
  const mimeType = guessMimeType(foto);
  
  return (
    <div className="flex items-center border-t py-4">
      <img
        src={
          foto
            ? `data:${mimeType};base64,${foto.file || foto.contenidoBase64}`
            : "https://via.placeholder.com/80?text=Sin+Imagen"
        }
        alt={item.nombre}
        className="w-20 h-20 object-cover rounded mr-4 border"
      />
      <div className="flex-1 truncate">
        <div className="font-medium text-leather-800 truncate">{item.nombre}</div>
        <div className="text-sm text-gray-600">Cantidad: {item.quantity}</div>
      </div>
      <div className="w-32 text-center font-bold">
        ${(item.precio * item.quantity).toLocaleString("es-AR")}
      </div>
    </div>
  );
};

// Componente para la sección de cupón
const CouponSection = ({ 
  cupon, 
  setCupon, 
  aplicado, 
  setAplicado, 
  setCuponMsg, 
  handleAplicarCupon, 
  cuponMsg,
  descuento,
  montoDescuento,
  totalBD,
  errorCategoria
}) => (
  <div>
    <div className="space-y-2">
      <label className="block font-semibold text-leather-700">Código de descuento</label>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Código de descuento"
          value={cupon}
          onChange={e => {
            setCupon(e.target.value);
            setAplicado(false);
            setCuponMsg("");
          }}
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          className={`bg-leather-800 text-white px-4 py-2 rounded font-bold hover:bg-leather-700 ${aplicado ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleAplicarCupon}
          disabled={aplicado || cupon.trim() === ""}
        >
          Usar
        </button>
      </div>
      {/* Mostrar mensaje de cupón o error de categoría */}
      {cuponMsg && (
        <div className={`text-sm ${aplicado && descuento > 0 ? "text-green-700" : "text-red-500"}`}>
          {cuponMsg}
        </div>
      )}
      {errorCategoria && (
        <div className="text-sm text-red-500">
          {errorCategoria}
        </div>
      )}
    </div>
  </div>
);

// Componente para el resumen del pedido
const OrderSummary = ({
  aplicado,
  subtotalBD,
  subtotal,
  descuento,
  montoDescuento,
  metodoSeleccionado,
  cotizando,
  costoEnvio,
  totalBD
}) => {
  
  const calcularTotal = () => {
    const subtotalFinal = aplicado && totalBD !== null ? totalBD : subtotal;
    const envio = metodoSeleccionado?.requiereDireccion && costoEnvio ? costoEnvio : 0;
    return subtotalFinal + envio;
  };
  
  return (
    <div className="border-t pt-8 space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>${(aplicado && subtotalBD !== null ? subtotalBD : subtotal).toLocaleString("es-AR")}</span>
      </div>
      
      {aplicado && descuento > 0 && montoDescuento !== null && (
        <div className="flex justify-between text-green-700">
          <span>Descuento ({descuento}%)</span>
          <span>- ${Math.round(montoDescuento).toLocaleString("es-AR")}</span>
        </div>
      )}
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Envío</span>
        {metodoSeleccionado?.requiereDireccion ? (
          cotizando ? (
            <span>Cotizando...</span>
          ) : costoEnvio !== null ? (
            <span>${costoEnvio.toLocaleString("es-AR")}</span>
          ) : (
            <span>Selecciona dirección</span>
          )
        ) : (
          <span>-</span>
        )}
      </div>
      
      <div className="flex justify-between font-bold text-xl pt-2">
        <span>Total</span>
        <span>
          ${calcularTotal().toLocaleString("es-AR")}
        </span>
      </div>
    </div>
  );
};

export default CheckoutSummary;