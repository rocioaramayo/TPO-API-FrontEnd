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

import React from "react";
import { FaCreditCard, FaUniversity } from "react-icons/fa";
import { MdOutlineCreditCard } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { SiMercadopago } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

const CarritoPage = ({ cartItems, setCartItems, user }) => {
  const navigate = useNavigate();

  // Definir flag de bloqueo por autenticación
  const isBlocked = !user || !user.token;

  // URL base consistente
  const API_BASE = "http://localhost:8080";

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

  // Estados para checkout
  const [metodosEntrega, setMetodosEntrega] = React.useState([]);
  const [metodoEntrega, setMetodoEntrega] = React.useState(""); // id del método de entrega
  const [metodoPago, setMetodoPago] = React.useState("");
  
  // Estados para direcciones - NUEVOS
  const [direcciones, setDirecciones] = React.useState([]);
  const [direccionSeleccionada, setDireccionSeleccionada] = React.useState("");
  const [mostrarFormNuevaDireccion, setMostrarFormNuevaDireccion] = React.useState(false);
  const [nuevaDireccion, setNuevaDireccion] = React.useState({
    calle: "",
    numero: "",
    piso: "",
    departamento: "",
    localidad: "",
    provincia: "",
    codigoPostal: "",
    telefonoContacto: ""
  });
  
  const [puntoRetiroId, setPuntoRetiroId] = React.useState("");
  const [puntosRetiro, setPuntosRetiro] = React.useState([]);
  // Estado para cotización de envío
  const [costoEnvio, setCostoEnvio] = React.useState(null);
  const [cotizando, setCotizando] = React.useState(false);

  // Estados de error y loading mejorados
  const [errorCheckout, setErrorCheckout] = React.useState("");
  const [loadingDirecciones, setLoadingDirecciones] = React.useState(false);
  const [errorDirecciones, setErrorDirecciones] = React.useState("");
  const [procesandoCompra, setProcesandoCompra] = React.useState(false);

  // Efecto para obtener datos del usuario autenticado
  React.useEffect(() => {
    if (user?.token) {
      fetch(`${API_BASE}/api/v1/users/me`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error ${res.status}: No se pudo cargar información del usuario`);
          }
          return res.json();
        })
        .then(data => setUserInfo(data))
        .catch(err => {
          console.error("Error al cargar usuario:", err);
          setUserInfo(null);
        });
    }
  }, [user]);

  // Cargar direcciones del usuario - MEJORADO
  React.useEffect(() => {
    if (user?.token) {
      setLoadingDirecciones(true);
      setErrorDirecciones("");
      
      fetch(`${API_BASE}/direcciones/mias`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudieron cargar las direcciones`);
        }
        return res.json();
      })
      .then(data => {
        setDirecciones(data);
        setErrorDirecciones("");
      })
      .catch(err => {
        console.error("Error al cargar direcciones:", err);
        setErrorDirecciones(err.message);
        setDirecciones([]);
      })
      .finally(() => {
        setLoadingDirecciones(false);
      });
    }
  }, [user]);

  // Traer métodos de entrega activos al montar - MEJORADO
  React.useEffect(() => {
    fetch(`${API_BASE}/entregas/metodos/activos`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudieron cargar los métodos de entrega`);
        }
        return res.json();
      })
      .then(setMetodosEntrega)
      .catch(err => {
        console.error("Error al cargar métodos de entrega:", err);
        setErrorCheckout("Error al cargar métodos de entrega. Por favor, recarga la página.");
      });
  }, []);

  // Definir el método seleccionado
  const metodoSeleccionado = metodosEntrega.find(m => String(m.id) === String(metodoEntrega));

  // useEffect mejorado para cotización de envío
  React.useEffect(() => {
    if (metodoSeleccionado?.requiereDireccion && direccionSeleccionada) {
      const direccion = direcciones.find(d => d.id.toString() === direccionSeleccionada);
      if (direccion) {
        setCotizando(true);
        fetch(`${API_BASE}/entregas/cotizar`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": user?.token ? `Bearer ${user.token}` : ""
          },
          body: JSON.stringify({
            direccion: `${direccion.calle} ${direccion.numero}`,
            localidad: direccion.localidad,
            provincia: direccion.provincia,
            codigoPostal: direccion.codigoPostal
          }),
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error ${res.status}: No se pudo cotizar el envío`);
          }
          return res.json();
        })
        .then(data => {
          setCostoEnvio(data.precio ?? null);
          setCotizando(false);
        })
        .catch(err => {
          console.error("Error al cotizar envío:", err);
          setCostoEnvio(null);
          setCotizando(false);
          // No mostrar error al usuario para cotización, es opcional
        });
      }
    } else {
      setCostoEnvio(null);
    }
  }, [direccionSeleccionada, direcciones, metodoSeleccionado, user]);

  React.useEffect(() => {
    if (metodoSeleccionado?.requierePuntoRetiro && metodoEntrega) {
      fetch(`${API_BASE}/entregas/puntos/metodo/${metodoEntrega}`)
        .then(res => {
          if (!res.ok) {
            throw new Error(`Error ${res.status}: No se pudieron cargar los puntos de retiro`);
          }
          return res.json();
        })
        .then(setPuntosRetiro)
        .catch(err => {
          console.error("Error al obtener puntos:", err);
          setPuntosRetiro([]);
        });
    }
  }, [metodoSeleccionado, metodoEntrega]);

  // Función para crear nueva dirección - MEJORADA
  const handleCrearNuevaDireccion = () => {
    if (!user?.token) {
      setErrorDirecciones("Debes estar autenticado para crear una dirección");
      return;
    }

    // Validación mejorada
    const camposRequeridos = ['calle', 'numero', 'localidad', 'provincia', 'codigoPostal'];
    const camposFaltantes = camposRequeridos.filter(campo => !nuevaDireccion[campo]?.trim());
    
    if (camposFaltantes.length > 0) {
      setErrorDirecciones(`Por favor, completa los siguientes campos: ${camposFaltantes.join(', ')}`);
      return;
    }

    setLoadingDirecciones(true);
    setErrorDirecciones("");
    
    fetch(`${API_BASE}/direcciones`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaDireccion)
    })
    .then(res => {
      if (!res.ok) {
        if (res.status === 400) {
          return res.json().then(data => {
            throw new Error(data.message || "Datos de dirección inválidos");
          });
        }
        throw new Error(`Error ${res.status}: No se pudo crear la dirección`);
      }
      return res;
    })
    .then(() => {
      // Recargar direcciones
      return fetch(`${API_BASE}/direcciones/mias`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Error al recargar direcciones");
      }
      return res.json();
    })
    .then(data => {
      setDirecciones(data);
      setMostrarFormNuevaDireccion(false);
      setNuevaDireccion({
        calle: "", numero: "", piso: "", departamento: "",
        localidad: "", provincia: "", codigoPostal: "", telefonoContacto: ""
      });
      // Seleccionar automáticamente la nueva dirección (última creada)
      if (data.length > 0) {
        setDireccionSeleccionada(data[data.length - 1].id.toString());
      }
      setErrorDirecciones("");
    })
    .catch(err => {
      console.error("Error:", err);
      setErrorDirecciones(err.message);
    })
    .finally(() => {
      setLoadingDirecciones(false);
    });
  };

  const handleAplicarCupon = () => {
    const codigo = cupon.trim();
    if (!codigo) {
      setCuponMsg("Por favor, ingresa un código de descuento");
      return;
    }
    
    if (!user?.token) {
      setCuponMsg("Debes estar autenticado para usar cupones");
      return;
    }

    const items = cartItems.map(item => {
      return {
        productoId: item.id || item.productoId,
        cantidad: item.quantity
      }
    });

    fetch(`${API_BASE}/descuentos/validar`, {
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
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo validar el cupón`);
        }
        return res.json();
      })
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
      .catch(err => {
        console.error("Error al aplicar cupón:", err);
        setDescuento(0);
        setAplicado(false);
        setCuponMsg(err.message || 'Error al validar el cupón');
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
    
    // Validación del carrito
    if (!cartItems || cartItems.length === 0) {
      setErrorCheckout("No hay productos en el carrito.");
      return;
    }

    // Validación de autenticación
    if (!user?.token) {
      setErrorCheckout("Debes estar autenticado para realizar una compra.");
      return;
    }

    // Validación de método de entrega
    if (!metodoEntrega) {
      setErrorCheckout("Por favor, selecciona un método de entrega.");
      return;
    }

    // Validación de método de pago
    if (!metodoPago) {
      setErrorCheckout("Por favor, selecciona una forma de pago.");
      return;
    }

    // Validaciones específicas para tarjetas - NUEVO
    if (metodoPago === "TARJETA_CREDITO" || metodoPago === "TARJETA_DEBITO") {
      const numeroTarjeta = document.querySelector('input[data-tarjeta="numero"]')?.value || "";
      const nombreTitular = document.querySelector('input[data-tarjeta="nombre"]')?.value || "";
      const vencimiento = document.querySelector('input[data-tarjeta="vencimiento"]')?.value || "";
      const ccv = document.querySelector('input[data-tarjeta="ccv"]')?.value || "";
      
      if (!numeroTarjeta.trim() || numeroTarjeta.length < 15) {
        setErrorCheckout("Por favor, ingresa un número de tarjeta válido (mínimo 15 dígitos).");
        return;
      }
      
      if (!nombreTitular.trim() || nombreTitular.length < 3) {
        setErrorCheckout("Por favor, ingresa el nombre del titular de la tarjeta.");
        return;
      }
      
      if (!vencimiento.trim() || vencimiento.length < 5) {
        setErrorCheckout("Por favor, ingresa la fecha de vencimiento (MM/AA).");
        return;
      }
      
      if (!ccv.trim() || ccv.length < 3) {
        setErrorCheckout("Por favor, ingresa el código de seguridad de la tarjeta.");
        return;
      }

      // Validación específica para tarjeta de crédito (cuotas obligatorias)
      if (metodoPago === "TARJETA_CREDITO") {
        const cuotasSeleccionadas = document.querySelector('select[name="cuotas"]')?.value || "";
        if (!cuotasSeleccionadas) {
          setErrorCheckout("Por favor, selecciona la cantidad de cuotas para el pago con tarjeta de crédito.");
          return;
        }
      }
    }

    // Validar campos según flags del método seleccionado - MEJORADO
    if (metodoSeleccionado?.requiereDireccion) {
      if (!direccionSeleccionada) {
        setErrorCheckout("Por favor, selecciona una dirección de envío.");
        return;
      }
      
      const direccionEncontrada = direcciones.find(d => d.id.toString() === direccionSeleccionada);
      if (!direccionEncontrada) {
        setErrorCheckout("La dirección seleccionada no es válida. Por favor, selecciona otra.");
        return;
      }
    }
    
    if (metodoSeleccionado?.requierePuntoRetiro) {
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

    // Validar que el método de pago siempre sea uno permitido
    const METODOS_PAGO_ENUM = [
      "EFECTIVO",
      "TARJETA_CREDITO",
      "TARJETA_DEBITO",
      "MERCADO_PAGO",
      "TRANSFERENCIA"
    ];
    let metodoPagoEnum = metodoPago;
    if (!METODOS_PAGO_ENUM.includes(metodoPagoEnum)) {
      metodoPagoEnum = "EFECTIVO";
    }

    // Definir cuotas solo si corresponde - MEJORADO
    let cuotasValue = 1; // Default para débito y otros métodos
    if (metodoPagoEnum === "TARJETA_CREDITO") {
      const cuotasInput = document.querySelector('select[name="cuotas"]');
      if (cuotasInput && cuotasInput.value && !isNaN(Number(cuotasInput.value))) {
        cuotasValue = Number(cuotasInput.value);
      } else {
        // Si no se seleccionó cuotas para crédito, ya se validó arriba
        cuotasValue = 1;
      }
    }

    // Construir body para POST - MEJORADO
    const body = {
      items,
      codigoDescuento: aplicado ? cupon.trim() : null,
      metodoEntregaId: parseInt(metodoEntrega),
      metodoDePago: metodoPagoEnum,
      cuotas: cuotasValue // Siempre incluir cuotas (1 por defecto)
    };

    // Body actualizado para usar direccionId - MEJORADO
    if (metodoSeleccionado?.requiereDireccion) {
      body.direccionId = parseInt(direccionSeleccionada);
    }
    if (metodoSeleccionado?.requierePuntoRetiro) {
      body.puntoRetiroId = parseInt(puntoRetiroId);
    }

    setProcesandoCompra(true);
    setErrorCheckout("");

    fetch(`${API_BASE}/compras`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 400) {
            return res.json().then(data => {
              throw new Error(data.message || "Datos de compra inválidos");
            });
          }
          if (res.status === 409) {
            throw new Error("Algunos productos no tienen suficiente stock disponible");
          }
          if (res.status === 401) {
            throw new Error("Tu sesión ha expirado. Por favor, inicia sesión nuevamente");
          }
          throw new Error(`Error ${res.status}: No se pudo procesar la compra`);
        }
        return res.json();
      })
      .then(data => {
        alert("¡Compra realizada con éxito!");
        setCartItems([]);
        navigate("/");
      })
      .catch(err => {
        console.error("Error en compra:", err);
        setErrorCheckout(err.message || "Hubo un error al procesar la compra. Intenta nuevamente.");
      })
      .finally(() => {
        setProcesandoCompra(false);
      });
  }

  // Limpiar el select de cuotas si el método de pago no es tarjeta de crédito ni débito
  React.useEffect(() => {
    if (metodoPago !== "TARJETA_CREDITO" && metodoPago !== "TARJETA_DEBITO") {
      const cuotasInput = document.querySelector('select[name="cuotas"]');
      if (cuotasInput) cuotasInput.value = "";
    }
  }, [metodoPago]);

  return (
    <>
      {isBlocked ? (
        <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
          Debes estar autenticado para acceder al carrito. <br />
          <button
            onClick={() => navigate("/")}
            className="underline text-leather-700 ml-2"
          >
            Ir al inicio
          </button>
        </div>
      ) : (
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
                    {metodosEntrega.map(metodo => (
                      <label key={metodo.id} className="inline-flex items-center gap-2">
                        <input
                          type="radio"
                          name="metodoEntrega"
                          value={metodo.id}
                          checked={String(metodoEntrega) === String(metodo.id)}
                          onChange={e => setMetodoEntrega(e.target.value)}
                        />
                        {metodo.nombre}
                      </label>
                    ))}
                  </div>
                  
                  {/* Sección de direcciones - CON MANEJO DE ERRORES MEJORADO */}
                  {metodoSeleccionado?.requiereDireccion && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block font-semibold text-leather-700 mb-2">
                          Seleccionar dirección de envío
                        </label>
                        
                        {/* Mostrar errores de direcciones */}
                        {errorDirecciones && (
                          <div className="mb-3 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {errorDirecciones}
                          </div>
                        )}

                        {/* Loading state */}
                        {loadingDirecciones && (
                          <div className="mb-3 flex items-center gap-2 text-leather-600">
                            <span className="animate-spin border-2 border-leather-300 border-t-leather-700 rounded-full w-4 h-4"></span>
                            <span>Cargando direcciones...</span>
                          </div>
                        )}
                        
                        {!loadingDirecciones && direcciones.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {direcciones.map(dir => (
                              <label key={dir.id} className="flex items-start gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
                                <input
                                  type="radio"
                                  name="direccionEnvio"
                                  value={dir.id}
                                  checked={direccionSeleccionada === dir.id.toString()}
                                  onChange={e => setDireccionSeleccionada(e.target.value)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <div className="font-medium">
                                    {dir.calle} {dir.numero}
                                    {dir.piso && `, Piso ${dir.piso}`}
                                    {dir.departamento && `, Depto ${dir.departamento}`}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {dir.localidad}, {dir.provincia} - CP: {dir.codigoPostal}
                                  </div>
                                  {dir.telefonoContacto && (
                                    <div className="text-sm text-gray-600">
                                      Tel: {dir.telefonoContacto}
                                    </div>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => setMostrarFormNuevaDireccion(!mostrarFormNuevaDireccion)}
                          className="text-leather-700 hover:underline text-sm font-medium"
                          disabled={loadingDirecciones}
                        >
                          {direcciones.length === 0 ? "Agregar dirección" : "+ Agregar nueva dirección"}
                        </button>

                        {mostrarFormNuevaDireccion && (
                          <div className="mt-4 p-4 border rounded bg-gray-50 space-y-3">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Calle *"
                                value={nuevaDireccion.calle}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, calle: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                                required
                              />
                              <input
                                type="text"
                                placeholder="Número *"
                                value={nuevaDireccion.numero}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, numero: e.target.value})}
                                className="border rounded px-3 py-2 w-24"
                                required
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Piso (opcional)"
                                value={nuevaDireccion.piso}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, piso: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                              />
                              <input
                                type="text"
                                placeholder="Depto (opcional)"
                                value={nuevaDireccion.departamento}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, departamento: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Localidad *"
                                value={nuevaDireccion.localidad}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, localidad: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                                required
                              />
                              <input
                                type="text"
                                placeholder="Provincia *"
                                value={nuevaDireccion.provincia}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, provincia: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                                required
                              />
                            </div>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Código Postal *"
                                value={nuevaDireccion.codigoPostal}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, codigoPostal: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                                required
                              />
                              <input
                                type="text"
                                placeholder="Teléfono"
                                value={nuevaDireccion.telefonoContacto}
                                onChange={e => setNuevaDireccion({...nuevaDireccion, telefonoContacto: e.target.value})}
                                className="border rounded px-3 py-2 flex-1"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <button
                                type="button"
                                onClick={() => setMostrarFormNuevaDireccion(false)}
                                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                                disabled={loadingDirecciones}
                              >
                                Cancelar
                              </button>
                              <button
                                type="button"
                                onClick={handleCrearNuevaDireccion}
                                className="px-4 py-2 bg-leather-700 text-white rounded hover:bg-leather-800 disabled:opacity-50"
                                disabled={loadingDirecciones || !nuevaDireccion.calle || !nuevaDireccion.numero || !nuevaDireccion.localidad}
                              >
                                {loadingDirecciones ? "Guardando..." : "Guardar dirección"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {metodoSeleccionado?.requierePuntoRetiro && (
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
                        className={`w-[150px] h-32 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded border-2
                          ${metodoPago === "EFECTIVO" ? "border-leather-700 bg-leather-50" : "border-gray-300 bg-white"}
                          hover:border-leather-700 transition
                          ${metodoSeleccionado?.nombre?.toLowerCase().includes("retiro") ? "" : "opacity-50 cursor-not-allowed"}
                        `}
                        disabled={!metodoSeleccionado?.nombre?.toLowerCase().includes("retiro")}
                        onClick={() => {
                          if (metodoSeleccionado?.nombre?.toLowerCase().includes("retiro")) {
                            setMetodoPago("EFECTIVO");
                          }
                        }}
                      >
                        <BsCash className="mb-1" size={36} />
                        <span className="text-sm font-bold">Efectivo</span>
                      </button>
                      {!metodoSeleccionado?.nombre?.toLowerCase().includes("retiro") && (
                        <span className="block text-xs text-gray-500 text-center mt-1">
                          Solo disponible para retiro en tienda
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Inputs para tarjeta */}
                  {(metodoPago === "TARJETA_CREDITO" || metodoPago === "TARJETA_DEBITO") && (
                    <TarjetaInputs metodoPago={metodoPago} />
                  )}
                  {/* Instrucción de pago según método - MEJORADO */}
                  {(
                    metodoPago === "TARJETA_CREDITO" ||
                    metodoPago === "TARJETA_DEBITO" ||
                    metodoPago === "MERCADO_PAGO" ||
                    metodoPago === "TRANSFERENCIA" ||
                    metodoPago === "EFECTIVO"
                  ) && (
                    <div className="mt-2">
                      {metodoPago === "TARJETA_CREDITO" && (
                        <div className="p-3 bg-leather-50 border border-leather-200 rounded">
                          <p className="text-sm text-leather-800 font-medium mb-1">💳 Pago con Tarjeta de Crédito</p>
                          <p className="text-sm text-leather-700">
                            Completa todos los datos de tu tarjeta y selecciona la cantidad de cuotas. 
                            Todas las cuotas son sin interés.
                          </p>
                        </div>
                      )}
                      {metodoPago === "TARJETA_DEBITO" && (
                        <div className="p-3 bg-leather-100 border border-leather-300 rounded">
                          <p className="text-sm text-leather-800 font-medium mb-1">💳 Pago con Tarjeta de Débito</p>
                          <p className="text-sm text-leather-700">
                            Completa todos los datos de tu tarjeta. El pago se realizará en una sola cuota 
                            con débito inmediato de tu cuenta.
                          </p>
                        </div>
                      )}
                      {metodoPago === "MERCADO_PAGO" && (
                        <div className="p-3 bg-leather-50 border border-leather-200 rounded">
                          <p className="text-sm text-leather-800 font-medium mb-1">🔄 Pago con Mercado Pago</p>
                          <p className="text-sm text-leather-700">
                            Después de hacer clic en 'Finalizar el pedido' serás redirigido a Mercado Pago 
                            para completar tu compra de forma segura con cualquier método disponible.
                          </p>
                        </div>
                      )}
                      {metodoPago === "TRANSFERENCIA" && (
                        <div className="p-3 bg-leather-100 border border-leather-300 rounded">
                          <p className="text-sm text-leather-800 font-medium mb-1">🏦 Pago por Transferencia</p>
                          <p className="text-sm text-leather-700">
                            <strong>ALIAS:</strong> CUERO.ARG<br/>
                            <strong>Email comprobante:</strong> pagos@cueroarg.com.ar<br/>
                            <span className="text-xs">Envía el comprobante para confirmar tu pedido.</span>
                          </p>
                        </div>
                      )}
                      {metodoPago === "EFECTIVO" && (
                        <div className="p-3 bg-leather-50 border border-leather-200 rounded">
                          <p className="text-sm text-leather-800 font-medium mb-1">💵 Pago en Efectivo</p>
                          <p className="text-sm text-leather-700">
                            Paga en efectivo al momento de retirar tu pedido en nuestra tienda. 
                            Asegurate de tener el monto exacto para agilizar la entrega.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {/* Errores - MEJORADO */}
                {errorCheckout && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                    <strong>Error:</strong> {errorCheckout}
                  </div>
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
                              alt={item.name}
                              className="w-20 h-20 object-cover rounded mr-4 border"
                            />
                          );
                        })()}
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
                        ${
                          (
                            (aplicado && totalBD !== null ? totalBD : subtotal)
                            + (metodoSeleccionado?.requiereDireccion && costoEnvio ? costoEnvio : 0)
                          ).toLocaleString("es-AR")
                        }
                      </span>
                    </div>
                  </div>
                  {/* Botón de finalizar pedido */}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CarritoPage;

// Inputs de tarjeta con validaciones mejoradas
function TarjetaInputs({ metodoPago }) {
  const [numero, setNumero] = React.useState("");
  const [nombre, setNombre] = React.useState("");
  const [vencimiento, setVencimiento] = React.useState("");
  const [ccv, setCcv] = React.useState("");
  const [cuotas, setCuotas] = React.useState("");
  const [erroresCampos, setErroresCampos] = React.useState({});

  // Número: solo dígitos, máximo 16
  function handleNumeroChange(e) {
    const val = e.target.value.replace(/\D/g, "");
    const formatted = val.slice(0, 16);
    setNumero(formatted);
    
    // Validación en tiempo real
    if (formatted.length > 0 && formatted.length < 15) {
      setErroresCampos(prev => ({...prev, numero: "El número debe tener al menos 15 dígitos"}));
    } else {
      setErroresCampos(prev => {
        const {numero, ...rest} = prev;
        return rest;
      });
    }
  }

  // Nombre: solo letras y espacios, mínimo 3 caracteres
  function handleNombreChange(e) {
    const val = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/g, "");
    setNombre(val);
    
    // Validación en tiempo real
    if (val.length > 0 && val.length < 3) {
      setErroresCampos(prev => ({...prev, nombre: "El nombre debe tener al menos 3 caracteres"}));
    } else {
      setErroresCampos(prev => {
        const {nombre, ...rest} = prev;
        return rest;
      });
    }
  }

  // Vencimiento: formato MM/AA
  function handleVencimientoChange(e) {
    let val = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    setVencimiento(val);
    
    // Validación en tiempo real
    if (val.length > 0 && val.length < 5) {
      setErroresCampos(prev => ({...prev, vencimiento: "Formato requerido: MM/AA"}));
    } else if (val.length === 5) {
      const [mes, año] = val.split('/');
      const mesNum = parseInt(mes);
      if (mesNum < 1 || mesNum > 12) {
        setErroresCampos(prev => ({...prev, vencimiento: "Mes inválido (01-12)"}));
      } else {
        setErroresCampos(prev => {
          const {vencimiento, ...rest} = prev;
          return rest;
        });
      }
    }
  }

  // CCV: solo números, 3-4 dígitos
  function handleCcvChange(e) {
    const val = e.target.value.replace(/\D/g, "");
    setCcv(val.slice(0, 4));
    
    // Validación en tiempo real
    if (val.length > 0 && val.length < 3) {
      setErroresCampos(prev => ({...prev, ccv: "El código debe tener 3-4 dígitos"}));
    } else {
      setErroresCampos(prev => {
        const {ccv, ...rest} = prev;
        return rest;
      });
    }
  }

  // Reset cuotas si cambia método
  React.useEffect(() => {
    if (metodoPago !== "TARJETA_CREDITO") {
      setCuotas("");
    }
  }, [metodoPago]);

  return (
    <div className="mb-4 space-y-3">
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Número de tarjeta *"
          className={`border rounded px-3 py-2 w-full ${erroresCampos.numero ? 'border-red-500' : 'border-gray-300'}`}
          value={numero}
          maxLength={16}
          inputMode="numeric"
          onChange={handleNumeroChange}
          data-tarjeta="numero"
          required
        />
        {erroresCampos.numero && (
          <p className="text-red-500 text-xs">{erroresCampos.numero}</p>
        )}
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Nombre del titular *"
          className={`border rounded px-3 py-2 w-full ${erroresCampos.nombre ? 'border-red-500' : 'border-gray-300'}`}
          value={nombre}
          onChange={handleNombreChange}
          data-tarjeta="nombre"
          required
        />
        {erroresCampos.nombre && (
          <p className="text-red-500 text-xs">{erroresCampos.nombre}</p>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="Vencimiento (MM/AA) *"
            className={`border rounded px-3 py-2 w-full ${erroresCampos.vencimiento ? 'border-red-500' : 'border-gray-300'}`}
            value={vencimiento}
            maxLength={5}
            inputMode="numeric"
            onChange={handleVencimientoChange}
            data-tarjeta="vencimiento"
            required
          />
          {erroresCampos.vencimiento && (
            <p className="text-red-500 text-xs">{erroresCampos.vencimiento}</p>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            placeholder="Código de Seguridad *"
            className={`border rounded px-3 py-2 w-full ${erroresCampos.ccv ? 'border-red-500' : 'border-gray-300'}`}
            value={ccv}
            maxLength={4}
            inputMode="numeric"
            onChange={handleCcvChange}
            data-tarjeta="ccv"
            required
          />
          {erroresCampos.ccv && (
            <p className="text-red-500 text-xs">{erroresCampos.ccv}</p>
          )}
        </div>
      </div>

      {/* Solo mostrar cuotas para TARJETA_CREDITO */}
      {metodoPago === "TARJETA_CREDITO" && (
        <div className="space-y-2">
          <label className="block font-semibold text-leather-700 mb-1">
            Cuotas disponibles *
          </label>
          <select
            className="border rounded px-3 py-2 w-full border-gray-300"
            name="cuotas"
            value={cuotas}
            onChange={e => setCuotas(e.target.value)}
            required
          >
            <option value="">Selecciona cantidad de cuotas</option>
            <option value="1">1 cuota (pago al contado)</option>
            <option value="3">3 cuotas sin interés</option>
            <option value="6">6 cuotas sin interés</option>
            <option value="12">12 cuotas sin interés</option>
            <option value="18">18 cuotas sin interés</option>
          </select>
        </div>
      )}

      {/* Información adicional según el método */}
      <div className="mt-3 p-3 bg-leather-50 rounded text-sm">
        {metodoPago === "TARJETA_CREDITO" && (
          <div>
            <p className="font-medium text-leather-700 mb-1">💳 Tarjeta de Crédito</p>
            <ul className="text-leather-600 text-xs space-y-1">
              <li>• Todos los campos son obligatorios</li>
              <li>• Debes seleccionar la cantidad de cuotas</li>
              <li>• Todas las cuotas son sin interés</li>
              <li>• Procesamiento seguro y encriptado</li>
            </ul>
          </div>
        )}
        {metodoPago === "TARJETA_DEBITO" && (
          <div>
            <p className="font-medium text-leather-700 mb-1">💳 Tarjeta de Débito</p>
            <ul className="text-leather-600 text-xs space-y-1">
              <li>• Todos los campos son obligatorios</li>
              <li>• Pago único (sin cuotas)</li>
              <li>• Débito inmediato de tu cuenta</li>
              <li>• Procesamiento seguro y encriptado</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}