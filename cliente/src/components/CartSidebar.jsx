import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Deducir tipo mime a partir del nombre del archivo (si existe)
function guessMimeType(foto) {
  if (foto?.nombre) {
    const ext = foto.nombre.split('.').pop().toLowerCase();
    if (ext === "png") return "image/png";
    if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
    if (ext === "gif") return "image/gif";
    if (ext === "webp") return "image/webp";
  }
  // Si empieza con "/9j/" probablemente es JPEG
  if (foto?.file && foto.file.startsWith("/9j/")) return "image/jpeg";
  // Default
  return "image/jpeg";
}

const CartSidebar = ({ isOpen, onClose, cartItems, onRemove, onAddQty, onSubQty }) => {
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState(null);
  const navigate = useNavigate();

  // Suma total
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-2xl font-bold">Mi carrito</h2>
        <button onClick={onClose} className="text-3xl font-bold hover:text-leather-600">
          &times;
        </button>
      </div>
      {/* Items */}
      <div
        className="overflow-y-auto px-5 py-4"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {cartItems.length === 0 ? (
          <p className="text-gray-500 mt-8 text-center">¡Tu carrito está vacío!</p>
        ) : (
          cartItems.map((item, idx) => (
            <div key={idx} className="mb-6">
              <div className="flex items-center">
                {(() => {
                  const foto = item.fotos && item.fotos[0];
                  const mimeType = guessMimeType(foto);
                  return (
                    <img
                      src={
                        foto
                          ? `data:${mimeType};base64,${foto.file || foto.contenidoBase64}`
                          : "https://via.placeholder.com/80?text=Sin+Imagen"
                      }
                      alt={item.name || "Producto"}
                      className="w-20 h-24 object-cover rounded mr-4 border"
                    />
                  );
                })()}
                <div className="flex-1">
                  <div className="font-medium text-leather-800 truncate">{item.name}</div>
                  <div className="text-lg font-bold text-leather-700">${item.price.toLocaleString()}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      className="px-2 py-1 text-lg font-bold border rounded hover:bg-leather-100"
                      onClick={() => onSubQty(idx)}
                    >-</button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      className="px-2 py-1 text-lg font-bold border rounded hover:bg-leather-100"
                      onClick={() => onAddQty(idx)}
                      disabled={item.quantity >= (item.stock !== undefined ? item.stock : 99)}
                    >+</button>
                    {confirmDeleteIndex === idx ? (
                      <div className="ml-4 flex items-center gap-2">
                        <span className="text-red-600 font-semibold">¿Eliminar este producto?</span>
                        <button
                          className="text-green-600 font-bold px-2 py-1 border border-green-600 rounded hover:bg-green-100"
                          onClick={() => {
                            onRemove(idx);
                            setConfirmDeleteIndex(null);
                          }}
                        >
                          Sí
                        </button>
                        <button
                          className="text-gray-600 font-semibold px-2 py-1 border border-gray-400 rounded hover:bg-gray-200"
                          onClick={() => setConfirmDeleteIndex(null)}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        className="ml-2 text-gray-400 hover:text-red-500 text-xl"
                        title="Eliminar producto"
                        onClick={() => setConfirmDeleteIndex(idx)}
                      >🗑️</button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* total */}
      <div className="absolute bottom-0 left-0 w-full border-t px-5 py-4 bg-white">
        <div className="flex justify-between items-center font-bold text-xl mb-2">
          <span>Total</span>
          <span>${total.toLocaleString()}</span>
        </div>
        <button
          className="w-full bg-leather-700 hover:bg-leather-800 text-white font-bold py-2 rounded transition"
          onClick={() => {
            onClose();
            navigate("/checkout");
          }}
        >
          PAGAR
        </button>
      </div>
    </div>
  );
};

export default CartSidebar;