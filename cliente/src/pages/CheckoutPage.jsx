import React from "react";
import { FaCreditCard, FaUniversity } from "react-icons/fa";
import { MdOutlineCreditCard } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { SiMercadopago } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const CarritoPage = ({ cartItems, setCartItems, user }) => {
  const navigate = useNavigate();

  // BLOQUEO DE ACCESO SI NO HAY USUARIO AUTENTICADO
  if (!user || !user.token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Debes estar autenticado para acceder al carrito. <br />
        <button
          onClick={() => navigate("/login")}
          className="underline text-leather-700 ml-2"
        >
          Ir al login
        </button>
      </div>
    );
  }

  if (!cartItems) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Error: No se pudo cargar el carrito.
      </div>
    );
  }

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

  // Estado local para datos del usuario
  const [userInfo, setUserInfo] = React.useState(null);

  // Efecto para obtener datos del usuario autenticado
  React.useEffect(() => {
    if (user?.token) {
      fetch("http://127.0.0.1:8080/api/v1/users/me", {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(res => res.json())
        .then(data => setUserInfo(data))
        .catch(() => setUserInfo(null));
    }
  }, [user]);

  // Estados para checkout
  const [metodoEntrega, setMetodoEntrega] = React.useState(null); // 1 para envío, 2 para retiro
  const [metodoPago, setMetodoPago] = React.useState("");
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

    if (!metodoPago) {
      setErrorCheckout("Por favor, selecciona una forma de pago.");
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
      metodoEntregaId: metodoEntrega,
    };
    body.metodoPago = metodoPago;

    // Nuevo: obtener flags de la API para saber qué campos agregar
    (async () => {
      const metodo = await fetch("http://localhost:8080/entregas/metodos")
        .then(res => res.json())
        .then(data => data.find(m => m.id === metodoEntrega));

      if (!metodo) {
        setErrorCheckout("Método de entrega inválido.");
        return;
      }

      if (metodo.requiereDireccion) {
        body.direccionEntrega = direccion.trim();
        body.localidadEntrega = localidad.trim();
        body.provinciaEntrega = provincia.trim();
        body.codigoPostalEntrega = codigoPostal.trim();
        body.telefonoContacto = telefono.trim();
      }

      if (metodo.requierePuntoRetiro) {
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
    })();
  }

  return (
    <>
      <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
        <div className="max-w-screen-xl w-full">
          <button
            className="mb-4 text-sm text-leather-600 hover:underline"
            onClick={() => navigate(-1)}
          >
            &lt; Volver al sitio
          </button>
          <h2 className="text-3xl font-bold text-center mb-6">Checkout</h2>
          <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] md:grid-flow-col-dense gap-16">
            {/* Columna izquierda: datos del comprador, entrega y pago */}
            <div className="bg-white shadow-md rounded-lg px-8 pt-8 pb-10 flex flex-col gap-4 min-w-[520px] max-w-[1200px] ml-0">
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
                <div className="text-gray-800">
                  {userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : "Invitado"}
                </div>
                {userInfo && (
                  <div className="text-sm text-gray-600">{userInfo.email}</div>
                )}
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
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Nombre"
                        value={userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : ""}
                        readOnly
                        className="border rounded px-3 py-2 w-1/2 bg-gray-50 text-gray-500"
                      />
                      <input
                        type="text"
                        placeholder="Teléfono"
                        value={telefono}
                        onChange={e => setTelefono(e.target.value)}
                        className="border rounded px-3 py-2 w-1/2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Dirección"
                        value={direccion}
                        onChange={e => setDireccion(e.target.value)}
                        className="border rounded px-3 py-2 w-1/2"
                      />
                      <input
                        type="text"
                        placeholder="Localidad"
                        value={localidad}
                        onChange={e => setLocalidad(e.target.value)}
                        className="border rounded px-3 py-2 w-1/2"
                      />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Código Postal"
                        value={codigoPostal}
                        onChange={e => setCodigoPostal(e.target.value)}
                        className="border rounded px-3 py-2 w-1/2"
                      />
                      <input
                        type="text"
                        placeholder="Provincia"
                        value={provincia}
                        onChange={e => setProvincia(e.target.value)}
                        className="border rounded px-3 py-2 w-1/2"
                      />
                    </div>
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
                <div className="flex flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap sm:flex-wrap gap-6 mb-4 w-full min-h-[170px] overflow-x-auto">
                  <button
                    type="button"
                    className={`w-[150px] h-32 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded border-2 ${metodoPago === "TARJETA_CREDITO" ? "border-leather-700 bg-leather-50" : "border-gray-300 bg-white"} hover:border-leather-700 transition`}
                    onClick={() => setMetodoPago("TARJETA_CREDITO")}
                  >
                    <FaCreditCard className="mb-1" size={36} />
                    <span className="text-sm font-bold">Tarjeta de crédito</span>
                  </button>
                  <button
                    type="button"
                    className={`w-[150px] h-32 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded border-2 ${metodoPago === "TARJETA_DEBITO" ? "border-leather-700 bg-leather-50" : "border-gray-300 bg-white"} hover:border-leather-700 transition`}
                    onClick={() => setMetodoPago("TARJETA_DEBITO")}
                  >
                    <MdOutlineCreditCard className="mb-1" size={36} />
                    <span className="text-sm font-bold">Tarjeta de débito</span>
                  </button>
                  <button
                    type="button"
                    className={`w-[150px] h-32 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded border-2 ${metodoPago === "MERCADO_PAGO" ? "border-leather-700 bg-leather-50" : "border-gray-300 bg-white"} hover:border-leather-700 transition`}
                    onClick={() => setMetodoPago("MERCADO_PAGO")}
                  >
                    <SiMercadopago className="mb-1" size={36} />
                    <span className="text-sm font-bold">Mercado Pago</span>
                  </button>
                  <button
                    type="button"
                    className={`w-[150px] h-32 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded border-2 ${metodoPago === "TRANSFERENCIA" ? "border-leather-700 bg-leather-50" : "border-gray-300 bg-white"} hover:border-leather-700 transition`}
                    onClick={() => setMetodoPago("TRANSFERENCIA")}
                  >
                    <FaUniversity className="mb-1" size={36} />
                    <span className="text-sm font-bold">Transferencia</span>
                  </button>
                  <div className="flex flex-col items-center">
                    <button
                      type="button"
                      className={`w-[150px] h-32 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded border-2 ${metodoPago === "EFECTIVO" ? "border-leather-700 bg-leather-50" : "border-gray-300 bg-white"} hover:border-leather-700 transition ${metodoEntrega !== 2 ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={metodoEntrega !== 2}
                      onClick={() => {
                        if (metodoEntrega === 2) setMetodoPago("EFECTIVO");
                      }}
                    >
                      <BsCash className="mb-1" size={36} />
                      <span className="text-sm font-bold">Efectivo</span>
                    </button>
                    {metodoEntrega !== 2 && (
                      <span className="block text-xs text-gray-500 text-center mt-1">
                        Solo disponible para retiro en tienda
                      </span>
                    )}
                  </div>
                </div>
                {/* Inputs para tarjeta */}
                {(metodoPago === "TARJETA_CREDITO" || metodoPago === "TARJETA_DEBITO") && (
                  <div className="mb-4 space-y-2">
                    <input type="text" placeholder="Número de tarjeta" className="border rounded px-3 py-2 w-full" />
                    <input type="text" placeholder="Nombre del titular" className="border rounded px-3 py-2 w-full" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="Vencimiento (MM/AA)" className="border rounded px-3 py-2 w-1/2" />
                      <input type="text" placeholder="Código de Seguridad" className="border rounded px-3 py-2 w-1/2" />
                    </div>
                    {metodoPago === "TARJETA_CREDITO" && (
                      <div>
                        <label className="block font-semibold text-leather-700 mb-1">Cuotas disponibles</label>
                        <select className="border rounded px-3 py-2 w-full">
                          <option value="">¿En cuántas cuotas deseas pagar?</option>
                          <option value="3">3 cuotas sin interés</option>
                          <option value="6">6 cuotas sin interés</option>
                          <option value="12">12 cuotas sin interés</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
                {/* Instrucción de pago según método */}
                {(
                  metodoPago === "TARJETA_CREDITO" ||
                  metodoPago === "TARJETA_DEBITO" ||
                  metodoPago === "MERCADO_PAGO" ||
                  metodoPago === "TRANSFERENCIA"
                ) && (
                  <div className="mt-2">
                    {["TARJETA_CREDITO", "TARJETA_DEBITO"].includes(metodoPago) && (
                      <p className="text-sm text-gray-700">
                        Vas a completar el pago con tu tarjeta de forma segura.
                      </p>
                    )}
                    {metodoPago === "MERCADO_PAGO" && (
                      <p className="text-sm text-gray-700">
                        Después de hacer clic en 'Finalizar el pedido' serás redirigido a Mercado Pago para completar tu compra de forma segura.
                      </p>
                    )}
                    {metodoPago === "TRANSFERENCIA" && (
                      <p className="text-sm text-gray-700">
                        Por favor, transferí a ALIAS: CUERO.ARG y envianos el comprobante a pagos@cueroarg.com.ar.
                      </p>
                    )}
                  </div>
                )}
              </div>
              {/* Errores */}
              {errorCheckout && (
                <div className="text-red-600 font-semibold">{errorCheckout}</div>
              )}
            </div>
            {/* Columna derecha: productos, cupón y resumen de pedido */}
            <div className="bg-white border rounded-lg p-4 flex flex-col h-[650px] min-w-[370px] max-w-[500px]">
              {/* Header de productos SIEMPRE arriba */}
              <div className="bg-white border rounded-lg p-4 mb-0">
                <div className="mb-4 flex font-bold text-leather-700 text-lg">
                  <div className="flex-1">Producto</div>
                  <div className="w-32 text-center">Precio</div>
                  <div className="w-32 text-center">Cantidad</div>
                  <div className="w-10"></div>
                </div>
              </div>
              {/* Lista de productos SCROLLEABLE entre header y resumen */}
              <div className="flex-1 overflow-y-auto">
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
              {/* Bloques de cupón, resumen y finalizar pedido SIEMPRE abajo */}
              <div className="flex flex-col gap-4 mt-6">
                {/* Código de descuento */}
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
                    {cuponMsg && (
                      <div className={`text-sm ${aplicado && descuento > 0 ? "text-green-700" : "text-red-500"}`}>
                        {cuponMsg}
                      </div>
                    )}
                  </div>
                </div>
                {/* Resumen del pedido */}
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
                    <span>Introducir la dirección de envío</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl pt-2">
                    <span>Total</span>
                    <span>${(aplicado && totalBD !== null ? totalBD : subtotal).toLocaleString("es-AR")}</span>
                  </div>
                </div>
                {/* Botón de finalizar pedido */}
                <button
                  className="w-full bg-leather-700 hover:bg-leather-800 text-white font-bold py-3 rounded transition"
                  onClick={handleProcederPago}
                >
                  Finalizar pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarritoPage;