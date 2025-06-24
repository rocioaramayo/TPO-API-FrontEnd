import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import PaymentSection from "./PaymentSection";
import DeliverySection from "./DeliverySection";
import CheckoutSummary from "./CheckoutSummary";
import { validarCupon, limpiarCupon } from '../store/slices/descuentosSlice';
import { fetchMetodoEntregaActivos } from '../store/slices/metodoEntregaSlice';
import { fetchPuntoEntregaActivos } from '../store/slices/puntoEntregaSlice';

const CheckoutForm = ({ cartItems }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.users);
  const isBlocked = !isAuthenticated;
  const API_BASE = "http://localhost:8080";

  // Estados principales
  const [cupon, setCupon] = React.useState("");
  const [aplicado, setAplicado] = React.useState(false);
  const [descuento, setDescuento] = React.useState(0);
  const [cuponMsg, setCuponMsg] = React.useState("");
  const [subtotalBD, setSubtotalBD] = React.useState(null);
  const [montoDescuento, setMontoDescuento] = React.useState(null);
  const [totalBD, setTotalBD] = React.useState(null);
  // Estado para error de categoría de cupón
  const [errorCategoria, setErrorCategoria] = React.useState("");

  // Estados de usuario y checkout
  const [userInfo, setUserInfo] = React.useState(null);
  const [metodoEntrega, setMetodoEntrega] = React.useState("");
  const [metodoPago, setMetodoPago] = React.useState("");
  const [numeroTarjeta, setNumeroTarjeta] = React.useState("");
  const [nombreTitular, setNombreTitular] = React.useState("");
  const [vencimiento, setVencimiento] = React.useState("");
  const [ccv, setCcv] = React.useState("");
  const [cuotas, setCuotas] = React.useState("");
  
  // Estados para direcciones
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
  const [costoEnvio, setCostoEnvio] = React.useState(null);
  const [cotizando, setCotizando] = React.useState(false);

  // Estados de error y loading
  const [errorCheckout, setErrorCheckout] = React.useState("");
  const [loadingDirecciones, setLoadingDirecciones] = React.useState(false);
  const [errorDirecciones, setErrorDirecciones] = React.useState("");
  const [procesandoCompra, setProcesandoCompra] = React.useState(false);

  const cuponRedux = useSelector((state) => state.descuentos.cupon);
  const metodosEntrega = useSelector((state) => state.metodoEntrega.items);
  const metodosEntregaLoading = useSelector((state) => state.metodoEntrega.loading);
  const puntosRetiro = useSelector((state) => state.puntoEntrega.items);
  const puntosRetiroLoading = useSelector((state) => state.puntoEntrega.loading);

  // Calcular subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.precio * item.quantity, 0);

  // Obtener método seleccionado
  const metodoSeleccionado = metodosEntrega.find(m => String(m.id) === String(metodoEntrega));

  // useEffect para cargar datos iniciales
  React.useEffect(() => {
    if (isAuthenticated && user?.token) {
      // Cargar info del usuario
      fetch(`${API_BASE}/api/v1/users/me`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(setUserInfo)
        .catch(() => setUserInfo(null));

      // Cargar direcciones
      setLoadingDirecciones(true);
      fetch(`${API_BASE}/direcciones/mias`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
          setDirecciones(data);
          setErrorDirecciones("");
        })
        .catch(err => {
          setErrorDirecciones(err.message || "Error al cargar direcciones");
          setDirecciones([]);
        })
        .finally(() => setLoadingDirecciones(false));
    }

    // Cargar métodos de entrega activos desde Redux
    dispatch(fetchMetodoEntregaActivos());
  }, [user, isAuthenticated, dispatch]);

  // useEffect para cotización de envío
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
          .then(res => res.ok ? res.json() : Promise.reject())
          .then(data => setCostoEnvio(data.precio ?? null))
          .catch(() => setCostoEnvio(null))
          .finally(() => setCotizando(false));
      }
    } else {
      setCostoEnvio(null);
    }
  }, [direccionSeleccionada, direcciones, metodoSeleccionado, user]);

  // useEffect para puntos de retiro activos desde Redux cuando corresponde
  React.useEffect(() => {
    if (metodoSeleccionado?.requierePuntoRetiro && metodoEntrega) {
      dispatch(fetchPuntoEntregaActivos());
    }
  }, [metodoSeleccionado, metodoEntrega, dispatch]);

  // useEffect para actualizar el estado local según el resultado de Redux
  React.useEffect(() => {
    if (cuponRedux.resultado) {
      const data = cuponRedux.resultado;
      if (data.descuentoAplicado) {
        if (data.montoDescuento > 0) {
          setDescuento(data.porcentajeDescuento);
          setAplicado(true);
          setCuponMsg(`Cupón aplicado: ${data.porcentajeDescuento}% de descuento`);
          setSubtotalBD(data.subtotalSinDescuento);
          setMontoDescuento(data.montoDescuento);
          setTotalBD(data.totalConDescuento);
        } else {
          setCuponMsg('El cupón pertenece a otra categoría');
          setDescuento(0);
          setAplicado(false);
          setSubtotalBD(null);
          setMontoDescuento(null);
          setTotalBD(null);
        }
      } else {
        setDescuento(0);
        setAplicado(false);
        setCuponMsg(data.mensajeError || 'Cupón inválido');
        setSubtotalBD(null);
        setMontoDescuento(null);
        setTotalBD(null);
      }
    } else if (cuponRedux.error) {
      setDescuento(0);
      setAplicado(false);
      setCuponMsg(cuponRedux.error || 'Error al validar el cupón');
      setSubtotalBD(null);
      setMontoDescuento(null);
      setTotalBD(null);
    }
  }, [cuponRedux]);

  React.useEffect(() => {
    setCupon("");
    setDescuento(0);
    setAplicado(false);
    setCuponMsg("");
    setSubtotalBD(null);
    setMontoDescuento(null);
    setTotalBD(null);
    dispatch(limpiarCupon());
  }, [cartItems, dispatch]);

  const handleAplicarCupon = () => {
    const codigo = cupon.trim();
    if (!codigo) {
      setCuponMsg('Por favor, ingresa un código de descuento');
      return;
    }
    if (!isAuthenticated) {
      setCuponMsg('Debes estar autenticado para usar cupones');
      return;
    }
    const items = cartItems.map(item => ({
      productoId: item.id || item.productoId,
      cantidad: item.quantity
    }));
    dispatch(validarCupon({ token: user.token, codigoDescuento: codigo, items }));
  };

  const handleCrearNuevaDireccion = () => {
    if (!isAuthenticated) {
      setErrorDirecciones("Debes estar autenticado para crear una dirección");
      return;
    }

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
      .then(res => res.ok ? res : Promise.reject(new Error(`Error ${res.status}`)))
      .then(() => fetch(`${API_BASE}/direcciones/mias`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      }))
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setDirecciones(data);
        setMostrarFormNuevaDireccion(false);
        setNuevaDireccion({
          calle: "", numero: "", piso: "", departamento: "",
          localidad: "", provincia: "", codigoPostal: "", telefonoContacto: ""
        });
        if (data.length > 0) {
          setDireccionSeleccionada(data[data.length - 1].id.toString());
        }
        setErrorDirecciones("");
      })
      .catch(err => setErrorDirecciones(err.message))
      .finally(() => setLoadingDirecciones(false));
  };

  const handleProcederPago = () => {
    setErrorCheckout("");
    
    // Validaciones básicas
    if (!cartItems || cartItems.length === 0) {
      setErrorCheckout("No hay productos en el carrito.");
      return;
    }

    if (!isAuthenticated) {
      setErrorCheckout("Debes estar autenticado para realizar una compra.");
      return;
    }

    if (!metodoEntrega) {
      setErrorCheckout("Por favor, selecciona un método de entrega.");
      return;
    }

    if (!metodoPago) {
      setErrorCheckout("Por favor, selecciona una forma de pago.");
      return;
    }

    // Validaciones específicas de tarjetas
    if (metodoPago === "TARJETA_CREDITO" || metodoPago === "TARJETA_DEBITO") {
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
      if (metodoPago === "TARJETA_CREDITO") {
        const cuotasSeleccionadas = cuotas;
        if (!cuotasSeleccionadas) {
          setErrorCheckout("Por favor, selecciona la cantidad de cuotas para el pago con tarjeta de crédito.");
          return;
        }
      }
    }

    // Validar direcciones y puntos de retiro
    if (metodoSeleccionado?.requiereDireccion) {
      if (!direccionSeleccionada) {
        setErrorCheckout("Por favor, selecciona una dirección de envío.");
        return;
      }
      
      const direccionEncontrada = direcciones.find(d => d.id.toString() === direccionSeleccionada);
      if (!direccionEncontrada) {
        setErrorCheckout("La dirección seleccionada no es válida.");
        return;
      }
    }
    
    if (metodoSeleccionado?.requierePuntoRetiro) {
      if (!puntoRetiroId.trim()) {
        setErrorCheckout("Por favor, selecciona un punto de retiro.");
        return;
      }
    }

    // Procesar compra
    const items = cartItems.map(item => ({
      productoId: item.id || item.productoId,
      cantidad: item.quantity
    }));

    const METODOS_PAGO_ENUM = ["EFECTIVO", "TARJETA_CREDITO", "TARJETA_DEBITO", "MERCADO_PAGO", "TRANSFERENCIA"];
    let metodoPagoEnum = METODOS_PAGO_ENUM.includes(metodoPago) ? metodoPago : "EFECTIVO";

    let cuotasValue = 1;
    if (metodoPagoEnum === "TARJETA_CREDITO") {
      if (cuotas && !isNaN(Number(cuotas))) {
        cuotasValue = Number(cuotas);
      }
    }

    const body = {
      items,
      codigoDescuento: aplicado ? cupon.trim() : null,
      metodoEntregaId: parseInt(metodoEntrega),
      metodoDePago: metodoPagoEnum,
      cuotas: cuotasValue
    };

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
      .then((data) => {
        dispatch(clearCart());
        dispatch(limpiarCupon());
        setDescuento(0);
        setAplicado(false);
        setCuponMsg("");
        setSubtotalBD(null);
        setMontoDescuento(null);
        setTotalBD(null);
        navigate(`/confirmacion-pedido/${data.id}`);
      })
      .catch(err => {
        setErrorCheckout(err.message || "Hubo un error al procesar la compra. Intenta nuevamente.");
      })
      .finally(() => {
        setProcesandoCompra(false);
      });
  };

  if (isBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl text-red-600">
        Debes estar autenticado para acceder al carrito. <br />
        <button
          onClick={() => navigate("/")}
          className="underline text-leather-700 ml-2"
        >
          Ir al inicio
        </button>
      </div>
    );
  }

  return (
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

            {/* Sección de Entrega */}
            <DeliverySection
              metodosEntrega={metodosEntrega}
              metodoEntrega={metodoEntrega}
              setMetodoEntrega={setMetodoEntrega}
              metodoSeleccionado={metodoSeleccionado}
              direcciones={direcciones}
              direccionSeleccionada={direccionSeleccionada}
              setDireccionSeleccionada={setDireccionSeleccionada}
              mostrarFormNuevaDireccion={mostrarFormNuevaDireccion}
              setMostrarFormNuevaDireccion={setMostrarFormNuevaDireccion}
              nuevaDireccion={nuevaDireccion}
              setNuevaDireccion={setNuevaDireccion}
              loadingDirecciones={loadingDirecciones}
              errorDirecciones={errorDirecciones}
              handleCrearNuevaDireccion={handleCrearNuevaDireccion}
              puntosRetiro={puntosRetiro}
              puntoRetiroId={puntoRetiroId}
              setPuntoRetiroId={setPuntoRetiroId}
            />

            {/* Sección de Pago */}
            <PaymentSection
              metodoPago={metodoPago}
              setMetodoPago={setMetodoPago}
              metodoSeleccionado={metodoSeleccionado}
              numeroTarjeta={numeroTarjeta}
              setNumeroTarjeta={setNumeroTarjeta}
              nombreTitular={nombreTitular}
              setNombreTitular={setNombreTitular}
              vencimiento={vencimiento}
              setVencimiento={setVencimiento}
              ccv={ccv}
              setCcv={setCcv}
              cuotas={cuotas}
              setCuotas={setCuotas}
            />

            {/* Errores */}
            {errorCheckout && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                <strong>Error:</strong> {errorCheckout}
              </div>
            )}
          </div>

          {/* Columna derecha: productos, cupón y resumen de pedido */}
          <CheckoutSummary
            cartItems={cartItems}
            cupon={cupon}
            setCupon={setCupon}
            aplicado={aplicado}
            setAplicado={setAplicado}
            setCuponMsg={setCuponMsg}
            handleAplicarCupon={handleAplicarCupon}
            cuponMsg={cuponMsg}
            subtotal={subtotal}
            subtotalBD={subtotalBD}
            descuento={descuento}
            montoDescuento={montoDescuento}
            totalBD={totalBD}
            metodoSeleccionado={metodoSeleccionado}
            cotizando={cotizando}
            costoEnvio={costoEnvio}
            handleProcederPago={handleProcederPago}
            procesandoCompra={procesandoCompra}
            errorCategoria={errorCategoria}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;