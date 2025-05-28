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

  const handleAplicarCupon = () => {
    const codigo = cupon.trim();
    if (!codigo || !user?.token) return;

    fetch('http://localhost:8080/descuentos/validar?codigo=' + codigo, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0 && data[0].activo) {
          setDescuento(Number(data[0].porcentaje));
          setAplicado(true);
          setCuponMsg(`Cupón aplicado: ${data[0].porcentaje}% de descuento`);
        } else {
          setDescuento(0);
          setAplicado(false);
          setCuponMsg('Cupón inválido');
        }
      })
      .catch(() => {
        setDescuento(0);
        setAplicado(false);
        setCuponMsg('Cupón inválido');
      });
  };

  const total = subtotal * (1 - descuento / 100);

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

  return (
    <>
      <Navigation user={user} />
      <div className="min-h-screen bg-white py-10 px-4 flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <button
            className="mb-4 text-sm text-leather-600 hover:underline"
            onClick={() => navigate(-1)}
          >
            &lt; Volver al sitio
          </button>
          <h2 className="text-3xl font-bold text-center mb-6">Carrito de compras</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Columna izquierda: productos */}
            <div className="md:col-span-2 bg-white border rounded-lg p-4">
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
            {/* Columna derecha: resumen y cupón */}
            <div className="bg-white border rounded-lg p-6 flex flex-col justify-between min-h-[300px]">
              <div>
                <div className="mb-2 flex gap-2">
                  <input
                    type="text"
                    placeholder="Código"
                    value={cupon}
                    onChange={e => { setCupon(e.target.value); setAplicado(false); setCuponMsg(""); }}
                    className="border rounded px-3 py-2 flex-1"
                  />
                  <button
                    className={`bg-leather-800 text-white px-4 py-2 rounded font-bold hover:bg-leather-700 ${aplicado ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={handleAplicarCupon}
                    disabled={aplicado || cupon.trim() === ""}
                  >
                    AÑADIR
                  </button>
                  {aplicado && (
                    <button
                      className="ml-2 text-leather-700 underline text-xs"
                      onClick={() => { setAplicado(false); setCupon(""); setDescuento(0); setCuponMsg(""); }}
                      type="button"
                    >
                      Quitar cupón
                    </button>
                  )}
                </div>
                {cuponMsg && (
                  <div className={`mb-2 text-sm ${aplicado && descuento > 0 ? "text-green-700" : "text-red-500"}`}>{cuponMsg}</div>
                )}
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString("es-AR")}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between mb-2 text-green-700">
                    <span>Descuento ({descuento}%)</span>
                    <span>- ${Math.round(subtotal * descuento / 100).toLocaleString("es-AR")}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl mb-4">
                  <span>Total</span>
                  <span>${total.toLocaleString("es-AR")}</span>
                </div>
              </div>
              <button
                className="w-full bg-leather-700 hover:bg-leather-800 text-white font-bold py-2 rounded transition mb-2"
              >
                PROCEDER AL PAGO
              </button>
              <button
                className="w-full border border-leather-300 text-leather-800 font-semibold py-2 rounded"
                onClick={() => navigate("/productos")}
              >
                ELEGIR MÁS PRODUCTOS
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CarritoPage;