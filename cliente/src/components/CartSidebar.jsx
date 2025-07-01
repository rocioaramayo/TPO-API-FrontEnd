import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../store/slices/cartSlice';

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

const CartSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  // Estado para advertencia por producto
  const [stockWarnings, setStockWarnings] = useState({});
  const stockWarningTimeouts = useRef({});

  // Suma total
  const total = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  const handleGoToCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-[400px] bg-white shadow-2xl z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b">
        <h2 className="text-2xl font-light text-orange-950">Mi Carrito</h2>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
      
      {/* Items */}
      <div
        className="overflow-y-auto px-5 py-4"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <p className="text-gray-500 mt-4 text-center font-light">Tu carrito está vacío</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="mb-6">
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
                      alt={item.nombre || "Producto"}
                      className="w-20 h-24 object-cover rounded mr-4 border"
                    />
                  );
                })()}
                <div className="flex-1">
                  <div className="font-medium text-orange-900 truncate">{item.nombre}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium text-amber-900">${item.precio.toLocaleString()}</span>
                    {stockWarnings[item.id] && (
                      <span className="text-xs text-red-600">Stock máximo alcanzado.</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      className="px-2 py-0.5 text-lg border rounded hover:bg-gray-100"
                      onClick={() => {
                        dispatch(decrementQuantity(item.id));
                        setStockWarnings((prev) => ({ ...prev, [item.id]: false }));
                        if (stockWarningTimeouts.current[item.id]) {
                          clearTimeout(stockWarningTimeouts.current[item.id]);
                        }
                      }}
                    >-</button>
                    <span className="font-medium text-base">{Math.min(item.quantity, item.stock !== undefined ? item.stock : 99)}</span>
                    <button
                      className="px-2 py-0.5 text-lg border rounded hover:bg-gray-100"
                      onClick={() => {
                        const max = item.stock !== undefined ? item.stock : 99;
                        if (item.quantity < max) {
                          dispatch(incrementQuantity(item.id));
                          setStockWarnings((prev) => ({ ...prev, [item.id]: false }));
                          if (stockWarningTimeouts.current[item.id]) {
                            clearTimeout(stockWarningTimeouts.current[item.id]);
                          }
                        } else {
                          setStockWarnings((prev) => ({ ...prev, [item.id]: true }));
                          if (stockWarningTimeouts.current[item.id]) {
                            clearTimeout(stockWarningTimeouts.current[item.id]);
                          }
                          stockWarningTimeouts.current[item.id] = setTimeout(() => {
                            setStockWarnings((prev) => ({ ...prev, [item.id]: false }));
                          }, 2000);
                        }
                      }}
                    >+</button>
                    <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="ml-auto text-gray-400 hover:text-red-600 transition-colors"
                        title="Eliminar producto"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Footer */}
      {cartItems.length > 0 && (
        <div className="absolute bottom-0 left-0 w-full border-t px-5 py-4 bg-white">
          <div className="flex justify-between items-center font-medium text-xl mb-3">
            <span>Subtotal</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <button
            className="w-full bg-orange-950 hover:bg-orange-900 text-white font-light tracking-wider py-3 rounded-md transition-colors"
            onClick={handleGoToCheckout}
          >
            PROCEDER AL PAGO
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;