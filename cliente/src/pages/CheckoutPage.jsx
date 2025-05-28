import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const CarritoPage = ({ cartItems, setCartItems, user }) => {
  if (!cartItems) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Error: No se pudo cargar el carrito.
      </div>
    );
  }

  const navigate = useNavigate();

  // Calcula el total
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Estado y handler de cupón
  const [cupon, setCupon] = React.useState("");
  const [aplicado, setAplicado] = React.useState(false);
  const [descuento, setDescuento] = React.useState(0);
  const [cuponMsg, setCuponMsg] = React.useState("");
  const [subtotalBD, setSubtotalBD] = React.useState(null);
  const [montoDescuento, setMontoDescuento] = React.useState(null);
  const [totalBD, setTotalBD] = React.useState(null);

  // Estados para checkout
  const [metodoEntrega, setMetodoEntrega] = React.useState(null); // 1 para envío, 2 para retiro
  const [direccion, setDireccion] = React.useState("");
  const [localidad, setLocalidad] = React.useState("");
  const [provincia, setProvincia] = React.useState("");
  const [codigoPostal, setCodigoPostal] = React.useState("");
  const [telefono, setTelefono] = React.useState("");
  const [puntoRetiroId, setPuntoRetiroId] = React.useState("");
  const [puntosRetiro, setPuntosRetiro] = React.useState([]);
  React.useEffect(() => {
    if (metodoEntrega === 2) {
      fetch("http://localhost:8080/entregas/metodos")
        .then(res => res.json())
        .then(data => {
          const metodo = data.find(m => m.nombre === "Retiro en tienda");
          if (metodo?.id) {
            fetch(`http://localhost:8080/entregas/puntos/metodo/${metodo.id}`)
              .then(res => res.json())
              .then(setPuntosRetiro)
              .catch(err => console.error("Error al obtener puntos:", err));
          }
        });
    }
  }, [metodoEntrega]);

  const [errorCheckout, setErrorCheckout] = React.useState("");

  const handleAplicarCupon = () => {
    const codigo = cupon.trim();
    if (!codigo || !user?.token) return;

    const items = cartItems.map(item => {
      return {
        productoId: item.id || item.productoId,
        cantidad: item.quantity
      }
    });

    fetch('http://localhost:8080/descuentos/validar', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        codigoDescuento: codigo,
        items
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.descuentoAplicado) {
          setDescuento(data.porcentajeDescuento);
          setAplicado(true);
          setCuponMsg(`Cupón aplicado: ${data.porcentajeDescuento}% de descuento`);
          setSubtotalBD(data.subtotalSinDescuento);
          setMontoDescuento(data.montoDescuento);
          setTotalBD(data.totalConDescuento);
        } else {
          setDescuento(0);
          setAplicado(false);
          setCuponMsg(data.mensajeError || 'Cupón inválido');
          setSubtotalBD(null);
          setMontoDescuento(null);
          setTotalBD(null);
        }
      })
      .catch(() => {
        setDescuento(0);
        setAplicado(false);
        setCuponMsg('Cupón inválido');
        setSubtotalBD(null);
        setMontoDescuento(null);
        setTotalBD(null);
      });
  };

  // Handlers para cantidad y eliminar productos
  const handleQuantityChange = (idx, newQty) => {
    if (newQty < 1) return;
    setCartItems(items =>
      items.map((item, i) =>
        i === idx
          ? { ...item, quantity: Math.min(newQty, item.stock ?? 99) }
          : item
      )
    );
  };

  const handleRemove = idx => {
    setCartItems(items => items.filter((_, i) => i !== idx));
  };

  const handleProcederPago = () => {
    setErrorCheckout("");
    if (!metodoEntrega) {
      setErrorCheckout("Por favor, selecciona un método de entrega.");
      return;
    }

    // Validar campos según método
    if (metodoEntrega === 1) {
      // Envío: validar campos obligatorios
      if (!direccion.trim() || !localidad.trim() || !provincia.trim() || !codigoPostal.trim() || !telefono.trim()) {
        setErrorCheckout("Por favor, completa todos los campos de envío.");
        return;
      }
    } else if (metodoEntrega === 2) {
      // Retiro: validar puntoRetiroId
      if (!puntoRetiroId.trim()) {
        setErrorCheckout("Por favor, selecciona un punto de retiro.");
        return;
      }
    }

    // Construir body para POST
    const items = cartItems.map(item => ({
      productoId: item.id || item.productoId,
      cantidad: item.quantity
    }));

    const body = {
      items,
      codigoDescuento: aplicado ? cupon.trim() : null,
      metodoEntrega,
    };

    if (metodoEntrega === 1) {
      body.direccion = {
        direccion: direccion.trim(),
        localidad: localidad.trim(),
        provincia: provincia.trim(),
        codigoPostal: codigoPostal.trim(),
        telefono: telefono.trim(),
      };
    } else if (metodoEntrega === 2) {
      body.puntoRetiroId = puntoRetiroId.trim();
    }

    fetch('http://localhost:8080/compras', {
      method: 'POST',
      headers: {
        'Authorization': user?.token ? `Bearer ${user.token}` : undefined,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) throw new Error("Error en la compra");
        return res.json();
      })
      .then(data => {
        // Aquí se podría redirigir o mostrar mensaje de éxito
        alert("Compra realizada con éxito.");
        // Limpiar carrito y navegar a otra página si se desea
        setCartItems([]);
        navigate("/");
      })
      .catch(() => {
        setErrorCheckout("Hubo un error al procesar la compra. Intenta nuevamente.");
      });
  };

  return (
    <>
      <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <button
            className="mb-4 text-sm text-leather-600 hover:underline"
            onClick={() => navigate(-1)}
          >
            &lt; Volver al sitio
          </button>
          <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-col-dense gap-8">
            {/* Columna izquierda: datos del comprador, entrega y pago */}
            <div className="bg-white border rounded-lg p-6 flex flex-col gap-6">
              {/* Email de contacto solo si no hay usuario */}
              {!user && (
                <div className="pt-0">
                  <h3 className="font-semibold text-leather-700 mb-2">Email de contacto</h3>
                  <input
                    type="email"
                    placeholder="Tu email"
                    className="border rounded px-3 py-2 w-full"
                    // No se pide guardar ni validar este email, solo mostrar el campo
                  />
                </div>
              )}
              {/* Nombre del comprador */}
              <div className="pb-0">
                <h3 className="font-semibold text-leather-700 mb-1">Nombre del comprador</h3>
                <div className="text-gray-800">{user?.email || "Invitado"}</div>
              </div>
              {/* Entrega */}
              <div className="pt-0">
                <h3 className="font-semibold text-leather-700 mb-2">Entrega</h3>
                <div className="flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="metodoEntrega"
                      value="1"
                      checked={metodoEntrega === 1}
                      onChange={() => setMetodoEntrega(1)}
                    />
                    Envío a Domicilio
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="metodoEntrega"
                      value="2"
                      checked={metodoEntrega === 2}
                      onChange={() => setMetodoEntrega(2)}
                    />
                    Retiro en tienda
                  </label>
                </div>
                {metodoEntrega === 1 && (
                  <div className="mt-4 space-y-2">
                    <input
                      type="text"
                      placeholder="Dirección"
                      value={direccion}
                      onChange={e => setDireccion(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Localidad"
                      value={localidad}
                      onChange={e => setLocalidad(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Provincia"
                      value={provincia}
                      onChange={e => setProvincia(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Código Postal"
                      value={codigoPostal}
                      onChange={e => setCodigoPostal(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    />
                    <input
                      type="text"
                      placeholder="Teléfono"
                      value={telefono}
                      onChange={e => setTelefono(e.target.value)}
                      className="border rounded px-3 py-2 w-full"
                    />
                  </div>
                )}
                {metodoEntrega === 2 && (
                  <div className="mt-4">
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
                  </div>
                )}
              </div>
              {/* Forma de pago */}
              <div className="pt-0">
                <h3 className="font-semibold text-leather-700 mb-2">Forma de Pago</h3>
                <p className="text-sm text-gray-700">
                  Después de hacer clic en 'Finalizar el pedido' serás redirigido a Mercado Pago para completar tu compra de forma segura.
                </p>
              </div>
              {/* Errores */}
              {errorCheckout && (
                <div className="text-red-600 font-semibold">{errorCheckout}</div>
              )}
            </div>
            {/* Columna derecha: productos, cupón y resumen de pedido */}
            <div className="bg-white border rounded-lg p-6 flex flex-col gap-6">
              {/* Listado de productos */}
              <div className="bg-white border rounded-lg p-4">
                <div className="mb-4 flex font-bold text-leather-700 text-lg">
                  <div className="flex-1">Producto</div>
                  <div className="w-32 text-center">Precio</div>
                  <div className="w-32 text-center">Cantidad</div>
                  <div className="w-10"></div>
                </div>
                {cartItems.length === 0 ? (
                  <div className="text-center text-leather-500 my-10">¡Tu carrito está vacío!</div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center border-t py-4">
                      <img
                        src={item.image || "https://via.placeholder.com/80?text=Sin+Imagen"}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded mr-4 border"
                      />
                      <div className="flex-1 truncate">
                        <div className="font-medium text-leather-800 truncate">{item.name}</div>
                      </div>
                      <div className="w-32 text-center font-bold">
                        ${item.price.toLocaleString("es-AR")}
                      </div>
                      <div className="w-32 flex items-center justify-center gap-2">
                        <button
                          className="px-2 py-1 border rounded"
                          onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >-</button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="px-2 py-1 border rounded"
                          onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                          disabled={item.quantity >= (item.stock ?? 99)}
                        >+</button>
                      </div>
                      <div className="w-10 flex justify-center">
                        <button
                          onClick={() => handleRemove(idx)}
                          className="text-gray-400 hover:text-red-500 text-xl"
                          title="Eliminar producto"
                        >🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* Código de descuento debajo del listado de productos */}
              <div className="mt-6">
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
                  {cuponMsg && (
                    <div className={`text-sm ${aplicado && descuento > 0 ? "text-green-700" : "text-red-500"}`}>
                      {cuponMsg}
                    </div>
                  )}
                </div>
              </div>
              {/* Resumen del pedido al final */}
              <div className="border-t pt-4 space-y-2">
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
                  <span>Introducir la dirección de envío</span>
                </div>
                <div className="flex justify-between font-bold text-xl pt-2">
                  <span>Total</span>
                  <span>${(aplicado && totalBD !== null ? totalBD : subtotal).toLocaleString("es-AR")}</span>
                </div>
              </div>
              {/* Botón de finalizar pedido */}
              <button
                className="w-full bg-leather-700 hover:bg-leather-800 text-white font-bold py-2 rounded transition"
                onClick={handleProcederPago}
              >
                Finalizar pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarritoPage;