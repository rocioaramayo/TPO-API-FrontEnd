import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cotizarEnvio, limpiarCotizacion } from "../store/slices/metodoEntregaSlice";

const zonasEnvio = [
    { id: "local", name: "Local" },
    { id: "nacional", name: "Nacional" },
    { id: "internacional", name: "Internacional" },
];

export default function EnvioForm({ productPrice }) {
    const dispatch = useDispatch();
    const [selectedZona, setSelectedZona] = useState("");
    const { cotizacion, cotizando, errorCotizacion } = useSelector((state) => state.metodoEntrega);

    const handleChange = (e) => {
        const zona = e.target.value;
        setSelectedZona(zona);
        dispatch(limpiarCotizacion());
        if (!zona) return;
        // Simulamos una dirección mínima para cotizar (ajusta según tu backend)
        dispatch(cotizarEnvio({ direccion: { zona }, token: null }));
    };

    const shippingCost = cotizacion?.costo || 0;
    const totalPrice = productPrice + shippingCost;

    return (
        <div className="mt-4 space-y-3">
            <label className="block text-sm font-medium text-gray-700">
                Seleccioná la zona de envío:
            </label>
            <select
                value={selectedZona}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            >
                <option value="">Seleccioná una zona</option>
                {zonasEnvio.map((zona) => (
                    <option key={zona.id} value={zona.id}>
                        {zona.name}
                    </option>
                ))}
            </select>

            {cotizando && <p>Cargando costo de envío...</p>}
            {errorCotizacion && <p className="text-red-500">{errorCotizacion}</p>}

            {cotizacion && !cotizando && !errorCotizacion && (
                <div>
                    <p className="text-gray-700">Costo de envío: ${shippingCost}</p>
                    <p className="font-bold text-lg text-gray-900">Total: ${totalPrice}</p>
                </div>
            )}
        </div>
    );
}
