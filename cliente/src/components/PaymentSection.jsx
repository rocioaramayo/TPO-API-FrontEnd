import React from "react";
import { FaCreditCard, FaUniversity } from "react-icons/fa";
import { MdOutlineCreditCard } from "react-icons/md";
import { BsCash } from "react-icons/bs";
import { SiMercadopago } from "react-icons/si";

const PaymentSection = ({ metodoPago, setMetodoPago, metodoSeleccionado }) => {
  
  return (
    <div className="pt-0">
      <h3 className="font-semibold text-leather-700 mb-2">Forma de Pago</h3>
      
      {/* Botones de métodos de pago */}
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
      
      {/* Instrucciones de pago según método */}
      {metodoPago && (
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
  );
};

// Componente para inputs de tarjeta
const TarjetaInputs = ({ metodoPago }) => {
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
};

export default PaymentSection;